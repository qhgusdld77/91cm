import { mapGetters } from "vuex";
let commonMixin = {
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      channelList: 'getChannelList'
    })
  },
  methods: {
    commit: function (key, value) {
      this.$store.commit(key, value)
    },
    post: function (url, params, callback) {
      this.$http.post(url, params)
        .then(res => {
          callback(res)
        }).catch(error => {
          console.error(error)
        })
    },
    isAdmin: function () {
      var loginUserRoles = this.currentUser.roles
      return loginUserRoles.includes('ROLE_ROOT') || loginUserRoles.includes('ROLE_ADMIN')
    },
    subscribe: function(url, func) {
      let result = this.$store.state.stompClient.subscribe(url, func)
      if(url.indexOf("/sub/chat/room/") > -1) {
        let channelId = url.replace("/sub/chat/room/", "")
        $.each(this.channelList, function(idx, channel) {
          if(channelId == channel.id) {
            channel.unsubscribe = result.unsubscribe
          }
        })
        this.commit("setChannelList", this.channelList)
      }
      return result
    }
  }
};
export default commonMixin;
