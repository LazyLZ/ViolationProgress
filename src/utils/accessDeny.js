// 添加token
import axios from 'axios'
import store from '../store/index'
import {LError} from './SpavaObj'

let excludeUrl = new Set([
  '/shiroApi/auth',
  '/shiroApi/auth/thirdpart/portal/pipe/default',
  '/shiroApi/logout',
  // '/shiroApi/viewPermission',
  '/shiroApi/version',
  '/shiroApi/selfInfo',
  '/shiroApi/auth/roles',
  '/passApi/pass/parkinglot/list',
  '/passApi/pass/controller/all'
])

function accessDeny (response) {
  let url
  if (response instanceof Object && response.config) {
    url = response.config.url || ''
  }
  if (url && excludeUrl.has(url)) {
    return false
  }
  // console.log(url, excludeUrl.has(url))
  // console.log('response', response)
  let authDenyMsg = 'The current Subject is not authenticated.  Access denied.'
  return response.data.status === -1 || response.data.msg === authDenyMsg
}

axios.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('loginInfo')) {
      let data = sessionStorage.getItem('loginInfo')
      data = JSON.parse(data)
      // 如果没有本地token直接返回
      if (!data.token) {
        return config
      }
      // 如果Authorization 不是false则添加Authorization
      else if (config.headers.Authorization !== 'false') {
        config.headers.Authorization = data.token
      }
      // 如果是false则删除Authorization
      else if (config.headers.hasOwnProperty('Authorization')) {
        delete config.headers.Authorization
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

axios.interceptors.response.use(
  response => {
    // 判断是否登录失效
    if (accessDeny(response)) {
      // logger.error('Authorization deny', response)
      // setTimeout(() => {
      store.dispatch('login/logoutCount', {second: 10})
      // }, 500)

      return Promise.reject(new LError(
        '登录信息无效',
        response.data.status,
      ))
    }
    else {
      return response
    }
  })
