<template>
  <li class="list-unstyled chat-message">
    <div class="icon">
      <slot name="m-icon">
        <img v-if="msg.user.picture" class="icon-round" :src="msg.user.picture" width="40" height="40"/>
        <img v-else class="icon-round" src="../../assets/images/default-user-picture.png" width="40" height="40">
      </slot>
    </div>
    <!-- flex에서 벗어나기 위해 감쌈  -->
    <div>
      <div class="verti-align">
        <slot name="m-info">
          <strong>{{ msg.user.name }}</strong>
          <span style="font-size: 11px; margin-left:3px; ">{{ msg.str_send_date }}</span>
        </slot>
      </div>
      <!-- 채팅메세지내용 -->
      <div class="verti-align">
        <slot name="m-content">
          <div v-if="msg.files == null || msg.content" v-html="textbyFilter(msg.content)"
               class="mychat-content"></div>
          <b-container fluid v-else-if="msg.files.length > 0" class="p-4 bg-white">
            <b-row>
              <b-col v-for="(file,index) in msg.files" :key="index">
                <a @click="fileDownload(file)">
                  <b-img thumbnail rounded fluid :src="selectImage(file)" alt="이미지를 찾을 수 없습니다."
                         style="max-width: 200px" @load="$emit('imgLoad')"></b-img>
                  <p><b>{{file.original_name}}</b></p>
                  <p>file size : {{(file.file_size / 1024).toLocaleString(undefined,{minimumFractionDigits:2})}}
                    kb</p>
                </a>
              </b-col>
            </b-row>
          </b-container>
        </slot>
      </div>
      <!-- 채팅메시지내용끝 -->
    </div>
  </li>
</template>
<script>
  import CommonClass from "../../service/common";

  export default {
    name: 'MsgBox',
    props: ['msg','msgPreviewBool'],
    methods: {
      textbyFilter: function(content) {
        const testRegexp = new RegExp(/<p>(.*?)<\/p>/g);
        const htmlTagRegexp = new RegExp(/(<([^>]+)>)/ig);
        const urlRegexp = new RegExp(/(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*)*/gi,)

        // content.match(testRegexp).forEach(contentItem =>{
        //   console.log(contentItem)
        //   console.log(urlRegexp.test(contentItem))
        // });

        // 임시 코드
        // 생각해봐야 할것 일반 택스트가 위고 링크가 아래 혹은 반대의 상황이 있을 수 있음
        // 링크가 여러개 있을 수 있음
        // 링크만 존재할 수 있음
        if (urlRegexp.test(content) && this.$store.state.searchText == '') {
          // url이 여러개 일때도 생각해서 코딩 match가 배열로 반환됨으로 여러개 일때는 match 배열에 다 들어가있을것으로 추측
          let result =""
          content.match(urlRegexp).forEach(url =>{
            result+= "<a style='color: blue' href='" + url+ "' target='_blank'>" + url + "</a><br>"
          })
          return result+=content.replace(urlRegexp,'')
        }
        return this.$options.filters.highlight(content, this.$store.state.searchText);
      },
      selectImage: function (file) {
        return CommonClass.checkFileType(file)
      },
      fileDownload: function (file) {
        this.$http.get(file.path, {
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
    },
    filters: {
      highlight: function (stringToSearch, searchTerm) {
        if (searchTerm === "") return stringToSearch;
        var iQuery = new RegExp(searchTerm, "ig");
        return stringToSearch
          .toString()
          .replace(iQuery, function (matchedText, a, b) {
            return "<span class='highlight'>" + matchedText + "</span>";
          });
      }
    }
  }
</script>
