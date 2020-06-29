<template>
  <div>
    <div class="wrapper">
      <template v-if="connectionCheck">
        <MainHeader></MainHeader>
        <div class="page-wrap">
          <LSidebar></LSidebar>
          <div class="main-content" style="padding-bottom:0;"
               :class="{'disactive-padding': $store.state.selectComponent=='main' }">
            <div :class="{'row': isVideoMode,'no-gutters':isVideoMode}">
              <div :class="{'col': isVideoMode,'col-3':isVideoMode}">
                <NoChannel v-if="$store.state.channelList[0]==null && $store.state.selectComponent=='main'"/>
                <keep-alive v-else>
                  <component :is="whichComponent"></component>
                </keep-alive>
              </div>
              <div :class="{'col': isVideoMode,'col-9':isVideoMode}">
                <VideoChat v-if="$store.state.isVideoMode"/>
              </div>
            </div>
            <RSidebar v-if="$store.state.currentChannel!=null"></RSidebar>
          </div>
          <footer class="footer">
            <div class="w-100 clearfix">
              <span class="text-center text-sm-left overline d-md-inline-block">Copyright © 2018 ThemeKit</span>
            </div>
          </footer>
        </div>
      </template>
      <!-- v-if="connctionCheck" else -->
      <Loading v-else/>

    </div>
    <AppsModal></AppsModal>
    <!-- 전체 공지용 스낵바 modal -->
    <v-snackbar v-model="noticeMsgToggle" :timeout='5000' :top="true"
                style="margin-top: 8vh; font-size: medium;"
                color="#404E67">
      {{noticeMsg}}
      <v-btn icon color="white" @click="noticeMsgToggle = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
  import LSidebar from '../views/main/LSidebar'
  import RSidebar from '../views/main/RSidebar'
  import MainHeader from '../views/main/MainHeader'
  import ContentWrapper from '../views/main/ContentWrapper'
  import AboutChannel from '../service/aboutchannel'
  import NotificationClass from '../service/notification'
  import EventListener from '../service/eventlistener'
  import UserInfo from "../views/user/UserInfo"
  import EditProfile from "../views/user/EditProfile"
  import ChannelHeader from "../views/main/ChannelHeader"
  import CommonClass from '../service/common'
  import NoChannel from '../views/main/NoChannel'
  import Loading from '../views/main/Loading'
  import Stomp from "webstomp-client";
  import SockJS from "sockjs-client";
  import TodoList from '../views/todolist/TodoList'
  import Calendar from "../views/calendar/Calendar";
  import AdminPage from "../views/admin/AdminPage"
  import AppsModal from "../views/main/AppsModal"
  import {mapGetters} from "vuex";
  import VideoChat from "./VideoChat";
  import channelMixin from "../mixins/channelMixin";

  export default {
    mixins: [channelMixin],
    name: 'Main',
    components: {
      'MainHeader': MainHeader,
      'LSidebar': LSidebar,
      'RSidebar': RSidebar,
      'ChannelHeader': ChannelHeader,
      'ContentWrapper': ContentWrapper,
      'UserInfo': UserInfo,
      'EditProfile': EditProfile,
      'NoChannel': NoChannel,
      'Loading': Loading,
      'TodoList': TodoList,
      'Calendar': Calendar,
      'AdminPage': AdminPage,
      'AppsModal': AppsModal,
      'VideoChat': VideoChat
    },
    data() {
      return {
        noticeMsgToggle: false,
        noticeMsg: '',
        channelTitle: '',
        isRActive: false,
        modalObj: {modalTitle: '', currentChannel: null},
      }
    },
    computed: {
      whichComponent() {
        AboutChannel.updateLastAccessStatus(this.$store.state.oldComponent, this.$store.state.selectComponent)
        switch (this.$store.state.selectComponent) {
          case 'main':
            return 'ContentWrapper'
          case 'user':
            return 'UserInfo'
          case 'edit':
            return 'EditProfile'
          case 'todoList':
            return 'TodoList'
          case 'calendar':
            return 'Calendar'
          case 'admin':
            return 'AdminPage'
          // case 'videoChat':
          //   return 'VideoChat'
          default:
            return 'ContentWrapper'
        }
      },
      connectionCheck() {
        if (this.$store.state.stompClient != null) {
          return this.$store.state.stompClient.connected
        }
      },
      ...mapGetters({
        msgArray: 'getMsgArray',
        isVideoMode: 'getIsVideoMode'
      })
    },
    deactivated() {
    },
    async created() {
      //await this.$store.dispatch('userListUpdate')
      this.selectChannelList()//채널목록 조회

      const currentChannel = this.$store.state.currentChannel
      if (currentChannel != null) {
        currentChannel.count = 0
      }
      this.connect()
      EventListener.resizeEvt()
      EventListener.beforeunloadEvt()
      EventListener.focusEvt(this)
      EventListener.blurEvt()
      NotificationClass.requestPermission()
      this.$store.commit('setSmallWidth', (window.innerWidth < 600) ? true : false)
    },
    updated() {
    },
    methods: {
      connect() {
        // 새로고침 했을때 Main의 로직이 실행되지 않는 환경에서는 문제가 생길 수 있음
        this.$store.state.stompClient = Stomp.over(new SockJS('/endpoint/'))
        // this.$store.state.stompClient.debug = f => f;

        this.$store.state.stompClient.connect(this.$store.state.currentUser, () => {
          this.$store.state.channelList.forEach(channel => {
            this.subscribe("/sub/chat/room/" + channel.id, this.channelSubscribeCallBack)
          })
          this.subscribe("/sub/sync/info", res => {
            if (res.headers.noticeMsg != null) {
              this.noticeMsg = res.headers.noticeMsg
              this.noticeMsgToggle = true
            }
            if (res.body == '"userList"') {
              this.$store.dispatch('userListUpdate')
              this.$store.dispatch('inviteUserList')
            }
          })
          // 사용하는 곳이 없음.
          // this.$store.state.stompClient.subscribe("/sub/" + this.$store.state.currentUser.email, (e) => {
          //   //메시지 전송 실패시
          //   this.channelSubscribeCallBack(e, true)
          // })
        }, (e) => {
          console.log('stomp close', this.$store.state.isLogout)
          if (!this.$store.state.isLogout) {
            window.location.href = "/"
          }
        })
      },
    }

  }

</script>
<style>
  .disactive-padding {
    padding-top: 0 !important;
    padding-right: 0 !important;
    padding-left: 240px !important;

  }
</style>
