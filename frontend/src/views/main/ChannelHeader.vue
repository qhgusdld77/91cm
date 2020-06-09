<template>
  <b-navbar toggleable="lg" type="light" variant="white">
    <!-- <b-nav-text>Navbar text</b-nav-text> -->
    <li class="list-unstyled" style="font-weight:bold;">{{ getCurrentChannel }}</li>
    <div class="ml-auto" style="display: flex;">
      <a @click="toggleSearchMode" style="margin-right: 15px;" class="verti-align"><i class="im im-magnifier"></i></a>
      <a class="nuj verti-align" @click="RSidebarOpen">
        <i class="im im-menu-dot-h"></i>
      </a>
    </div>
  </b-navbar>
</template>
<script>
  export default {
    name: 'ChannelHeader',
    data() {
      return {}
    },
    computed: {
      getCurrentChannel: function () {
        if (this.$store.state.currentChannel == null) {
          return
        }
        return this.$store.state.currentChannel.name
      }
    },
    methods: {
      RSidebarOpen: function () {
        this.$store.state.isRActive = true
      },
      toggleSearchMode: function () {
        this.$store.state.isSearchMode = !this.$store.state.isSearchMode
        this.$store.state.isInviteMode = false
      }
    }
  }
</script>

