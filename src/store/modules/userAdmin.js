import F from '@/utils/functional'
import {Person} from '../../utils/SpavaObj'

const state = {
}
const getters = {
}

// 转换接口

const mutations = {
}

const actions = {
  async getUsers ({dispatch}, {pagination, filter, sortStack, search}) {
    let {items, amount} = await dispatch('getDataList', {
      pagination,
      sortStack,
      search,
      filter,
      transDict: {phone: 'mobilePhone'},
      url: `/shiroApi/user/list`
    }, {root: true})
    return {items: items.map(t => Person.fromPlugin(t)), amount: amount}
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
