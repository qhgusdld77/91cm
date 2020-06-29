import axios from "axios";
/*import Vue from 'vue'*/

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
    //console.log("jjw1122")
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
  updateUserList: function (context) {
    //console.log("jjw1123")
    //context.commit('selectChannelList', context.state.currentChannel)
    //channelMixin.selectChannelList(context.state.currentChannel)

    /*
    let currentChannel = 
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
    */
  },
  // 현재 유저의 채널 리스트 가져오기
  channelList: async function (context) {
    //console.log("jjw1121")
    
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
  forceLeaveChannel: function(context) {
    context.dispatch('channelList')
  }
}
