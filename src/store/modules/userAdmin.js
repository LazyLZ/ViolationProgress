import F from '@/utils/functional'

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
      url: `/shiroApi/user/list`
    }, {root: true})
    return {items: items, amount: amount}
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
