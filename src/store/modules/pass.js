// import F from '@/utils/functional'
import {Vehicle} from '../../object'

const state = {}
const getters = {}

const mutations = {}

const actions = {
  async getVehicle ({dispatch}, {plate}) {
    try {
      let v = await dispatch('getDataFromApi', {
        method: 'get',
        url: '/api/vehicles/' + plate
      }, {root: true})
      if (v) {
        return new Vehicle({
          plate: v.plate,
          owner: {
            name: v.name,
            phone: v.phone,
            email: v.email,
            typeName: v.identityType
          }
        })
      }
      else {
        return null
      }
    }
    catch (e) {

    }
    return null
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve(new Vehicle({
    //       id: 1,
    //       plate: plate || '',
    //       owner: {
    //         id: 1,
    //         name: 'LZ',
    //         phone: '18618164058',
    //         email: 'laizhi727@126.com',
    //         typeName: '在校学生'
    //       }
    //     }))
    //   }, 1000)
    // })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
