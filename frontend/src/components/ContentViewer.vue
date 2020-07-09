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
  // let loadingTask = pdf.createLoadingTask('/api/file/download/489ecdfabfb94d7c9ef7a49774393d82');
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
