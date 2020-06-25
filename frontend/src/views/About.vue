<template>
  <!-- <div>
    <v-btn @click="testModal"></v-btn>
    <button ref="test" v-show="false">teetetet</button>
  </div> -->

 <v-row>
    <v-col cols="12" style="padding:0px;">
      <v-card style="height:100vh;">
        
          <v-row>
            <v-col
              v-for="n in 9"
              :key="n"
              class="d-flex child-flex"
              cols="4"
            >
              <v-card flat tile class="d-flex">
                <v-img
                  :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
                  :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        
      </v-card>
    </v-col>
  </v-row>

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
