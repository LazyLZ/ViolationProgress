import axios from 'axios'

export default {
  alert ({commit}, attr) {
    commit('$L/openAlert', attr)
  },
  confirm ({commit}, attr) {
    commit('$L/openOperation', attr)
  },

  handleError (context, e) {
    return e
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
      res = await axios({method, url, ...other})
      console.log(res)
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
      throw dispatch('handleError', e)
    }
  },
  // 通用获取列表组件
  async getDataList ({dispatch, commit}, {pagination, param = {}, type = 'post', url = ''}) {
    if (!pagination) {
      throw TypeError('pagination cannot be null')
    }
    if (!url) {
      throw TypeError('url cannot be null')
    }
    let res = await dispatch('getDataFromApi', {
      method: type,
      url: url,
      params: {
        pageNum: pagination.page,
        pageSize: pagination.rowsPerPage,
      }
    })

    return {items: res.list || [], amount: res.total || 0}
  }
}
