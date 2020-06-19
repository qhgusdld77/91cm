<template>
  <div class="bg">
    <div class="container">
      <div class="row">
        <!--   이메일, 이름, 핸드폰 번호 규격에 맞는지 확인 하는 정규식 추후에 추가     -->
        <div class="col-md-12 min-vh-100 d-flex flex-column justify-content-center">
          <div class="row">
            <div class="col-lg-6 col-md-8 mx-auto">
              <div class="card rounded shadow shadow-sm mainbox">
                <div class="card-header">
                  <h5>91cm를 사용하기 위해 추가적으로 필요한 정보를 입력해주세요</h5>
                </div>
                <div class="card-body">
                  <label v-if="!user.email">가입할 이메일을 입력해주세요</label>
                  <b-input v-if="!user.email" type="text" name="email" v-model="email" placeholder="이메일"></b-input>
                  <label>91cm에서 사용할 이름을 입력해주세요</label>
                  <b-input type="text" name="name" v-model="user.name" placeholder="이름"
                           @keyup="symbolsFormatter"></b-input>
                  <label>업무에 사용하는 핸드폰 번호를 입력해주세요</label>
                  <b-input type="text" name="phone" v-model="user.phone" placeholder="핸드폰 번호"
                           @keyup="phoneFormatter" ref="phoneNum"></b-input>
                  <b-button class="float-right" style="margin:15px;" variant="primary" @click="insertUser">등록</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Home from "./Home";

  export default {
    name: 'SignUp',
    data() {
      return {
        user: {
          name: '',
          phone: '',
          email: '',
          picture: ''
        }
      }
    },
    created() {
      this.getUser()
    },
    methods: {
      symbolsFormatter: function () {
        this.user.name = this.user.name.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, "")
      },
      phoneFormatter: function () {
        this.user.phone = this.user.phone.replace(/[^0-9]/g, "") // 숫자만 추출 되도록하는 정규식
        this.user.phone = this.user.phone.replace(/(^02.{0}|^01.{1}|[0-9]{4})([0-9]+)([0-9]{4})/, "$1-$2-$3");// 휴대폰번호 자동 하이픈 넣어주는 정규식
      },
      getUser() {
        this.$http.get('/api/user/getsession').then(res => {
          this.user.name = res.data.name
          this.user.phone = res.data.phone
          this.user.email = res.data.email
          this.email = this.user.email
          this.user.picture = res.data.picture
        })
      },
      insertUser() {
        this.user.email = this.email
        if (!this.valueCheck(this.user.email, this.user.name, this.user.phone)) {
          return;
        }
        let csrfToken = document.cookie.match('(^|;) ?' + 'XSRF-TOKEN' + '=([^;]*)(;|$)')
        this.$http.post('/api/user/check', JSON.stringify(this.user), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            if (res.data) {
              this.$http.post('/api/user/signup', JSON.stringify(this.user), {
                headers: {
                  'X-CSRF-TOKEN': csrfToken[2],
                  'Content-Type': 'application/json'
                }
              }).then(res => {
                if (res.data) {
                  this.$router.replace({
                    name: 'Home',
                    params: {
                      msg: {
                        show: true,
                        message: '가입을 요청하였습니다.'
                      }
                    }
                  })
                } else {
                  this.$_error('회원가입 실패')
                }
              })
            } else {
              this.user.email = null
              this.$_error('해당 이메일은 이미 가입되어 있습니다.')
            }
          }).catch(error => {
          console.log(error)
        })
      },
      valueCheck: function (email, name, phone) {
        const phoneRegex = '^01(?:0|1|[6-9])[-]?(\\d{3}|\\d{4})[-]?(\\d{4})$'
        // const symbolsRegex = '/[~!@#$%^&*()_+|<>?:{}]/'
        // if (!name.match(symbolsRegex)){
        //   this.$alertModal('error','이름에는 특수기호가 들어갈 수 없습니다')
        //   return false
        // }

        if (email == null || email == '') {
          this.$_error('이메일을 입력해주세요')
          return false
        }
        if (name == null || name == '') {
          this.$_error('이름을 입력해주세요')
          return false
        }
        if (name.length > 20) {
          this.$_error('이름이 너무 깁니다.')
          return false
        }
        if (phone == null || phone == '') {
          this.$_error('핸드폰 번호를 입력해주세요')
          return false
        }
        if (!phone.match(phoneRegex)) {
          this.$_error( '핸드폰 번호가 형식에 맞지 않습니다')
          return false
        }
        return true
      }
    }
  }
</script>
<style>
  .bg {
    background-image: url("../assets/images/laptop.jpg");
  }
</style>
