export default {
  install(Vue, options) {
    Vue.mixin({
      methods: {
        typeToTitle: function (type) {
          if (type === 'error') return "에러"
          if (type === 'alert') return "알림"
          return "알림"
        },
        showInput: function () {
          this.$bvModal.show('channelD');
        }
      }
    })
    // 단순 알림용
    Vue.msgModalOk = function (instance, title, content, option) {
      instance.$bvModal.msgBoxOk(content, {
        okTitle: '확인',
        buttonSize: 'sm',
        title: title,
        // headerBgVariant: 'info',
        // headerTextVariant: 'light',
      })
        .then(value => {
          console.log(value)
          switch (option) {
            case 'redirect':
              instance.$router.go('/main')
              return value
            default:
              return value
          }
        })
    }
    //YES OR NO
    Vue.msgModalConfirm = async (instance, title, content) => {
      return await instance.$bvModal.msgBoxConfirm(content, {
        title: title,
        okTitle: '확인',
        okVariant: 'danger',
        buttonSize: 'sm',
        cancelTitle: '취소'
      }).then(value => {
        return value;
      })
    }
    Vue.prototype.$alertModal = async function (types, content, callBackFunc) {
      switch (types) {
        case 'alert':
        case 'error':
          return Vue.msgModalOk(this, this.typeToTitle(types), content);
        case 'confirm':
          let userSelect = await Vue.msgModalConfirm(this, this.typeToTitle(types), content);
          console.log(userSelect);
          if (userSelect && callBackFunc !== undefined) {
            callBackFunc()
          }
      }
    },
      Vue.prototype.$_alert = async function (content) {
        this.$alertModal('alert', content);
      },
      Vue.prototype.$_confirm = async function (content,callbackFunc) {
        this.$alertModal('confirm', content,callbackFunc);
      },
      Vue.prototype.$_error = async function (content) {
        this.$alertModal('error', content);
      }
  },

}
