<template>
  <div>
    <v-btn @click="testModal"></v-btn>
    <button ref="test" v-show="false">teetetet</button>
  </div>
</template>
<script>
  export default {
    name: 'About',
    created() {
    },
    components: {},
    computed: {},
    data() {
      return {
      };
    },
    watch: {
    },
    methods: {
      typeToTitle :function (type) {
        if(type === 'error') return "에러"
        if(type === 'alert') return "알림"
        return "알림"
      },
      testModal: async function () {
        // this.$_confirm("test",function(){
        //       alert("test")
        // });

      },
      async hihi(){
        let val = await this.$alertModal('asd','asdasd' )
        console.log(val)
      },

    }
  }

</script>
<style scoped>

</style>
