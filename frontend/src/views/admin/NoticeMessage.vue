<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row :justify="justify" :align="alignment">
          <v-text-field @keydown.enter.exact="send" label="전체 공지사항" :rules="rules" hide-details="auto"
                        v-model="message"></v-text-field>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-card
        class="mx-auto"
        width="100%"
      >
        <v-list shaped>
          <v-list-item-group
            v-model="message"
          >
            <template v-for="(item, i) in noticeMsgs">
              <v-divider
                v-if="!item"
                :key="`divider-${i}`"
              ></v-divider>

              <v-list-item
                v-else
                :key="`item-${i}`"
                :value="item"
                active-class="black--text text--accent-3"
              >
                <template v-slot:default="{ active, toggle }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox
                      :input-value="active"
                      :true-value="item"
                      color="cyan darken-1"
                      @click="toggle"
                    ></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: "NoticeMessage",
    data() {
      return {
        message: "",
        alignment: 'center',
        justify: 'justify',
        rules: [
          value => !!value || '값이 없습니다.'
        ],
        noticeMsgs: ['공지사항입니다. 업데이트를 위해 1분후 91cm가 잠시 멈춰질 예정입니다. 사용을 잠시 멈추고 기다려주시면 감사하겠습니다. '
          ,'자주 사용할 안내 메시지 추가 1']
      }
    },
    methods: {
      send: function () {
        if (this.message == ''){
          return;
        }
        this.$store.state.stompClient.send('/sub/sync/info', null, {noticeMsg: this.message})
        this.message = ''
      }
    }
  }
</script>

<style scoped>

</style>
