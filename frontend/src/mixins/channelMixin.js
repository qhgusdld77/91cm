let channelMixin = {
  methods: {
    confirmChannel: function (mode, channel) {
      this.modalTitle = "채널 " + this.getChannelModeKorStr(mode)
      this.channelMode = mode
      try {
        this.channelTitle = (channel === undefined) ? this.$store.state.currentChannel.name : channel.name
      } catch (e) {
        this.channelTitle = ''
      }

      if (mode === "create" || mode === "update") {
        if (mode === "create") {
          this.channelTitle = ''
        }

        this.$bvModal.show('channelCU')
      }
      else if (mode === "delete") {
        this.$_confirm("<code>[" + channel.name + "]</code>채널을 삭제하시겠습니까?", this.deleteChannel(channel));
      }
    },
    //채널 생성
    createChannel: function (channelTitle, email) {
      this.$http.post('/api/channel/create', {
        name: channelTitle,
        member_email: email
      })
        .then(async (res) => {
          this.selectChannelList(res.data)
        }).catch(error => {
          console.warn(error)
        })
    },
    //채널 수정
    updateChannel: function (channel) {
      this.$http.post('/api/channel/update', channel)
        .then(res => {
          console.log(1)
          this.selectChannelList(channel, false)
          console.log(3)
          //this.sendSub('updateCurrentChannel')
        }).catch(error => {
          console.error(error)
        })
    },
    //채널 삭제
    deleteChannel: function (channel) {
      this.$http.post('/api/channel/delete', channel)
        .then(res => {
          this.sendSub('deleteCurrentChannel')
        }).catch(error => {
          console.error(error)
        })
    },
    //채널 목록 조회
    selectChannelList: function (channel, isJoin = true) {
      console.log(2)
      this.$http.get('/api/channel/list')
        .then(res => {
          let channelList = res.data
          console.log(5)
          this.$store.commit('setChannelList', channelList)
          console.log(6)

          if(isJoin) {
            if (channelList.length == 0) channel = null
            else if (channel === undefined) channel = channelList[0]
            this.joinChannel(channel)
          }
        }).catch(error => {
          console.error(error)
        })
    },
    //채널 진입
    joinChannel: function (channel) {
      if (channel === undefined) channel = null
      if (window.innerWidth < 600) $(".app-sidebar").addClass("hide-sidebar")

      this.$store.commit('getSelectComponent', 'main')
      this.$store.state.currentChannel.count = 0
      this.$store.state.isSearchMode = false

      this.$store.commit('setCurrentChannel', channel)//채널 진입
      this.selectChannelUserList(channel)//채널 사용자 조회
      this.selectMessageList()//채널 메시지 조회

      if (channel != null) {
        //마지막 진입일자 갱신
        this.$http.post('/api/channel/update/lastaccessdate', {
          currentChannelId: channel.id,
          userEmail: this.$store.state.currentUser.email
        })
      }
    },
    //채널 사용자 조회
    selectChannelUserList: function (channel) {
      if (channel != null) {
        this.$http.post('/api/user/channel/' + channel.id, {
          currentChannelId: channel.id,
          userEmail: this.$store.state.currentUser.email
        })
          .then(res => {
            this.$store.commit('setChannelUsers', res.data)
          })
      }
      else {
        this.$store.commit('setChannelUsers', [])
      }
    },

    //채널 메시지 조회
    selectMessageList: function () {
      this.initMessageList()
    },
    //채널 메시지 초기화
    initMessageList: function () {
    },
    //채널 강퇴 및 나가기 Confirm
    confirmChannelForceLeave: function (user) {
      let isMine = this.isMine(user)
      let currentChannel = this.$store.state.currentChannel
      //나가기
      if (isMine) this.$_confirm("<code>[" + this.$store.state.currentChannel.name + "]</code>채널을 나가시겠습니까?", this.leaveChannle(user.email, currentChannel));
      //추방
      else this.$_confirm("<code>[" + user.name + "]</code>님을 추방하시겠습니까?", this.forceLeaveChannel(user.email, currentChannel, isMine));
    },
    //채널 초대
    inviteChannel: function () {

    },
    //채널 떠나기
    leaveChannle: function (userEmail, channel, isLeave) {
      this.$http.post('/api/channel/leave', {
        email: userEmail,
        channel_id: channel.id
      }).then(res => {
        this.sendPub('message')// 유저가 나갔음으로 채널 유저 업데이트
        this.$eventBus.$emit('leaveChannelMsg')
        this.$_alert(null, this.currentChannel + ' 채널에서 나갔습니다.')
      }).catch(error => {
        this.$_e('error', '나가기에 실패했습니다.')
      })
    },
    //채널 강퇴
    forceLeaveChannel: function(userEmail, channel) {
      this.leaveChannle(userEmail, channel, false)
      this.$http.post('/api/channel/leave', {
        email: userEmail,
        channel_id: channel.id
      }).then(res => {
        this.sendPub('message')// 유저가 나갔음으로 채널 유저 업데이트
        this.$eventBus.$emit('forceLeaveChannelMsg', this.userName)
        this.$_alert(this.currentChannel + ' 채널에서 추방되었습니다.')
      }).catch(error => {
        this.$_e('error', '추방에 실패했습니다.')
      })
    },
    //채널 모드 한글명 조회
    getChannelModeKorStr: function (mode) {
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
    sendSub: function (message) {
      this.$store.state.stompClient.send("/sub/chat/room/" + this.$store.state.currentChannel.id, JSON.stringify({
        'message': message,
        'error': "null"
      }))
    },
    sendPub: function (message) {
      this.$store.state.stompClient.send("/pub/chat/room/" + this.$store.state.currentChannel.id, JSON.stringify({
        'message': message,
        'error': "null"
      }))
    }
  }
};
export default channelMixin;