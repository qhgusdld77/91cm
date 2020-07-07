import axios from "axios";

export default {
  // 현재 채널의 모든 taskList 가져오기

  loadChannelFiles: function(context,payload){
    axios.post('/api/file/get/files',{
      channel_id: payload
    }).then(res => {
      console.log("loadChannelFiles >>>",res.data)
      context.commit('setChannelFiles',res.data)
    })
  },

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
    /*
    axios.get('/api/user/list')
      .then(res => {
        context.commit('getUserList', res.data);
      }).catch(error => {
      console.error(error);
    })
    */
  },
  // 채널에 입장하지 않은 모든 유저 가져오기
  inviteUserList: function (context) {
    axios.get('/api/user/invite/'+context.state.currentChannel.id)
      .then(res => {
        context.commit('setInviteUserList', res.data);
      }).catch(error => {
      console.error(error);
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
  forceLeaveChannel: function(context) {
    context.dispatch('channelList')
  }
}
