<template>
  <aside class="right-sidebar">
    <div class="sidebar-chat" data-plugin="chat-sidebar">
      <div class="sidebar-chat-info" style="margin: 16px 0px;display:flex;">
        <h6>About this Channel</h6>
        <li @click="rightSidebarToggle" class="list-unstyled"
            style="flex-grow: 1;display: flex;justify-content: flex-end;align-items: center;font-size: 20px;margin-bottom: 8px;">
          <i class="ik ik-x close-card" style="cursor: pointer;"></i>
        </li>
      </div>
      <div class="chat-list">
        <div class="list-group row">

          <a class="list-group-item " style="color: #444;" v-b-toggle.channel-info>
            <i class="im im-info"></i>
            <span style="margin-left:20px;">Channel Details</span>
            <div style="display: flex; flex-grow: 1; justify-content: flex-end;">
              <i class="im im-care-down" style="font-size: 15px;"></i>
            </div>
          </a>

          <b-collapse id="channel-info">
            <div class="s-coll-style">
              <div>
                <div style="display:flex;">
                  <p>Channel Name</p>
                  <a class="verti-align" style="color: #007bff;" data-mode="edit" @click="useModal('edit')">Edit</a>
                </div>
                <li class="list-unstyled">{{ $store.state.currentChannel.name }}</li>
              </div>
              <div style="display:flex; justify-content:flex-start;">
                <v-btn color="blue-grey" class="white--text" @click="leaveChannle">
                  나가기
                  <v-icon right dark>exit_to_app</v-icon>
                </v-btn>
              </div>
            </div>
          </b-collapse>

          <!-- 화상 채닝 메뉴 시작 -->

          <a class="list-group-item" v-b-toggle.video-chat>
            <i class="im im-video-camera"></i>
            <span style="margin-left:20px;">Video Chat</span>
            <div style="display: flex; flex-grow: 1; justify-content: flex-end;">
              <i class="im im-care-down" style="font-size: 15px;"></i>
            </div>
          </a>
          <b-collapse id="video-chat">
            <div class="s-coll-style">
              <p>화상 채팅 유저 수 : 0</p>
              <v-btn color="blue-grey" class="white--text" @click="toggleVideoMode()" v-if="!isVideoMode">
                Join
                <v-icon right dark class="my-video">play_circle_outline</v-icon>
              </v-btn>
              <v-btn v-else color="blue-grey" class="white--text" @click="toggleVideoMode">
                Leave
                <v-icon right dark class="my-video">exit_to_app</v-icon>
              </v-btn>
            </div>
          </b-collapse>
          <!-- 화상 채팅 메뉴 끝 -->

          <!-- to do list 메뉴 시작 -->
          <a class="list-group-item" @click="callComponent('todoList')">
            <i class="im im-task-o"></i>
            <span style="margin-left:20px;">Todo List</span>
          </a>
          <!-- to do list 메뉴 끝 -->
          <!-- calender 메뉴 시작 -->
          <a class="list-group-item" @click="callComponent('calendar')">
            <i class="im im-calendar"></i>
            <span style="margin-left:20px;">Calendar</span>
          </a>
          <!-- calender 메뉴 끝 -->
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    props: ['modalObj'],
    name: 'RSidebar',
    computed: {
      ...mapGetters({
        channelUsers: 'getChannelUsers',
        isVideoMode: 'getIsVideoMode',

      })
    },
    data() {
      return {
        videoChatUsers: 0,
        channelUserSize: 0,
        userSelect: null
      }
    },
    mounted() {
      // vue-webRTC.vue의 화상채팅 사용자 수 데이터 받기
      // this.$eventBus.$on('videoChatUsers', res=>{
      //   this.videoChatUsers = res
      // })

    },
    methods: {
      toggleVideoMode: function () {
        if (this.isVideoMode) {

        }
        this.$store.commit('setIsVideoMode', !this.isVideoMode)
        this.callComponent('main', true)
      },
      rightSidebarToggle: function (e) {
        // console.log(e)
        $('.right-sidebar-toggle')[0].classList.toggle('active');
        $('.wrapper').toggleClass('right-sidebar-expand');
        return false;
      },
      callComponent: function (componentName, bool) {
        this.RSidebarClose()
        this.$store.commit('getSelectComponent', componentName)
        if (bool == null) {
          this.$store.commit('setIsVideoMode', false)
        }
      },
      leaveChannle: function () {
        this.$http.post('/api/channel/leave', {
          // 모두가 나가면 채널 삭제
          email: this.$store.state.currentUser.email,
          channel_id: this.$store.state.currentChannel.id
        }).then(res => {
          // 유저가 나갔음으로 채널 유저 업데이트
          this.$store.state.stompClient.send('/pub/chat/room/' + this.$store.state.currentChannel.id,
            JSON.stringify({'message': 'updateChannel', 'error': "null"}))
          this.$eventBus.$emit('leaveChannelMsg')
          this.$alertModal('alert redirect', this.$store.state.currentChannel.name + ' 채널에서 나갔습니다.')
        }).catch(error => {
          this.$alertModal('error', '나가기에 실패했습니다.')
        })
      },
      RSidebarClose: function () {
        $('.right-sidebar-toggle')[0].classList.toggle('active');
        $('.wrapper').removeClass('right-sidebar-expand');
        // this.$store.state.isRActive = false
      },
      useModal: function (mode) {
        if (mode == 'edit') {
          this.$eventBus.$emit('useModal', mode)
        }
      },
      msgBox: async function (content) {
        await this.$bvModal.msgBoxConfirm(content, {
          title: '확인',
          okTitle: '확인',
          okVariant: 'danger',
          buttonSize: 'sm',
          cancelTitle: '취소'
        })
          .then(value => {
            this.userSelect = value
            return value
          })
      }
    }
  }
</script>

<style scope>
  .wrapper .page-wrap .right-sidebar .sidebar-chat .chat-list .list-group .list-group-item {
    color: #444 !important;
  }
</style>
