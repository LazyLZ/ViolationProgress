import store from '@/store'

export function alert (fn, successMsg = '', callback) {
  if (typeof fn !== 'function') {
    throw TypeError('fn should be a Function')
  }
  return async function (...args) {
    try {
      let res = await fn.call(this, ...args)
      if (successMsg) {
        store.dispatch('alert', {type: 'success', message: successMsg})
      }
      return res
    }
    catch (e) {
      // console.error(e)
      store.dispatch('alert', {type: 'error', message: e.message || e + ''})
    }
    finally {
      callback.call(this)
    }
  }
}

export function handleError (e) {
  console.error('[Spava]: ', e)
  if (typeof e === 'string') {
    return {
      message: e,
      code: 0
    }
  }
  else if (e instanceof Object) {
    if (e.hasOwnProperty('response')) {
      if (e.response instanceof Object) {
        let code = e.response.status
        return {
          message: e.response.statusText,
          code: code
        }
      }
      else {
        return {
          message: '服务器未响应',
          code: 'ERR_EMPTY_RESPONSE'
        }
      }
    }
    else if (e.hasOwnProperty('message')) {
      return {
        message: e.message || '未知错误',
        code: e.code || 0
      }
    }
    else if (e.hasOwnProperty('description')) {
      let p = /^([A-Z_])+(\d)+$/i
      if (p.test(e.description)) {
        return {
          code: e.statusCode || 0,
          message: e.description || '未知错误'
        }
      }
      else {
        return {
          message: e.description || '未知错误',
          code: e.statusCode || 0,
        }
      }
    }
    else {
      return {
        message: '未知错误: ' + e,
        code: -2
      }
    }
  }
  else {
    return {
      message: '未知错误: ' + e,
      code: -2
    }
  }
}
