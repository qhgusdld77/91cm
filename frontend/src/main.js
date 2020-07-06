import 'babel-polyfill'
import 'expose-loader?$!expose-loader?jQuery!jquery'
import '../plugins/icon-kit/dist/css/iconkit.min.css'
import '../plugins/ionicons/dist/css/ionicons.min.css'
import '../plugins/bootstrap/dist/js/bootstrap.min.js'
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import Vuetify from 'vuetify'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import VueSession from 'vue-session'
import AlertModal from "./plugins/AlertModal";
import './assets/font/iconmonstr/css/iconmonstr-iconic-font.min.css';
import 'animate.css'
import './assets/css/main.css'
import '../dist/css/theme.css'
import channelMixin from './mixins/channelMixin'
import commonMixin from './mixins/commonMixin'
import messageMixin from './mixins/messageMixin'

Vue.mixin({
  mixins: [channelMixin, commonMixin, messageMixin]
})

Vue.use(BootstrapVue)
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
Vue.use(AlertModal)
Vue.use(Vuetify)
Vue.use(VueSession, {persist: true})
Vue.prototype.$eventBus = new Vue();
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  vuetify: new Vuetify({
    theme: {disable: true},
    icons: {
      iconfont: "mdi"
    }
  }),
  watch: {
    channelList: function (newChannelList, oldChannelList) {
      let newChannelListCnt = newChannelList.length
      let oldChannelListCnt = oldChannelList.length

      //최초 진입 후 구독
      if (oldChannelListCnt == 0 && newChannelListCnt > 0) {
        $.each(newChannelList, function (index, channel) {
          channel.subscribe()
        })
      }
      //채널 삭제 후 구독 취소
      else if(newChannelListCnt < oldChannelListCnt) {
        $.each(oldChannelList, function(index, oldChannel) {
          let isEquals = newChannelList.find(newChannel => {
            return newChannel.id == oldChannel.id
          })
          if(isEquals === undefined) {
            oldChannel.unsubscribe()
          }
        })
      }
    },
    currentChannel: function (newCurrentChannel, oldCurrentChannel) {
      console.log(oldCurrentChannel,'oldCurrentChannel')
      if(oldCurrentChannel!==null){
        if (oldCurrentChannel.id !== undefined) {
          oldCurrentChannel = this.getChannel(oldCurrentChannel)
          oldCurrentChannel.access()
        }
      }
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
