import {getField, updateField} from 'vuex-map-fields'
import {ViolationEvent, ViolationRule} from '../../object'
import F from '@/utils/functional'
// import cfg from '@/config'
// import {LError} from '../../utils/SpavaObj'

class RuleNode extends ViolationRule {
  constructor (o) {
    super(o)
    o = o instanceof Object ? o : {}
    this.index = o.index || -1
    this.root = o.root
    this.children = o.children
    this.level = o.level
  }

  static fromAPI (o) {
    let v = ViolationRule.fromAPI(o)
    v.index = o.index || -1
    v.root = o.root
    v.children = o.children
    v.level = o.level
    return v
  }
}

const state = {
  areaList: [
    {id: 'QSH', name: '清水河'},
    {id: 'SH', name: '沙河'}
  ],
  ruleList: [],
}
const getters = {
  getField,
  getNewEvent: () => () => {
    return new ViolationEvent()
  },
  getNewRule: () => () => {
    return new ViolationRule()
  }
}
const mutations = {
  updateField,
  setRuleList (state, data) {
    state.ruleList = data
  }
}

const actions = {
  async getEvents ({dispatch}, {pagination, sortStack, search, filter}) {
    // let {items, amount} = await dispatch('getDataList', {
    //   pagination,
    //   sortStack,
    //   search,
    //   filter,
    //   transDict: {phone: 'mobilePhone'},
    //   url: `/violationApi/violation/runtime/group/false`
    // }, {root: true})
    let items = [
      {
        id: 1,
        vehicle: {
          plate: '川ALZ000',
          owner: {
            id: '1',
            name: 'LZ',
            phone: '18618164058'
          },
        },
        type: {
          id: '1',
          name: '一般违章类'
        },
        area: '清水河',
        creationTime: 1544837000000,
      }
    ]
    let amount = 100
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({items: items.map(t => ViolationEvent.fromAPI(t)), amount: amount})
      }, 1000)
    })

    // return {items: items.map(t => ViolationEvent.fromAPI(t)), amount: amount}
  },

  async getRules ({dispatch, commit}, filter) {
    let id
    if (filter instanceof Object) {
      id = filter.id
    }

    function buildTree (items) {
      let tree = []
      let seq = '-'

      function findNode (route) {
        let node = tree
        route.forEach(i => {
          if (node instanceof Array) {
            node = node.find(n => Number(n.index) === Number(i))
            if (node) {
              if (!node.children) {
                node.children = []
              }
              node = node.children
            }
          }
        })
        return node
      }

      items.forEach((item, i, a) => {
        item.level = (item.code || '').split(seq).length - 1
        a[i] = RuleNode.fromAPI(item)
      })

      let group = F.groupBy(items, 'level')

      if (!group['0']) return []
      group['0'].forEach((item, i) => {
        item.index = item.code
        item.root = null
      })
      tree.push(...group['0'])
      delete group['0']

      // console.log('build root', tree)

      let keys = Object.keys(group)
      keys.sort((a, b) => Number(a) - Number(b))

      keys.forEach(i => {
        let items = group[i]
        // console.log('level', i, items)
        items.forEach(item => {
          let route = item.code.split(seq)
          let parent = findNode(route.slice(0, -1))
          // console.log('parent', parent)
          item.index = route[route.length - 1]

          let root = tree.find(t => t.index === route[0])

          item.root = root || item
          if (parent instanceof Array) {
            let insertIndex = parent.reduce((t, c, i) => c.index <= t ? i : t, 0) + 1
            parent.splice(insertIndex, 0, item)
          }
        })
      })
      console.log('success', tree)
      return tree
    }

    let items = await dispatch('getDataFromApi', {
      method: 'get',
      url: '/api/regulars',
      timeout: 5000
    }, {root: true})

    console.log('items', items)
    if (id) {
      let item = items.find(t => t.id + '' === id + '')
      console.log('find', id, item)
      return ViolationRule.fromAPI(item)
    }
    else {
      console.log('build')
      let rootRules = buildTree(items)
      commit('setRuleList', rootRules)
      return rootRules
    }

    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     let items = [
    //       {
    //         'id': 1,
    //         'name': '情节恶劣',
    //         'serious': null,
    //         'code': '1',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 2,
    //         'name': '情节严重',
    //         'serious': null,
    //         'code': '2',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 4,
    //         'name': '酒驾',
    //         'serious': '1',
    //         'code': '1-1',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 5,
    //         'name': '毒驾',
    //         'serious': '1',
    //         'code': '1-2',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 6,
    //         'name': '毒驾1',
    //         'serious': null,
    //         'code': '1-2-1',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 7,
    //         'name': '酒驾1',
    //         'serious': null,
    //         'code': '1-2-2',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 8,
    //         'name': '酒驾1-1',
    //         'serious': null,
    //         'code': '1-2-2-1',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 9,
    //         'name': '酒驾1-2',
    //         'serious': null,
    //         'code': '1-2-2-2',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 10,
    //         'name': '禁停区域停车',
    //         'serious': null,
    //         'code': '2-1',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 11,
    //         'name': '阻碍消防通道',
    //         'serious': null,
    //         'code': '3-1',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //       {
    //         'id': 3,
    //         'name': '一般违章',
    //         'serious': null,
    //         'code': '3',
    //         creationTime: 1547174912000,
    //         lastEditor: 'admin'
    //       },
    //     ]
    //     if (id) {
    //       let item = items.find(t => t.id + '' === id + '')
    //       console.log('find', id, item)
    //       resolve(item)
    //     }
    //     else {
    //       console.log('build')
    //       commit('setRuleList', buildTree(items))
    //       resolve()
    //     }
    //   }, 1500)
    // })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
