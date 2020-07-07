<template>
  <div>
    <v-container fluid>
      <v-row justify="end">
        <v-btn icon @click="callComponent('main')"><i class="im im-x-mark"></i></v-btn>
      </v-row>
      <v-row>
        <v-col
          v-for="n in 9"
          :key="n"
          class="d-flex child-flex"
          cols="2"
        >
          <v-card flat class="mx-auto">
            <v-img
              :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
              :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
              aspect-ratio="1"
              class="grey lighten-2"
              style="cursor: zoom-in"
              contain
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
            <v-card-title style="">
              파일 {{n}}
            </v-card-title>
            <v-card-subtitle>
              날짜
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: "FileDrawer",
    methods:{
      callComponent: function (componentName) {
        this.$store.commit('getSelectComponent', componentName)
      },
    }
  }
</script>

<style scoped>

</style>
