import Vue from 'vue'
import Vuex from 'vuex'
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex)

// state, mutations, action, getter 등을 파일로 나눌 필요 있음
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
