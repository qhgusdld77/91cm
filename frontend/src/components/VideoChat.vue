<template>
  <VueWebRTC
    ref="webrtc"
    :room-id="$store.state.currentChannel.id"
  ></VueWebRTC>
</template>

<script>
  import * as io from 'socket.io-client'
  import VueWebRTC from "../views/util/vue-webRTC"

  export default {
    name: "VideoChat",
    components: {VueWebRTC},
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
      $('.nav-toggle').click()
      function a(e, s) {
        e.children(".submenu-content").show().slideUp(200, function () {
          i(this).css("display", ""), i(this).find(".menu-item").removeClass("is-shown"), e.removeClass("open"), s && s()
        })
      }

      let l = $(".wrapper")
      if (l.hasClass("nav-collapsed")) {
        l.addClass("menu-collapsed");
        let s = $(".navigation-main .nav-item.open"),
          a = s.children(".submenu-content");
        s.addClass("nav-collapsed-open"), a.show().slideUp(300, function () {
          $(this).css("display", "")
        }), s.removeClass("open")
      }
      this.$refs.webrtc.join();

    },
    beforeDestroy() {
      this.$refs.webrtc.leave();
    },
    methods: {
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
