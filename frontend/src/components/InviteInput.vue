<template>
  <v-row>
    <v-col cols="12">
      <v-autocomplete
        v-model="friends"
        :items="inviteUserList"
        @keydown.enter.exact="inviteChannel"
        @keydown.esc.exact="$emit('inviteToggle')"
        filled
        autofocus
        chips
        label="Select"
        item-text="name"
        item-value="email"
        multiple
        :menu-props="{  contentClass: 'inviteClass'}"
      >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="remove(data.item)"
          >
            <v-avatar left>
              <v-img :src="data.item.picture"></v-img>
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-avatar>
              <img :src="data.item.picture">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
  import InviteService from "../service/inviteService";
  import {mapGetters} from "vuex";

  export default {
    name: "InviteInput",
    computed: {
      ...mapGetters({
        userList: 'getUserList',
        inviteUserList: 'getInviteUserList',
      })
    },
    data() {
      return {
        friends: [],
      }
    },
    async created() {
      await this.$store.dispatch('inviteUserList')
    },
    mounted() {
      this.friends = []
    },
    methods: {
      remove(item) {
        const index = this.friends.indexOf(item.email);
        if (index >= 0) this.friends.splice(index, 1);
      }
    }
  }
</script>

<style scoped>

</style>
