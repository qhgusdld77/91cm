import AboutChannel from './aboutchannel'
import store from '../store'
class EventListener{
    beforeunloadEvt () {
        store.commit('setIsLogout',false)
        //로그아웃함수가 실행되어 페이지이동시에 발생하지 않도록 조건문 처리
        window.addEventListener('beforeunload', function (event) {
            if(!store.state.isLogout){
                AboutChannel.updateSessionIsCW(false)
            }
        })
    }
    focusEvt(instance) {
        window.addEventListener('focus', function() {
                if(!store.state.isLogout){
                store.commit('setFocus',true)
                let isfocus = store.state.isfocus
                AboutChannel.updateFocus(isfocus)
                instance.modalObj.currentChannel.count = 0
            }
        })
    }
    blurEvt() {
        window.addEventListener('blur', function() {
            if(!store.state.isLogout){
            store.commit('setFocus',false)
            let isfocus = store.state.isfocus
            AboutChannel.updateFocus(isfocus)
        }
        })
      }
}
export default new EventListener()
