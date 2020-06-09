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
                <span>개인 프로필</span>
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
                  <img v-if="$store.state.currentUser.picture" class="icon-round"
                       :src="$store.state.currentUser.picture" width="200" height="200">
                  <img v-else class="icon-round" src="../../assets/images/default-user-picture.png" width="200"
                       height="200">
                </div>
                <table>
                  <tbody>
                  <tr>
                    <th>
                      <label for="name">이름</label>
                    </th>
                    <td>
                      <span>{{$store.state.currentUser.name}}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label for="email">이메일</label>
                    </th>
                    <td>
                      <span>{{$store.state.currentUser.email}}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label for="phone">전화번호</label>
                    </th>
                    <td>
                      <span>{{$store.state.currentUser.phone}}</span>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <b-button style="margin:15px;" variant="primary" @click="callComponent">수정</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>

  export default {
    name: 'UserInfo',
    created() {
    },
    deactivated() {
    },
    methods: {
      callComponent: function () {
        this.$store.commit('getSelectComponent', 'edit')
      }
    }
  }
</script>
