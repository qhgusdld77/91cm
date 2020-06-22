<template>
  <div class="container" style="
    height: 100vh;
    display: flex;
">
    <div class="row py-5 mt-4 align-items-center">
      <!-- For Demo Purpose -->
      <div class="col-md-5 pr-lg-5 mb-5 mb-md-0">
        <img src="../assets/images/login.png" alt=""
             class="img-fluid mb-3 d-none d-md-block">
        <h1>91CM Login</h1>
        <p class="font-italic text-muted mb-0">협업 메신저</p>
        <a class="d-none d-md-block" href="http://www.freepik.com">Designed by pikisuperstar / Freepik</a>
        <!--        <p class="font-italic text-muted">Snippet By <a href="https://bootstrapious.com" class="text-muted">-->
        <!--          <u>Bootstrapious</u></a>-->
        <!--        </p>-->
      </div>

      <!-- Registeration Form -->
      <div class="col-md-7 col-lg-6 ml-auto margincustom">
          <div class="row mycustom">
            <input type ="hidden" name="_csrf" :value="csrfToken"/>
            <!-- Email -->
            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                              <v-icon>person</v-icon>
                            </span>
              </div>
              <input id="firstName" type="text" placeholder="Email" @blur="emailDubleCheck"
                     class="form-control bg-white border-left-0 border-md" v-model="email">
            </div>
            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                              <v-icon>person</v-icon>
                            </span>
              </div>
              <input  type="text" placeholder="Name"
                     class="form-control bg-white border-left-0 border-md" v-model="name">
            </div>
            <!-- Password -->
            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                               <v-icon>lock</v-icon>
                            </span>
              </div>
              <input  type="password" placeholder="Password" @blur="checkPassword"
                     class="form-control bg-white border-left-0 border-md" v-model="password1">
            </div>

            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                               <v-icon>lock</v-icon>
                            </span>
              </div>
              <input type="password" placeholder="Password" @blur="checkPassword"
                     class="form-control bg-white border-left-0 border-md" v-model="password2">
            </div>
            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                              <v-icon>phone</v-icon>
                            </span>
              </div>
              <input type="text" placeholder="Phone" @keyup="phoneFormatter"
                     class="form-control bg-white border-left-0 border-md" v-model="phone">
            </div>




            <!-- Submit Button -->
            <div class="form-group col-lg-12 mx-auto mb-0" >
              <button class="btn btn-primary btn-block py-2" @click="formSignUp" style="height:auto;">
                <span class="font-weight-bold" style="color: white;">회원가입</span>
              </button>
            </div>

          </div>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../router'
  import axios from 'axios'

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password1: '',
        password2: '',
        name:'',
        phone:'',
        csrfToken: '',
        doubleCheck: false,
        passwordCheck: false
      }
    },
    created(){
      let token = document.cookie.match('(^|;) ?' + 'XSRF-TOKEN' + '=([^;]*)(;|$)')
      this.csrfToken = token[2]
    },
    methods: {
      checkPassword(){
          if(this.password2!='' && this.password1!=''){
            if(this.password1 == this.password2){
              this.passwordCheck = true
            }else{
              this.passwordCheck = false
            }
          }
      },
      emailDubleCheck(){
        if(this.emailValidator()){
          axios.post('/api/user/check',{email: this.email},{
            headers: {
                  'Content-Type': 'application/json'
            }
          }).then(res=>{
          if(res.data){
            this.doubleCheck = true
            this.$_alert('사용가능한 이메일입니다.')
          }else{
            this.doubleCheck = false
            this.$_error( '중복되는 이메일이 존재합니다.')
          }
        })
        }else{
          this.$_error('올바른 이메일 주소가 아닙니다.')
        }
      },
      formSignUp(){

        let user = {
          email : this.email,
          password : this.password1,
          phone : this.phone,
          name: this.name
        }
        if(this.email == '' || this.password1 == '' || this.password2 == ''
                || this.phone == '' || this.name == ''){
            this.$_error('모든 항목을 채워주세요.')
            return
        }
        let phoneValidator = this.phoneValidator()
        if(this.doubleCheck && this.passwordCheck && phoneValidator){
          axios.post('/api/user/formsignup',user).then(res=>{
          this.email = ''
          this.password1 = ''
          this.password2 = ''
          this.phone = ''
          this.name = ''
          this.$router.replace('/')
        })
        }else{
          if(!this.doubleCheck){
            this.$_error( '이메일 중복확인을 해주세요.')
          }else if(!this.passwordCheck){
            this.$_error( '비밀번호가 일치하지 않습니다.')
          }else if(!phoneValidator){
            this.$_error('올바른 번호가 아닙니다.')
          }
        }
      },
      phoneFormatter: function () {
        this.phone = this.phone.replace(/[^0-9]/g, "") // 숫자만 추출 되도록하는 정규식
        this.phone = this.phone.replace(/(^02.{0}|^01.{1}|[0-9]{4})([0-9]+)([0-9]{4})/, "$1-$2-$3");// 휴대폰번호 자동 하이픈 넣어주는 정규식
      },
      emailValidator(){
        let regExpEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        return regExpEmail.test(this.email)
      },
      phoneValidator(){
        let regExpPhone = /^\d{3}-\d{3,4}-\d{4}$/
        return regExpPhone.test(this.phone)
      }
    },
    mounted() {
    }
  }
</script>
<style scoped>

  .input-group .input-group-prepend .input-group-text {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: inherit;
    border-color: #ced4da;
    padding-left: 15px;
    font-size: 14px;
  }

  .social-logo {
    width: 50px;
    height: 50px;
  }

  .social-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .logo-wrapper {
    margin: 10px;
  }

  .mycustom {
    margin-bottom: 0px;
  }

  .margincustom {
    margin-top: 120px;
  }

  @media (max-width: 768px) {
    .mycustom {
      margin-bottom: 188px;
    }

    .margincustom {
      margin-top: 80px;
    }
  }

  /*
  *
  * ==========================================
  * CUSTOM UTIL CLASSES
  * ==========================================
  *
  */
  .border-md {
    border-width: 2px;
  }

  .btn-facebook {
    background: #405D9D;
    border: none;
  }

  .btn-facebook:hover, .btn-facebook:focus {
    background: #314879;
  }

  .btn-twitter {
    background: #42AEEC;
    border: none;
  }

  .btn-twitter:hover, .btn-twitter:focus {
    background: #1799e4;
  }

  /*
  *
  * ==========================================
  * FOR DEMO PURPOSES
  * ==========================================
  *
  */
  .form-control:not(select) {
    padding: 1.5rem 0.5rem;
  }

  .form-control::placeholder {
    color: #ccc;
    font-weight: bold;
    font-size: 0.9rem;
  }


  .form-control:focus {
    box-shadow: none;
    color: #495057;
    background-color: #fff;
    border-color: #ced4da;;
    outline: none;
  }
</style>
