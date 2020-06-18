<template>
  <div>
    <v-card v-bind:class="{moHeight:  $store.state.isSmallWidth }">
      <v-card-title>사용자 리스트</v-card-title>
      <v-data-table
        :headers="headers"
        :items="authUserList"
        :items-per-page="5"
        :calculate-width="true"
        class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">회원 정보 수정</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :disabled="true" v-model="editedIndex" label="Dessert name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field :disabled="true" v-model="editedItem.email" label="User email"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.authority"
                  :items="authorityList"
                  label="Interests"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "AuthorityPage",
    beforeCreate() {
      this.$http.post('/api/user/admin/userList')
        .then(res => {
          this.authUserList = res.data
          this.authUserList.forEach((user, index) => {
            user.number = index + 1;
          });
        })
    },
    data() {
      return {
        authUserList: [],
        authorityList: ["ROLE_ADMIN", "ROLE_USER", "ROLE_ANON"],
        editedIndex: -1,
        editedItem: {
          number: 0,
          name: "",
          email: "",
          authority: 0,
          protein: 0
        },
        dialog: false,
        headers: [
          {
            text: "번호",
            align: "start",
            sortable: false,
            value: "number"
          },
          {text: "이름", value: 'name'},
          {text: "이메일", value: 'email', sortable: false},
          {text: "권한", value: 'authority'},
          {text: "Actions", value: 'actions', sortable: false},
        ],
      }
    },
    methods: {
      close() {
        this.dialog = false;
      },
      save() {
        this.$http.post('/api/user/admin/auth', {
            member_email: this.editedItem.email,
            roles_authority: this.editedItem.authority
          }
        )
          .then(res => {
            this.authUserList[this.editedIndex].authority = this.editedItem.authority
            this.dialog = false
            this.$alertModal("alert", "권한이 수정되었습니다.")
          }).catch(error => {
          this.$alertModal("error", "권한 수정에 실패했습니다." + "\n" + error)
          this.dialog = false
        })
      },
      editItem(item) {
        this.editedIndex = this.authUserList.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;

        var role = this.$store.state.currentUser.roles
        if(role.includes('ROLE_ADMIN') && this.authorityList.includes('ROLE_ADMIN')) {
          console.log(this.authorityList)
          this.authorityList = this.authorityList.splice(1, 2)
          console.log(this.authorityList)
        }
      },
    }
  }
</script>

<style scoped>

</style>
