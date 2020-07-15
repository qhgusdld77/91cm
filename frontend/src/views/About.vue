<template>
  <h1>test</h1>
</template>
<script>
  export default {
    name: 'About',
    created() {
    },
    mounted() {
      this.$http.get('https://kapi.kakao.com/v1/translation/translate?query=test&src_lang=kr&target_lang=en',{
        headers:{
          'Authorization': 'KakaoAK a59b20447f9a342512799f90e4bec7d5',
        }
      }).then(res=>{
        console.log(res)
      })
      },
    computed: {},
    data() {
      return {
      };
    },
    watch: {
    },
    methods: {
    }
  }

</script>
<style scoped>

</style>
