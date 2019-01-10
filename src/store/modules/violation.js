import {getField, updateField} from 'vuex-map-fields'
import {ViolationEvent, ViolationRule} from '../../object'
import F from '@/utils/functional'
// import cfg from '@/config'
// import {LError} from '../../utils/SpavaObj'

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
    let {items, amount} = await dispatch('getDataList', {
      pagination,
      sortStack,
      search,
      filter,
      transDict: {phone: 'mobilePhone'},
      url: `/violationApi/violation/runtime/group/false`
    }, {root: true})
    return {items: items.map(t => ViolationEvent.fromAPI(t)), amount: amount}
  },

  getRules ({dispatch, commit}) {
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

      items.forEach(item => {
        item.level = (item.code || '').split(seq).length - 1
      })

      let group = F.groupBy(items, 'level')

      if (!group['0']) return []
      group['0'].forEach((item, i) => {
        item.index = i
      })
      tree.push(...group['0'])
      delete group['0']

      console.log('build root', tree)

      let keys = Object.keys(group)
      keys.sort((a, b) => Number(a) - Number(b))

      keys.forEach(i => {
        let items = group[i]
        console.log('level', i, items)
        items.forEach(item => {
          let route = item.code.split(seq)
          let parent = findNode(route.slice(0, -1))
          // console.log('parent', parent)
          item.index = route[route.length - 1]
          if (parent instanceof Array) {
            let insertIndex = parent.reduce((t, c, i) => c.index <= t ? i : t, 0) + 1
            parent.splice(insertIndex, 0, item)
          }
        })
      })
      console.log('success', tree)
      return tree
    }

    return new Promise(resolve => {
      setTimeout(() => {
        let items = [
          {
            'id': 1,
            'name': '情节恶劣',
            'serious': null,
            'code': '1'
          },
          {
            'id': 2,
            'name': '情节严重',
            'serious': null,
            'code': '2',
          },
          {
            'id': 4,
            'name': '酒驾',
            'serious': '1',
            'code': '1-1'
          },
          {
            'id': 5,
            'name': '毒驾',
            'serious': '1',
            'code': '1-2',
          },
          {
            'id': 6,
            'name': '毒驾1',
            'serious': null,
            'code': '1-2-1'
          },
          {
            'id': 7,
            'name': '酒驾1',
            'serious': null,
            'code': '1-2-2',
          },
          {
            'id': 8,
            'name': '酒驾1-1',
            'serious': null,
            'code': '1-2-2-1'
          },
          {
            'id': 9,
            'name': '酒驾1-2',
            'serious': null,
            'code': '1-2-2-2'
          },
          {
            'id': 3,
            'name': '一般违章',
            'serious': null,
            'code': '3'
          },
        ]

        commit('setRuleList', buildTree(items))
        resolve()
      }, 1500)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
