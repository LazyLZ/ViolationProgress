import axios from 'axios'
import {handleError} from './handleError'
import {LError} from '../utils/SpavaObj'
import {SearchParam} from '../utils/searchParam'

export default {
  alert ({commit}, attr) {
    commit('$L/openAlert', attr)
  },
  closeAlert ({commit}) {
    commit('$L/closeAlert')
  },
  confirm ({commit}, attr) {
    commit('$L/openOperation', attr)
  },
  async getDataFromApi ({dispatch}, {method, url, checkStatus = true, ...other}) {
    if (!url) {
      throw TypeError('url cannot be null')
    }
    let typeMap = new Set(['get', 'post', 'put', 'delete', 'head', 'patch'])
    if (!typeMap.has(method)) {
      throw TypeError('type can only be get|post|delete|put|head|patch')
    }
    let res = null
    try {
      let config = {method, url, ...other}
      // console.log('axios', config)
      res = await axios(config)
      // console.log('res', res)
      if (checkStatus && res.data.status + '' === '1') {
        return res.data.data
      }
      else if (!checkStatus) {
        return res.data
      }
      else {
        throw res.data
      }
    }
    catch (e) {
      // console.error('error', e)
      if (e instanceof Promise) {
        let err = await e
        throw handleError(err)
      }
      else {
        throw handleError(e)
      }
    }
  },
  // 通用获取列表组件
  async getDataList (
    {dispatch, commit, rootGetters, rootState}, {
      searchParam,
      pagination,
      sortStack = [],
      filter = {},
      search = {},
      transform,
      url,
      method = 'post',
      ...args
    }
  ) {
    if (!pagination) {
      throw TypeError('getDataList: pagination cannot be null')
    }
    if (!url) {
      throw TypeError('getDataList: url cannot be null')
    }
    if (typeof url !== 'string') {
      throw TypeError('getDataList: url can only be string')
    }

    console.log(pagination, sortStack, filter, search)
    let sp = searchParam
    if (!sp) {
      sp = (new SearchParam(pagination, sortStack, filter, search)).create()
    }
    // // 暂时屏蔽creationTime
    // if (sp.hasOwnProperty('creationTime')) {
    //   // logger.info('delete creationTime', sp.creationTime)
    //   delete sp.creationTime
    // }

    let data = await dispatch('getDataFromApi', {
      method,
      url: url,
      data: {
        'searchParam': sp
      },
      params: {
        page: pagination.page - 1 || 0,
        size: pagination.rowsPerPage || 10
      },
      ...args
    }, {root: true})

    if (data instanceof Object && data.content instanceof Array && !isNaN(data.totalElements)) {
      let items = data.content
      let amount = data.totalElements
      return {items: items, amount: amount}
    }
    else if (data.data instanceof Array) {
      let items = data
      let amount = data.length
      console.warn('接口未返回分页参数，数据总数可能不正确', url)
      return {items: items, amount: amount}
    }
    else {
      throw new LError(
        `数据格式错误,需要 data.content: Array, data.totalElements: Number`,
        1001
      )
    }
  },
}
