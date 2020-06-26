import {mapGetters} from "vuex";
let commonMixin = {
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser'
    })
  },
  methods: {
    commit: function(key, value) {
      this.$store.commit(key, value)
    },
    post: function(url, params, callback) {
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
    subscribe: function(url,func){
      this.$store.state.stompClient.subscribe(url,func)
    }
  }
};
export default commonMixin;