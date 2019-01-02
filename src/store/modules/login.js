import {getField, updateField} from 'vuex-map-fields'
import F from '@/utils/functional'
import cfg from '@/config'
import {Person} from '@/utils/SpavaObj'
import {LError} from '../../utils/SpavaObj'

let LOGIN_INFO_KEY = 'loginInfo'

function LoginInfo ({token, name, id, role}) {
  this.token = token || ''
  this.name = name || ''
  this.id = id || ''
  this.role = role || ''
  // this.permission = permission || {}
}

function _buildAccess (tree, access, prefix) {
  if (!F.isObj(tree)) {
    access.push(prefix)
    return
  }
  for (let key of Object.keys(tree)) {
    _buildAccess(tree[key], access, prefix + cfg.permissionSeq + 'key')
  }
  return access
}

function buildAccess (tree) {
  return _buildAccess(tree, [], '')
}

const state = {
  token: '',
  name: '',
  id: '',
  role: '',
  self: {},
  access: {},
  isInit: false,
  exitDialog: {
    count: 0,
    reason: '由于长时间未操作, 您的登录信息已失效',
  },
  exitDialogActivate: false,
}
const getters = {
  getField,
  isLogin (state) {
    return !!state.token && state.isInit
  },
  isGetToken (state) {
    return !!state.token
  },
  getInfo (state) {
    return new LoginInfo({
      token: state.token,
      name: state.name,
      id: state.id,
      role: state.role,
      permission: state.permission
    })
  },
  getPermission (state) {
    return state.permission
  },
  getAccess (state) {
    return buildAccess(state.permission)
  }
}
const mutations = {
  updateField,
  setInit (state, val) {
    state.isInit = val
  },
  clearInit (state) {
    state.isInit = false
    state.permission = {}
    state.role = ''
  },
  saveInfo (state, info) {
    let loginInfo = new LoginInfo(info)
    for (let key of Object.keys(loginInfo)) {
      state[key] = loginInfo[key]
    }
    F.saveToLocal(LOGIN_INFO_KEY, loginInfo)
  },
  setSelf (state, self = {}) {
    // console.log('set self', self)
    self.phone = self.mobilePhone
    self.group = self.userGroups instanceof Array ? self.userGroups[0] || {} : {}
    self.org = self.group.organizations instanceof Array ? self.group.organizations[0] || {} : {}
    state.self = new Person(self)
    // console.log(new Person(self))
  },
  setPermission (state, permission) {
    state.permission = permission
  },
  deleteInfo (state) {
    state.token = ''
    state.name = ''
    state.id = ''
    state.role = ''
    state.permission = {}
    F.deleteLocal(LOGIN_INFO_KEY)
  },
  recoveryLogin () {
    let info = F.getFromLocal(LOGIN_INFO_KEY) || {}
    let loginInfo = new LoginInfo(info)
    for (let key of Object.keys(loginInfo)) {
      state[key] = loginInfo[key]
    }
  },
  openExitDialog (state, {second, reason}) {
    state.exitDialog.count = second
    if (reason) {
      state.exitDialog.reason = reason
    }
    state.exitDialogActivate = true
  },
}

const actions = {
  async login ({dispatch, commit}, {loginId, password, verifyKey, type}) {
    let message = {
      url: type === 'portal' ? '/shiroApi/auth/thirdpart/login?pipe=uestc-portal' : '/shiroApi/auth',
      method: 'post',
      data: {
        'username': loginId,
        'password': password,
        'verifyKey': verifyKey
      },
      timeout: 5000,
    }
    let {Authorization, name, username} = await dispatch('getDataFromApi', message, {root: true})
    if (!Authorization) {
      throw new LError('该用户未授权', -1)
    }
    let loginInfo = new LoginInfo({
      token: Authorization,
      name: name,
      id: username,
      role: ''
    })
    commit('saveInfo', loginInfo)
    console.log('login', loginInfo.name)
    return loginInfo
    // your login dispatch
    // throw error when login failed
  },
  // 获取全局系统信息
  async initSystemInfo ({dispatch, commit}, force = false) {
    try {
      let data = await Promise.all([
        dispatch('getPermission'),
        dispatch('getRole'),
        dispatch('getSelfInfo'),
        dispatch('initControllers')
      ])
      commit('setInit', true)
      console.log('system init', data)
    }
    catch (e) {
      if (force) {
        commit('setInit', true)
      }
      else {
        throw e
      }
    }
  },
  async initControllers ({dispatch}) {
    return dispatch('parkingLot/initControllers', null, {root: true})
  },
  async getVerifyImg ({dispatch}) {
    let {key} = await dispatch('getDataFromApi', {
      method: 'get',
      url: '/verifyApi/validate/token',
      timeout: 5000
    }, {root: true})
    let {verify, verifyKey, msg} = await dispatch('getDataFromApi', {
      method: 'post',
      url: `/verifyApi/validate/verify/${key}/pipe/web`,
      timeout: 5000,
    }, {root: true})
    return {img: verify, key: verifyKey, msg: msg}
  },
  async checkVerify ({dispatch}, {key, code}) {
    return dispatch('getDataFromApi', {
      method: 'post',
      url: '/verifyApi/validate/check',
      timeout: 5000,
      data: {
        'verifyKey': key,
        'realMsg': code
      }
    }, {root: true})
  },
  async getPermission ({dispatch, commit}) {
    let data = await dispatch('getDataFromApi', {
      url: '/shiroApi/viewPermission',
      method: 'get',
      timeout: 5000,
    }, {root: true})
    let permission = data.permission
    let list = [].concat(permission.menu, permission.button, permission.element)
    let groups = {}
    list.forEach(l => {
      let s = l.split(':')
      let o = groups
      s.forEach(si => {
        if (!o[si]) {
          o[si] = {}
        }
        o = o[si]
      })
    })
    console.log('get permission', groups)
    commit('setPermission', groups)
    return groups
  },
  async getSelfInfo ({dispatch, commit}) {
    let self = await dispatch('getDataFromApi', {
      method: 'get',
      url: '/shiroApi/selfInfo',
      timeout: 5000,
    }, {root: true})
    commit('setSelf', self)
    return self
  },
  async getRole ({dispatch, commit}) {
    let role = await dispatch('getDataFromApi', {
      url: '/shiroApi/auth/roles',
      method: 'post',
      timeout: 5000,
    }, {root: true})
    console.log('get Role', role)
    return role
  },
  async logout ({dispatch, commit}, silent = false) {
    try {
      if (!silent) {
        await dispatch('getDataFromApi', {
          method: 'get',
          url: '/shiroApi/logout'
        }, {root: true})
        // your logout dispatch
      }
    }
    catch (e) {
      // throw e
    }
    finally {
      commit('deleteInfo')
      commit('clearInit')
      commit('$L/changeTab', [], {root: true})
    }
    return true
  },
  async logoutCount ({dispatch, commit}, {second, reason}) {
    dispatch('closeAlert', null, {root: true})
    commit('openExitDialog', {second, reason})
    return true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
