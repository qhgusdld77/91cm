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
        <form action="#">
          <div class="row mycustom">

            <!-- Email -->
            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path
                                d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"/></svg>
                            </span>
              </div>
              <input id="firstName" type="text" name="email" placeholder="Id" autocomplete="off"
                     class="form-control bg-white border-left-0 border-md" v-model="userid">
            </div>
            <!-- Password -->
            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path
                                 d="M12.451 17.337l-2.451 2.663h-2v2h-2v2h-6v-5l6.865-6.949c1.08 2.424 3.095 4.336 5.586 5.286zm11.549-9.337c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-3-3c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2z"/></svg>
                            </span>
              </div>
              <input id="password" type="password" name="password" placeholder="Password"
                     class="form-control bg-white border-left-0 border-md" v-model="password">
            </div>


            <!-- Submit Button -->
            <div class="form-group col-lg-12 mx-auto mb-0">
              <a class="btn btn-primary btn-block py-2">
                <span class="font-weight-bold" style="color: white;">로그인</span>
              </a>
            </div>

            <div class="social-wrapper">
              <a class="logo-wrapper" href="/oauth2/authorization/github"><img class="social-logo"
                                                                               src="../assets/images/github_logo.png"></a>
              <a class="logo-wrapper" href="/oauth2/authorization/google"><img class="social-logo"
                                                                               src="../assets/images/google_logo.png"></a>
              <a class="logo-wrapper" href="/oauth2/authorization/naver"><img class="social-logo"
                                                                              src="../assets/images/naver_logo.png"></a>
              <!--        동작 에러 인해 주석처리-->
              <!--        <a href="/oauth2/authorization/kakao"><img class="social-logo" src="../assets/images/kakao_logo.png"></a>-->
            </div>

            <!-- Already Registered -->
            <br><br><br>
            <div class="text-center w-100">
              <p class="text-muted font-weight-bold">회원가입하기 <a href="#" class="text-primary ml-2">Sign Up</a>
              </p>
            </div>


          </div>
        </form>
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
        userid: '',
        password: ''
      }
    },
    methods: {},
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
