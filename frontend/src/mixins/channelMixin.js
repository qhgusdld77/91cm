import NotificationClass from '../service/notification'
import CommonClass from '../service/common'
import InviteService from '../service/inviteService'

let channelMixin = {
  methods: {
    _makeChannelFunction: function (channel) {
      if (channel !== undefined && channel.id !== undefined) {
        let _this = this
        let _url = "/sub/chat/room/"
        let result = null

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
        if (channel.subscribe === undefined) {
          channel.subscribe = function () {
            result = _this.subscribe(_url + this.id, _this.channelSubscribeCallBack,{id:this.id})
            // if (_this.unsubscribe === undefined) {
            //   _this.$store.commit('setUnsubscribe', result.unsubscribe)
            // }

          }
          // channel.unsubscribe = function () {
          //   channel.unsubscribe = result.unsubscribe()
          // }
        }

        if (channel.unsubscribe === undefined) {
          channel.unsubscribe = function() {
            _this.unsubscribe(this.id)
          }
        }

        // if (channel.unsubscribe === undefined && _this.$store.unsubscribe !== undefined) {
        //   console.log("구독 취소 설정")
        //   channel.unsubscribe = _this.$store.unsubscribe
        // }
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
      } else {
        //메시지가 함수명일때 함수를 call하는 구문
        try {
          if (data.message.includes('|')) {
            let splitArr = data.message.split('|')
            console.log("~~>", splitArr)
            this[splitArr[0]](splitArr[1]);
          } else {
            this[data.message]();
          }
        } catch (e) {
          console.error(e);
        }
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
      } else if (mode === "delete") {
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
        let channel = _this.getChannel(res.data)
        channel.subscribe()
        _this.selectChannelList(channel)
      })
    },
    //채널 수정
    updateChannel: function (channel) {
      this.post('/api/channel/update', channel, function () {
        channel.send("selectChannelList|" + channel.id)
      })
    },
    //채널 삭제
    deleteChannel: function (channel) {
      let _this = this;
      this.post('/api/channel/delete', channel, function () {
        channel.send("selectChannelList|" + _this.currentChannel.id)
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
          let channelList = res.data
          this.commit('setChannelList', channelList)
          channelList.forEach(thisChannel => {
            this.getChannel(thisChannel)
          })
          if (isJoin) {
            channel = this.getChannel(channel)
            if (channelList.length === 0) channel = null
            else if (channel === undefined) channel = channelList[0]
            if (this.currentChannel == null) this.commit('setCurrentChannel', {id: -1})//채널 진입
            this.joinChannel(channel)
          }
        }).catch(error => {
        console.error(error)
      })
    },
    //채널 진입
    joinChannel: function (channel) {
      if (channel !== undefined && channel != null) {
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
        } else {
          this.selectChannelUserList(channel)//채널 사용자 조회
        }
      } else {
        this.commit('setCurrentChannel', null)
        this.initChannelUserList()
      }
    },
    //채널 사용자 조회
    selectChannelUserList: function (channel = this.$store.state.currentChannel) {
      if (channel != null) {
        this.$http.get('/api/user/channel/' + channel.id, {
          currentChannelId: channel.id,
          userEmail: this.currentUser.email
        })
          .then(res => {
            this.setChannelUserList(res.data)
          })
      } else {
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
    inviteChannel: async function (event) {
      let el = document.querySelector(".menuable__content__active.inviteClass")
      if (el == null) {
        if (this.friends.length != 0) {
          await InviteService.invite(this.currentUser.email, this.currentChannel.id, this.friends)
            .then(res => {
              for (let i = 0; i < this.friends.length; i++) {
                const user = this.inviteUserList.find(el => el.email == this.friends[i])

                if (user != null) {
                  this.message.content += user.name + '님'
                }
              }
              // 임시 주석처리
              // this.$http.post('/api/invite/mail', {
              //   channel_id: this.$store.state.currentChannel.id,
              //   sender: this.$store.state.currentUser.email,
              //   recipients: this.friends
              // })
              //   .then(res => {
              //     console.warn(res.data)
              //   })
              this.message.content += '을 초대했습니다.'
              // 아래 코드 무엇인지
              this.$eventBus.$emit('getUserList', true)

              this.$emit('sendMessage', null, true)
              this.friends = []
              this.message.content = ''
              this.$store.state.isInviteMode = !this.$store.state.isInviteMode
            }).catch(error => {
              let alertmsg = ''
              console.log(error, 'error')
              if (error.response.data.list != null) {
                const alertList = error.response.data.list
                for (let i = 0; i < alertList.length; i++) {
                  const user = this.userList.find(el => el.email == alertList[i])
                  alertmsg += user.name + '님'
                }
                alertmsg += '은 이미 이 채널에 초대 받았습니다. 확인해주세요.'
                this.$_error(alertmsg)
              } else {
                this.$_error(error.response.data.message)
              }
              console.error(error.response)
              this.message.content = ''
            })
        } else {
          this.$_alert('초대할 사용자를 선택해주세요')
        }
      }
    },
    inviteAccept: function(alarm,index){
      const message = {
        channel_id: alarm.channel_id,
        sender: null,
        content: this.$store.state.currentUser.name + '님이 채널에 초대되었습니다.',
        message_type:'action'
        // user: this.$store.state.currentUser
      }
      this.$http.post('/api/invite/accept', alarm)
        .then(async (res) => {
          //현재 채널을 변경하는 로직을 구현해야할듯
          this.$store.state.stompClient.send('/pub/chat/message', JSON.stringify(message))
          this.alarmList.splice(index, 1);
          this.$store.state.stompClient.send('/pub/chat/room/' + alarm.channel_id, JSON.stringify({"message": "updateChannel", "error": "null"}))
          await this.selectChannelList(alarm.channel_id) // 채널 id 값이 아니라 channel 객체를 줘야함
          await this.subscribe("/sub/chat/room/" + alarm.channel_id, this.channelSubscribeCallBack)
          this.send("/sub/chat/room/" + alarm.channel_id, 'selectChannelUserList')
        })
        .catch(error => {
          console.error(error)
        })
    },
    inviteRefuse: function (alarm, index) {
      // 초대가 거절됐다는 메시지를 채널에 보내는 로직을 구현해야함
      this.$http.post('/api/invite/refuse', alarm)
        .then(res => {
          const message = {
            channel_id: alarm.channel_id,
            sender: null,
            content: this.$store.state.currentUser.name + '님이 채널 초대를 거부하셨습니다.',
            message_type:'action'
          }
          this.alarmList.splice(index, 1);
          this.$store.state.stompClient.send('/pub/chat/message', JSON.stringify(message))
        })
        .catch(error => {
          console.error(error)
        })
    },
    //채널 강퇴 및 나가기
    leaveChannle: function (user) {
      this.$http.post('/api/channel/leave', {
        email: user.email,
        channel_id: this.currentChannel.id
      }).then(res => {
        this.$eventBus.$emit('leaveChannelMsg', user)
        // 나가기 및 퇴장 유저 채널 리스트 리로드
        this.selectChannelList()
        this.$_alert("<code>[" + this.currentChannel.name + ']</code> 채널에서 ' + (this.isMine(user) ? "나갔습니다." : "추방되었습니다."))
      }).catch(error => {
        this.$_error((this.isMine(user) ? "나가기" : "추방") + '에 실패했습니다.')
      })
    },
    //채널 조회
    getChannel: function (paramChannel) {
      let thisChannel
      if (paramChannel === undefined) {
        thisChannel = paramChannel
      } else {
        let _this = this
        if (typeof paramChannel == 'string' || typeof paramChannel == 'number') {
          $.each(this.channelList, function (idx, channel) {
            if ((paramChannel * 1) === channel.id) {
              thisChannel = _this._makeChannelFunction(channel)
              return false
            }
          })
        } else {
          thisChannel = this._makeChannelFunction(paramChannel)
        }

        /*
        if (thisChannel === undefined && thisChannel.unsubscribe === undefined) {
          setTimeout(function () {
            _this.getChannel(thisChannel)
          }, 500)
        }
        */
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
