<template>
  <div>
    <v-slide-y-transition>
      <v-container fluid v-if="mounted">
        <v-layout row justify-center>
          <v-flex xs12 md10>
            <v-card>
              <v-card-title class="py-2">
                <!--<span class="subheading ml-2">{{selected}}</span>-->
                <v-breadcrumbs class="py-1 my-2" large>
                  <v-icon slot="divider">chevron_right</v-icon>
                  <v-breadcrumbs-item
                    v-for="(item, i) in bcItems"
                    :disabled="item.disabled"
                    :key="item.id"
                  >
                    <span
                      @click="goChildren(item, -1)"
                    >{{ item.name }}</span>
                  </v-breadcrumbs-item>
                </v-breadcrumbs>
                <v-spacer></v-spacer>
                <v-tooltip left>
                  <v-btn
                    slot="activator"
                    icon
                    class="py-0 my-0"
                    @click="goDetails('new')"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                  <span>添加规则</span>
                </v-tooltip>

              </v-card-title>
              <v-divider></v-divider>
              <v-tooltip open-delay="1500" bottom>
                <div slot="activator">
                  <v-data-table
                    disable-initial-sort
                    hide-actions
                    :items="ruleList"
                    :headers="headers"
                    :item-key="name"
                    :loading="loading"
                  >
                    <template slot="no-data">
                      <v-flex class="body-2 text-xs-center">
                        <div v-if="loading">数据加载中...</div>
                        <div v-else-if="errorData.error">
                          <span>数据加载出错: {{errorData.message}}, code: {{errorData.code}}</span>
                          <v-btn flat color="primary" @click="getViolationRule()">重新加载</v-btn>
                        </div>
                        <div v-else>没有规则</div>
                      </v-flex>
                    </template>
                    <template slot="items" slot-scope="prop">
                      <tr
                        @click="selected = selected === prop.index ? -1: prop.index"
                        @dblclick="goChildren(prop.item, prop.index)"
                      >
                        <td>
                          <v-flex layout align-center>
                            <v-icon
                              :color="selected === prop.index ? 'primary' : ''"
                              class="pr-3"
                            >
                              {{prop.item.children && prop.item.children.length!==0? 'folder' : 'description'}}
                            </v-icon>
                            {{prop.item.name}}
                          </v-flex>
                        </td>
                        <td class="text-xs-right">{{ prop.item.operator }}</td>
                        <td class="text-xs-right">{{ prop.item.createTime }}</td>
                        <td class="text-xs-right" style="width: 100px" @dblclick.stop>
                          <v-menu left>
                            <v-btn slot="activator" class="mx-0 px-0" icon>
                              <v-icon small>more_vert</v-icon>
                            </v-btn>
                            <v-list dense>
                              <v-list-tile
                                @click="goEdit(prop.item, prop.index)"
                              >
                                <v-list-tile-title class="pr-1">
                                  <v-icon small class="pr-3">edit</v-icon>
                                  编辑规则
                                </v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile
                                @click="addChild(prop.item, prop.index)"
                              >
                                <v-list-tile-title class="pr-1">
                                  <v-icon small class="pr-3">add</v-icon>
                                  添加细分规则
                                </v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile
                                @click="deleteDialog = {activate:true, item:prop.item}"
                              >
                                <v-list-tile-title class="pr-1">
                                  <v-icon small class="pr-3">delete</v-icon>
                                  删除规则
                                </v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </td>
                      </tr>
                    </template>

                  </v-data-table>
                </div>
                <span>双击跳转</span>
              </v-tooltip>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-slide-y-transition>
    <confirm-operation-dialog
      v-if="!deleteDialog.item.children || deleteDialog.item.children.length === 0"
      v-model="deleteDialog.activate"
      title="确认删除"
      @cancel="deleteRule(0)"
      @confirm="deleteRule(deleteDialog.item)"
    >
      确认删除规则
      <span class="body-2 primary--text px-1">{{deleteDialog.item.name}}</span>
      ?
    </confirm-operation-dialog>
    <confirm-operation-dialog
      v-else
      disable-confirm
      auto-close
      v-model="deleteDialog.activate"
      title="无法删除"
    >
      <v-flex layout align-center justify-center>
        <v-icon class="pr-3" color="error">error</v-icon>
        <span>无法删除含有细分规则的规则类</span>
      </v-flex>
      <!--<span class="body-2 primary&#45;&#45;text px-1">{{deleteDialog.item.name}}</span>-->
    </confirm-operation-dialog>
  </div>

  <!--<v-card>-->
  <!--<v-card-title>违章规则管理</v-card-title>-->
  <!--<div class="treeMenu">-->
  <!--<TreeMenu-->
  <!--class="item"-->
  <!--:model="treeData">-->
  <!--</TreeMenu>-->
  <!--</div>-->
  <!--</v-card>-->
