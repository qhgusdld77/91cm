import AboutChannel from './aboutchannel'
import store from '../store'
class EventListener{
    beforeunloadEvt () {
        store.commit('setIsLogout',false)
        //로그아웃함수가 실행되어 페이지이동시에 발생하지 않도록 조건문 처리
        window.addEventListener('beforeunload', function (event) {
            console.log(store.state.selectComponent, store.state.isfocus)
            if(store.state.selectComponent==='main' && store.state.isfocus) {
                AboutChannel.updateLastAccessDate(store.state.currentChannel.id)   
            }
        })
    }
    focusEvt(instance) {
        window.addEventListener('focus', function() {
            if(!store.state.isLogout) {
                store.commit('setFocus',true)
                if(store.state.currentChannel != null && store.state.selectComponent == 'main') {
                    instance.msgCountUpdate(store.state.currentChannel.id,false)
                }
            }
        })
    }
    blurEvt() {
        window.addEventListener('blur', function() {
            if(!store.state.isLogout){
                store.commit('setFocus',false)
        }
        })
    }

    resizeEvt(){
        window.addEventListener('resize', function(){        
            store.commit('setSmallWidth',(window.innerWidth < 600) ? true : false)
            // let n = $(".app-sidebar");
            // let i = jQuery
            // i(e).width() < 992 && (n.addClass("hide-sidebar"), l.removeClass("nav-collapsed menu-collapsed")), i(e).resize(function() {
            //     i(e).width() < 992 && (n.addClass("hide-sidebar"), l.removeClass("nav-collapsed menu-collapsed")), i(e).width() > 992 && (n.removeClass("hide-sidebar"), "collapsed" === i(".toggle-icon").attr("data-toggle") && l.not(".nav-collapsed menu-collapsed") && l.addClass("nav-collapsed menu-collapsed"))
            // }), i(s).on("click", ".navigation li:not(.has-sub)", function() {
            //     i(e).width() < 992 && n.addClass("hide-sidebar")
            // }), i(s).on("click", ".logo-text", function() {
            //     i(e).width() < 992 && n.addClass("hide-sidebar")
            // }), i(".mobile-nav-toggle").on("click", function(e) {
            //     e.stopPropagation(), n.toggleClass("hide-sidebar")
            // }), i("html").on("click", function(s) {
            //     i(e).width() < 992 && (n.hasClass("hide-sidebar") || 0 !== n.has(s.target).length || n.addClass("hide-sidebar"))
            // }), i("#sidebarClose").on("click", function() {
            //     n.addClass("hide-sidebar")
            // })
        })
    }

}
export default new EventListener()
