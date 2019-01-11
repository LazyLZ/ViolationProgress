import axios from 'axios'
import {handleError} from './handleError'
import {LError} from '../object'
import {SearchParam} from '../utils/searchParam'
import F from '../utils/functional'

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
      if (checkStatus && res.data.statusCode + '' === '200') {
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
      transDict,
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
    if (transDict instanceof Object) {
      F.transformIO(sp, transDict)
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
        page: pagination.page || 1,
        size: pagination.rowsPerPage || 10
      },
      ...args
    }, {root: true})

    if (data instanceof Object && data.list instanceof Array && !isNaN(data.total)) {
      let items = data.list
      let amount = data.total
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
  async uploadFile ({dispatch, rootGetters}, {url = '', type = 'post', file, onProgress, key = 'file', extra = {}}) {
    try {
      let formdata = new FormData()
      if (file instanceof File) {
        let fileKey = key || 'file'
        formdata.append(fileKey, file, file.name)
      }
      else {
        let e = {code: 1001, message: `参数错误(files:${typeof file})，需要 File`}
        throw e
      }

      for (let key_ of Object.keys(extra)) {
        formdata.append(key_, extra[key_])
      }

      let F = onProgress

      let message = {
        method: type || 'post',
        url: url || '',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formdata,
      }
      if (typeof F === 'function') {
        message.config.onUploadProgress = F
      }
      console.log('uploadFile request', message)
      let data = await axios(message)
      if (data.status === 1) {
        return data.data
      }
      else {
        throw data
      }
    }
    catch (e) {
      throw handleError(e)
    }
  },
  async downloadFile ({dispatch, rootGetters}, {url = '', type = 'get', onProgress}) {
    try {
      if (typeof url !== 'string' || !url) {
        let e = {code: 1001, message: `参数错误(files:${typeof url})，需要 String`}
        throw e
      }

      let F = onProgress

      let message = {
        method: type || 'get',
        url: url || '',
        responseType: 'blob',
      }
      if (typeof F === 'function') {
        message.config.onUploadProgress = F
      }
      console.debug('downloadFile request', message)
      let data = await axios(message)
      return data
    }
    catch (e) {
      console.error('downloadFile() error', e)
      throw handleError(e)
    }
  },
}