</template>
<script>
import ConfirmOperationDialog from '@/components/confirmOperationDialog'

export default {
  components: {ConfirmOperationDialog},
  data: () => ({
    loading: false,
    mounted: false,
    name: 'ViolationTypes',
    selected: -1,
    deleteDialog: {
      activate: false,
      item: {}
    },
    errorData: {
      error: false,
      code: 0,
      message: ''
    },
    pagination: {},
    headers: [
      {
        text: '规则名称',
        align: 'left',
        value: 'name',
      },
      {text: '操作人', value: 'operator', align: 'right', sortable: false},
      {text: '上次修改时间', value: 'createTime', align: 'right', sortable: false},
      {text: '', align: 'right', sortable: false},
    ],
    ruleList: [],
    bcItems: [],
  }),
  computed: {
    dark () {
      return this.$store.state.dark
    },
    // ruleList () {
    //   return this.$store.state.violationRule.ruleList
    // }
  },
  methods: {
    async deleteRule (item, i) {
      if (item) {
        await this.$store.dispatch('violationRule/deleteViolationRule', {id: item.id})
          .then((res) => {
            console.log('delete success')
            this.getViolationRule()
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            this.deleteDialog.activate = false
          })
      }
      else {
        console.log('cancel')
        this.deleteDialog.activate = false
      }
    },
    addChild (item, i) {
      if (!item.hasOwnProperty('children')) {
        item.children = []
      }
      this.bcItems.push(item)
      this.goDetails('new')
    },
    goDetails (status = 'new', item = {}, i = 0) {
      // console.log('go details', i, item)
      let selectionString = document.getSelection().toString()
      if (!selectionString) {
        this.go({
          name: status === 'new' ? 'NewViolationRule' : 'RuleDetails',
          params: {
            status: status,
            ruleName: item.name,
            ruleId: item.id,
            rawItem: item,
            ruleStack: this.bcItems
          }
        })
      }
    },
    goEdit (item, i) {
      // this.bcItems.push(item)
      this.goDetails('edit', item, i)
    },
    goChildren (item, i, details = true) {
      document.getSelection().empty()
      // console.log('goChildren', item, i, details)
      if (i < 0) {
        while (this.bcItems.pop().id !== item.id) {
        }
      }
      if (item.hasOwnProperty('children') && item.children.length !== 0) {
        this.ruleList = item.children
        this.bcItems.push(item)
      }
      else {
        if (details) {
          this.goDetails('edit', item, i)
        }
        // alert('go details')
      }
    },
    go (path) {
      if (path) {
        this.$router.push(path)
      }
    },

    // routeTo()
    async getViolationRule () {
      let route = []
      if (this.bcItems.length > 1) {
        route = this.bcItems[this.bcItems.length - 1].route
        // console.log('route: ', route, last)
      }
      // console.log('route: ', route)
      let config = {
        params: {
          page: 0,
          size: 1000
        },
        data: {
          'searchParam': {
            'name': {
              'keyword': '',
              'order': 'ASC'
            }
          }
        }
      }
      this.loading = true
      // console.log(this.loading)
      await this.$store.dispatch('violationRule/getViolationRule', config)
        .then((res) => {
          this.ruleList = res.ruleList
          console.log('get ruleList', this.$store.state.violationRule.ruleList)
        })
        .catch((err) => {
          console.error('get ruleList error', err)
          this.errorData.error = true
          this.errorData.code = err.code
          this.errorData.message = err.message
        })
        .finally(() => {
          const BCROOT = {
            id: '__ROOT__',
            name: '违章规则列表',
            disabled: false,
            children: this.ruleList
          }
          this.bcItems = [BCROOT]
          for (let r of route) {
            this.goChildren(this.ruleList[r], r, false)
          }
          this.loading = false
        })
    }
  },
  created () {
    this.getViolationRule()
  },
  mounted () {
    this.mounted = true
  },
  activated () {
    this.mounted = true
  },
  deactivated () {
    this.mounted = false
  },
  beforeRouteEnter (to, from, next) {
    console.log('route from', from.name)
    next(vm => {
      if (from.name === 'RuleDetails' || from.name === 'NewViolationRule') {
        vm.getViolationRule()
      }
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
<style scoped>

</style>
