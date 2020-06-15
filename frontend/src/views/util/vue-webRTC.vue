<template>
  <div style="height: 100%">
    <v-row justify="end">
      <div style="margin-right: 5vh">
        <v-btn color="blue-grey"
               class="white--text"
               @click="shareScreen"
        >
          Screen Share
          <v-icon style="margin-left: 10px;">airplay</v-icon>
        </v-btn>
<!--        <v-btn color="blue-grey"-->
<!--               class="white&#45;&#45;text"-->
<!--               @click="capture"-->
<!--        >-->
<!--          Capture-->
<!--          <v-icon style="margin-left: 10px;">add_photo_alternate</v-icon>-->
<!--        </v-btn>-->
      </div>
    </v-row>
    <v-row justify="center" align="center" no-gutters style="height: 90%;">
      <v-col :cols="getVideoCols" v-for="(item,index) in videoList" :key="index" style="margin-top: 0px; padding: 5px;">
        <v-card class="d-inline" flat tile>
          <v-card
            v-bind:video="item"
            v-bind:key="item.id"
            class="video-item">
            <video controls autoplay playsinline ref="videos" :muted="item.muted"
                   :id="item.id" style="max-width:100%;"></video>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
<!--    <p v-show="false">{{getVideoUsers}}</p>-->
  </div>
</template>

<script>
  import RTCMultiConnection from 'rtcmulticonnection';

  require('adapterjs');
  export default {
    name: "vue-webRTC",
    components: {
      RTCMultiConnection
    },
    deactivated() {
      console.log('deactivated vue-webRTC')
      },
    computed: {
      // getVideoUsers: function(){
      //   console.log(this.videoList.length)
      //   // RSidebar.vue 의 화상채팅 사용자 수 데이터 넘기는 용
      //   this.$eventBus.$emit('videoChatUsers',this.videoList.length)
      //   return this.videoList.length
      // },
      getVideoCols: function () {
        switch (this.videoList.length) {
          case 1:
            return 10;
          case 2:
            return 6;
          case 3:
          case 4:
            return 5;
          case 5:
          case 6:
            return 4;
          default:
            return 3;
        }
      },
    },
    data() {
      return {
        rtcmConnection: null,
        localVideo: null,
        videoList: [],
        canvas: null,
        windowSize: {
          x: 0,
          y: 0,
        },
      };
    },
    props: {
      iceServer: {
        type: String,
        default: 'stun:stun.1.google.com:19302'
      },
      roomId: {
        type: String,
        default: 'public-room'
      },
      socketURL: {
        type: String,
        default: 'https://rtcmulticonnection.herokuapp.com:443/'
      },
      cameraHeight: {
        type: [Number, String],
        default: 160
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      screenshotFormat: {
        type: String,
        default: 'image/jpeg'
      },
      enableAudio: {
        type: Boolean,
        default: true
      },
      enableVideo: {
        type: Boolean,
        default: true
      },
      enableLogs: {
        type: Boolean,
        default: true
      },
    },
    watch: {
    },
    mounted() {
      let that = this;
      this.rtcmConnection = new RTCMultiConnection();
      this.rtcmConnection.socketURL = this.socketURL;
      this.rtcmConnection.iceServers.push({
        urls: this.iceServer
      });
      this.rtcmConnection.autoCreateMediaElement = false;
      this.rtcmConnection.enableLogs = this.enableLogs;
      this.rtcmConnection.session = {
        audio: this.enableAudio,
        video: this.enableVideo
      };
      this.rtcmConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: this.enableAudio,
        OfferToReceiveVideo: this.enableVideo
      };
      this.rtcmConnection.onstream = function (stream) {
        let found = that.videoList.find(video => {
          return video.id === stream.streamid
        })
        if (found === undefined) {
          let video = {
            id: stream.streamid,
            muted: stream.type === 'local'
          };

          that.videoList.push(video);

          if (stream.type === 'local') {
            that.localVideo = video;
          }
        }

        setTimeout(function () {
          for (var i = 0, len = that.$refs.videos.length; i < len; i++) {
            if (that.$refs.videos[i].id === stream.streamid) {
              that.$refs.videos[i].srcObject = stream.stream;
              break;
            }
          }
        }, 1000);

        that.$emit('joined-room', stream.streamid);
      };
      this.rtcmConnection.onstreamended = function (stream) {
        var newList = [];
        that.videoList.forEach(function (item) {
          if (item.id !== stream.streamid) {
            newList.push(item);
          }
        });
        that.videoList = newList;
        that.$emit('left-room', stream.streamid);
      };
    },
    methods: {
      onResize() {
        this.windowSize = {x: window.innerWidth, y: window.innerHeight}
        console.log(this.windowSize)
      },
      join() {
        var that = this;
        this.rtcmConnection.openOrJoin(this.roomId, function (isRoomExist, roomid) {
          if (isRoomExist === false && that.rtcmConnection.isInitiator === true) {
            that.$emit('opened-room', roomid);
          }
          that.rtcmConnection.socket.on('disconnect', function (message) {
            alert(message)
          })
        });

      },
      leave() {
        this.rtcmConnection.attachStreams.forEach(function (localStream) {
          localStream.stop();
        });
        this.videoList = [];
      },
      capture() {
        // let img = this.getCanvas().toDataURL(this.screenshotFormat)
        // const url = window.URL.createObjectURL(new Blob([img]))
        // const link = document.createElement('a')
        // link.href = url
        // link.setAttribute('download',new Date().toDateString())
        // document.body.appendChild(link)
        // link.click()
        // link.remove()
        // window.URL.revokeObjectURL(url)
        return;
      },
      getCanvas() {
        let video = this.getCurrentVideo();
        if (video !== null && !this.ctx) {
          let canvas = document.createElement('canvas');
          canvas.height = video.clientHeight;
          canvas.width = video.clientWidth;
          this.canvas = canvas;
          this.ctx = canvas.getContext('2d');
        }
        const {ctx, canvas} = this;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas;
      },
      getCurrentVideo() {
        if (this.localVideo === null) {
          return null;
        }
        for (var i = 0, len = this.$refs.videos.length; i < len; i++) {
          if (this.$refs.videos[i].id === this.localVideo.id)
            return this.$refs.videos[i];
        }
        return null;
      },
      shareScreen() {
        var that = this;
        if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
          function addStreamStopListener(stream, callback) {
            var streamEndedEvent = 'ended';
            if ('oninactive' in stream) {
              streamEndedEvent = 'inactive';
            }
            stream.addEventListener(streamEndedEvent, function () {
              callback();
              callback = function () {
              };
            }, false);
          }

          function onGettingSteam(stream) {
            that.rtcmConnection.addStream(stream);
            that.$emit('share-started', stream.streamid);

            addStreamStopListener(stream, function () {
              that.rtcmConnection.removeStream(stream.streamid);
              that.$emit('share-stopped', stream.streamid);
            });
          }

          function getDisplayMediaError(error) {
            console.log('Media error: ' + JSON.stringify(error));
          }

          if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia({video: true, audio: false}).then(stream => {
              onGettingSteam(stream);
            }, getDisplayMediaError).catch(getDisplayMediaError);
          } else if (navigator.getDisplayMedia) {
            navigator.getDisplayMedia({video: true}).then(stream => {
              onGettingSteam(stream);
            }, getDisplayMediaError).catch(getDisplayMediaError);
          }
        }
      }
    }
  };
</script>

<style scoped>

</style>
