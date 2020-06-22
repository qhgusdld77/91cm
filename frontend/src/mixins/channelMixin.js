let channelMixin = {
  methods:{
    leaveChannle: function (userEmail, channel,option='default') {
      console.log(userEmail);
      console.log(option)
      this.$http.post('/api/channel/leave', {
        email: userEmail,
        channel_id: channel.id
      }).then(res => {
        // 유저가 나갔음으로 채널 유저 업데이트
        this.$store.state.stompClient.send('/pub/chat/room/' + channel.id,
          JSON.stringify({'message': 'updateChannel', 'error': "null"}))
        this.leaveMsgConverter(option)
      }).catch(error => {
        this.$_e('error', '나가기에 실패했습니다.')
      })
    },
    leaveMsgConverter: function(option){
      console.log(this.userName)
      if (option==='forceLeave'){
        this.$eventBus.$emit('forceLeaveChannelMsg', this.userName)
        this.$_alert(this.currentChannel + ' 채널에서 추방되었습니다.')
      }else{
        this.$eventBus.$emit('leaveChannelMsg')
        this.$_alert(null, this.currentChannel+ ' 채널에서 나갔습니다.')
      }
    }
  }
};
export default channelMixin;
