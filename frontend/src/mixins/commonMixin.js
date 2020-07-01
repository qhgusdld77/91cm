import { mapGetters } from "vuex";
let commonMixin = {
  data() {
    return {
      subscribeList: []
    }
  },
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
          if(callback !== undefined) {
            callback(res)
          }
        })
    },
    isAdmin: function () {
      var loginUserRoles = this.currentUser.roles
      return loginUserRoles.includes('ROLE_ROOT') || loginUserRoles.includes('ROLE_ADMIN')
    },
    subscribe: function(url, func) {
      if(!this.subscribeList.includes(url)) {
        this.subscribeList.push(url)
        return this.$store.state.stompClient.subscribe(url, func)
      }
      return null
    },
    send: function(url, message) {
      this.$store.state.stompClient.send(url, JSON.stringify({
        'message': message,
        'error': "null"
      }))
    }
  }
};
export default commonMixin;
