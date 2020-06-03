<template>
  <main class="mainwrapper" style="height: calc(100vh - 91px);">
    <div class="h-inherit" v-cloak @drop.prevent="dropFile" @dragover.prevent>
      <ul class="c-c-wrapper list-unstyled" @scroll="scrollEvt">
        <MsgBox v-for="msg in msgArray" :key="msg.id">
          <template #m-icon>
            <img v-if="msg.user.picture" class="icon-round" :src="msg.user.picture" width="40" height="40"/>
            <img v-else class="icon-round" src="../../assets/images/default-user-picture.png" width="40" height="40">
          </template>
          <template #m-info>
            <!-- #으로 단축해서 사용 -->
            <strong>{{ msg.user.name }}</strong>
            <span style="font-size: 11px; margin-left:3px; ">{{ msg.str_send_date }}</span>
          </template>
          <template #m-content>
            <!-- #으로 단축해서 사용 -->
            <div v-if="msg.files == null || msg.content" v-html="TextbyFilter(msg.content)"
                 class="mychat-content"></div>
            <b-container fluid v-else-if="msg.files.length > 0" class="p-4 bg-white">
              <b-row>
                <b-col v-for="(file,index) in msg.files" :key="index">
                  <a @click="fileDownload(file)">
                    <b-img thumbnail rounded fluid :src="selectImage(file)" alt="이미지를 찾을 수 없습니다."
                           style="max-width: 200px" @load="imgLoad"></b-img>
                    <p><b>{{file.original_name}}</b></p>
                    <p>file size : {{(file.file_size / 1024).toLocaleString(undefined,{minimumFractionDigits:2})}}
                      kb</p>
                  </a>
                </b-col>
              </b-row>
            </b-container>
          </template>
        </MsgBox>
      </ul>
      <a v-if="msgPreviewBool" @click="clickMsgPreview">
        <div id="c-c-preview" v-bind:class="{active: $store.state.isLActive}">
          <div class="p-wrapper">
            <div>{{ previewObj.username }} : &nbsp;</div>
            <div class="p-nowrap" v-html="previewObj.content"></div>
          </div>
        </div>
      </a>
      <div class="c-i-wrapper">
        <!-- 더 뭔가 추가할 거 같아서 div로 감싸놓음 -->
        <div style="flex-grow:1;" class="myflex-column">
          <div style="position: relative;">
            <div class="mytextarea-wrapper" v-if="!$store.state.isInviteMode && !$store.state.isSearchMode">
              <v-icon class="my-mail" v-bind:class="{'active-m': sendMail}" @click="sendMailToggle">mail</v-icon>
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
                @keydown.enter.exact="send"
                @keyup="byteCheck"
                @keydown.shift.alt.50='inviteToggle'
              ></b-form-textarea>
            </div>

            <div v-if="$store.state.isInviteMode">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="friends"
                    :items="userList"
                    @keydown.enter.exact="enter"  
                    @keydown.esc.exact="inviteToggle"
                    filled  
                    autofocus
                    chips
                    label="Select"
                    item-text="name"
                    item-value="email"
                    multiple
                    :menu-props="{contentClass: 'inviteClass'}"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="remove(data.item)"
                      >
                        <v-avatar left>
                          <v-img :src="data.item.picture"></v-img>
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item"></v-list-item-content>
                      </template>
                      <template v-else>
                        <v-list-item-avatar>
                          <img :src="data.item.picture">
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item.name"></v-list-item-title>
                          <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
            </div>
            <SearchInput
              :cursorPoint="cursorPoint"
              :wrapperEl="wrapperEl"
              @getMessage="getMessage"></SearchInput>
          </div>
          <div style="display: flex;flex-grow: 1;">
            <span class="ml-auto"> {{ stringByteLength }} / 30000Byte</span>
          </div>
        </div>
        <b-button v-if="!$store.state.isInviteMode && !$store.state.isSearchMode" @click="send"
                  style="height: 57px; width: 70px; margin-left:20px;" variant="primary">전송
        </b-button>
      </div>
    </div>
  </main>
