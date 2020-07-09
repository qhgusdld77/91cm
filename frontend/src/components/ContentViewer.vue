<template>
  <div style="background-color: black; opacity: 0.8; justify-items: center">
    <v-container fluid id="container">
      <pdf
        v-for="page in pages"
        :key="page"
        :src="pdfSrc"
        :page="page"
        style="width: 50%"
      ></pdf>
    </v-container>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'
  // let loadingTask = pdf.createLoadingTask('/api/file/download/ffa90b27581f4c2a9bc38f26f4e9160b');
  export default {
    name: "ContentViewer",
    components:{
      pdf
    },
    data(){
      return{
        pdfSrc: loadingTask,
        pages: undefined
      }
    },
    mounted() {
      this.pdfSrc.promise.then(pdf =>{
        this.pages = pdf.numPages;
      });
    },
  }
</script>

<style scoped>
</style>
