export default {
  setChannelUsers: function(state,payload){
    state.channelUsers = payload
  },
  setCurrentChannel: function (state, payload) {
    state.currentChannel = payload
  },
  setChannelList: function (state, payload) {
    state.userChannelList = payload
  },
  getSelectComponent: function (state, payload) {
    state.oldComponent = state.selectComponent
    state.selectComponent = payload
  },
  getUserList: function (state, payload) {
    state.userList = payload
  },
  setCurrentUser: function (state, payload) {
    state.currentUser = payload
  },
  resetCurrentUser: function (state) {
    state.currentUser = {}
  },
  setFocus: function (state, payload) {
    state.isfocus = payload
  },
  setIsLogout: function (state, payload) {
    state.isLogout = payload
  },
  setSearchText: function (state, paylod) {
    state.searchText = paylod
  },
  setTaskBoard: function (state,payload) {
    state.taskBoard = payload
  },
  setSmallWidth: function (state, payload) {
    state.isSmallWidth = payload
  },
  setCreateListActive: function(state,payload){
    state.isCreateListActive = payload
  },
  setMsgArray: function(state,payload){
    state.msgArray = payload
  },
  pushMsg: function(state,payload){
    state.msgArray.push(payload)
  },
  setIsVideoMode: function(state,payload){
    state.isVideoMode = payload
  }
  


}