</template>
<script>
  import MsgBox from './MsgBox'
  import InviteService from '../../service/inviteService'
  import CommonClass from '../../service/common'
  import SearchInput from './SearchInput'
  import AboutChannel from '../../service/aboutchannel'
  import {mapGetters} from "vuex";

  export default {
    name: 'ContentWrapper',
    components: {
      MsgBox, SearchInput
    },
    data() {
      return {
        friends:[],
        sendMail:false,
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
        cursorPoint: {
          channel_id: 0,
          first: true,
          cursorId: 0,
          empty: false
        },
        firstLoad: true,
        oldScrollHeight: 0,
        wrapperEl: null,
        msgPreviewBool: false,
        getmsgBool: false,
        selectedUserEmail: ''
      }
    },
    created() {
      if(this.$store.state.currentChannel!=null){
        this.getMessage()
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.wrapperEl = document.querySelector('.c-c-wrapper')
        window.addEventListener('resize', this.widthCheck);
      })
      this.$eventBus.$on('leaveChannelMsg', () => {
        this.message.content = this.$store.state.currentUser.name + '님이 나가셨습니다.'
        this.send()
      })
    },
    updated() {
      this.scrollToEnd()
    },
    activated() {
      if (this.$store.state.oldComponent != 'main' && this.$store.state.selectComponent == 'main') {
        this.scrollToEnd(true)
      }
      this.friends= []
      this.$store.state.isInviteMode = false
      this.$store.state.isSearchMode = false
    },
    methods: {
      enter: async function(event) {
        let el = document.querySelector(".menuable__content__active.inviteClass")
        if(el == null){
          if(this.friends.length!=0){
            await InviteService.invite(this.$store.state.currentUser.email, this.$store.state.currentChannel.id, this.friends)
            .then(res => {
              //메일 보내는 비동기 통신 있어야 함

              for(let i=0; i < this.friends.length; i++){
                const user = this.userList.find(el=> el.email == this.friends[i] )
                this.message.content += user.name + '님 ' 
              }
              
              //메일 오류 계속 떠서 일단 임시로 주석 처리함
              //   this.$http.post('/api/invite/mail', invite).then(res=>{
              //     console.log(res.data)
              //   })
              this.message.content += '을 초대했습니다.'
              this.$eventBus.$emit('getUserList', true)
              this.send()
              this.inviteDataInit()

            }).catch(error => {
              let alertmsg = ''
              if(error.response.data.list != null){
                const alertList = error.response.data.list
                for(let i=0; i < alertList.length; i++){
                  const user = this.userList.find(el=> el.email == alertList[i] )
                  alertmsg += user.name + '님 ' 
                }
                alertmsg += '은 이미 이 채널에 초대 받았습니다. 확인해주세요.'
                this.$alertModal('error', alertmsg)
              }else{
                this.$alertModal('error', error.response.data.message)
              }
              console.error(error.response)
              this.message.content = ''
            })
          }else{
            this.$alertModal('alert','초대할 사용자를 선택해주세요')
          }  
        }  
      },
      remove(item) {
        const index = this.friends.indexOf(item.email);
        if (index >= 0) this.friends.splice(index, 1);
      },
      sendMailToggle(){
        this.sendMail =!this.sendMail
        if(this.sendMail){
          this.$alertModal('alert','지금부터 보내는 메시지는'+this.$store.state.currentChannel.name +' 채널 사용자들에게 '+'메일로 보내집니다.')
        }
      },
      toggleSearchMode: function () {
        this.$store.state.isSearchMode = !this.$store.state.isSearchMode
        this.$store.state.isInviteMode = false
      },
      widthCheck() {
        this.oldScrollHeight = this.wrapperEl.scrollHeight
      },
      splitData(data) {
        this.message.content = data.split("-")[0]
        this.selectedUserEmail = data.split("-")[1]
      },
      imgLoad() {
        if (!this.msgPreviewBool) {
          this.scrollToEnd(true)
        }
      },
      dropFile: function (e) {
        this.addFile(e.dataTransfer.files)
      },
      attachFile: function (e) {
        this.addFile(e.target.files)
        this.$refs.fileInput.value = null
      },
      selectImage: function (file) {
        return CommonClass.checkFileType(file)
      },
      fileDownload: function (file) {
        this.$http.get(file.path, {
          responseType: 'blob'
        })
          .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url;
            link.setAttribute('download', file.original_name)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
          })
      },
      addFile: function (uploadFiles) {
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
          this.$alertModal('alert', '한번에 보낼 수 있는 파일 용량은 100MB 입니다.')
          return;
        }
        /////////////////////////////////////
        formData.append('channel_id', this.$store.state.currentChannel.id)
        formData.append('sender', this.$store.state.currentUser.email)
        this.$http.post('/api/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
        }).catch(error => {
          this.$alertModal('error', '폴더는 업로드 할 수 없습니다.')
        })
      },
      inviteToggle: function (e) {
        let el = document.querySelector(".menuable__content__active.inviteClass")
        if(this.$store.state.isInviteMode == false){
          this.$store.state.isInviteMode = !this.$store.state.isInviteMode
        }else{
          if(el == null){
            this.inviteDataInit()
          }
        }
      },
      inviteDataInit: function(){
        this.friends = []
        this.message.content = ''
        this.$store.state.isInviteMode = !this.$store.state.isInviteMode
      },
      send: async function (e) {
        if (e != null) {
          e.preventDefault()
        }
        this.message.sender = this.$store.state.currentUser.email
        this.message.channel_id = this.$store.state.currentChannel.id
        this.message.user = this.$store.state.currentUser
        if (CommonClass.byteLimit(this.stringByteLength)) {
          if (this.$store.state.stompClient && this.$store.state.stompClient.connected) {
            this.$store.state.stompClient.send("/pub/chat/message", JSON.stringify(this.message), {})
            this.message.content = ''
            this.scrollToEnd(true)
            if (this.sendMail){
              console.log(this.$store.state.channelUsers.filter(channelUser=> channelUser!=this.$store.state.currentUser))
              this.$store.state.channelUsers.filter(channelUser=> channelUser!=this.$store.state.currentUser)
                .forEach(channelUser =>{
                this.$http.post('/api/message/send/mail',{
                  channelName: this.$store.state.currentChannel.name,
                  fromUser: this.$store.state.currentUser.name,
                  toUser: channelUser.email
                })
                  .then(res =>{
                    this.sendMail = false
                  })
              })
            }
          } else {
            this.message.content = CommonClass.replaceErrorMsg(this.message.content)
            this.message.content = '<p style="color:red;">메세지 전송에 실패하였습니다.</p>' + this.message.content
            let errormsg = JSON.parse(JSON.stringify(this.message))
            this.$store.commit('pushMsg',errormsg)
            this.message.content = ''
          }
        }
      },
      scrollEvt(e) {
        let element = e.target;
        //스크롤이 없을때에도 스크롤 위치가 최상단이기 때문에 스크롤이 있는지 없는지 판단해야한다.
        if (element.scrollTop <= 0 && element.scrollHeight != element.clientHeight) {
          if (this.cursorPoint.empty == false) {
            this.getMessage(element)
          }
        } else if (this.isScrollAtEnd(element)) {
          this.msgPreviewBool = false
        }
      },

      getMessage: function (wrapperEl) {
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
          this.getmsgBool = true
        })
      },
      scrollToEnd(bool) {
        this.$nextTick(() => {
          if (this.firstLoad) {
            this.oldScrollHeight = this.wrapperEl.scrollHeight
          }
          if (this.isScrollAtEnd(this.wrapperEl) || this.firstLoad || bool ||
            ((this.oldScrollHeight == this.wrapperEl.clientHeight) && (this.wrapperEl.scrollHeight > this.wrapperEl.clientHeight))) {

            this.wrapperEl.scrollTop = this.wrapperEl.scrollHeight
            this.firstLoad = false
            this.oldScrollHeight = this.wrapperEl.scrollHeight
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
        this.friends= []
        this.$store.state.isInviteMode = false
        this.$store.state.isSearchMode = false
        this.message.channel_id = this.getCurrentChannel.id
        this.message.sender = this.$store.state.currentUser.email
        this.cursorPoint.channel_id = this.$store.state.currentChannel
        this.cursorPoint.first = true
        this.cursorPoint.cursorId = 0
        this.cursorPoint.empty = false
        this.$store.commit('setMsgArray',[])
        this.firstLoad = true
        this.scrollHeight = 0
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
      TextbyFilter(content) {
        return this.$options.filters.highlight(content, this.$store.state.searchText);
      }
    },
    computed: {
      getCurrentChannel: function () {
        return this.$store.state.currentChannel
      },
      ...mapGetters({
        userList: 'getUserList',
        msgArray: 'getMsgArray'
      })
    },
    watch: {
      getCurrentChannel: function (newv, oldv) {
        this.initData()
        this.getMessage()
        this.scrollToEnd()
      },
      msgArray: function () {
        // 스크롤을 최상단으로 올려 메시지를 가져올 때 실행되는 것을 막기 위한 if문
        if (this.getmsgBool) {
          this.getmsgBool = false
        } else {
          if (!this.isScrollAtEnd(this.wrapperEl) && this.msgArray.length > 0) {
            let copymsg = JSON.parse(JSON.stringify(this.msgArray[this.msgArray.length - 1]))
            this.previewObj.content = copymsg.content == null ? "첨부파일" : CommonClass.replacemsgForPreview(copymsg.content)
            this.previewObj.username = this.msgArray[this.msgArray.length - 1].user.name
            this.msgPreviewBool = true
          }
        }
      },
      checkbox: function (){
        if(this.checkbox){
          alert('지금부터 보내는 메시지는 나인원소프트 전체 메일로 보내집니다.')
        }
      }
    },
    filters: {
      highlight: function (stringToSearch, searchTerm) {
        if (searchTerm === "") return stringToSearch;
        var iQuery = new RegExp(searchTerm, "ig");
        return stringToSearch
          .toString()
          .replace(iQuery, function (matchedText, a, b) {
            return "<span class='highlight'>" + matchedText + "</span>";
          });
      }
    }

  }
</script>

<style scoped>

@media only screen and (max-width: 1023px){
  .wrapper .page-wrap .main-content {
    padding-left: 0px !important;
  }  
}


</style>
