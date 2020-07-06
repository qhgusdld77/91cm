<template>
  <main class="mainwrapper" style="height: calc(100vh - 91px);">
    <div class="h-inherit" v-cloak @drop.prevent="dropFile" @dragover.prevent>
      <ul class="c-c-wrapper list-unstyled" @scroll="scrollEvt">
        <div v-for="msg in msgArray" :key="msg.id">
          <MsgBox v-if="msg.message_type=='message'|| msg.message_type=='file'" :msg="msg" :msgPreviewBool="msgPreviewBool" @scrollToEnd="scrollToEnd"
                  @imgLoad="imgLoad"></MsgBox>
          <div v-if="msg.message_type=='action'" class="hori-align" >
            <v-chip class="ma-2" style="font-weight:bold;">
              {{msg.content}}
            </v-chip>
          </div>
          <div class="date-divider" v-if="msg.message_type=='date'">
            <span class="mydate">{{msg.content}}</span>
          </div>
        </div>
      </ul>
      <a v-if="msgPreviewBool && !isRoot()" @click="clickMsgPreview">
        <div id="c-c-preview" v-bind:class="{active: $store.state.isLActive}">
          <div class="p-wrapper">
            <div>{{ previewObj.username }} : &nbsp;</div>
            <div class="p-nowrap" v-html="previewObj.content"></div>
          </div>
        </div>
      </a>
      <v-row align="end" justify="center" class="c-i-wrapper" v-if="!isRoot()">
        <div style="flex-grow:1;" class="myflex-column">
          <div style="position: relative;">
            <div class="mytextarea-wrapper" v-if="!$store.state.isInviteMode && !$store.state.isSearchMode">
              <v-icon class="my-mail" v-bind:class="{'active-m': sendMail}" @click="sendMailToggle">mail</v-icon>
              <v-icon class="my-search" @click="toggleSearchMode">find_in_page</v-icon>
              <i class="im im-users myfile-upload" style="right: 50px;" @click="inviteToggle"></i>
              <label for="file-input" style="display: block;margin-bottom: 0;">
                <i class="im im-cloud-upload myfile-upload"></i>
              </label>
              <input id="file-input" type="file" ref="fileInput" multiple @change="attachFile" hidden/>
              <b-form-textarea
                class="mytextarea"
                autofocus
                id="textarea-no-resize"
                placeholder="Enter chat message"
                rows="2"
                no-resize
                v-model="message.content"
                @keydown.ctrl.shift.70="toggleSearchMode"
                @keydown.enter.exact="sendMessage($event)"
                @keyup="byteCheck"
                @keydown.shift.alt.50='inviteToggle'
              ></b-form-textarea>
            </div>
            <!--  초대 모드 시작 -->
            <div v-if="$store.state.isInviteMode">
              <InviteInput @sendMessage="sendMessage" @inviteToggle="inviteToggle" :message="message"></InviteInput>
            </div>
            <!-- 초대 모드 끝  -->
            <!-- 채팅 검색 모드 시작 -->
            <SearchInput
              :cursorPoint="cursorPoint"
              :wrapperEl="wrapperEl"
              @getMessage="getMessage">
            </SearchInput>
            <!-- 채팅 검색 모드 끝 -->
          </div>
          <div style="display: flex;flex-grow: 1;">
            <!-- 파일 업로드 progress bar -->
            <v-progress-linear
              v-if="isFileUpload"
              color="cyan darken-4"
              height="10"
              v-model="progressValue"
              striped
            ></v-progress-linear>
            <!--            <span style="position: absolute;right: 108px;"> {{ stringByteLength }} / 30000Byte</span>-->
          </div>
        </div>
        <!--        일반 채팅 모드 일때 아이콘-->
        <v-btn class="mx-2" fab dark large color="cyan" style="margin-bottom: 15px;"
               v-if="!$store.state.isVideoMode" @click="send($event)">
          <i class="im im-paperplane"></i>
        </v-btn>
        <!--        화상 채팅 모드 일때 아이콘-->
        <v-btn class="mx-2" fab dark small color="cyan" style="margin-bottom: 25px;"
               v-else @click="send($event)">
          <i class="im im-paperplane"></i>
        </v-btn>
      </v-row>
    </div>
  </main>
