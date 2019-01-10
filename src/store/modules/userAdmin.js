// import F from '@/utils/functional'
import {Person, LError} from '../../object'
import {getField, updateField} from 'vuex-map-fields'

const state = {
  newUserData: new Person()
}
const getters = {
  getField,
  getNewPerson: () => () => {
    return new Person()
  }
}

// 转换接口

const mutations = {
  updateField,
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
    return {items: items.map(t => Person.fromAPI(t)), amount: amount}
  },
  async setUser ({dispatch}, {id = '', name, loginId, password, phone, email}) {
    let data = await dispatch('getDataFromApi', {
      method: 'put',
      data: {
        'id': id,
        'loginId': loginId,
        'name': name,
        'password': password,
        'mobilePhone': phone,
        'email': email,
      },
      url: '/shiroApi/user/'
    }, {root: true})
    return new Person(data)
  },
  async deleteUsers ({dispatch}, users) {
    let ids
    if (users instanceof Array) {
      ids = users.filter(p => p instanceof Person).map(p => p.id)
    }
    else if (users instanceof Person) {
      ids = [users.id]
    }
    else {
      return
    }
    return dispatch('getDataFromApi', {
      method: 'delete',
      data: {
        ids: ids
      },
      url: '/shiroApi/user/'
    }, {root: true})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
