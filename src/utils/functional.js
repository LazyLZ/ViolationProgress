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
function deepClone (obj) {
  if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj) {
    return obj
  }
  let temp = {}
  if (obj instanceof Date) {
    temp = new obj.constructor()
  } // or new Date(obj);
  else {
    temp = obj.constructor()
  }

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null
      temp[key] = deepClone(obj[key])
      delete obj['isActiveClone']
    }
  }

  return temp
}
function transformIO (inObject, transDict, mode = 'strict') {
  if (!(inObject instanceof Object)) {
    // throw Error('输入类型不正确: ' + typeof inObject)
    return
  }
  if (inObject instanceof Array) {
    inObject.forEach(o => {
      transformIO(o, transDict, mode)
    })
    return inObject
  }
  let o = inObject
  let t = transDict

  if (mode === 'reverse') {
    t = deepClone(transDict)
    for (let key of Object.keys(t)) {
      if (typeof t[key] === 'string') {
        let k = t[key]
        t[k] = key
        delete t[key]
      }
      else if (t[key] instanceof Object) {
        if (t[key].hasOwnProperty('to')) {
          let k = t[key].to
          // t[key].to = key
          t[k] = key
        }
        delete t[key]
      }
      else {
        throw Error('映射表类型不正确: ' + typeof t[key])
      }
    }
    // console.log(deepClone(t))
  }
  for (let key of Object.keys(t)) {
    let attr = t[key]
    if (attr instanceof Object) {
      if (attr.hasOwnProperty('default') && attr.hasOwnProperty('type')) {
        // console.log('set deafult', deepClone(o))
        let check = {}
        check[key] = {type: attr.type, default: attr.default}
        checkType(o, check)
        // if (typeof o[key] === null) {
        // console.log('set default', key, 'to', attr.default)
        // o[key] = attr.default
        // }
      }
      if (!o.hasOwnProperty(key)) continue
      if (attr.hasOwnProperty('children')) {
        if (!(attr.children instanceof Object)) throw Error('映射表类型不正确: ' + typeof attr.children)
        transformIO(o[key], attr.children, mode)
      }
      if (attr.hasOwnProperty('to')) {
        if (o.hasOwnProperty(attr.to)) {
          throw Error('属性命名重复' + key + '->' + attr.to)
        }
        o[attr.to] = o[key]
        delete o[key]
      }
    }
    else if (typeof attr === 'string') {
      if (!o.hasOwnProperty(key)) continue
      if (o.hasOwnProperty(attr)) {
        throw Error('属性命名重复' + key + '->' + attr)
      }
      o[attr] = o[key]
      delete o[key]
    }
    else {
      throw Error('映射表类型不正确:' + typeof attr)
    }
  }
  return o
}
function checkType (inObject, typeList) {
  if (inObject instanceof Array) {
    inObject.forEach(item => {
      checkType(item, typeList)
    })
    return
  }
  if (!(inObject instanceof Object)) {
    return
  }
  for (let attr in typeList) {
    if (!typeList.hasOwnProperty(attr)) continue
    let t = typeList[attr]
    let checked = false
    if (inObject.hasOwnProperty(attr)) {
      if (t.type === String) {
        checked = typeof inObject[attr] === 'string'
      }
      else if (t.type === Number) {
        checked = typeof inObject[attr] === 'number'
      }
      else if (t.type === null || t.type === undefined) {
        checked = true
      }
      else if (t.type instanceof Object) {
        checked = inObject[attr] instanceof t.type
      }
      else {
        checked = false
      }
      // console.log(attr, checked)
    }
    else {
      checked = false
    }
    if (!checked) {
      if (t.throwError === true) {
        throw inObject[attr]
      }
      else if (!t.hasOwnProperty('default') && t.throwError !== false) {
        throw inObject[attr]
      }
      else {
        inObject[attr] = t.default
      }
    }
  }
}

export default {
  saveToLocal,
  getFromLocal,
  joinPath,
  is,
  isObj,
  haveTruthyAttr,
  getAttr,
  deleteLocal,
  transformIO,
  checkType,
}