</template>
<script>
  import MsgBox from './MsgBox'
  import CommonClass from '../../service/common'
  import SearchInput from './SearchInput'
  import {mapGetters} from "vuex";
  import InviteInput from "../../components/InviteInput";

  export default {
    name: 'ContentWrapper',
    components: {
      InviteInput,
      MsgBox, SearchInput
    },
    data() {
      return {
        isFileUpload: false,
        progressValue: 0,
        sendMail: false,
        tempImg: '',
        stringByteLength: 0,
        previewObj: {
          content: '',
          username: ''
        },
        message: {
          channel_id: 0,
          content: '',
          sender: '',
          user: {}
        },
        // 채널 옮길 때마다 초기화 되어야한다.
        // cursorPoint: {
        //   channel_id: 0,
        //   first: true,
        //   cursorId: 0,
        //   empty: false
        // },
        //oldScrollHeight: 0,
        //wrapperEl: null,
        msgPreviewBool: false,
        isGetMsgForPreview: false,
        isGetMsgForImgLoad: false,
        selectedUserEmail: ''
      }
    },
    created() {
      // 사용되지 않는 것 같음
      // if (this.$store.state.currentChannel != null) {
      //   this.getMessage()
      // }
    },
    mounted() {
      this.$nextTick(() => {
        this.$store.commit('setWrapperEl',document.querySelector('.c-c-wrapper'))
        window.addEventListener('resize', this.widthCheck);
      })
      this.$eventBus.$on('leaveChannelMsg', (user) => {
        this.$store.state.message.content = user.name + '님이 ' + (this.isMine(user)?"나가셨습니다.":"추방되었습니다.")
        this.sendMessage(null, true)
      })
    },
    updated() {
      this.scrollToEnd()
    },
    activated() {
      if (this.$store.state.oldComponent != 'main' && this.$store.state.selectComponent == 'main') {
        this.scrollToEnd(true)
      }
      this.$store.state.isInviteMode = false
      this.$store.state.isSearchMode = false
    },
    methods: {
      imgLoad() {
        // 문제 있으면 아래 코드 지우기..
        this.$store.state.oldScrollHeight = this.$store.state.wrapperEl.scrollHeight

        if (!this.msgPreviewBool && !this.isGetMsgForImgLoad) {
          this.scrollToEnd(true)
        }
        if (this.isGetMsgForImgLoad) {
          this.isGetMsgForImgLoad = false
        }
      },
      inviteToggle: function (e) {
        let el = document.querySelector(".menuable__content__active.inviteClass")
        if (this.$store.state.isInviteMode == false) {
          this.$store.state.isInviteMode = !this.$store.state.isInviteMode
        } else {
          if (el == null) {
            this.inviteDataInit()
          }
        }
      },
      inviteDataInit: function () {
        this.message.content = ''
        this.$store.state.isInviteMode = !this.$store.state.isInviteMode
      },
      sendMailToggle() {
        this.sendMail = !this.sendMail
        if (this.sendMail) {
          this.$_alert('지금부터 보내는 메시지는' + this.$store.state.currentChannel.name + ' 채널 사용자들에게 ' + '메일로 보내집니다.')
        }
      },
      toggleSearchMode: function () {
        this.$store.state.isSearchMode = !this.$store.state.isSearchMode
        this.$store.state.isInviteMode = false
      },
      widthCheck() {
        this.$store.state.oldScrollHeight = this.$store.state.wrapperEl.scrollHeight
      },
      splitData(data) {
        this.message.content = data.split("-")[0]
        this.selectedUserEmail = data.split("-")[1]
      },
      dropFile: function (e) {
        this.addFile(e.dataTransfer.files)
      },
      attachFile: function (e) {
        this.addFile(e.target.files)
        this.$refs.fileInput.value = null
      },
      addFile: function (uploadFiles) {
        this.progressValue = 0
        const maxUploadSize = 100 * 1024 * 1024;
        let fileSize = 0;
        if (uploadFiles[0] == null) {
          return;
        }
        let formData = new FormData();
        // formData에 multi로 파일을 담는 방법에 대해 추후 확인
        ([...uploadFiles]).forEach(file => {
          formData.append("files", file)
          fileSize += file.size
        });
        if (fileSize >= maxUploadSize) {
          this.$_alert('한번에 보낼 수 있는 파일 용량은 100MB 입니다.')
          return;
        }
        /////////////////////////////////////
        formData.append('channel_id', this.$store.state.currentChannel.id)
        formData.append('sender', this.$store.state.currentUser.email)
        formData.append('type','file')
        this.isFileUpload = true
        this.$http.post('/api/file/upload', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: event => {
              this.progressValue = Math.round((100 * event.loaded) / event.total);
            }
          }).then(res => {
          this.isFileUpload = false
        }).catch(error => {
          this.isFileUpload = false
          this.progressValue = 0
          this.$_error('폴더는 업로드 할 수 없습니다.')
        })
      },
      send: async function (e, isSysMsg) {
        if (e != null) {
          e.preventDefault()
        }
        if (this.message.content == '') {
          return;
        }
        if (isSysMsg) {
          this.message.sender = null
        } else {
          this.message.sender = this.$store.state.currentUser.email
          this.message.user = this.$store.state.currentUser
        }
        this.message.channel_id = this.$store.state.currentChannel.id
        if (CommonClass.byteLimit(this.stringByteLength)) {
          if (this.$store.state.stompClient && this.$store.state.stompClient.connected) {
            this.$store.state.stompClient.send("/pub/chat/message", JSON.stringify(this.message), {})
            this.message.content = ''
            this.scrollToEnd(true)
            if (this.sendMail) {
              this.$store.state.channelUsers.filter(channelUser => channelUser != this.$store.state.currentUser)
                .forEach(channelUser => {
                  this.$http.post('/api/message/send/mail', {
                    channelName: this.$store.state.currentChannel.name,
                    fromUser: this.$store.state.currentUser.name,
                    toUser: channelUser.email
                  })
                    .then(res => {
                      this.sendMail = false
                    })
                })
            }
          } else {
            this.message.content = CommonClass.replaceErrorMsg(this.message.content)
            this.message.content = '<p style="color:red;">메세지 전송에 실패하였습니다.</p>' + this.message.content
            let errormsg = JSON.parse(JSON.stringify(this.message))
            this.$store.commit('pushMsg', errormsg)
            this.message.content = ''
          }
        }
      },
      scrollEvt(e) {
        let element = e.target;
        //스크롤이 없을때에도 스크롤 위치가 최상단이기 때문에 스크롤이 있는지 없는지 판단해야한다.
        if (element.scrollTop <= 0 && element.scrollHeight != element.clientHeight) {
          if (this.$store.state.cursorPoint.empty == false) {
            this.selectMessageList(this.currentChannel,false)
            //this.getMessage(element)
          }
        } else if (this.isScrollAtEnd(element)) {
          this.msgPreviewBool = false
        }
      },
      getMessage: function (wrapperEl) {
        return
        this.cursorPoint.channel_id = this.$store.state.currentChannel.id
        this.$http.post('/api/message/getmsg', JSON.stringify(this.cursorPoint), {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.length == 0) {
            this.cursorPoint.empty = true
          } else {
            this.cursorPoint.first = false
            this.cursorPoint.cursorId = res.data[res.data.length - 1].id
          }
          for (let i = 0; i < res.data.length; i++) {

            res.data[i].content = CommonClass.replacemsg(res.data[i].content)
          }
          this.$store.commit('setMsgArray', res.data.reverse().concat(this.msgArray))
          if (wrapperEl != null) {
            this.$nextTick(() => {
              wrapperEl.scrollTop = wrapperEl.scrollHeight - this.oldScrollHeight
              this.oldScrollHeight = wrapperEl.scrollHeight
            })
          }
          this.isGetMsgForPreview = true
          this.isGetMsgForImgLoad = true
        })
      },
      scrollToEnd(bool) {
        this.$nextTick(() => {
          if (this.firstLoad) {

            this.$store.state.oldScrollHeight = this.wrapperEl.scrollHeight
          }
          if (this.isScrollAtEnd(this.wrapperEl) || this.firstLoad || bool ||
            ((this.oldScrollHeight == this.wrapperEl.clientHeight) && (this.wrapperEl.scrollHeight > this.wrapperEl.clientHeight))) {

            this.wrapperEl.scrollTop = this.wrapperEl.scrollHeight
            this.$store.commit('setFirstLoad',false)
            //this.firstLoad = false
            this.$store.commit('setOldScrollHeight', this.wrapperEl.scrollHeight);
          }
        })
      },
      isScrollAtEnd(wrapperEl) {
        if (Math.floor(wrapperEl.scrollTop + wrapperEl.clientHeight) == this.oldScrollHeight || Math.round(wrapperEl.scrollTop + wrapperEl.clientHeight) == this.oldScrollHeight) {
          return true
        } else {
          return false
        }
      },
      clickMsgPreview() {
        this.scrollToEnd(true)
        this.msgPreviewBool = false
      },
      initData() {
        /*
        this.$store.state.isInviteMode = false
        this.$store.state.isSearchMode = false
        this.message.channel_id = this.getCurrentChannel().id
        this.message.sender = this.$store.state.currentUser.email
        this.cursorPoint.channel_id = this.$store.state.currentChannel
        this.cursorPoint.first = true
        this.cursorPoint.cursorId = 0
        this.cursorPoint.empty = false
        this.$store.commit('setMsgArray', [])
        this.firstLoad = true
        this.scrollHeight = 0
        */
      },
      byteCheck(e) {
        // v-model을 썼음에도 e.target.value를 사용하는 이유는 한글은 바로 바인딩이 안되기때문에 수동적으로 값들을 message.content에 넣기 위함이다.
        this.message.content = e.target.value
        this.stringByteLength = CommonClass.byteCount(this.message.content)
        if ((47 < e.keyCode && e.keyCode < 112 && e.ctrlKey == false) || (e.keyCode == 13 && e.shiftKey == true) || e.keyCode == 32
          || e.keyCode == 229) {
          CommonClass.byteLimit(this.stringByteLength)
        }
      },
    },
    computed: {


      ...mapGetters({
        //msgArray: 'getMsgArray',
        currentChannel: 'getCurrentChannel'
      })
    },
    watch: {
      currentChannel: function (newv, oldv) {
        //this.initData()
        //this.getMessage()
        //this.scrollToEnd()
      },
      msgArray: function () {
        // 스크롤을 최상단으로 올려 메시지를 가져올 때 실행되는 것을 막기 위한 if문
        if (this.isGetMsgForPreview) {
          this.isGetMsgForPreview = false
        } else { //메세지 미리보기(preview) 실행
          if(this.wrapperEl==null){
            this.$store.commit('setWrapperEl',document.querySelector('.c-c-wrapper'))
          }
          if (!this.isScrollAtEnd(this.wrapperEl) && this.msgArray.length > 0) {
            let copymsg = JSON.parse(JSON.stringify(this.msgArray[this.msgArray.length - 1]))
            this.previewObj.content = copymsg.content == null ? "첨부파일" : CommonClass.replacemsgForPreview(copymsg.content)
            this.previewObj.username = this.msgArray[this.msgArray.length - 1].user.name
            this.msgPreviewBool = true
          }
        }
      },

      checkbox: function () {
        if (this.checkbox) {
          alert('지금부터 보내는 메시지는 나인원소프트 전체 메일로 보내집니다.')
        }
      }
    },
  }
</script>

<style scoped>

  @media only screen and (max-width: 1023px) {
    .wrapper .page-wrap .main-content {
      padding-left: 0px !important;
    }
  }

  /* .v-chip{
    padding: 0 30px;
  } */
  .theme--light.v-chip:hover:before {
    opacity: 0;
  }

  .v-chip.v-size--default {
    min-height: 32px;
    height: auto;
  }

  .v-chip {
    white-space: normal;
  }
</style>
