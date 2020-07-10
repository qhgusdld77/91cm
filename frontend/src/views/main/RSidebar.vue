<template>
  <aside class="right-sidebar">
    <div class="sidebar-chat" data-plugin="chat-sidebar" >
      <div class="sidebar-chat-info" style="margin: 16px 0px;display:flex;">
        <h6>About this Channel</h6>
        <li @click="RSidebarClose" class="list-unstyled"
            style="flex-grow: 1;display: flex;justify-content: flex-end;align-items: center;font-size: 20px;margin-bottom: 8px;">
          <i class="ik ik-x close-card" style="cursor: pointer;"></i>
        </li>
      </div>
      <div class="chat-list">
        <div class="list-group row">
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
          <a v-if="channelFiles.length != 0" class="list-group-item" @click="callComponent('fileDrawer')">
            <i class="im im-files-o"></i>
            <span style="margin-left:20px;">Files</span>
          </a>
          <b-collapse id="files" visible v-if="channelFiles.length != 0">
            <!--파일이 3개보다 작을때 테스트 필요 -->
            <v-row
              style="width: 320px"
              justify="left"
              align="center"
              dense>
              <v-col
                @click="test2"
                v-for="file in getChannelFiles"
                :cols="4">
                <v-img :src="selectImage(file,'tiles')" style="cursor: pointer;" contain></v-img>
              </v-col>
            </v-row>
          </b-collapse>
          <!-- calender 메뉴 끝 -->
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
  import CommonClass from "../../service/common";

  export default {
    props: ['modalObj'],
    name: 'RSidebar',
    computed: {
      getChannelFiles: function () {
        return this.channelFiles.slice(0,3)
      }
    },
    data() {
      return {
        videoChatUsers: 0,
        channelUserSize: 0,
        userSelect: null,
      }
    },
    mounted() {
      // vue-webRTC.vue의 화상채팅 사용자 수 데이터 받기
      // this.$eventBus.$on('videoChatUsers', res=>{
      //   this.videoChatUsers = res
      // })
    },
    methods: {
      selectImage: function (file,option) {
        return CommonClass.checkFileType(file,option)
      },
      test: function () {
        alert('test')
      },
      test2: function () {
        alert('test2s')
      },
      toggleVideoMode: function () {
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
      RSidebarClose: function () {
        $('.right-sidebar-toggle')[0].classList.toggle('active');
        $('.wrapper').removeClass('right-sidebar-expand');
        $('.main-content').removeClass('rsidebar-padding-right')
        // this.$store.state.isRActive = false
      },
      useModal: function (mode) {
        if (mode == 'edit') {
          this.$eventBus.$emit('useModal', mode)
        } else if (mode == 'delete') {
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
      },
    }
  }
</script>

<style scope>
  .wrapper .page-wrap .right-sidebar .sidebar-chat .chat-list .list-group .list-group-item {
    color: #444 !important;
  }
</style>
