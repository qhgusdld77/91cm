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
  getChannel: state => state.channel,
  getChannelList: state => state.channelList,
  getTaskBoard: state=> state.taskBoard,
  getCurrentChannel: state => state.currentChannel,
  getSubscribeList: state => state.subscribeList,
  getSyncChannelUser: state => state.syncSignal.syncChannelUser,
  getChannelUsers: state => state.channelUsers,
  getSelectComponent: state => state.selectComponent,
  getUserList: state => state.userList,
  getMsgArray: state => state.msgArray,
  getIsVideoMode: state => state.isVideoMode,
  getIsSmallWidth: state => state.isSmallWidth,
  getInviteUserList: state => state.inviteUserList,
  getWrapperEl: state => state.wrapperEl,
  getCursorPoint: state => state.cursorPoint,
  getOldScrollHeight:state => state.oldScrollHeight,
  getChannelArr:state => state.channelArr,
  getFirstLoad: state => state.firstLoad,
}
