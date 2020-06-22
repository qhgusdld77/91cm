<template>
  <div class="home">
    <Login></Login>
  </div>
</template>

<script>
  import Login from '../views/Login'

  export default {
    name: 'Home',
    components: {
      Login
    },
    data() {
      return {}
    },
    mounted() {
      if (this.$route.params.msg) {
        if (this.$route.params.msg.show) {
          this.$_alert(this.$route.params.msg.message)
        }
      }
      if (this.$route.query.msg) {
        if (this.$route.query.msg.show) {
          this.$_alert(this.$route.query.msg.message)
        }
      }
    },

  }
</script>
