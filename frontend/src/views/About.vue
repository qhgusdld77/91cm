<template>
  <v-app data-app id="app">
    <!-- <v-card :loading="isUpdating"> -->
    <div :loading="isUpdating">
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            v-model="friends"
            :disabled="isUpdating"
            :items="people"
            @keydown.enter="enter"
            filled
            chips
            label="Select"
            item-text="name"
            item-value="id"
            multiple
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
                  <v-img :src="data.item.avatar"></v-img>
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
                  <img :src="data.item.avatar">
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
    </div>
    <!-- </v-card> -->
  </v-app>
</template>

<script>

  export default {
    name: 'About',
    created() {

    },
    components: {},
    computed: {},
    data() {
      const srcs = {
        1: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        2: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        3: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        4: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        5: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
      };

      return {
        autoUpdate: true,
        friends: [],
        isUpdating: false,
        name: "Midnight Crew",
        people: [
          {header: "Group 1"},
          {name: "Sandra Adams", group: "Group 1", avatar: srcs[1], id: 1},
          {name: "Ali Connors", group: "Group 1", avatar: srcs[2], id: 2},
          {name: "Trevor Hansen", group: "Group 1", avatar: srcs[3], id: 3},
          {name: "Tucker Smith", group: "Group 1", avatar: srcs[2], id: 4},
          {name: "Britta Holt", group: "Group 2", avatar: srcs[4], id: 5},
          {name: "Jane Smith ", group: "Group 2", avatar: srcs[5], id: 6},
          {name: "John Smith", group: "Group 2", avatar: srcs[1], id: 7},
          {name: "Sandra Williams", group: "Group 2", avatar: srcs[3], id: 8}
        ],
        title: "The summer breeze"
      };
    },

    watch: {
      isUpdating(val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000);
        }
      }
    },

    methods: {
      enter() {
        console.log(this.friends);
      },
      remove(item) {
        const index = this.friends.indexOf(item.id);
        if (index >= 0) this.friends.splice(index, 1);
      }
    }
  }

</script>
<style scoped>

</style>
