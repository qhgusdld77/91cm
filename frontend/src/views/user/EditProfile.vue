<template>
  <main class="mainwrapper" style="height: calc(100vh - 150px);overflow: auto;">
    <div class="container-fluid">
      <div class="page-header">
        <div class="row align-items-end">
          <div class="col-lg-8">
            <div class="page-header-title">
              <i class="ik ik-file-text bg-blue"></i>
              <div class="d-inline">
                <h5>Profile</h5>
                <span>개인 프로필 수정</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row no-gutters">
        <div class="col-lg-2 col-md-3">

        </div>
        <div class="col-lg-8 col-md-7">
          <div class="card">
            <div class="info-w verti-align">

              <div class="info-wrapper cetered-align card-body">
                <div style="margin: 20px 0px 35px;">
                  <input type="file" hidden ref="fileInput" @change="attachFile">
                  <div @click="fileInputClick">
                    <img v-if="user.picture" class="icon-round"
                           :src="user.picture" width="200" height="200">
                    
                    <img v-else class="icon-round" src="../../assets/images/default-user-picture.png" width="200"
                           height="200">
                  </div>
                </div>
                <table>
                  <tbody>
                  <tr>
                    <th>
                      <label for="name">이름</label>
                    </th>
                    <td>
                      <b-input type="text" @keyup="symbolsFormatter" name="name" v-model="user.name"></b-input>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label for="email">이메일</label>
                    </th>
                    <td>
                      <b-input type="email" name="email" :disabled="true" v-model="user.email"></b-input>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label for="phone">전화번호</label>
                    </th>
                    <td>
                      <b-input type="text" @keyup="phoneFormatter" name="phone" v-model="user.phone"></b-input>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div style="margin-top: 25px;">
                  <b-button style="margin:15px;" variant="primary" @click="edit">수정</b-button>
                  <b-button style="margin:15px;" variant="primary" @click="callComponent">취소</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="프로필 사진"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="">
        <b-form-group
          :state="nameState"
          label="이미지 url"
          label-for="name-input"
          invalid-feedback="url 주소가 필요합니다."
        >
          <b-form-input
            id="name-input"
            v-model="imageUrl"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </main>
</template>
<script>
  // 이름 길이 제한 및 핸드폰 번호 정규식 추가 예정
  export default {
    name: 'EditUser',
    data() {
      return {
        imageForm: null,
        imageUrl: '',
        nameState: null,
        user: {}
      }
    },
    activated() {
      this.user=Object.assign({}, this.$store.state.currentUser)
    },
    methods: {
      addFile: function (uploadFiles) {
        const maxUploadSize = 100 * 1024 * 1024;
        if (uploadFiles[0] == null) {
          return;
        }
        if (uploadFiles[0].size >= maxUploadSize) {
          this.$alertModal('alert', '한번에 보낼 수 있는 파일 용량은 100MB 입니다.')
          return;
        }
        this.imageForm = new FormData();
        this.imageForm.append('file', uploadFiles[0])
        const url = window.URL.createObjectURL(uploadFiles[0])
        this.user.picture = url
      },
      attachFile: function (e) {
        this.addFile(e.target.files)
        this.$refs.fileInput.value = null
      },
      fileInputClick() {
        this.$refs.fileInput.click()
      },
      callComponent: function () {
        this.$store.commit('getSelectComponent', 'user')
      },
      handleOk: function (bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },
      handleSubmit: function () {
        if (!this.checkFormValidity) {
          // 추후 url 주소 정규식 검사 추가
          return
        }
        this.user.picture = this.imageUrl
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      checkFormValidity: function () {
        const valid = this.$refs.form.checkValidity()
        this.nameState = valid
        return valid
      },
      resetModal: function () {
        this.imageUrl = ''
      },
      edit: function () {
        if (!this.valueCheck(this.user.email, this.user.name, this.user.phone)) {
          return;
        }
        this.$http.post('/api/user/update', this.user)
          .then(res => {
            if (res.data) {
              this.$http.post('/api/file/upload/user/image', this.imageForm, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then(res => {
                this.$store.state.currentUser.picture = res.data
              }).catch(error => {
                this.$alertModal('error', '이미지 파일만 업로드 할 수 있습니다.')
              })
              this.$store.state.stompClient.send('/pub/sync/info', null, {})
              this.$store.dispatch('initCurrentUser')
              this.$store.commit('getSelectComponent', 'user')
            }
          })

      },
      phoneFormatter: function () {
        this.user.phone = this.user.phone.replace(/[^0-9]/g, "") // 숫자만 추출 되도록하는 정규식
        this.user.phone = this.user.phone.replace(/(^02.{0}|^01.{1}|[0-9]{4})([0-9]+)([0-9]{4})/, "$1-$2-$3");// 휴대폰번호 자동 하이픈 넣어주는 정규식
      },
      symbolsFormatter: function () {
        this.user.name = this.user.name.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, "")
      },

      valueCheck: function (email, name, phone) {
        const phoneRegex = '^01(?:0|1|[6-9])[-]?(\\d{3}|\\d{4})[-]?(\\d{4})$'
        // const symbolsRegex = '/[~!@#$%^&*()_+|<>?:{}]/'
        // if (!name.match(symbolsRegex)){
        //   this.$alertModal('error','이름에는 특수기호가 들어갈 수 없습니다')
        //   return false
        // }
        if (email == null || email == '') {
          this.$alertModal('error', '이메일을 입력해주세요')
          return false
        }
        if (name == null || name == '') {
          this.$alertModal('error', '이름을 입력해주세요')
          return false
        }
        if (name.length > 20) {
          this.$alertModal('error', '이름이 너무 깁니다.')
          return false
        }
        if (phone == null || phone == '') {
          this.$alertModal('error', '핸드폰 번호를 입력해주세요')
          return false
        }
        if (!phone.match(phoneRegex)) {
          this.$alertModal('error', '핸드폰 번호가 형식에 맞지 않습니다')
          return false
        }
        return true
      }
    }
  }
</script>
