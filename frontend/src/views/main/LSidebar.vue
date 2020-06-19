<template>
  <div class="app-sidebar colored" @mouseover="activeBlock" @mouseleave="activeNone">
    <div class="sidebar-header">
      <a class="header-brand" href="/main">
        <!-- <div class="logo-img">
           <img src="" class="header-brand-img" alt="lavalite">
        </div> -->
        <span class="text">91CM</span>
      </a>
      <button type="button" class="nav-toggle"><i data-toggle="expanded" class="ik ik-toggle-right toggle-icon"></i>
      </button>
      <button id="sidebarClose" class="nav-close"><i class="ik ik-x"></i></button>
    </div>

    <div class="sidebar-content">
      <div class="nav-container">
        <nav id="main-menu-navigation" class="navigation-main">

          <div class="nav-item has-sub open">
            <a href="javascript:void(0)">
              <div style="display: flex;align-items: center;">
                <i class="ik ik-layers"></i><span>Channels</span>
                <div style="flex-grow: 1;display: flex;justify-content: flex-end;">
                  <button @click="prepareModal('create')" style="margin-right: 5px;display: flex;color: white;">
                    <i class="im im-plus-circle" style="margin-right: 15px;display: flex;"></i>
                  </button>
                </div>
              </div>
            </a>

            <div class="submenu-content">
              <div v-for="(channel, index) in userChannelList" :key="channel.id" v-on:mouseover="fnChannelMouseOver(index)">
                <a @click="sendSelectChannel(index)" @dblclick="prepareModal('edit', channel)" class="menu-item" style="display: flex;" :class="{ 'active-channel': channel.id == $store.state.currentChannel.id}">
                  <button class="channelDel" :id="'channelDel' + index" @click="prepareModal('delete', channel)" style="margin-left: -15px; display: flex; visibility:hidden">
                    <i class="im im-minus-circle" style="font-size:15px; color:black;"></i>
                  </button>
                  <div>{{ channel.name }}</div>
                  <div style="display: flex;justify-content: flex-end;flex-grow: 1;" v-if="channel.count!=0">
                    <span class="badge badge-danger" style="position: inherit;">{{channel.count }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- <div class="nav-lavel">Users</div> -->

          <div class="nav-item has-sub open">
            <a href="javascript:void(0)" style="display: flex;align-items: center;">
              <i class="ik ik-users"></i>
              <span>Users</span>
              <v-badge
                style="margin-left: 105px"
                color="#bcc8d8"
                overlap
                left
                :content="channelUsers.length"
              ></v-badge>
            </a>
            <div class="submenu-content">
              <a style="cursor:default;display:flex; padding-left: 15px;" v-for="(user) in channelUsers"
                 :key="user.email" class="menu-item verti-align">
                <div v-if="user.online">
                  <v-badge
                    bottom
                    color="cyan lighten-1"
                    dot
                    offset-x="10"
                    offset-y="10"
                  >
                    <img v-if="user.picture!=null" class="avatar"  :src="user.picture">
                    <img v-else class="avatar"  src="../../assets/images/default-user-picture.png">
                  </v-badge>
                </div>
                <div v-else>
                  <img v-if="user.picture!=null" class="avatar"  :src="user.picture">
                  <img v-else class="avatar"  src="../../assets/images/default-user-picture.png">

                </div>

                <!-- <v-badge
                  color="pink"
                  dot
                  inline
                > -->
                <span style="margin-left:15px;">{{ user.name }}</span>
                <div style="display: flex;justify-content: flex-end;flex-grow: 1;" v-if="isActiveForceLeave(user)">
                  <button @click="confirmChannelForceLeave(user)" style="margin-left: -15px; display: flex;">
                    <i class="im im-minus-circle" style="font-size:15px; color:black;"></i>
                  </button>
                </div>
                <!-- </v-badge> -->
              </a>

            </div>
          </div>


          <!-- <div class="nav-item">
             <div v-for="(user) in channelUsers" :key="user.email">
               <a style="cursor:default;"><span>{{ user.name }}</span></a>
             </div>
         </div> -->
        </nav>
      </div>
    </div>
    <b-modal id="channelCU" centered ref="modal" @hidden="resetModal" @ok="handleOk">
      <template #modal-title>{{ modalTitle }}</template>
      <b-form-group label="채널 이름" :state="nameState" label-for="channel-input" invalid-feedback="채널 이름이 필요합니다.">
        <b-form-input id="channel-input" :state="nameState" v-model="channelTitle" required autofocus
                      autocomplete="off">
        </b-form-input>
      </b-form-group>
    </b-modal>

    <b-modal id="channelD" title="채널 삭제" @hidden="resetModal" @ok="handleOk">
      <p class="my-4"><code>[{{ channelTitle }}]</code>채널을 삭제하시겠습니까?</p>
    </b-modal>

    <b-modal id="channelForceLeave" title="채널 추방" @hidden="resetModal" @ok="leaveChannle(userEmail,currentChannel,'forceLeave')">
      <p class="my-4"><code>[{{ userName }}]</code>님을 추방하시겠습니까?</p>
    </b-modal>

    <b-modal id="channelLeave" title="채널 나가기" @hidden="resetModal" @ok="leaveChannle(userEmail,currentChannel)">
      <p class="my-4"><code>[{{ channelTitle }}]</code>채널에서 나가시겠습니까?</p>
    </b-modal>
  </div>

</template>
<script>
  import AboutChannel from '../../service/aboutchannel'
  import {mapGetters} from "vuex";
  import RSidebarVue from './RSidebar.vue';
  import channelMixin from "../../mixins/channelMixin";
  export default {
    props: ['modalObj'],
    mixins: [channelMixin],
    watch: {
      currentChannel(newCurrentChannel, oldCurrentChannel) {
        this.$store.dispatch('updateUserList')
      },
      syncChannelUser() {
        // this.updateUserList(this.$store.state.currentChannel)
        this.$store.dispatch('updateUserList')
      }
    },
    computed: {
      ...mapGetters({
        userChannelList: 'getUserChannelList',
        currentChannel: 'getCurrentChannel',
        syncChannelUser: 'getSyncChannelUser',
        channelUsers: 'getChannelUsers'
      }),
    },
    name: 'LSidebar',
    data() {
      return {
        channelIndex: 0,
        nameState: null,
        modalTitle: '',
        channelMode: '',
        channelTitle: '',
        userName: '',
        userEmail: ''
        // channelUsers: [],
      }
    },
    created() {
      // this.updateUserList(this.currentChannel)
      this.$store.dispatch('updateUserList')
    },
    mounted() {
      this.$eventBus.$on('useModal', res => {
        this.prepareModal(res)
      })
      // if(window.innerWidth < 500){
      //   this.$nextTick(function() {
      //     let el = document.querySelector('.app-sidebar')
      //     el.classList.add("hide-sidebar")
      //   });


      // }
    },
    updated() {

    },
    methods: {
      fnChannelMouseOver: function(index) {
        $(".channelDel").css("visibility", "hidden")
        if(this.isAdmin()) {
          $("#channelDel" + index).css("visibility", "visible")
        }
      },
      activeCurrentChannel: function () {
        this.$store.state.currentChannel
        return true
      },
      activeBlock: function () {
        this.$nextTick(function () {
          let el = document.querySelector('.wrapper')
          let t = $(".sidebar-content")
          if (el.classList.contains('nav-collapsed')) {
            el.classList.remove('menu-collapsed');
            var e = $(".navigation-main .nav-item.nav-collapsed-open");
            e.children(".submenu-content").hide().slideDown(300, function () {
              $(this).css("display", "")
            }), t.find(".nav-item.active").parents(".nav-item").addClass("open"), e.addClass("open").removeClass("nav-collapsed-open")
          }
        })
      },
      activeNone: function () {
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
      },
      LSidebarClose: function () {
        var n = $(".app-sidebar")
        n.addClass("hide-sidebar")
        // 아래는 옛날 코드 isLActive 이 변수를 안쓰니 없어도 될 것같기도하고..
        // this.$store.state.isLActive = !this.$store.state.isLActive
      },
      sendSelectChannel: function (index) {
        if (window.innerWidth < 600) {
          this.LSidebarClose()
        }
        //console.log("user select channel list index " + index)
        //console.log("select channel info : " + this.$store.state.userChannelList[index].id)
        this.$store.commit('getSelectComponent', 'main')
        if (this.$store.state.oldComponent == 'main') {
          AboutChannel.updateLastAccessDate(this.$store.state.userChannelList[index].id, this.$store.state.currentChannel.id)
        }
        this.$store.commit('setCurrentChannel', this.$store.state.userChannelList[index])
        this.$store.state.currentChannel.count = 0
        this.$store.state.isSearchMode = false
      },
      prepareModal: function (mode, channel) {
        this.modalTitle = "채널 " + this.getModeKorStr(mode)
        this.channelMode = mode
        try {
          this.channelTitle = (channel === undefined) ? this.$store.state.currentChannel.name : channel.name
        } catch (e) {
          this.channelTitle = ''
        }
        switch (mode) {
          case "create":
            this.channelTitle = ''
          case "edit":
            this.$bvModal.show('channelCU')
            break
          case "delete":
            this.$bvModal.show('channelD')

        }
      },
      // 채널 생성 부분
      // checkFormValidity: function () {
      //   const valid = this.$refs.channelCreateForm.checkValidity()
      //   this.nameState = valid
      //   return valid
      // },
      resetModal() {
        this.$store.state.channelModal = false
        this.channelTitle = ''
        this.nameState = null
      },
      handleOk(bvModalEvt) {
        this.$store.state.channelModal = false
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.channelForm()
      },
      channelForm: function () {
        //this.$refs['modal'].hide()

        this.$nextTick(() => {
          this.$bvModal.hide('channelCU')
          this.$bvModal.hide('channelD')
        })

        if (this.channelMode == "create") {
          this.createChannel()
        } else if (this.channelMode == "edit") {
          this.$store.state.currentChannel.name = this.channelTitle
          this.updateChannel()
        } else if (this.channelMode == "delete") {
          this.deleteChannel()
        }
      },
      createChannel: function () {
        // vuex에서 currentUser 객체 사용
        AboutChannel.createChannel(this.channelTitle, this.$store.state.currentUser.email)
          .then(async (res) => {
            //res.data = 새로 생성된 channel 인스턴스
            if (this.$store.state.currentChannel != null) {
              AboutChannel.updateLastAccessDate(res.data.id, this.$store.state.currentChannel.id)
            }
            this.$store.commit('setCurrentChannel', res.data)
            // 채널 생성 후 리스트를 업데이트 하는 부분
            await this.$store.dispatch('channelList')
            this.$emit('channelUpdate')

          }).catch(error => {
          console.warn(error)
        })
      },
      updateChannel: function () {
        AboutChannel.updateChannelAPI(this.$store.state.currentChannel)
          .then(res => {
            this.$store.state.stompClient.send("/sub/chat/room/" + this.$store.state.currentChannel.id, JSON.stringify({
              'message': 'updateCurrentChannel',
              'error': "null"
            }))
          }).catch(error => {
          console.error(error)
        })
      },
      deleteChannel: function () {
        AboutChannel.deleteChannelAPI(this.$store.state.currentChannel)
          .then(res => {
            this.$store.state.stompClient.send("/sub/chat/room/" + this.$store.state.currentChannel.id, JSON.stringify({
              'message': 'deleteCurrentChannel',
              'error': "null"
            }))
          }).catch(error => {
          console.error(error)
        })
      },
      getModeKorStr: function (mode) {
        if (mode == "create") return "생성"
        if (mode == "edit") return "수정"
        if (mode == "delete") return "삭제"
      },
      isAdmin: function () {
        var loginUserRoles = this.$store.state.currentUser.roles
        return loginUserRoles.includes('ROLE_ROOT') || loginUserRoles.includes('ROLE_ADMIN')
      },
      isMine: function (user) {
        var loginUserEmail = this.$store.state.currentUser.email
        var clicktUserEmail = user.email
        return loginUserEmail == clicktUserEmail
      },
      isActiveForceLeave: function (user) {
        return this.isAdmin() || this.isMine(user)
      },
      confirmChannelForceLeave: function (user) {
        this.userEmail = user.email

        //나가기
        if (this.isMine(user)) {
          this.channelTitle = this.$store.state.currentChannel.name
          this.$bvModal.show('channelLeave')
        }
        //추방
        else {
          this.userName = user.name
          this.$bvModal.show('channelForceLeave')
        }
      },
    }
  }
</script>
<style scoped>
  /* >>>는 deep selector  */
  >>> .v-badge__badge {
    color: #404E67 !important;
  }

  .active-channel {
    background-color: white;
    color: black !important;
  }

  .avatar {
    color: #4c5667;
    font-weight: 600;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    display: inline-block;
    background: #ced4da no-repeat center/cover;
    position: relative;
    vertical-align: bottom;
    font-size: .875rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
