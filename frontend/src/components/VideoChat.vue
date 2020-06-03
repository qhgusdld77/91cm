<template>
  <div class="container-fluid">
    <VueWebRTC
      ref="webrtc"
      :room-id="$store.state.currentChannel.id"
      :socket-u-r-l="'http://91cm.nineonesoft.com:9001/'"
    ></VueWebRTC>
  </div>
</template>

<script>
  import * as io from 'socket.io-client'
  import ContentWrapper from "../views/main/ContentWrapper";
  import VueWebRTC from "../views/util/vue-webRTC"

  export default {
    name: "VideoChat",
    props: ['msgArray'],
    components: {ContentWrapper, VueWebRTC},
    data() {
      return {
        img: null,
        roomId: "public-room"
      };
    },
    created() {
      window.io = io
      this.$eventBus.$on(command => {

      })
    },
    mounted() {
      this.$refs.webrtc.join();
    },
    methods: {
      msgArrayUpdate: function (newMsgArray) {
        this.msgArray = newMsgArray
        this.$emit('msgArrayUpdate', newMsgArray)
      },
      onCapture() {
        this.img = this.$refs.webrtc.capture();
      },
      onJoin() {
        this.$refs.webrtc.join();
      },
      onLeave() {
        this.$refs.webrtc.leave();
      },
      onShareScreen() {
        this.img = this.$refs.webrtc.shareScreen();
      },
      onError(error, stream) {
        console.log('On Error Event', error, stream);
      },
      logEvent(event) {
        console.log('Event : ', event);
      },
    }
  }
</script>

<style scoped>
  /*.video-list {*/
  /*  background: whitesmoke;*/
  /*  height: auto;*/
  /*}*/

  /*.video-list div {*/
  /*  padding: 0px;*/
  /*}*/

  /*.video-item {*/
  /*  background: #c5c4c4;*/
  /*  display: inline-block;*/
  /*}*/
</style>
