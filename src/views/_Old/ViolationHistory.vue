<template>
  <div>
    <v-slide-y-transition mode="out-in">
      <v-container v-show="mounted" :class="[$vuetify.breakpoint.smAndDown ? 'px-0 py-0' : '']" fluid>
        <v-layout row justify-center>
          <v-flex xs12 lx10>
            <v-card class="card" ref="card" :flat="$vuetify.breakpoint.smAndDown">
              <v-card-title class="py-0" style="height: 64px">
                <v-flex row layout align-center>

                  <span class="subheading pl-2 pr-4">车辆违章历史日志</span>
                  <v-tabs height="64px" class="mr-4" :value="statusTab">
                    <v-tab id="runtime" key="runtime" @click="historyType = 'runtime'">未冻结</v-tab>
                    <v-tab id="history" key="history" @click="historyType = 'history'">已冻结</v-tab>
                    <v-tab id="cancel" key="cancel" @click="historyType = 'cancel'">已撤销</v-tab>
                  </v-tabs>
                  <v-switch
                    class="my-0 py-0"
                    hide-details
                    label="仅显示本人处理事件"
                    v-model="selfHandle"
                  ></v-switch>

                </v-flex>

                <v-spacer></v-spacer>
                <v-text-field
                  class="my-0 mr-3 pt-0"
                  v-model="search"
                  append-icon="search"
                  label="搜索车辆"
                  single-line
                  hide-details
                ></v-text-field>
                <v-tooltip bottom>
                  <v-btn slot="activator" icon v-model="filter" @click.stop="filter = !filter">
                    <v-icon>filter_list</v-icon>
                  </v-btn>
                  <span>筛选</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <v-btn slot="activator" :loading="refreshBtnLoading" @click="refreshLog()" class="my-0" icon>
                    <v-icon>refresh</v-icon>
                  </v-btn>
                  <span>刷新列表</span>
                </v-tooltip>
                <!--<v-menu>-->
                <!--<v-btn-->
                <!--icon-->
                <!--slot="activator"-->
                <!--&gt;-->
                <!--<v-icon>more_vert</v-icon>-->
                <!--</v-btn>-->
                <!--<v-list>-->
                <!--<v-list-tile @click="multiSelect = !multiSelect">-->
                <!--<v-list-tile-title>批量删除</v-list-tile-title>-->
                <!--</v-list-tile>-->
                <!--<v-list-tile @click="multiSelect = !multiSelect">-->
                <!--<v-list-tile-title>导出</v-list-tile-title>-->
                <!--</v-list-tile>-->
                <!--</v-list>-->
                <!--</v-menu>-->

              </v-card-title>
              <l-expand-transition-group>
                <div :key="'filter'" class="filter" v-if="filter">
                  <v-divider></v-divider>
                  <v-form ref="filterForm">
                    <v-container fluid grid-list-md>
                      <v-layout row wrap>
                        <v-flex xs12 md4>
                          <select-datetime-duration
                            label="上报时间"
                            v-model="filterDuration"
                          ></select-datetime-duration>
                        </v-flex>
                        <!--<v-flex xs12 md3>-->
                        <!--<v-select-->
                        <!--disabled-->
                        <!--prepend-icon="group"-->
                        <!--label="登记类型"-->
                        <!--:items="['全部','教职工车辆','学生车辆','访客']"-->
                        <!--&gt;</v-select>-->
                        <!--</v-flex>-->
                        <v-flex xs12 md4>
                          <select-violation-rule
                            single-select
                            return-id
                            v-model="filterViolationRule"
                          ></select-violation-rule>
                        </v-flex>
                        <v-flex xs12 md4>
                          <v-select
                            label="状态"
                            prepend-icon="offline_pin"
                            :items="statusSelects"
                            v-model="filterStatus"
                            clearable
                            multiple
                            clear-icon="clear"
                          ></v-select>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex>
                          <v-btn small @click="resetLog()" class="mx-0" color="primary">
                            筛选
                          </v-btn>
                          <v-btn small @click="resetFilter()">
                            重置
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </div>
                <div :key="'table'">
                  <v-divider></v-divider>
                  <!--style="height: 400px; overflow-y: scroll"-->
                  <v-data-table
                    must-sort
                    class="table"
                    :headers="headers"
                    :total-items="logAmount"
                    :items="logList"
                    :loading="loading"
                    :pagination.sync="pagination"
                    item-key="id"
                    :rows-per-page-items="rowPerPage"
                    rows-per-page-text="每页行数"
                  >
                    <template slot="no-data">
                      <v-flex class="body-2 text-xs-center">
                        <div v-if="loading">数据加载中...</div>
                        <div v-else-if="errorData.error">
                          <span>数据加载出错: {{errorData.message}}, code: {{errorData.code}}</span>
                          <v-btn flat color="primary" @click="getLogList(initPage)">重新加载</v-btn>
                        </div>
                        <div v-else>没有数据</div>
                      </v-flex>
                    </template>
                    <!--<v-progress-linear height="5" slot="progress" indeterminate></v-progress-linear>-->
                    <template slot="items" slot-scope="props">
                      <tr
                        @click="goDetails('readonly', props.item, props.index)"
                        style="cursor: pointer"
                      >
                        <td><span style="cursor: auto">{{ props.item.plate }}</span></td>
                        <!--<td class="text-xs-right"><span style="cursor: auto">{{ props.item.ownerName }}</span></td>-->
                        <!--<td class="text-xs-right"><span style="cursor: auto">{{ props.item.phoneNumber }}</span></td>-->
                        <!--<td class="text-xs-right"><span style="cursor: auto">{{ props.item.ownerGroup }}</span></td>-->
                        <td class="text-xs-right"><span style="cursor: auto">{{ props.item.violationAreaName}}</span>
                        </td>
                        <td class="text-xs-right"><span style="cursor: auto">{{ props.item.violationRuleName }}</span>
                        </td>
                        <td class="text-xs-right"><span style="cursor: auto">{{ props.item.createTime }}</span>
                        </td>
                        <td class="text-xs-right"><span
                          style="cursor: auto">{{ violationStatus(props.item.status) }}</span></td>
                        <!--<td @click.stop class="mx-0 px-0">-->
                        <!--<v-flex layout justify-center>-->
                        <!--<v-menu>-->
                        <!--<v-btn slot="activator" icon>-->
                        <!--<v-icon small>more_vert</v-icon>-->
                        <!--</v-btn>-->
                        <!--<v-list dense>-->
                        <!--<v-list-tile>-->
                        <!--<v-list-tile-title class="px-1">导出</v-list-tile-title>-->
                        <!--</v-list-tile>-->
                        <!--<v-list-tile>-->
                        <!--<v-list-tile-title class="px-1 error&#45;&#45;text">删除</v-list-tile-title>-->
                        <!--</v-list-tile>-->
                        <!--</v-list>-->
                        <!--</v-menu>-->
                        <!--</v-flex>-->
                        <!--</td>-->
                      </tr>
                    </template>
                    <template slot="pageText" slot-scope="props">
                      第 {{ props.pageStart }} - {{ props.pageStop }}条，共 {{ props.itemsLength }} 条
                    </template>
                  </v-data-table>
                </div>
              </l-expand-transition-group>
              <!--</transition-group>-->
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout style="height:30px"></v-layout>
      </v-container>
    </v-slide-y-transition>
  </div>
