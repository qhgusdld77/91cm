<template>
  <header class="header-top" header-theme="light">
    <div class="container-fluid">
      <div class="d-flex justify-content-between">
        <div class="top-menu d-flex align-items-center">
          <button type="button" class="btn-icon mobile-nav-toggle d-lg-none"><span></span></button>
          <div class="header-search">
            <div class="input-group">
              <span class="input-group-addon search-close"><i class="ik ik-x"></i></span>
              <input type="text" class="form-control">
              <span class="input-group-addon search-btn"><i class="ik ik-search"></i></span>
            </div>
          </div>
          <button type="button" id="navbar-fullscreen" class="nav-link"><i class="ik ik-maximize"></i></button>
        </div>
        <div class="top-menu d-flex align-items-center">
          <div class="dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="notiDropdown" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false"><i class="ik ik-bell"></i><span class="badge bg-danger"
                                                                                          v-show="getAlarmList.length > 0">{{alarmList.length}}</span></a>
            <div class="dropdown-menu dropdown-menu-right notification-dropdown" aria-labelledby="notiDropdown">
              <h4 class="header">Notifications</h4>
              <div class="notifications-wrap">
                <div v-for="(alarm,index) in getAlarmList" :key="alarm">
                  <a class="media" style="cursor: default;">
                    <span class="media-body">
                      <div class="heading-font-family media-heading">
                        {{getUserNameByEmail(alarm.sender)}} 님이 채널에 초대했습니다. 수락하시겠습니까?
                      </div>
                      <div class="menulist-header-icon">
                        <b-button style="padding: 0 0.5rem 0 0;" size="sm"
                                  variant="nonoutline" @click="inviteAccept(alarm,index)">
                          <i class="im im-check-mark-circle" style="color: #42b983;"></i>
                        </b-button>
                        <b-button style="padding: 0 0.5rem 0 0;" size="sm" variant="nonoutline" @click="inviteRefuse(alarm,index)">
                          <i class="im im-x-mark-circle" style="color: red;"></i>
                        </b-button>
                      </div>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button v-if="$store.state.userChannelList[0]!=null" type="button" @click="rightSidebarToggle"
                  class="nav-link ml-10 right-sidebar-toggle"><i class="ik ik-message-square"></i></button>
          <button type="button" class="nav-link ml-10" id="apps_modal_btn" data-toggle="modal" data-target="#appsModal">
            <i class="ik ik-grid"></i></button>
          <div class="dropdown">
            <a class="dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              <img v-if="$store.state.currentUser.picture" class="avatar" :src="$store.state.currentUser.picture">
              <img v-else class="avatar" src="../../assets/images/default-user-picture.png">
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
              <a class="dropdown-item" @click="callComponent('user')"><i class="ik ik-user dropdown-icon"></i>
                Profile</a>
<!--              <a class="dropdown-item" @click="showModal('copyRight-modal')"><i-->
<!--                class="ik ik-navigation dropdown-icon"></i> Opensource license</a>-->
              <a class="dropdown-item" @click="SignOut"><i class="ik ik-power dropdown-icon"></i> Logout</a>
              <a class="dropdown-item" v-if="getUserRoles" @click="callComponent('admin')"><i
                class="ik ik-settings dropdown-icon"></i> Permission</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CopyRight></CopyRight>
  </header>

</template>

<script>
  import CopyRight from "../util/CopyRight";
  import AboutChannel from '../../service/aboutchannel'

  export default {
    name: 'MainHeader',
    components: {CopyRight},
    data() {
      return {
        alarmList: [],
      }
    },
    computed: {
      getUserRoles: function () {
        if (this.$store.state.currentUser.roles.includes('ROLE_ADMIN')) {
          return true;
        } else {
          return false;
        }
      },
      getAlarmList: function () {
        while (this.alarmList.length > 5) {
          this.alarmList.pop()
        }
        return this.alarmList
      }
    },
    created() {
      this.$store.state.stompClient.subscribe("/sub/alarm/" + this.$store.state.currentUser.email, (e) => {
        let invite = JSON.parse(e.body)
        this.alarmList.unshift(invite)
      }),
        this.$http.get('/api/invite/list')
          .then(res => {
            this.alarmList = res.data.reverse()
          })
          .catch(error => {
          })
    },
    mounted() {

    },
    methods: {
      rightSidebarToggle: function(e){
        $('.right-sidebar-toggle')[0].classList.toggle('active');
        $('.wrapper').toggleClass('right-sidebar-expand');
        return false;
      },

      },
      showModal: function(modalId){
        console.log('click')
        this.$bvModal.show(modalId)
      },
      inviteAccept: function (alarm, index) {
        const message = {
          channel_id: alarm.channel_id,
          sender: this.$store.state.currentUser.email,
          content: this.$store.state.currentUser.name + '님이 채널에 초대되었습니다.',
          user: this.$store.state.currentUser
        }
        this.$http.post('/api/invite/accept', alarm)
          .then(async (res) => {
            // 현재 채널을 변경하는 로직을 구현해야할듯
            this.$store.state.stompClient.send('/pub/chat/message', JSON.stringify(message))
            this.alarmList.splice(index, 1);
            this.$store.state.stompClient.send('/pub/chat/room/' + alarm.channel_id,
              JSON.stringify({"message": "updateChannel", "error": "null"}))
            if (this.$store.state.currentChannel != null) {
              await AboutChannel.updateLastAccessDate(this.$store.state.currentChannel.id)
            }
            AboutChannel.updateLastAccessDate(alarm.channel_id, null).then(async (res) => {
              await this.$store.dispatch('channelList')
              const joinChannel = this.$store.state.userChannelList.find(channel => channel.id == alarm.channel_id)
              this.$store.commit('setCurrentChannel', joinChannel)
              console.log('joinChannel', this.$store.state.currentChannel)
              this.$emit('channelUpdate')
            }).catch(err => console.error(err))

          })
          .catch(error => {
            console.error(error)
          })
      }
      ,
      // 거절 과 수락은 하나의 api로 해서 신호를 하나 줘서 분기 시키는게 더 좋을 듯
      inviteRefuse: function (alarm, index) {
        // 초대가 거절됐다는 메시지를 채널에 보내는 로직을 구현해야함
        this.$http.post('/api/invite/refuse', alarm)
          .then(res => {
            this.alarmList.splice(index, 1);
          })
          .catch(error => {
            console.error(error)
          })
      }
      ,
      callComponent: function (component) {
        console.log(component)
        this.$store.commit('getSelectComponent', component)
        console.log('selectcom', this.$store.state.selectComponent == 'main')
        console.log('selectcom', this.$store.state.selectComponent)
        console.log('userchannel', this.$store.state.userChannelList[0] == null)
        console.log('userchannel', this.$store.state.userChannelList[0])
      }
      ,
      LSidebarToggle: function () {
        this.$store.state.isLActive = !this.$store.state.isLActive
      }
      ,
      RSidebarOpen: function () {
        this.$store.state.isRActive = true
      }
      ,
      SignOut() {
        this.$store.commit('setIsLogout', true)
        window.location.href = "/logout"
      }
      ,
      getUserNameByEmail: function (email) {
        return this.$store.state.userList.find(element => {
          return element.email == email
        }).name
      }
    }
    ,
  }
</script>
<style scoped>

  .v-application .ml-10 {
    margin-left: 10px !important;
  }
</style>
