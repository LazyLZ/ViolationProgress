import F from '@/utils/functional'

const state = {
  parkingLotList: [],
  controllerList: []
}
const getters = {
  findParkingLot: (state) => (id) => {
    return state.parkingLotList.find(p => p.id === id)
  },
  findController: (state) => (id) => {
    return state.controllerList.find(p => p.id === id)
  },
}

// 转换接口
let controllerTransDict = {
  parklotId: 'parkingLotId'
}

const mutations = {
  setParkingLotList (state, list) {
    if (list instanceof Array) {
      state.parkingLotList = list
    }
  },
  setControllerList (state, list) {
    if (list instanceof Array) {
      state.controllerList = list
    }
  }
}

const actions = {
  async getParkingLotList ({dispatch, commit}) {
    let data = await dispatch('getDataFromApi', {
      method: 'post',
      url: '/passApi/pass/parkinglot/list',
      params: {
        page: 0,
        size: 1000
      },
      timeout: 5000,
    }, {root: true})
    F.transformIO(data, controllerTransDict)
    return data
  },
  async getAllControllers ({dispatch, commit, getters, state}) {
    let data = await dispatch('getDataFromApi', {
      method: 'get',
      url: '/passApi/pass/controller/all',
      timeout: 5000,
    }, {root: true})
    F.transformIO(data, controllerTransDict)
    return data
  },
  async initControllers ({dispatch, commit}) {
    let [parkingLots, controllers] = await Promise.all([
      dispatch('getParkingLotList'),
      dispatch('getAllControllers')
    ])
    controllers.forEach(controller => {
      controller.id = controller.controllerId
      let parkingLot = parkingLots.find(p => p.id === controller.parkingLotId)
      controller.parkingLotName = parkingLot ? parkingLot.name : ''
    })
    commit('setParkingLotList', parkingLots)
    commit('setControllerList', controllers)
    return controllers
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
