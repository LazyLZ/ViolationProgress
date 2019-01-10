import Vue from 'vue'
import Vuex from 'vuex'
import $L from './modules/$L'
import login from './modules/login'
import globalActions from './globalActions'
import globalMutations from './globalMutations'
import globalGetters from './globalGetters'
import parkingLot from './modules/parkingLot'
import userAdmin from './modules/userAdmin'
import violation from './modules/violation'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  mutations: globalMutations,
  actions: globalActions,
  getters: globalGetters,
  modules: {
    $L,
    login,
    parkingLot,
    userAdmin,
    violation
  },
  strict: debug,
})
