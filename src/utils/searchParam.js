// function isDefined (v) {
//   return v !== undefined && v !== null
// }

class Param {
  constructor (f = {}, s = {}) {
    let key = f instanceof Object ? f.key || s.by : s.by
    console.log('cp', f, s, key)
    if (key) {
      let value = f.value === undefined ? '' : f.value
      let fn = f.f || s.f
      if (fn instanceof Function) {
        value = fn(value) || ''
      }
      this.key = key
      this.value = value
      this.descending = s.descending || false
      this.precious = f.precious || false
      this.range = f.range
    }
    else {
      throw TypeError('must set key')
    }
  }

  transform () {
    let key = this.key
    let value = {
      'order': this.descending ? 'DESC' : 'ASC',
      operators: [],
    }
    let v = this.value
    if (this.range) {
      let r1 = v instanceof Array ? v[0] : -Infinity
      let r2 = v instanceof Array ? v[1] : -Infinity
      if (r1 !== undefined) {
        value.operators.push({
          keyword: r1,
          operator: 'GTE'
        })
      }
      if (r2 !== undefined) {
        value.operators.push({
          keyword: r2,
          operator: 'LTE'
        })
      }
    }
    else if (this.value instanceof Array) {
      value.operators.push({
        keyword: this.value.join(','),
        operator: 'IN'
      })
    }
    else {
      let o = {
        keyword: this.value === undefined ? '' : this.value,
        operator: 'LIKE'
      }
      if (this.precious) {
        o.matchType = 'BOTH'
      }
      value.operators.push(o)
    }
    // if (v === '' || v === undefined || v === null) {
    //
    // }

    return {key, value}
  }
}

class SearchParam {
  constructor (pagination, sortStack, filter, search) {
    this.paramList = []

    // 排序栈 这里最后入栈的为最优先关键字
    let sortStack_ = sortStack instanceof Array ? sortStack.splice(0) : []
    let search_ = search
    let filter_ = {}

    // 处理filter的两种情况
    if (filter instanceof Array) {
      filter.forEach(f => {
        if (f.key) {
          filter_[f.key] = f
        }
      })
    }
    else if (filter instanceof Object) {
      for (let key of Object.keys(filter)) {
        let value = filter[key]
        if (value instanceof Object) {
          filter_[key] = value
        }
        else if (typeof value === 'string') {
          filter_[key] = {key: key, value: value}
        }
      }
    }

    // 处理分页排序关键字不在sortStack的情况
    let sortBy = pagination.sortBy || ''
    let descending = pagination.descending || false
    if (sortBy) {
      let t = sortStack_.find(s => s.by === sortBy)
      // 如果在排序里找到，直接重写
      if (t) {
        descending = pagination.descending || t.descending || false
        let i = sortStack_.indexOf(t)
        sortStack_.splice(i, 1)
      }
      sortStack_.push({by: sortBy, descending: descending})
    }

    // 取相反顺序开始遍历
    sortStack_.reverse()

    // 优先合成排序字段
    // forEach保证按顺序执行
    sortStack_.forEach(s => {
      // result[s.by] = toSearchParam(filter_[s.by], i + 1, s)
      this.paramList.push(new Param(filter_[s.by], s))
    })

    // searchParam index字段值
    // let idx = Object.keys(result).length + 1

    // 将search字段的值补入
    if (search_ instanceof Object && search_.key) {
      this.paramList.push(new Param(search_))
    }

    // 在filter中筛选没有排序的字段加入searchParam
    for (let key of Object.keys(filter_)) {
      this.paramList.push(new Param(filter_[key]))
    }
  }

  static merge (target, source) {
    // console.log('merge', Object.assign({}, target), Object.assign({}, source))
    if (!(target.operators instanceof Array)) {
      target.operators = []
    }
    if (!(source.operators instanceof Array)) {
      source.operators = []
    }
    for (let opt of source.operators) {
      let t = target.operators.find(o => o.keyword === opt.keyword)
      if (t) {
        if (t.operator === opt.operator) {
          if (opt.precious) {
            opt.precious = true
          }
        }
        else {
          target.operators.push(opt)
        }
      }
      else {
        target.operators.push(opt)
      }
    }
    return target
  }

