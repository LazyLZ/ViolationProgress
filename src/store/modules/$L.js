import {getField, updateField} from 'vuex-map-fields'
import F from '../../utils/functional'
import routes from '@/router/routes'

let routeToTab = function (route) {
  if (route.meta.singlePage) return
  let tab = {
    key: route.name,
    name: route.name,
    label: route.meta.label || route.name || route.path,
    to: route.fullPath || route.path || '',
    persistent: route.meta.persistent || false,
    subText: F.getAttr(route, route.meta.subText),
    cacheKey: F.getAttr(route, route.meta.cacheKey),
    beforeCloseName: route.meta.beforeCloseName || '',
    notCache: route.meta.notCache,
  }
  if (route.matched && route.matched[1] && route.matched[1].components) {
    let c = route.matched[1].components.default || {}
    if (c.name === 'ParentView') {
      tab.isChildren = true
    }
  }
  return tab
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
  replaceTabNext: false,
  platform: {
    name: '',
    isApple: false, // ios || macOS
    isWindows: false,
    isIOS: false, // iPhone || ipad
    isIPad: false,
    isIPhone: false,
    isMacOS: false,
    isLinux: false,
    isAndroid: false,
  },
  mainNavDrawer: true,
  mainTabItems: [],
  lastCloseTab: null,
  floatingTabs: false,
  pageLoading: false,
  haveNotification: false,
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
    onCancel: undefined,
    onConfirm: undefined
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
  setPageLoading (state, val) {
    state.pageLoading = !!val
  },
  addTab (state, route) {
    let tab = routeToTab(route)
    if (tab) {
      state.mainTabItems.push(tab)
      F.saveToLocal('$mainTabItems', state.mainTabItems)
    }
  },
  routerInTab (state, callback) {
    state.replaceTabNext = true
    if (callback instanceof Function) {
      callback()
    }
  },
  replaceTab (state, {route, index}) {
    if (!route) return
    let i = -1
    if (typeof index === 'number') {
      i = index
    }
    if (typeof index === 'string') {
      i = state.mainTabItems.findIndex(tab => tab.to === index)
      // console.log('find', state.mainTabItems.find(tab => tab.to === i), state.mainTabItems.map(tab => tab.to))
    }
    let tab = routeToTab(route)
    // console.log('replace route', route, index, i)

    if (tab) {
      if (i < 0) {
        state.mainTabItems.push(tab)
      }
      else {
        state.lastCloseTab = state.mainTabItems[i]
        state.mainTabItems.splice(i, 1, tab)
      }
      F.saveToLocal('$mainTabItems', state.mainTabItems)
    }
    state.replaceTabNext = false
  },
  closeTab (state, i) {
    let index
    if (typeof i === 'number') {
      index = i
    }
    if (typeof i === 'string') {
      index = state.mainTabItems.findIndex(tab => tab.to === i)
    }
    if (index >= 0) {
      state.lastCloseTab = state.mainTabItems[index]
      state.mainTabItems.splice(index, 1)
      F.saveToLocal('$mainTabItems', state.mainTabItems)
    }
  },
  changeTab (state, tabs) {
    // console.log('change tabs', state.mainTabItems.length, tabs.length)
    // if (state.mainTabItems.length >= tabs.length) {

    let closed = []
    for (let i = 0; i < state.mainTabItems.length; ++i) {
      let tab = state.mainTabItems[i]
      if (!tabs.find(t => t.to === tab.to)) {
        closed.push(tab)
      }
    }
    state.lastCloseTab = closed
    // }
    state.mainTabItems = tabs
    F.saveToLocal('$mainTabItems', state.mainTabItems)
  },
  moveTab (state, {from, to}) {
    let insertIndex = from > to ? to + 1 : to
    let temp = state.mainTabItems[from]
    // console.log(`delete ${from}, insert at ${insertIndex}`)
    // console.log(state.mainTabItems.map(t => t.key))
    state.mainTabItems.splice(from, 1)
    // console.log(state.mainTabItems.map(t => t.key))
    state.mainTabItems.splice(insertIndex, 0, temp)
    // console.log(state.mainTabItems.map(t => t.key))
  },
  recoveryTab (state, routeNow) {
    // 暂时仅恢复主页
    let tabNow = routeToTab(routeNow)
    let tabs = getPersistentTab()
    let localTabs = F.getFromLocal('$mainTabItems') || []
    localTabs.forEach(t => {
      if (!tabs.find(tab => tab.to === t.to)) {
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
    if (tabNow && !tabs.find(t => t.to === tabNow.to)) {
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
  closeAlert (state) {
    state.globalAlert = {
      type: '',
      title: '',
      message: ''
    }
    state.globalAlertActivate = false
    console.log('close alert')
  },
  openOperation (state, attr) {
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
      onCancel: attr.onCancel,
      onConfirm: attr.onConfirm
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
