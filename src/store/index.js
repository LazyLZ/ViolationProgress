import Vue from 'vue'
import Vuex from 'vuex'
import $L from './modules/$L'
import login from './modules/login'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  mutations: {},
  actions: {
    alert ({commit}, attr) {
      commit('$L/openAlert', attr)
    },
    confirm ({commit}, attr) {
      commit('$L/openOperation', attr)
    }
  },
  modules: {
    $L,
    login
  },
  strict: debug,
})
