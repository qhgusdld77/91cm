<!--<template>-->
<!--  <v-row>-->
<!--    <v-col cols="12">-->
<!--      <v-autocomplete-->
<!--        v-model="friends"-->
<!--        :items="userList"-->
<!--        @keydown.enter.exact="enter"-->
<!--        @keydown.esc.exact="inviteToggle"-->
<!--        filled-->
<!--        autofocus-->
<!--        chips-->
<!--        label="Select"-->
<!--        item-text="name"-->
<!--        item-value="email"-->
<!--        multiple-->
<!--        :menu-props="{  contentClass: 'inviteClass'}"-->
<!--      >-->
<!--        <template v-slot:selection="data">-->
<!--          <v-chip-->
<!--            v-bind="data.attrs"-->
<!--            :input-value="data.selected"-->
<!--            close-->
<!--            @click="data.select"-->
<!--            @click:close="remove(data.item)"-->
<!--          >-->
<!--            <v-avatar left>-->
<!--              <v-img :src="data.item.picture"></v-img>-->
<!--            </v-avatar>-->
<!--            {{ data.item.name }}-->
<!--          </v-chip>-->
<!--        </template>-->
<!--        <template v-slot:item="data">-->
<!--          <template v-if="typeof data.item !== 'object'">-->
<!--            <v-list-item-content v-text="data.item"></v-list-item-content>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <v-list-item-avatar>-->
<!--              <img :src="data.item.picture">-->
<!--            </v-list-item-avatar>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title v-html="data.item.name"></v-list-item-title>-->
<!--              <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>-->
<!--            </v-list-item-content>-->
<!--          </template>-->
<!--        </template>-->
<!--      </v-autocomplete>-->
<!--    </v-col>-->
<!--  </v-row>-->
<!--</template>-->

<!--<script>-->
<!--  import InviteService from "../service/inviteService";-->

<!--  export default {-->
<!--    name: "InviteInput",-->
<!--    computed:{-->
<!--      ...mapGetters({-->
<!--        userList: 'getUserList',-->
<!--      })-->
<!--    },-->
<!--    data(){-->
<!--      return{-->
<!--        friends: [],-->
<!--      }-->
<!--    },-->
<!--    methods:{-->
<!--      inviteToggle: function (e) {-->
<!--        let el = document.querySelector(".menuable__content__active.inviteClass")-->
<!--        if (this.$store.state.isInviteMode == false) {-->
<!--          this.$store.state.isInviteMode = !this.$store.state.isInviteMode-->
<!--        } else {-->
<!--          if (el == null) {-->
<!--            this.inviteDataInit()-->
<!--          }-->
<!--        }-->
<!--      },-->
<!--      inviteDataInit: function () {-->
<!--        this.friends = []-->
<!--        this.message.content = ''-->
<!--        this.$store.state.isInviteMode = !this.$store.state.isInviteMode-->
<!--      },-->
<!--      enter: async function (event) {-->
<!--        let el = document.querySelector(".menuable__content__active.inviteClass")-->
<!--        if (el == null) {-->
<!--          if (this.friends.length != 0) {-->
<!--            await InviteService.invite(this.$store.state.currentUser.email, this.$store.state.currentChannel.id, this.friends)-->
<!--              .then(res => {-->
<!--                const invite = {-->
<!--                  channel_id: this.$store.state.currentChannel.id,-->
<!--                  sender: this.$store.state.currentUser.email,-->
<!--                  recipients: this.friends-->
<!--                }-->
<!--                for (let i = 0; i < this.friends.length; i++) {-->
<!--                  const user = this.userList.find(el => el.email == this.friends[i])-->
<!--                  this.message.content += user.name + '님 '-->
<!--                }-->
<!--                //메일 오류 계속 떠서 일단 임시로 주석 처리함-->
<!--                this.$http.post('/api/invite/mail', invite)-->
<!--                  .then(res => {-->
<!--                    console.log(res.data)-->
<!--                  })-->
<!--                this.message.content += '을 초대했습니다.'-->
<!--                this.$eventBus.$emit('getUserList', true)-->
<!--                this.$emit('send')-->
<!--                this.inviteDataInit()-->

<!--              }).catch(error => {-->
<!--                let alertmsg = ''-->
<!--                if (error.response.data.list != null) {-->
<!--                  const alertList = error.response.data.list-->
<!--                  for (let i = 0; i < alertList.length; i++) {-->
<!--                    const user = this.userList.find(el => el.email == alertList[i])-->
<!--                    alertmsg += user.name + '님 '-->
<!--                  }-->
<!--                  alertmsg += '은 이미 이 채널에 초대 받았습니다. 확인해주세요.'-->
<!--                  this.$alertModal('error', alertmsg)-->
<!--                } else {-->
<!--                  this.$alertModal('error', error.response.data.message)-->
<!--                }-->
<!--                console.error(error.response)-->
<!--                this.message.content = ''-->
<!--              })-->
<!--          } else {-->
<!--            this.$alertModal('alert', '초대할 사용자를 선택해주세요')-->
<!--          }-->
<!--        }-->
<!--      },-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
