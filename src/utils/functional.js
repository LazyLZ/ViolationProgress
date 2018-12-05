let is = function (v, t, exact = false) {
  let returnType = arguments.length === 1
  if (t !== t) {
    return v !== v
  }
  try {
    let type = v.constructor
    if (returnType) {
      return type
    }
    else {
      return type === t
    }
  }
  catch (e) {
    let type
    if (typeof v === 'undefined') type = undefined
    if (v === null) type = null
    if (returnType) {
      return type
    }
    else {
      return type === t
    }
  }
}
let isObj = function (o) {
  return o instanceof Object
}
let saveToLocal = function (key, value, type = 'session') {
  if (!value) return
  let v = value instanceof Object ? JSON.stringify(value) : value
  sessionStorage.setItem(key, v)
  // console.log('save local', key, v)
}
let deleteLocal = function (key, type = 'session') {
  sessionStorage.removeItem(key)
  // console.log('save local', key, v)
}
let getFromLocal = function (key, type = 'session') {
  let value = sessionStorage.getItem(key)
  // console.log('get local', key, value)
  try {
    return JSON.parse(value)
  }
  catch (e) {
    return value
  }
}
let joinPath = function (a, b, seq = '/') {
  if (typeof a === 'string' && typeof b === 'string') {
    if (a.length && b.length) {
      let lastA = a.charAt(a.length - 1)
      let firstB = b.charAt(0)
      let prepend = lastA === seq ? a.slice(0, a.length - 1) : a
      let append = firstB === seq ? b.slice(1) : b
      // console.log(a, b, lastA, firstB, prepend, append)
      return prepend + seq + append
    }
    else {
      return a + b
    }
  }
  else {
    throw TypeError(`joinPath type error: get (a:${typeof a}b:${typeof b}), need (string, string)`)
  }
}

let haveTruthyAttr = function (o, attr, own = false, nested = false, seq = '.') {
  let chain = []
  if (!isObj(o)) {
    throw TypeError(`Params error: get (${typeof o}, ${typeof attr}), need (object, string | Array)`)
  }
  if (!attr) {
    return
  }
  if (is(attr, String)) {
    if (nested) {
      chain.push(...attr.split(seq))
    }
    else {
      chain.push(attr)
    }
  }
  else if (is(attr, Array)) {
    chain = attr
  }
  else {
    throw TypeError(`Params error: get (${typeof o}, ${typeof attr}), need (object, string | Array)`)
  }
  let tmp = o
  for (let i = 0; i < chain.length; ++i) {
    let c = chain[i]
    if (!c) {
      throw TypeError('Attribute name should not be empty')
    }
    if (own) {
      if (tmp.hasOwnProperty(c)) {
        tmp = tmp[c]
      }
      else {
        return false
      }
    }
    else {
      tmp = tmp[c]
    }
    if (!tmp) return false
  }
  return true
}

let getAttr = function (o, attr, own = false, nested = true, seq = '.') {
  let chain = []
  if (!isObj(o)) {
    throw TypeError(`Params error: get (${typeof o}, ${typeof attr}), need (object, string | Array)`)
  }
  if (!attr) {
    return
  }
  if (is(attr, String)) {
    if (nested) {
      chain.push(...attr.split(seq))
    }
    else {
      chain.push(attr)
    }
  }
  else if (is(attr, Array)) {
    chain = attr
  }
  else {
    throw TypeError(`Params error: get (${typeof o}, ${typeof attr}), need (object, string | Array)`)
  }
  let tmp = o
  for (let i = 0; i < chain.length; ++i) {
    let c = chain[i]
    if (!c) {
      throw TypeError('Attribute name should not be empty')
    }
    if (own) {
      if (tmp.hasOwnProperty(c)) {
        tmp = tmp[c]
      }
      else {
        return
      }
    }
    else {
      tmp = tmp[c]
    }
    if (!tmp) return tmp
  }

  return tmp
}

export default {
  saveToLocal,
  getFromLocal,
  joinPath,
  is,
  isObj,
  haveTruthyAttr,
  getAttr,
  deleteLocal
}
