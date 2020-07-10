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
              <div style="height:150px; background-color: #E0E0E0;"  @click="fileSelect(file)" class="cetered-align">
                <v-img v-if="selectImage(file).includes('/api/file/download')"
                  :src="selectImage(file)"
                  :lazy-src="`https://picsum.photos/10/6?image=50`"
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
    <v-overlay
      :value="dialogShow"
      opacity="0.8"
      dark
      z-index="10000"
    >
<!--      <v-progress-circular indeterminate size="64" v-if="!showFile"></v-progress-circular>-->
      <div class="row">
        <v-col cols="1" align-self="center" style="margin-top: 10px">
          <v-icon large @click="changeFile(--index)">keyboard_arrow_left</v-icon>
        </v-col>
        <v-col cols="10">
          <div class="myflex">
            <div style="display:inline-block">
              <v-btn icon @click="fileDownload(selectFile)"><i class="im im-download"></i></v-btn>
              <!--              <v-btn icon ><i class="im im-printer"></i></v-btn>-->
            </div>
            <div class="myflex-grow-end">
              <v-btn icon @click="dialogShow=false"><i class="im im-x-mark"></i></v-btn>
            </div>
          </div>

          <v-img v-if="selectFile!=undefined && selectFile.extension !== 'pdf'"
                 :src="selectImage(selectFile,'origin')"
                 lazy-src="https://picsum.photos/10/6?image=50"
                 contain
                 max-height="60vh" max-width="45vw"
          ></v-img>
          <div style="overflow:scroll; max-width: 45vw; height:80vh;" v-else>
            <pdf
              v-for="page in pages"
              :key="page"
              :rotate="rotate"
              @progress="loadedRatio = $event"
              :src="pdfSrc"
              :page="page"
              style="width: 100%">
            </pdf>
          </div>
        </v-col>
        <v-col cols="1" align-self="center" style="margin-top: 10px">
          <v-icon large @click="changeFile(++index)">keyboard_arrow_right</v-icon>
        </v-col>
      </div>
    </v-overlay>

  </div>
</template>
<script>
  import CommonClass from "../service/common";
  import pdf from 'vue-pdf'

  export default {
    name: "FileDrawer",
    components: {
      pdf
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
      }
    },
    watch: {
      channelFiles: function () {
        this.initFiles()
      },
      loadedRatio: function () {
        console.log(this.loadedRatio)
      }
    },
    mounted() {
      this.initFiles()
    },
    methods: {
      test: function () {
        alert('laod')
      },
      changeFile: function (index) {
        console.log('changeFile, ', index)
        if (index < 0) {
          this.index = 0
          this.$_error('가장 최신 파일 입니다.')
          return;
        }
        if (index >= this.channelFiles.length) {
          this.index = this.channelFiles.length - 1
          this.$_error('더 이상 파일이 없습니다.');
          return;
        }
        if (this.channelFiles[index].extension === 'pdf') {
          this.loadPdfFile(this.channelFiles[index])
        }
        this.selectFile = this.channelFiles[index];
      },
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
      formatBytes: function (bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
      fileSelect: function (file) {
        if (file.extension == 'pdf') {
          this.loadPdfFile(file)
        }
        this.index = this.channelFiles.findIndex((f) => f.id == file.id)
        this.selectFile = file
        this.dialogShow = true
      },
      loadPdfFile(file) {
        this.showFile = false
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
        return CommonClass.checkFileType(file, option)
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
        this.$http.get("/api/file/download/" + file.server_name, {
          responseType: 'blob'
        })
          .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url;
            link.setAttribute('download', file.original_name)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
          })
      },
    }
  }
</script>

<style scoped>
  /*.{*/
  /*  height: 100%;*/
  /*  width: 100%;*/
  /*}*/

  /*.v-overlay{*/
  /*  align-items: normal;*/
  /*  justify-items: normal;*/
  /*}*/
  /*.v-overlay__content{*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*}*/
</style>
