import { mapGetters } from "vuex";
import commonMixin from "./commonMixin";
import messageMixin from "./messageMixin";
import NotificationClass from '../service/notification'
import CommonClass from '../service/common'

let channelMixin = {
  mixins: [commonMixin, messageMixin],
  computed: {
    ...mapGetters({
      channelList: 'getChannelList',
      currentChannel: 'getCurrentChannel',
      currentUser: 'getCurrentUser'
    })
  },
  watch: {
    channelList: function(newChannelList, oldChannelList) {
      console.log("jjw!!! channelList")
      //최초
      if(oldChannelList.length == 0 && newChannelList.length > 0) {
        $.each(newChannelList, function (index, channel) {
          channel.subscribe()
        })
      }
      else {
        //console.log("newChannelList", newChannelList.length)
        //console.log("oldChannelList", oldChannelList.length)
      }
    }
  },
  methods: {
    _makeChannelFunction: function(channel) {
      let _this = this
      let _url = "/sub/chat/room/"
      if(channel.subscribe === undefined) {
        channel.subscribe = function() {
          let result = _this.subscribe(_url + this.id, _this.channelSubscribeCallBack)
          channel.unsubscribe = result.unsubscribe
        }
      }
      if(channel.send === undefined) {
        channel.send = function(message) {
          _this.send(_url + this.id, message)
        }
      }
    },
    channelSubscribeCallBack(e) {
      let data = JSON.parse(e.body)
      if(data.message === undefined) {
        NotificationClass.sendNotification(this.$store.state.isfocus, data)
        if (data.channel_id == this.$store.state.currentChannel.id && this.enableComponent) {
          data.content = CommonClass.replacemsg(data.content)
          this.$store.commit('pushMsg', data)
          if (!this.$store.state.isfocus) {
            this.msgCountUpdate(data.channel_id, true)
          }
        } else {
          this.msgCountUpdate(data.channel_id, true)
        }
      }
      // 채널 사용자 및 채널 실시간 업데이트 처리 코드 -> 현재 사용 안됨
      // else if(data.message == 'updateChannel'){
      //   this.$store.state.syncSignal.syncChannelUser =! this.$store.state.syncSignal.syncChannelUser;
      // }
      else if (data.message == 'selectChannelList') {
        this.selectChannelList()
      }
      if (e.headers.noticeMsg != null) {
        this.noticeMsg = res.headers.noticeMsg
        this.noticeMsgToggle = true
      }
    },
    enableComponent: function () {
      // sokect 통신을 위한 컴포넌트 체크
      switch (this.$store.state.selectComponent) {
        case "main":
        // case "videoChat":
          return true
        default:
          return false
      }
    },

    //채널 공통 확인
    confirmChannel: function (event, mode, channel) {
      event.stopPropagation()

      this.modalTitle = "채널 " + this.getChannelModeKorStr(mode)
      this.channelMode = mode
      try {
        this.channelTitle = (channel === undefined) ? this.currentChannel.name : channel.name
      } catch (e) {
        this.channelTitle = ''
      }

      if (mode === "create" || mode === "update") {
        if (mode === "create") this.channelTitle = ''
        this.$bvModal.show('channelCU')
      }
      else if (mode === "delete") {
        this.$_confirm("<code>[" + channel.name + "]</code>채널을 삭제하시겠습니까?", this.deleteChannel, channel);
      }
    },
    //채널 생성
    createChannel: function (channelTitle, email) {
      let _this = this
      this.post('/api/channel/create', {
        name: channelTitle,
        member_email: email
      }, function (res) {
        //_this.commit('setCurrentChannel', res.data) //채널 진입
        _this.selectChannelList(res.data)
        //jny 추가 새로 생성된 채널에 대해 구독하기 위함
        _this.subscribe("/sub/chat/room/" + res.data.id, _this.channelSubscribeCallBack)
      })
    },
    //채널 수정
    updateChannel: function (channel) {
      let _this = this
      this.post('/api/channel/update', channel, function () {
        channel.send("selectChannelList")
      })
    },
    //채널 삭제
    deleteChannel: function (channel) {
      this.post('/api/channel/delete', channel, function () {
          //channel.unsubscribe()
          /*
          channel.send("selectChannelList")
          channel.subscribe()
          */
          //구독
          //신호전송
          //구독취소
          /*
          */
          //this.sendSub('selectChannelList')
        })
    },
    //채널 삭제 아이콘 표시
    visibilityChannelDelete: function (channelId) {
      this.hiddenChannelDelete()
      $("#channelDel" + channelId).css("visibility", "visible")
    },
    //채널 삭제 아이콘 미표시
    hiddenChannelDelete: function () {
      $(".channelDel").css("visibility", "hidden")
    },
    //채널 목록 조회
    selectChannelList: function (channel, isJoin = true) {
      this.$http.get('/api/channel/list')
        .then(res => {
          let _this = this
          let channelList = res.data
          $.each(channelList, function(index, channel) {
            _this._makeChannelFunction(channel)
          })

          console.log("jjw!!! setChannelList")
          this.commit('setChannelList', channelList)
          if (isJoin) {
            if (channelList.length == 0) channel = null
            else if (channel === undefined) channel = channelList[0]
            else if (this.currentChannel==null) this.commit('setCurrentChannel', {id: -1})//채널 진입
            this.joinChannel(channel)
          }
        }).catch(error => {
          console.error(error)
        })
    },
    //채널 진입
    joinChannel: function (channel) {
      if (channel !== undefined && channel != null) {
        if(typeof channel == 'number') {
          channel = this.getChannel(channel)
        }

        if (channel.id != this.currentChannel.id) {
          this.commit('setCurrentChannel', channel)//채널 진입
          this.initChannelUserList()
          this.selectChannelUserList(channel)//채널 사용자 조회
          this.selectMessageList(channel, true)//채널 메시지 조회
          this.hiddenChannelDelete()

          if (window.innerWidth < 600) $(".app-sidebar").addClass("hide-sidebar")

          this.commit('getSelectComponent', 'main')
          this.currentChannel.count = 0
          this.$store.state.isSearchMode = false

          if (channel != null) {
            //마지막 진입일자 갱신
            this.post('/api/channel/update/lastaccessdate', {
              currentChannelId: channel.id,
              userEmail: this.currentUser.email
            })
          }
        }
        else {
          this.selectChannelUserList(channel)//채널 사용자 조회
        }
      }
      else {
        this.commit('setCurrentChannel', null)
        this.initChannelUserList()
      }
    },
    //채널 사용자 조회
    selectChannelUserList: function (channel) {
      if (channel != null) {
        this.$http.get('/api/user/channel/' + channel.id, {
          currentChannelId: channel.id,
          userEmail: this.currentUser.email
        })
          .then(res => {
            this.setChannelUserList(res.data)
          })
      }
      else {
        this.initChannelUserList()
      }
    },
    //채널 사용자 초기화
    initChannelUserList: function () {
      this.setChannelUserList([])
    },
    //채널 사용자 적용
    setChannelUserList: function (channelUserList) {
      this.commit('setChannelUsers', channelUserList)
    },
    //채널 사용자 삭제 아이콘 표시
    visibilityChannelUserDelete: function (index) {
      this.hiddenChannelUserDelete()
      $("#channelUserDel" + index).css("visibility", "visible")
    },
    //채널 사용자 삭제 아이콘 미표시
    hiddenChannelUserDelete: function () {
      $(".channelUserDel").css("visibility", "hidden")
    },
    //채널 강퇴 및 나가기 Confirm
    confirmChannelForceLeave: function (user) {
      var content = this.isMine(user) ? "<code>[" + this.currentChannel.name + "]</code> 채널을 나가시겠습니까?" : "<code>[" + user.name + "]</code>님을 추방하시겠습니까?"
      this.$_confirm(content, this.leaveChannle, user);
    },
    //채널 초대
    inviteChannel: function () {

    },
    //채널 강퇴 및 나가기
    leaveChannle: function (user) {
      this.post('/api/channel/leave', {
        email: user.email,
        channel_id: this.currentChannel.id
      }).then(res => {
        //this.sendSub('selectChannelList')
        this.$eventBus.$emit('leaveChannelMsg', user)
        this.$_alert("<code>[" + this.currentChannel.name + ']</code> 채널에서 ' + (this.isMine(user) ? "나갔습니다." : "추방되었습니다."))
      }).catch(error => {
        this.$_error((this.isMine(user) ? "나가기" : "추방") + '에 실패했습니다.')
      })
    },
    //채널 조회
    getChannel: function(channelId) {
      let thisChannel
      $.each(this.channelList, function(idx, channel) {
        if(channelId == channel.id) {
          thisChannel = channel
          return false
        }
      })
      return thisChannel
    },
    //채널 모드 한글명 조회
    getChannelModeKorStr: function (mode) {
      if (mode == "create") return "생성"
      if (mode == "update") return "수정"
      if (mode == "delete") return "삭제"
    },
    isMine: function (user) {
      var loginUserEmail = this.currentUser.email
      var clicktUserEmail = user.email
      return loginUserEmail == clicktUserEmail
    },
    isActiveForceLeave: function (user) {
      return this.isAdmin() || this.isMine(user)
    }
  }
};
export default channelMixin;
