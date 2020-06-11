export default {
  getSearchMode: state => {
    return state.isSearchMode
  },
  getStompClient: state => {
    if (state.stompClient.connected != null) {
      if (state.stompClient != null) {
        return state.stompClient
      }
    }
  },
  getCurrentUser: state => state.currentUser,
  getUserChannelList: state => state.userChannelList,
  getTaskBoard: state=> state.taskBoard,
  getCurrentChannel: state => state.currentChannel,
  getSyncChannelUser: state => state.syncSignal.syncChannelUser,
  getChannelUsers: state => state.channelUsers,
  getSelectComponent: state => state.selectComponent,
  getUserList: state => state.userList,
  getMsgArray: state => state.msgArray,
  getIsVideoMode: state => state.isVideoMode,
  getIsSmallWidth: state => state.isSmallWidth
}
