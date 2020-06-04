<template>
  <div>
    <div class="wrapper">
      <template v-if="connectionCheck">
        <MainHeader @channelUpdate="channelUpdate"></MainHeader>
        <div class="page-wrap">
          <LSidebar @channelUpdate="channelUpdate"></LSidebar>
          <div class="main-content" style="padding-bottom:0;"
               :class="{'disactive-padding': $store.state.selectComponent=='main' }">
            <NoChannel v-if="$store.state.userChannelList[0]==null && $store.state.selectComponent=='main'"/>
            <keep-alive v-else>
              <component :is="whichComponent"></component>
            </keep-alive>
            <RSidebar v-if="$store.state.currentChannel!=null"></RSidebar>
          </div>
          <footer class="footer">
            <div class="w-100 clearfix">
              <span class="text-center text-sm-left d-md-inline-block">Copyright © 2018 ThemeKit</span>
            </div>
          </footer>
        </div>
      </template>
      <Loading v-else/>
    </div>
    <AppsModal></AppsModal>
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

  export default {
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
        channelTitle: '',
        channelList: [],
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
          case 'videoChat':
            return 'VideoChat'
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
        msgArray: 'getMsgArray'
      })
    },
    deactivated() {
    },
    async created() {
      await this.$store.dispatch('userListUpdate')
      await this.$store.dispatch('channelList') // 설정되는 값은 userChannelList
      this.$store.commit('setCurrentChannel', this.$store.state.userChannelList[0])
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
        this.$store.state.stompClient.connect({}, () => {
          this.$store.state.userChannelList.forEach(channel => {
            this.$store.state.stompClient.subscribe("/sub/chat/room/" + channel.id, (e) => {
              let data = JSON.parse(e.body)
              if (data.message == 'updateChannel') {
                this.$store.state.syncSignal.syncChannelUser = !this.$store.state.syncSignal.syncChannelUser;
                return;
              } else if (data.message == 'updateCurrentChannel') {
                this.$store.dispatch('updateCurrentChannel')
                return;
              } else {
                this.channelSubscribeCallBack(e);
                return;
              }
            })
          })
          this.$store.state.stompClient.subscribe("/sub/sync/info", (res) => {
            if (res.body == '"userList"') {
              this.$store.dispatch('userListUpdate')
            }
          })
          this.$store.state.stompClient.subscribe("/sub/" + this.$store.state.currentUser.email, (e) => {
            //메시지 전송 실패시
            this.channelSubscribeCallBack(e, true)
          })
        }, () => {
          console.log('stomp close', this.$store.state.isLogout)
          if (!this.$store.state.isLogout) {
            window.location.href = "/"
          }
        })
      },
      channelUpdate() {
        this.$store.state.stompClient.subscribe("/sub/chat/room/" + this.$store.state.currentChannel.id, (e) => {
          let data = JSON.parse(e.body)
          if (data.message == 'updateChannel') {
            this.$store.state.syncSignal.syncChannelUser = !this.$store.state.syncSignal.syncChannelUser;
            return;
          } else {
            this.channelSubscribeCallBack(e);
            return;
          }
        })
      },
      channelSubscribeCallBack(e, fail) {
        let data = JSON.parse(e.body)
        NotificationClass.sendNotification(this.$store.state.isfocus, data)
        if (data.channel_id == this.$store.state.currentChannel.id && this.enableComponent) {
          data.content = CommonClass.replacemsg(data.content)
          if (fail) {
            data.content = '<p style="color:red;">메세지 전송에 실패하였습니다.</p>' + data.content
          }
          this.$store.commit('pushMsg', data)
          console.log(this.$store.state.msgArray)
          if (!this.$store.state.isfocus) {
            this.msgCountUpdate(data.channel_id, true)
          }
        } else {
          this.msgCountUpdate(data.channel_id, true)
        }
      },
      msgCountUpdate(id, counting) {
        // commit 을 안해도 객체 내부의 내용은 변경이 되는지 확인 필요 확인 후 해당 주석 제거
        for (let i = 0; i < this.$store.state.userChannelList.length; i++) {
          if (id == this.$store.state.userChannelList[i].id) {
            if (counting) {
              this.msgCounting(i)
              break
            } else {
              this.msgCountReset(i)
              break
            }
          }
        }
      },
      msgCounting(i) {
        this.$store.state.userChannelList[i].count += 1
      },
      msgCountReset(i) {
        this.$store.state.userChannelList[i].count = 0
      },
      enableComponent: function () {
        // sokect 통신을 위한 컴포넌트 체크
        switch (this.$store.state.selectComponent) {
          case "main":
          case "videoChat":
              return true
          default:
            return false
        }

      }

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
