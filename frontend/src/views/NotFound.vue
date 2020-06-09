<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <h3>{{ errorMsg[0] }}</h3>
        <h1><span>{{ errorCode[0] }}</span><span>{{ errorCode[1] }}</span><span>{{ errorCode[2] }}</span></h1>
      </div>
      <h2>{{ errorMsg[1] }}</h2>
      <a href="/" class="btn btn-white btn-animation-1">GO HOME</a>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'NotFound',
    data() {
      return {
        errorCode: ['4', '0', '2'],
        errorMsg: ['Page not found', '해당 페이지를 찾을 수 없습니다.']
      }
    },
    created() {
      switch (this.$route.query.type) {
        case '502':
          this.errorCode[0] = '5'
          this.errorCode[1] = '0'
          this.errorCode[2] = '2'
          this.errorMsg[0] = 'Bad Gateway'
          this.errorMsg[1] = '서버에 연결할 수 없습니다.'
          return
        default:
          return
      }

    }
  }
</script>

<style scoped>
  @import "../assets/css/error.css";
</style>
