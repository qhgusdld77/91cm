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
            cols="4"
            lg="2"
            md="2"
            sm="3"
          >
            <v-card flat class="mx-auto" tile>
              <v-img
                :src="selectImage(file)"
                :lazy-src="`https://picsum.photos/10/6?image=50`"
                aspect-ratio="1"
                class="grey lighten-2"
                style="cursor: zoom-in"
                contain
                @click="fileSelect(file)"

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
              <v-card-title @click="fileDownload(file)" style="cursor: pointer">
                  <i class="im im-download" style="font-size: medium"> {{file.original_name}}</i>
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
        <v-container fluid :style="{height: windowHeight+'px'}">
          <v-row align="start">
            <v-col cols="4">
              <v-btn icon @click="dialogShow=false"><i class="im im-x-mark"></i></v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn icon @click="alert('test')"><i class="im im-info"></i></v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn icon @click="fileDownload(selectFile)"><i class="im im-download"></i></v-btn>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="5">
              <v-img v-if="selectFile!=undefined" :src="selectImage(selectFile)"
                     min-width="500px"
                     max-width="1000px"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
    </v-overlay>
  </div>
</template>
<script>
  import CommonClass from "../service/common";

  export default {
    name: "FileDrawer",
    data() {
      return {
        rows: [],
        dialogShow: false,
        selectFile: undefined,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      }
    },
    created() {
      window.addEventListener("resize", this.windowResizeEvent);
    },
    destroyed() {
      window.removeEventListener("resize", this.windowResizeEvent);
    },
    mounted() {
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
    methods: {
      windowResizeEvent: function(){
        console.log(this.windowHeight)
        this.windowHeight = window.innerHeight
        this.windowWidth = window.innerWidth
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
        this.selectFile = file
        this.dialogShow = true
      },
      callComponent: function (componentName) {
        this.$store.commit('getSelectComponent', componentName)
      },
      selectImage: function (file) {
        return CommonClass.checkFileType(file, 'origin')
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
  .v-overlay{
    align-items: normal;
    justify-items: normal;
  }
  .v-overlay__content{
    width: 100%;
    height: 100%;
  }
</style>
