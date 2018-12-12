import Vue from 'vue'
import Vuex from 'vuex'
import $L from './modules/$L'
import login from './modules/login'
import globalAction from './globalAction'
import globalMutation from './globalMutation'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  mutations: globalMutation,
  actions: globalAction,
  modules: {
    $L,
    login
  },
  strict: debug,
})
