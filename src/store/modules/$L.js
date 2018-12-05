import {getField, updateField} from 'vuex-map-fields'
import F from '../../utils/functional'
import routes from '@/router/routes'

let routeToTab = function (route) {
  return {
    key: route.name,
    label: route.meta.label || route.name || route.path,
    to: route.fullPath || route.path || '',
    persistent: route.meta.persistent || false,
    subText: F.getAttr(route, route.meta.subText),
    beforeCloseName: route.meta.beforeCloseName || ''
  }
}
let getPersistentTab = function () {
  let tabs = []
  routes.forEach(r => {
    if (r.children instanceof Array) {
      r.children.forEach(route => {
        if (route.meta && route.meta.persistent) {
          // console.log('persistent', )
          let tab = routeToTab(route)
          tab.to = F.joinPath(r.path, tab.to)
          tabs.push(tab)
        }
      })
    }
  })
  return tabs
}
const state = {
  dark: false,
  mainNavDrawer: true,
  mainTabItems: [],
  floatingTabs: false,
  pageLoading: false,
  haveNotification: true,
  globalAlert: {
    type: '',
    title: '',
    message: ''
  },
  globalAlertActivate: false,
  globalOperation: {
    title: '',
    icon: '',
    iconColor: '',
    text: '',
    subText: '',
    disableCancel: false,
    disableConfirm: false,
    cancelText: '取消',
    confirmText: '确认',
    width: '350px',
    onCancel: () => {
    },
    onConfirm: () => {
    },
  },
  globalOperationActivate: false
  // bcItems: []
}
const getters = {
  getField,
  routeToTab: () => (route) => {
    return routeToTab(route)
  }
}
const actions = {}
const mutations = {
  updateField,
  addTab (state, route) {
    let tab = routeToTab(route)
    state.mainTabItems.push(tab)
    F.saveToLocal('$mainTabItems', state.mainTabItems)
  },
  closeTab (state, i) {
    state.mainTabItems.splice(i, 1)
    F.saveToLocal('$mainTabItems', state.mainTabItems)
  },
  changeTab (state, tabs) {
    state.mainTabItems = tabs
  },
  recoveryTab (state, routeNow) {
    // 暂时仅恢复主页
    let tabNow = routeToTab(routeNow)
    let tabs = getPersistentTab()
    let localTabs = F.getFromLocal('$mainTabItems') || []
    localTabs.forEach(t => {
      if (!tabs.find(tab => tab.key === t.key)) {
        tabs.push(t)
      }
    })
    // if (!tabs.find(t => t.key === 'Home') && tabNow && tabNow.key !== 'Home') {
    //   tabs.unshift({
    //     key: 'Home',
    //     label: '首页',
    //     to: '/home',
    //     persistent: true,
    //   })
    // }
    if (tabNow && !tabs.find(t => t.key === tabNow.key)) {
      tabs.push(tabNow)
    }
    console.log('recover', tabs)
    state.mainTabItems = tabs
  },
  // addBread (state, route) {
  //   state.bcItems.push({
  //     text: route.meta.label || route.name || '',
  //     disabled: true,
  //     href: route.fullPath || route.path
  //   })
  // },
  openAlert (state, {type = '', title = '', message = ''}) {
    state.globalAlert = {
      type: type,
      title: title,
      message: message
    }
    state.globalAlertActivate = true
  },
  openOperation (state, attr) {
    let emptyF = () => {
    }
    state.globalOperation = {
      title: attr.title || '',
      icon: attr.icon || '',
      iconColor: attr.iconColor || '',
      text: attr.text || '',
      subText: attr.subText || '',
      disableCancel: attr.disableCancel || false,
      disableConfirm: attr.disableConfirm || false,
      cancelText: attr.cancelText || '取消',
      confirmText: attr.confirmText || '确认',
      width: attr.width || '350px',
      onCancel: attr.onCancel || emptyF,
      onConfirm: attr.onConfirm || emptyF
    }
    state.globalOperationActivate = true
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
