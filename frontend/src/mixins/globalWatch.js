import {mapGetters} from "vuex";

let globalWatch = {
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      channelList: 'getChannelList'
    })
  },
  mounted() {
    this.$watch('getChannelList', (newVal, oldVal) => {
      //최초
      if (oldVal.length == 0 && newVal.length > 0) {
        $.each(newVal, function (index, channel) {
          channel.subscribe()
        })
      } else {
        //console.log("newChannelList", newChannelList.length)
        //console.log("oldChannelList", oldChannelList.length)
      }
    });
  },
};
export default globalWatch;
