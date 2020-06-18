import axios from "axios";
import Vue from 'vue'
export default {
  // 현재 채널의 모든 taskList 가져오기
  updateTaskBoard: function(context){
    axios.get('/api/tasklist/get/'+context.state.currentChannel.id)
      .then(res => {
        // CommonClass.replaceText(res.data)
        context.commit('setTaskBoard',res.data);
      }).catch(error=>{
      console.error(error)
    })
  },
  // 91cm에 가입한 모든 유저 가져오기
  userListUpdate: function (context) {
    axios.get('/api/user/list')
      .then(res => {
        context.commit('getUserList', res.data);
      }).catch(error => {
      console.error(error);
    })
  },
  updateUserList: function (context) {
    let currentChannel = context.state.currentChannel
    if (currentChannel != null) {
      axios.get('/api/user/channel/' + currentChannel.id)
        .then(res => {
          this.channelUsers = res.data
          context.commit('setChannelUsers', res.data)
        })
    }
    else {
      context.commit('setChannelUsers', [])
    }
  },
  // 현재 유저의 채널 리스트 가져오기
  channelList: async function (context) {
    await axios.get('/api/channel/list')
      .then(res => {
        context.commit('setChannelList', res.data)
        if(res.data.length == 0) {
          context.commit('setCurrentChannel', null)
          context.dispatch('updateUserList')
        }
        else {
          context.commit('setCurrentChannel', res.data[0])
        }
      }).catch(error => {
      })
  },
  // 현재 로그인 한 유저 가져오기
  initCurrentUser: async function (context) {
    await axios.get('/api/user/info')
      .then(res => {
        context.commit('setCurrentUser', res.data)
      }).catch(error=>{
        context.commit('setCurrentUser', 'none')
      })
  },
  resetCurrentUser: function (context) {
    context.commit('resetCurrentUser')
  },
  updateCurrentChannel: function (context) {
    axios.post('/api/channel/current',{id: context.state.currentChannel.id})
      .then(res =>{
        context.commit('setCurrentChannel',res.data)
        const channel = context.state.userChannelList
          .find(channel => channel.id == context.state.currentChannel.id)
        channel.name = context.state.currentChannel.name
      })
  },
  deleteCurrentChannel: function(context) {
    context.dispatch('channelList')
    //this.$store.state.stompClient.send("/sub/chat/room/" + this.$store.state.currentChannel.id, null ,{noticeMsg : context.state.currentChannel.name + "채널이 삭제되었습니다."})
  },
  forceLeaveChannel: function(context) {
    console.log("jjw channelList call")
    context.dispatch('channelList')
  }
}
