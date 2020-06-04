import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import NotFound from '../views/NotFound.vue'
import Clock from '../views/Clock'
import Main from '../components/Main'
import SignUp from '../components/SignUp'
import FormSignUp from "../views/FormSignUp";
import Todolist from '../views/todolist/TodoList'
import About from "../views/About";
import Calendar from "../views/calendar/Calendar";
import DevelopView from "../views/util/DevelopView";
import VideoChat from "../components/VideoChat";
import CopyRight from "../views/util/CopyRight";

Vue.use(VueRouter)

const routes = [
  {
    path: '/license',
    name: 'CopyRight',
    component: CopyRight
  },
  {
    path: '/video',
    name: 'VideoChat',
    component: VideoChat
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true
  },
  {
    path: '/about',
    name: 'mains',
    component: About
  },
  {
    path: '*',
    component: NotFound
  },
  {
    path: '/clock',
    component: Clock
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    beforeEnter: async function (to, from, next) {
      await store.dispatch('initCurrentUser')
      console.log(store.state.currentUser)
      console.log(store.state.currentUser.roles)
      if (store.state.currentUser.roles.length == 0) {
        next('/signup')
      } else if (store.state.currentUser.roles.length == 1
        && store.state.currentUser.roles.includes('ROLE_ANON')) {
        next({
          path: '/',
          query: { msg : {
              show: true,
              message: '가입 수락을 기다리는 중 입니다.'
            } }
        })
      } else if (store.state.currentUser.phone != null) {
        next()
      }
    }
  },
  {
    path: '/signup',
    component: SignUp

  },
  {
    path: '/formSignUp',
    component: FormSignUp
  },
  // 테스트용 path 테스트 후에 삭제
  {
    path: '/test',
    component: Calendar
  },
  {
    path: '/todo',
    component: Todolist
  },
  {
    path: '/develop',
    component: DevelopView

  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
