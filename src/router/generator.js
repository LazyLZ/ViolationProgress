import Router from 'vue-router'
import routes from './routes'
import store from '@/store/index'
import cfg from '@/config'
import F from '@/utils/functional'

const LOGIN_PAGE_NAME = 'Login'
const ACCESS_DENY_PAGE_NAME = 'AccessDeny'
export const NOT_FOUND_PAGE_NAME = 'NotFound'
export const HOME_PAGE_NAME = 'Home'
// import Main from '../core/components/Main/main'
// import ParentView from '../core/components/parentView'
// export let createMainRoute = function (route) {
//   return route
// }
// let testRoute = {
//   path: '/test-parent/test-page',
//   component: route,
//   meta: {
//     label: '',
//   }
// }
// export let createNestRoute = function (route, level) {
//   if (level < 1) {
//     throw TypeError('cannot create level0 route, you should define it yourself')
//   }
//   if (!F.is(level, Number) || !F.is(route, Object)) {
//     throw TypeError('params error on createNestRoute')
//   }
//   let R = {
//     path: '/test-router-parent',
//     name: 'TestRouterParent',
//     component: Main,
//     meta: {
//       label: '违章处理',
//       disabled: true
//     },
//   }
// }

let isNeedLogin = function (to) {
  if (!store.getters['login/isLogin']) {
    store.commit('login/recoveryLogin')
  }
  return !to.meta.noLoginRequired && !store.getters['login/isLogin'] && to.name !== LOGIN_PAGE_NAME
}

let havePermission = function (to) {
  let permission = store.getters['login/getPermission']
  let access = to.meta.access
  if (F.is(access, Array) && access.length > 0) {
    return access.some(a => F.haveTruthyAttr(permission, a, true, true, cfg.permissionSeq))
  }
  if (F.is(access, String)) {
    return F.haveTruthyAttr(permission, access, true, true, cfg.permissionSeq)
  }
  return true
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
})

router.beforeEach((to, from, next) => {
  // console.log(store.getters['login/isLogin'])
  if (isNeedLogin(to)) {
    next({name: LOGIN_PAGE_NAME})
  }
  else if (havePermission(to)) {
    next()
  }
  else {
    next({name: ACCESS_DENY_PAGE_NAME})
  }
})

export {router}