</template>
<script>
import LExpandTransitionGroup from '../../components/l-expand-transition-group'
import ConfirmOerationDialog from '../../components/confirmOperationDialog'
import SelectDatetimeDuration from '../../components/timeSelects/selectDatetimeDuration'
import SelectViolationRule from '@/components/exclusiveSelects/selectViolationRule'
import _ from 'lodash'

let EVENT_SUBMIT = '-1'
let ALERT_CONFIRM = '0'
let VIOLATION_CONFIRM = '1'
let CONFIRMED = '2'
let ERROR_STATUS = '-2'

export default {
  name: 'ViolationHistory',
  components: {SelectViolationRule, SelectDatetimeDuration, ConfirmOerationDialog, LExpandTransitionGroup},
  data () {
    return {
      selfHandle: false,
      refreshBtnLoading: false,
      filter: true,
      filterStatus: [],
      filterViolationRule: '',
      filterDuration: {
        startDatetime: '',
        endDatetime: '',
      },
      search: '',
      rowPerPage: [10, 15, 20, 25, 50, 100],
      initPage: {
        sortBy: 'createTime',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
      pagination: {
        sortBy: 'createTime',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
      historyType: 'runtime',
      loading: false,
      selected: [],
      mounted: false,
      errorData: {
        error: false,
        code: 0,
        message: ''
      },
      headers: [
        {
          align: 'left',
          value: 'plate',
          text: '车辆号牌'
        },
        // {text: '车主姓名', value: 'ownerName', align: 'right', sortable: false},
        // {text: '联系方式', value: 'phoneNumber', align: 'right', sortable: false},
        // {text: '登记类型', value: 'ownerGroup', align: 'right', sortable: false},
        {text: '违章区域', value: 'violationAreaName', align: 'right', sortable: false},
        {text: '违章类型', value: 'violationRuleName', align: 'right', sortable: false},
        // {text: '消息内容', value: 'textContent', align: 'right'},
        {text: '上报时间', value: 'createTime', align: 'right'},
        {text: '状态', value: 'status', align: 'right'},
        // {text: '',sortable: false}
      ],
    }
  },
  computed: {
    statusTab () {
      switch (this.historyType) {
        case 'runtime':
          return 0
        case 'history':
          return 1
        case 'cancel':
          return 2
      }
    },
    logList () {
      return this.$store.state.violationEvent.logList
    },
    logAmount () {
      return this.$store.state.violationEvent.logAmount
    },
    statusSelects () {
      let select = [
        {text: '未确认', value: 0},
        {text: '初步确认', value: 1},
        {text: '违章已确认', value: 2},
      ]
      if (this.historyType === 'cancel') {
        select = [{text: '已撤销', value: -1}]
      }
      return select
    },
    violationStatus () {
      return (s) => {
        switch (Number(s)) {
          case -1:
            return '违章已撤销'
          case 0:
            return '违章未确认'
          case 1:
            return '初步确认'
          case 2:
            return '违章已确认'
          default:
            return '未知状态'
        }
      }
    },
  },
  watch: {
    search: _.debounce(function () {
      // this.pagination.page = 1
      if (this.pagination.page !== 1) {
        this.pagination.page = 1
      }
      else {
        this.getLogList()
      }
    }, 600),
    role () {
      this.$refs.filterForm.reset()
      this.resetLog()
    },
    historyType () {
      if (this.filter) {
        this.$refs.filterForm.reset()
      }
      this.resetLog()
    },
    selfHandle () {
      if (this.filter) {
        this.$refs.filterForm.reset()
      }
      this.resetLog()
    },
    pagination: {
      handler () {
        // console.log('change')
        this.getLogList()
      },
      deep: true
    }
  },
  methods: {
    goDetails (status = 'readonly', item = {}, i = 0) {
      // console.log('click', i, this.mousemove)
      let selectionString = document.getSelection().toString()
      if (!selectionString) {
        // console.log(item.plate)
        this.go({
          name: status === 'eventSubmit' ? 'NewEvent' : 'EventDetails',
          params: {
            plate: item.plate || '',
            status: status,
            rawItem: item
          }
        })
      }
    },
    resetFilter () {
      this.$refs.filterForm.reset()
      this.getLogList(this.initPage)
    },
    async refreshLog () {
      this.refreshBtnLoading = true
      await this.getLogList(this.initPage)
      this.refreshBtnLoading = false
    },
    resetLog () {
      this.pagination = this.util.deepClone(this.initPage)
    },
    go (path) {
      if (path) {
        this.$router.push(path)
      }
    },
    async getLogList (pagination = null) {
      if (pagination) {
        this.pagination = this.util.deepClone(pagination)
        console.log('set pagination to', pagination)
        return
      }
      let INFINITFY_DATE = this.util.datetimeStrNow('date')
      let UNINFINITY_DATE = '1970-01-01'
      this.errorData = {
        error: false,
        code: 1,
        message: ''
      }
      let status = this.filterStatus.length === 0 ? ['0', '1', '2'] : this.filterStatus
      // this.pagination = this.deepClone(pagination)
      console.log('test duration', this.filterDuration)
      let locate = 'runtime'
      switch (this.historyType) {
        case 'history':
          locate = 'history'
          break
        case 'runtime':
          locate = 'runtime'
          break
        case 'cancel':
          locate = 'history'
          status = '-1'
          break
        default:
          throw Error('违章类型不正确: ' + this.historyType)
      }
      this.loading = true
      try {
        // await this.$store.dispatch('violationEvent/getViolationLogList', configs)
        let {events, amount} = await this.$store.dispatch('violationEvent/getViolationEvents', {
          self: this.selfHandle,
          pagination: this.pagination,
          locate: locate,
          sortStack: [{by: this.pagination.sortBy, descending: this.pagination.descending}],
          filter: {
            status: status,
            plate: this.search.trim() || '',
            violationRuleId: this.filterViolationRule || '',
            createTime: `${this.filterDuration.startDatetime || UNINFINITY_DATE},${this.filterDuration.endDatetime || INFINITFY_DATE}`
          }
        })
        this.$store.commit('violationEvent/getLogList', {eventList: events, eventAmount: amount})
      }
      catch (e) {
        this.errorData = {
          error: true,
          code: e.code,
          message: e.message
        }
        this.$store.commit('violationEvent/getLogList', {eventList: [], eventAmount: 0})
      }
      finally {
        this.loading = false
      }
    }
  },
  activated () {
    this.mounted = true
  },
  deactivated () {
    this.mounted = false
  },
  mounted () {
    this.mounted = true
  }
}
</script>
