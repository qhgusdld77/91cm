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
      currentUser: 'getCurrentUser'
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
      if (isInit) this.initMessageList(channel)

      this.cursorPoint.channel_id = channel.id
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
          }

          this.commit('setMsgArray', res.data.reverse().concat(this.msgArray))

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
    sendMessage: function() {

    },
    //채널 메시지 삭제
    deleteMessge: function() {

    }
  }
};
export default messageMixin;