  create () {
    let result = {}
    console.log('paramlist', this.paramList)
    let idx = 0
    this.paramList.forEach(param => {
      let {key, value} = param.transform()
      console.log('param', key, Object.assign({}, value))
      if (result[key]) {
        result[key] = SearchParam.merge(result[key], value)
      }
      else {
        value.index = idx
        idx++
        result[key] = value
      }
    })
    console.log('result', result)
    return result
  }
}

export {SearchParam}
//
// let generateSearchParam = function (pagination, sortStack, filter, search) {
//   let result = {}
//
//   let toSearchParam = function (f, i, s = {}) {
//     let k = ''
//     let opt = {}
//     // 如果是数组则直接取keyword为逗号分隔
//     if (f instanceof Array) {
//       k = f.join(',')
//     }
//
//     // 支持精细配置
//     else if (f instanceof Object) {
//       if (f.keyword instanceof Array) {
//         k = f.keyword.join(',')
//       }
//       else {
//         k = f.keyword
//       }
//       if (f.matchType) {
//         opt.matchType = f.matchType
//       }
//     }
//     else {
//       k = f || ''
//       k = k + ''
//     }
//     // 匹配类型
//     // if (opt.matchType) {
//     //   result[s.by].matchType = opt.matchType || ''
//     // }
//
//     // 合成searchParam
//     return {
//       index: i,
//       operators: [
//         {
//           keyword: k,
//           operator: 'LIKE'
//         }
//       ],
//       order: s.descending ? 'DESC' : 'ASC'
//     }
//   }
//
//   // 排序栈 这里最后入栈的为最优先关键字
//   let sortStack_ = sortStack instanceof Array ? sortStack.splice(0) : []
//   let search_ = search
//   let filter_ = {}
//
//   // 处理filter的两种情况
//   if (filter instanceof Array) {
//     filter.forEach(f => {
//       if (f.key) {
//         filter_[f.key] = {keyword: f.value}
//       }
//     })
//   }
//   else if (filter instanceof Object) {
//     filter_ = Object.assign({}, filter)
//   }
//
//   // 处理分页排序关键字不在sortStack的情况
//   let sortBy = pagination.sortBy || ''
//   let descending = pagination.descending || false
//   if (sortBy) {
//     let t = sortStack_.find(s => s.by === sortBy)
//     // 如果在排序里找到，直接重写
//     if (t) {
//       descending = pagination.descending || t.descending || false
//       let i = sortStack_.indexOf(t)
//       sortStack_.splice(i, 1)
//     }
//     sortStack_.push({by: sortBy, descending: descending})
//   }
//
//   // 取相反顺序开始遍历
//   sortStack_.reverse()
//
//   // 优先合成排序字段
//   // forEach保证按顺序执行
//   sortStack_.forEach((s, i) => {
//     result[s.by] = toSearchParam(filter_[s.by], i + 1, s)
//   })
//
//   // searchParam index字段值
//   let idx = Object.keys(result).length + 1
//
//   // 将search字段的值补入
//   if (search_ instanceof Object && search_.key) {
//     if (result.hasOwnProperty(search_.key)) {
//       result[search_.key].operators.push({
//         keyword: search_.value,
//         operator: 'LIKE'
//       })
//     }
//     else {
//       result[search_.key] = toSearchParam(search_.value, idx)
//     }
//   }
//
//   idx++
//
//   // 在filter中筛选没有排序的字段加入searchParam
//   for (let key of Object.keys(filter_)) {
//     if (!result[key]) {
//       result[key] = toSearchParam(filter_[key], idx)
//       idx++
//     }
//   }
//
//   return result
// }
