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
                              <i class="im im-user-male"></i>
                            </span>
              </div>
              <input id="firstName" type="text" name="email" placeholder="Id"
                     class="form-control bg-white border-left-0 border-md">
            </div>
            <!-- Password -->
            <div class="input-group col-lg-12 mb-4">
              <div class="input-group-prepend">
                            <span class="input-group-text bg-white px-4 border-md border-right-0">
                                <i class="im im-key"></i>
                            </span>
              </div>
              <input id="password" type="password" name="password" placeholder="Password"
                     class="form-control bg-white border-left-0 border-md">
            </div>


            <!-- Submit Button -->
            <div class="form-group col-lg-12 mx-auto mb-0">
              <a href="#" class="btn btn-primary btn-block py-2">
                <span class="font-weight-bold">로그인</span>
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
  // For Demo Purpose [Changing input group text on focus]
  // $(function () {
  //   $('input, select').on('focus', function () {
  //     $(this).parent().find('.input-group-text').css('border-color', '#80bdff');
  //   });
  //   $('input, select').on('blur', function () {
  //     $(this).parent().find('.input-group-text').css('border-color', '#ced4da');
  //   });
  // });

  export default {
    name: "FormSignUp"
  }
</script>

<style scoped>
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
      margin-top: 0px;
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
