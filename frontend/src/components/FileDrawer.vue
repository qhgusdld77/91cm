<template>
  <div>
    <v-container fluid>
      <v-row justify="end">
        <v-btn icon @click="callComponent('main')"><i class="im im-x-mark"></i></v-btn>
      </v-row>
      <div v-for="row in rows">
        <div class="date-divider">
          <span class="mydate">{{setDateFormat(row[0].send_date)}}</span>
        </div>
        <v-row>
          <v-col
            v-for="file in row"
            :key="file.id"
            class="d-flex child-flex"
            cols="6"
            xl="2"
            lg="3"
            md="3"
            sm="4"
          >
            <v-card flat class="mx-auto" tile>
              <div style="height:150px; background-color: #E0E0E0;" @click="fileSelect(file)" class="cetered-align">
                <v-img v-if="selectImage(file).includes('/api/file/download')"
                       :src="selectImage(file)"
                       aspect-ratio="1"
                       class="grey lighten-2"
                       style="cursor: zoom-in"
                       contain
                       height="150"
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
                <div v-else>
                  <v-img
                    :src="selectImage(file,'tiles')"
                    :lazy-src="`https://picsum.photos/10/6?image=50`"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    style="cursor: zoom-in"
                    contain
                    height="55"
                    width="55"
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
                </div>
              </div>
              <v-card-title style="display: inline-block;width: 100%;">
                <a @click="fileDownload(file)" style="font-size:medium;" class="cetered-align">
                  <i class="im im-download" style="font-size: 18px;margin-right: 5px;"/>
                  <span style="width: 100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{file.original_name}}</span>
                </a>
              </v-card-title>
              <v-card-subtitle>
                <p>{{formatBytes(file.file_size)}}</p>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <FilePreview ref="FilePreview"></FilePreview>
  </div>
</template>
<script>
  import CommonClass from "../service/common";
  import FilePreview from "../views/util/FilePreview";
  import pdf from 'vue-pdf'

  export default {
    name: "FileDrawer",
    components: {
      pdf, FilePreview
    },
    data() {
      return {
        showFile: false,
        rotate: 0,
        loadedRatio: 0,
        pdfSrc: undefined,
        pages: undefined,
        index: -1,
        dialog: false,
        rows: [],
        dialogShow: false,
        selectFile: undefined,
        prevImage: undefined,
      }
    },
    watch: {
      channelFiles: function () {
        this.initFiles()
      }
    },
    mounted() {
      this.initFiles()
    },
    methods: {
      initFiles: function () {
        this.rows = []
        let date = this.setDateFormat(this.channelFiles[0].send_date)
        let array = []
        this.channelFiles.forEach(file => {
          if (this.setDateFormat(file.send_date) == date) {
            array.push(file)
          } else {
            this.rows.push(array)
            array = []
            date = this.setDateFormat(file.send_date)
            array.push(file)
          }
        })
        if (array.length != 0) {
          this.rows.push(array)
        }
      },
      formatBytes: function (bytes) {
        return CommonClass.formatBytes(bytes)
      },
      fileSelect: function (file) {
        this.$refs.FilePreview.show(file)
      },
      loadPdfFile(file) {
        this.pdfSrc = pdf.createLoadingTask('/api/file/download/' + file.server_name)
        this.pdfSrc.promise.then(pdf => {
          this.pages = pdf.numPages;
          this.showFile = true
        });
      },
      callComponent: function (componentName) {
        this.$store.commit('getSelectComponent', componentName)
      },
      selectImage: function (file, option) {
        if (this.prevImage === undefined) {
          this.prevImage = CommonClass.checkFileType(file, option)
          return this.prevImage
        } else if (this.prevImage == CommonClass.checkFileType(file, option)) {
          this.showFile = true
          return this.prevImage
        } else {
          return CommonClass.checkFileType(file, option)
        }
      },
      setDateFormat(date, option = 'default') {
        switch (option) {
          case 'all':
            return this.$moment(date).format('YYYY년 MM월 DD일 hh시 mm분')
          default:
            return this.$moment(date).format('YYYY년 MM월 DD일')
        }
      },
      fileDownload: function (file) {
        CommonClass.fileDownload(file)
      },
    }
  }
</script>

<style scoped>

</style>
