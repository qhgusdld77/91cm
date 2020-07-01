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
      return this.$store.state.stompClient.subscribe(url, func)
    },
    send: function(url, message) {
      console.log("jjw2")
      this.$store.state.stompClient.send(url, JSON.stringify({
        'message': message,
        'error': "null"
      }))
    }
  }
};
export default commonMixin;