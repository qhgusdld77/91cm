<template>
  <v-overlay
    :value="overlayShow"
    opacity="0.8"
    dark
    z-index="10000"
  >
    <v-progress-circular indeterminate size="64" v-show="!showFile"></v-progress-circular>
    <v-row justify="center" v-show="showFile">
      <v-col cols="1" align-self="center" style="margin-top: 10px">
        <v-icon v-if="index > 0" large @click="moveFile(--index)">keyboard_arrow_left</v-icon>
      </v-col>
      <v-col cols="10">
        <div class="myflex">
          <div style="display:inline-block">
            <v-btn icon @click="fileDownload(selectFile)"><i class="im im-download"></i></v-btn>
            <!--              <v-btn icon ><i class="im im-printer"></i></v-btn>-->
          </div>
          <div class="myflex-grow-end">
            <v-btn icon @click="hide"><i class="im im-x-mark"></i></v-btn>
          </div>
        </div>
        <v-img v-if="selectFile!==undefined && selectFile.extension !== 'pdf'"
               :src="selectImage(selectFile,'origin')"
               contain
               max-height="60vh" max-width="45vw"
               eager
               @load="showFile = true;"
        ></v-img>
        <div style="overflow:scroll; width: 100%; height:80vh;" v-else>
          <pdf
            v-for="page in pages"
            :key="page"
            @progress="loadedRatio = $event"
            :src="pdfSrc"
            :page="page"
            style="width: 100%;">
          </pdf>
        </div>
      </v-col>
      <v-col cols="1" align-self="center" style="margin-top: 10px">
        <v-icon v-if="index < channelFiles.length-1" large @click="moveFile(++index)">keyboard_arrow_right</v-icon>
      </v-col>
    </v-row>
  </v-overlay>
</template>

<script>
  import pdf from "vue-pdf";
  import CommonClass from "../../service/common";

  export default {
    name: "FilePreview",
    components: {
      pdf
    },
    data() {
      return {
        showFile: false,
        selectFile: undefined,
        overlayShow: false,
        pdfSrc: undefined,
        pages: undefined,
        index: 0,
      }
    },
    methods: {
      clickEvent: function (e) {
        if (this.overlayShow === true) {
          if (e.code === "ArrowRight") {
            this.moveFile(++this.index)
          } else if (e.code === "ArrowLeft") {
            this.moveFile(--this.index)
          } else if (e.code === "Escape") {
            this.hide()
          }
        }
        // else if (this.overlayShow === false) {
        //   if (e.code === "Escape") {
        //     // this.callComponent('main')
        //   }
        // }
      },
      show: function (file) {
        document.addEventListener('keydown', this.clickEvent)
        if (file.extension == 'pdf') {
          this.loadPdfFile(file)
        }
        this.index = this.channelFiles.findIndex((f) => f.id == file.id)
        this.selectFile = file
        this.overlayShow = true
      },
      hide: function () {
        document.removeEventListener('keydown', this.clickEvent)
        this.overlayShow = false
        this.selectFile = undefined
        this.showFile = false
      },
      moveFile: function (index) {
        if (index < 0) {
          this.index = 0
          return
        } else if (index >= this.channelFiles.length) {
          this.index = this.channelFiles.length - 1
          return;
        }
        this.showFile = false
        if (this.channelFiles[index].extension === 'pdf') {
          this.loadPdfFile(this.channelFiles[index])
        }
        this.selectFile = this.channelFiles[index];
      },
      loadPdfFile(file) {
        this.pdfSrc = pdf.createLoadingTask('/api/file/download/' + file.server_name)
        this.pdfSrc.promise.then(pdf => {
          this.pages = pdf.numPages;
          this.showFile = true
        });
      },
      selectImage: function (file, option) {
        if (this.prevImage === undefined) {
          this.prevImage = CommonClass.checkFileType(file, option)
          return this.prevImage
        } else if (this.prevImage == CommonClass.checkFileType(file, option)) {
          this.showFile = true
          return this.prevImage
        } else {
          this.prevImage = CommonClass.checkFileType(file, option)
          return this.prevImage
        }
      },
      fileDownload: function (file) {
        CommonClass.fileDownload(file)
      },
    }
  }
</script>

<style scoped>
 >>>canvas{
   max-width: 45vw;
 }
</style>
