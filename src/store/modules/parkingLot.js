import F from '@/utils/functional'

const state = {
  parkingLotList: [
    {
      'id': '8a990932592ffac501593902d6d00001',
      'name': '清水河校区',
      'description': null,
      'code': '1',
      'grade': '1',
      'longitude': '103.9389',
      'latitude': '30.7548',
      'creationTime': null,
      'lastUpdateTime': null
    },
    {
      'id': '8a9909325d97732c015d9cb4288c003e',
      'name': '沙河校区',
      'description': null,
      'code': '2',
      'grade': '1',
      'longitude': '89.909',
      'latitude': '30.6794',
      'creationTime': null,
      'lastUpdateTime': null
    }
  ],
  controllerList: [
    {
      'id': '8a990932592ffac50159394f41770008',
      'name': '清水河西二门【入口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a990932592ffac50159394d79810005',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a990932592ffac50159394f91a50009',
      'name': '清水河西二门【出口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a990932592ffac50159394decd60006',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed1122f17a0160342c81ea002c',
      'name': '沙河继教院【出口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed658b9bbf016706baec001630',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fbda1d8015fbdb617e60003',
      'name': '手持终端虚拟【入口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fbda1d8015fbdb49d760001',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fbda1d8015fbdb65fed0004',
      'name': '手持终端虚拟【出口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fbda1d8015fbdb4e0350002',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fbda1d8015fbe65cf8f001a',
      'name': '清水河西大门【入口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fbda1d8015fbe623faf0018',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fbda1d8015fbe666199001b',
      'name': '清水河西大门【出口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fbda1d8015fbe62e03b0019',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fe7faae015fe819c48d000a',
      'name': '清水河南二门二号门【入口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fe7faae015fe80dcdcf0008',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fe7faae015fe81a3770000b',
      'name': '清水河南二门二号门【出口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fe7faae015fe80e5fcb0009',
      'isChargingGate': '0',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fece98601600aab10f50234',
      'name': '清水河南二门【入口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fece98601600aa55e620232',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed5fece98601600aab67fd0235',
      'name': '清水河南二门【出口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed5fece98601600aa727090233',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed6033f17a0160342bf7ce000f',
      'name': '沙河南侧门【入口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed602a61ca016033b40011003d',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed6033f17a0160342bf7ce1113',
      'name': '沙河继教院【入口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed658b9bbf016706ba6a10162f',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed6033f17a0160342c81ea002c',
      'name': '沙河南侧门【出口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed602a61ca016033b4c77e003e',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed6033f17a016052ed43035645',
      'name': '沙河东大门【入口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed6033f17a016052ea55c05643',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed6033f17a016052edc0325664',
      'name': '沙河东大门【出口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed6033f17a016052eae02a5644',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed6071b1a9016071cdb9540051',
      'name': '沙河西大门【入口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed6071b1a9016071bfda420009',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed6071b1a9016071ce245c0073',
      'name': '沙河西大门【出口】',
      'description': null,
      'parkingLotId': '8a9909325d97732c015d9cb4288c003e',
      'controllerId': '8a9ac7ed6071b1a9016071c5915e000c',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:37:39'
    },
    {
      'id': '8a9ac7ed610d7596016117c86c4c13a6',
      'name': '清水河南大门【入口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed610d7596016117c69a8d13a4',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:35:27'
    },
    {
      'id': '8a9ac7ed610d7596016117c8d91c1624',
      'name': '清水河南大门【出口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed610d7596016117c73a7113a5',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-05-22 10:32:17',
      'lastUpdateTime': '2018-05-22 06:35:13'
    },
    {
      'id': '8a9ac7ed62dbbca20163952352481404',
      'name': '校医院综合楼【入口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed62dbbca20163952241631402',
      'isChargingGate': '0',
      'inOrOut': '0',
      'creationTime': '2018-06-05 16:00:34',
      'lastUpdateTime': '2018-06-05 08:03:43'
    },
    {
      'id': '8a9ac7ed62dbbca20163952395422c80',
      'name': '校医院综合楼【出口】',
      'description': null,
      'parkingLotId': '8a990932592ffac501593902d6d00001',
      'controllerId': '8a9ac7ed62dbbca2016395226fb71403',
      'isChargingGate': '1',
      'inOrOut': '1',
      'creationTime': '2018-06-05 16:01:39',
      'lastUpdateTime': '2018-06-05 08:02:37'
    }
  ]
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
  parkingLotId: 'parkingLotId'
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
