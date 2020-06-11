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
              <div v-for="(channel, index ) in userChannelList" :key="channel.id">
                <a @click="sendSelectChannel(index)" class="menu-item" style="display: flex;"
                   :class="{ 'active-channel': channel.id == $store.state.currentChannel.id}">
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
                content="1"
              ></v-badge>
            </a>
            <div class="submenu-content">
              <a style="cursor:default;" v-for="(user) in channelUsers" :key="user.email" class="menu-item"><span>{{ user.name }}</span></a>

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
      <template #modal-title>
        {{ channelmode }}
      </template>
      <form ref="channelCreateForm" @submit.stop.prevent="channelForm">
        <b-form-group label="채널 이름" :state="nameState" label-for="channel-input" invalid-feedback="채널 이름이 필요합니다.">
          <b-form-input id="channel-input" :state="nameState" v-model="channelTitle" required autofocus>
          </b-form-input>
        </b-form-group>
      </form>
    </b-modal>


  </div>

</template>
<script>
  import AboutChannel from '../../service/aboutchannel'
  import {mapGetters} from "vuex";

  export default {
    props: ['modalObj'],
    watch: {
      currentChannel(newCurrentChannel, oldCurrentChannel) {
        this.updateUserList(newCurrentChannel)
      },
      syncChannelUser() {
        this.updateUserList(this.$store.state.currentChannel)
      }
    },
    computed: {
      ...mapGetters({
        userChannelList: 'getUserChannelList',
        currentChannel: 'getCurrentChannel',
        syncChannelUser: 'getSyncChannelUser'

      }),
    },
    name: 'LSidebar',
    data() {
      return {
        channelIndex: 0,
        nameState: null,
        channelmode: '',
        channelTitle: '',
        channelUsers: [],
      }
    },
    created() {
      this.updateUserList(this.currentChannel)
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
      updateUserList: function (currentChannel) {
        if (currentChannel != null) {
          this.$http.get('/api/user/channel/' + currentChannel.id)
            .then(res => {
              this.channelUsers = res.data
              this.$store.commit('setChannelUsers', res.data)
            })
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
        console.log("user select channel list index " + index)
        console.log("select channel info : " + this.$store.state.userChannelList[index].id)
        this.$store.commit('getSelectComponent', 'main')
        if (this.$store.state.oldComponent == 'main') {
          AboutChannel.updateLastAccessDate(this.$store.state.userChannelList[index].id, this.$store.state.currentChannel.id)
        }
        this.$store.commit('setCurrentChannel', this.$store.state.userChannelList[index])
        this.$store.state.currentChannel.count = 0
        this.$store.state.isSearchMode = false
      },
      prepareModal: function (mode) {
        if (mode == 'create') {
          this.channelmode = '채널 생성'
        } else if (mode == 'edit') {
          this.channelmode = '채널 수정'
          this.channelTitle = this.$store.state.currentChannel.name
        }
        this.$bvModal.show('channelCU')
      },
      // 채널 생성 부분
      checkFormValidity: function () {
        const valid = this.$refs.channelCreateForm.checkValidity()
        this.nameState = valid
        return valid
      },
      resetModal() {
        this.channelTitle = ''
        this.nameState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.channelForm()
      },
      channelForm: function () {
        if (!this.checkFormValidity()) {
          return
        }
        this.$refs['modal'].hide()

        this.$nextTick(() => {
          this.$bvModal.hide('channelCU')
        })
        if (this.channelmode === '채널 생성') {
          this.createChannel()
        } else if (this.channelmode === '채널 수정') {
          this.$store.state.currentChannel.name = this.channelTitle
          this.updateChannel()
        }
      },
      updateChannel: function () {
        AboutChannel.updateChannelAPI(this.$store.state.currentChannel)
          .then(res => {
            this.$store.state.stompClient.send("/sub/chat/room/" + this.$store.state.currentChannel.id,
              JSON.stringify({'message': 'updateCurrentChannel', 'error': "null"}))
          }).catch(error => {
          console.error(error)
        })
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
      }
    }
  }
</script>
<style scoped>
/* >>>는 deep selector  */
  >>>.v-badge__badge{
    color: #404E67 !important;
  }
  .active-channel {
    background-color: white;
    color: black !important;
  }
</style>
