import {getField, updateField} from 'vuex-map-fields'
import F from '@/utils/functional'
import cfg from '@/config'

let LOGIN_INFO_KEY = 'loginInfo'

function LoginInfo ({token, name, id, role, access}) {
  this.token = token || ''
  this.name = name || ''
  this.id = id || ''
  this.role = role || ''
  this.access = access || {}
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
  access: {},
  exitDialog: {
    count: 0,
    reason: '由于长时间未操作, 您的登录信息已失效',
  },
  exitDialogActivate: false,
}
const getters = {
  getField,
  isLogin (state) {
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
  saveInfo (state, info) {
    let loginInfo = new LoginInfo(info)
    for (let key of Object.keys(loginInfo)) {
      state[key] = loginInfo[key]
    }
    F.saveToLocal(LOGIN_INFO_KEY, loginInfo)
  },
  deleteInfo (state) {
    state.token = ''
    state.name = ''
    state.id = ''
    state.role = ''
    state.access = {}
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
  }
}

const actions = {
  async login ({dispatch, commit}, payload) {

    // test
    let loginInfo = new LoginInfo({token: '__TEMP__', name: 'LZ', id: 'admin_lz', role: 'admin'})

    // your login dispatch
    // throw error when login failed

    commit('saveInfo', loginInfo)
    return true
  },
  async logout ({dispatch, commit}, silent = false) {
    if (!silent) {
      // your logout dispatch
    }
    commit('deleteInfo')
    return true
  },
  async logoutCount ({dispatch, commit}, {second, reason}) {
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
