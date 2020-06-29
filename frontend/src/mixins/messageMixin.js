import { mapGetters } from "vuex";
import commonMixin from "./commonMixin";
import CommonClass from '../service/common'

let messageMixin = {
  mixins: [commonMixin],
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
      channelArr: [],
      message: {
        channel_id: 0,
        content: '',
        sender: '',
        user: {}
      },
      cursorPoint: {
        channel_id: 0,
        first: true,
        cursorId: 0,
        empty: false
      },
      oldScrollHeight: 0,
      wrapperEl: null,
      msgPreviewBool: false,
      isGetMsgForPreview: false,
      isGetMsgForImgLoad: false,
      selectedUserEmail: '',
    }
  },
  computed: {
    ...mapGetters({
      msgArray: 'getMsgArray',
      currentChannel: 'getCurrentChannel',
      currentUser: 'getCurrentUser',
      channelList: 'getChannelList'
    })
  },
  watch: {
    /*
    msgArray: function () {
      console.log("메시지정보가 갱신되었다")
    },
    */
  },
  methods: {
    msgCountUpdate(id, counting) {
      // commit 을 안해도 객체 내부의 내용은 변경이 되는지 확인 필요 확인 후 해당 주석 제거
      for (let i = 0; i < this.channelList.length; i++) {
        if (id == this.channelList[i].id) {
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
      this.channelList[i].count += 1
    },
    msgCountReset(i) {
      this.channelList[i].count = 0
    },
    //채널 메시지 초기화
    initMessageList: function (channel) {
      this.channelArr.push(channel.id)
      this.firstLoad = true
      this.scrollHeight = 0
      this.message.sender = this.currentUser.email

      this.$store.state.isInviteMode = false
      this.$store.state.isSearchMode = false
      this.commit('setMsgArray', [])
      this.cursorPoint.channel_id = this.message.channel_id = channel.id
      this.cursorPoint.first = true
      this.cursorPoint.cursorId = 0
      this.cursorPoint.empty = false
    },
    //채널 메시지 조회
    selectMessageList: function (channel, isInit, wrapperEl) {
      console.log(channel,'channel')
      if (isInit){
        this.initMessageList(channel)
      }
      this.$http.post('/api/message/getmsg', JSON.stringify(this.cursorPoint), {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (channel.id == this.channelArr[this.channelArr.length - 1]) {
          if (res.data.length == 0) {
            this.cursorPoint.empty = true
          } else {
            this.cursorPoint.first = false
            this.cursorPoint.cursorId = res.data[res.data.length - 1].id
          }

          for (let i = 0; i < res.data.length; i++) { 
            res.data[i].content = CommonClass.replacemsg(res.data[i].content)
            console.log(res.data[i].content,'res.data[i].content')
          }
          console.log(this.msgArray,'msgarr1')
          this.commit('setMsgArray', res.data.reverse().concat(this.msgArray))
          console.log(this.msgArray,'msgarr')
          if (wrapperEl !== undefined) {
            this.$nextTick(() => {
              wrapperEl.scrollTop = wrapperEl.scrollHeight - this.oldScrollHeight
              this.oldScrollHeight = wrapperEl.scrollHeight
            })
          }
          this.isGetMsgForPreview = true
          this.isGetMsgForImgLoad = true
        }
      })
    },
    //채널 메시지 전송
    sendMessage: function(e, isSysMsg) {
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
          console.log(errormsg)
          console.log(this.msgArray)
          this.message.content = ''
        }
      }
    },
    //채널 메시지 삭제
    deleteMessge: function(msg) {
      this.$http.post('/api/message/update/deleteyn', msg).then(res=>{
        // 해당 메세지 삭제되었습니다로 변경하는 로직, 실시간적으로 변경되는 로직
        // 프론트에서 서로 메세지만 교체하는 방법,

        //아예 메시지리스트를 새로 가져오는 방법 -> 메세지 찾기하고 있거나 이전 메세지를 조회중일때
        //신호가 간다면 문제 생길 것 같음 모드가 바뀌었을때 메세지arr 변경 못하게 바꾸거나 프론트 단에서 해당 메세지만 변경처리 해줘야 할듯
        
        // if(res){
        //   this.selectMessageList(this.currentChannel,true)
        // }

      }); 
    }
  }
};
export default messageMixin;