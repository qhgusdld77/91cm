import {mapGetters} from "vuex";
import NotificationClass from '../service/notification'
import CommonClass from '../service/common'

let channelMixin = {
  computed: {
    ...mapGetters({
      channelList: 'getChannelList',
      currentChannel: 'getCurrentChannel',
      currentUser: 'getCurrentUser',
      selectComponent: 'getSelectComponent'
    })
  },
  methods: {
    _makeChannelFunction: function (channel) {
      if (channel.id !== undefined) {
        let _this = this
        let _url = "/sub/chat/room/"
        let result = null
        if (channel.subscribe === undefined) {
          channel.subscribe = function () {
            result = _this.subscribe(_url + this.id, _this.channelSubscribeCallBack)
            channel.unsubscribe = function () {
              _this.subscribeList.pop(_url + this.id)
              _this.commit('setSubscribeList', _this.subscribeList)
              result.unsubscribe()
            }
          }
          if (channel.send === undefined) {
            channel.send = function (message) {
              _this.send(_url + this.id, message)
            }
          }
          if (channel.access === undefined) {
            channel.access = function () {
              _this.post('/api/channel/update/lastaccessdate', {
                currentChannelId: this.id,
                userEmail: _this.currentUser.email
              })
            }
          }
        }
      }
      return channel
    },
    channelSubscribeCallBack(e) {
      let data = JSON.parse(e.body)
      if (data.message === undefined) {
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
      else{
        //메시지가 함수명일때 함수를 call하는 구문
        try{
          this[data.message]();
        }catch (e) {
          console.error(e);
        }
      }
      // else if (data.message === 'selectChannelList') {
      //   this.selectChannelList()
      // }else if (data.message === 'selectChannelUserList'){
      //   this.selectChannelUserList()
      // }
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
      this.hannelMode = mode
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
      this.$http.post('/api/channel/create', {
        name: channelTitle,
        member_email: email
      }, function (res) {
        let channel = _this.getChannel(res.data)
        channel.subscribe()
        _this.selectChannelList(channel)
      })
    },
    //채널 수정
    updateChannel: function (channel) {
      this.post('/api/channel/update', channel, function () {
        channel.send("selectChannelList")
      })
    },
    //채널 삭제
    deleteChannel: function (channel) {
      this.post('/api/channel/delete', channel, function () {
        channel.send("selectChannelList")
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
    selectChannelList: function (channel = this.$store.state.currentChannel, isJoin = true) {
      this.$http.get('/api/channel/list')
        .then(res => {
          let _this = this
          let channelList = res.data
          console.log(res.data)
          $.each(channelList, function (index, channel) {
            _this._makeChannelFunction(channel)
          })
          this.commit('setChannelList', channelList)

          if (isJoin) {
            if (channelList.length == 0) channel = null
            else if (channel === undefined) channel = channelList[0]
            else if (this.currentChannel == null) this.commit('setCurrentChannel', { id: -1 })//채널 진입
            this.joinChannel(channel)
          }
        }).catch(error => {
          console.error(error)
        })
    },
    //채널 진입
    joinChannel: function (channel) {
      this.$store.commit('getSelectComponent','main')
      if (channel !== undefined && channel != null) {
        channel = this.getChannel(channel)

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
            channel.access()
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
    selectChannelUserList: function (channel= this.$store.state.currentChannel) {
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
      this.$http.post('/api/channel/leave', {
        email: user.email,
        channel_id: this.currentChannel.id
      }).then(res => {
        this.$eventBus.$emit('leaveChannelMsg', user)
        this.$_alert("<code>[" + this.currentChannel.name + ']</code> 채널에서 ' + (this.isMine(user) ? "나갔습니다." : "추방되었습니다."))
      }).catch(error => {
        this.$_error((this.isMine(user) ? "나가기" : "추방") + '에 실패했습니다.')
      })
    },
    //채널 조회
    getChannel: function (paramChannel) {
      let thisChannel
      const _this = this
      if (typeof paramChannel == 'string' || typeof paramChannel == 'number') {
        $.each(this.channelList, function (idx, channel) {
          if (paramChannel == channel.id) {
            thisChannel = _this._makeChannelFunction(channel)
            return false
          }
        })
      }
      else {
        thisChannel = this._makeChannelFunction(paramChannel)
      }
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
