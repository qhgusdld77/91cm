import {mapGetters} from "vuex";

let commonMixin = {
  computed: {
    ...mapGetters({
      channelUsers: 'getChannelUsers',
      isVideoMode: 'getIsVideoMode',
      currentUser: 'getCurrentUser',
      channelList: 'getChannelList',
      msgArray: 'getMsgArray',
      currentChannel: 'getCurrentChannel',
      wrapperEl: 'getWrapperEl',
      cursorPoint: 'getCursorPoint',
      oldScrollHeight: 'getOldScrollHeight',
      selectComponent: 'getSelectComponent',
      subscribeList: 'getSubscribeList',
      channelArr: 'getChannelArr',
      firstLoad: 'getFirstLoad'
    })
  },
  methods: {
    commit: function (key, value) {
      this.$store.commit(key, value)
    },
    post: function (url, params, callback) {
      this.$http.post(url, params)
        .then(res => {
          if (callback !== undefined) {
            callback(res)
          }
        })
    },
    isAdmin: function () {
      return this.currentUser.roles.includes('ROLE_ADMIN') || this.isRoot()
    },
    isRoot: function () {
      return this.currentUser.roles.includes('ROLE_ROOT')
    },
    subscribe: function (url, func) {
      if (!this.subscribeList.includes(url)) {
        this.subscribeList.push(url)
        this.commit('setSubscribeList', this.subscribeList)

        return this.$store.state.stompClient.subscribe(url, func)
      }
      return null
    },
    send: function (url, message) {
      this.$store.state.stompClient.send(url, JSON.stringify({
        'message': message,
        'error': "null"
      }))
    }
  }
};
export default commonMixin;
