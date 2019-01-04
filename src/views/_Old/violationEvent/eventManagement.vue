<template>
  <l-content-level1 :layout="['xs12',]">
    <v-tooltip left>
      <span>上报违章事件</span>
      <v-fab-transition slot="activator">
        <v-btn
          v-if="floatingButton && canSubmit"
          fixed
          fab
          bottom
          right
          color="primary"
          class="mr-4 mb-4"
          @click="newEventSubmit()"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-tooltip>
    <v-layout class="py-5" v-if="errorStatus" column justify-center>
      <p class="text-xs-center subheading">您没有权限查看此页面</p>
      <p class="text-xs-center caption">如果您是多角色用户，请将角色切换为
        <span class="primary--text">违章管理员</span>、
        <span class="primary--text">报警中心管理员</span> 或
        <span class="primary--text">交通管理员</span>
      </p>
    </v-layout>
    <l-data-table
      v-else
      ref="lDataTable"
      title-text="待处理事件列表"
      search-text="搜索车辆"
      :get-data-func="getEventList"
      :headers="headers"
      init-sort-by="createTime"
    >
      <template slot="row-action" slot-scope="{item}">
        <td @click.stop class="mx-0 px-0 text-xs-right">
          <v-btn
            flat
            color="primary"
            @click="goDetails(eventStatus,item)"
          >
            {{canHandle? '处理':'查看'}}
          </v-btn>
        </td>
      </template>
    </l-data-table>
  </l-content-level1>
</template>
<script>
import _ from 'lodash'
import LContentLevel1 from '../../../components/l-content-level1'
import LDataTable from '../../../components/LDataTable'

// let EVENT_SUBMIT = '-1'
let ALERT_CONFIRM = '0'
let VIOLATION_CONFIRM = '1'
let CONFIRMED = '2'
let ERROR_STATUS = '-2'
export default {
  name: 'EventManagement',
  components: {LDataTable, LContentLevel1},
  data () {
    return {
      statusRouterNameMap: {
        readonly: 'EventDetails',
        eventSubmit: 'NewEvent',
        alarmConfirm: 'ConfirmEventAlarm',
        adminConfirm: 'ConfirmEventAdmin',
      },
      roleEventMap: {
        trafficController: 'readonly',
        alertCenterAdmin: 'alarmConfirm',
        violationAdmin: 'adminConfirm',
      },
      statusCodeMap: {
        readonly: ALERT_CONFIRM,
        eventSubmit: ALERT_CONFIRM,
        alarmConfirm: ALERT_CONFIRM,
        adminConfirm: VIOLATION_CONFIRM,
        confirmed: CONFIRMED
      },
      mounted: false,
      floatingButton: false,
      headers: [
        {
          align: 'left',
          value: 'plate',
          text: '车辆号牌'
        },
        // {text: '车主姓名', value: 'ownerName', align: 'right'},
        // {text: '联系方式', value: 'ownerTel', align: 'right', sortable: false},
        // {text: '登记类型', value: 'ownerGroup', align: 'right', sortable: false},
        {text: '违章类型', value: 'violationRuleName', align: 'right', sortable: false},
        {text: '违章区域', value: 'violationAreaName', align: 'right', sortable: false},
        {text: '上报时间', value: 'createTime', align: 'right'},
        {text: '', sortable: false, width: '100px'}
      ],
    }
  },
  computed: {
    eventStatus () {
      let status = ''
      if (this.role === 'trafficController') {
        status = 'readonly'
      }
      else if (this.role === 'alertCenterAdmin') {
        status = 'alarmConfirm'
      }
      else if (this.role === 'violationAdmin') {
        status = 'adminConfirm'
      }
      else {
        status = ''
      }
      return status
    },
    role () {
      return this.$store.state.userRole
    },
    errorStatus () {
      return !this.statusRouterNameMap.hasOwnProperty(this.eventStatus)
    },
    canSubmit () {
      let o = {
        'trafficController': true,
        'alertCenterAdmin': true,
        'violationAdmin': true
      }
      return this.role in o
    },
    canHandle () {
      return this.role !== 'trafficController'
    },
  },
  watch: {
    role () {
      if (this.$refs.lDataTable) {
        this.$refs.lDataTable.refreshData(true)
      }
    },
  },
  methods: {
    newEventSubmit () {
      this.goDetails('eventSubmit', {}, true)
    },
    goDetails (status, item = {}, force = false) {
      // console.log('click', i, this.mousemove)
      if (!this.statusRouterNameMap[status]) return
      let selectionString = document.getSelection().toString()
      if (!selectionString || force) {
        console.log(item.plate)
        this.go({
          name: this.statusRouterNameMap[status],
          params: {
            plate: item.plate || '',
            status: status,
            rawItem: item
          }
        })
      }
    },
    go (path) {
      if (path) {
        this.$router.push(path)
      }
    },
    async getEventList ({pagination, sortStack, filterItems, search = '', titleSwitch}) {
      // let INFINITFY_DATE = this.util.datetimeStrNow('date')
      // let UNINFINITY_DATE = '1970-01-01'
      let code = this.statusCodeMap[this.eventStatus]
      if (!this.statusCodeMap.hasOwnProperty(this.eventStatus)) return {items: [], amount: 0}
      let {events, amount} = await this.$store.dispatch('violationEvent/getViolationEvents', {
        self: !this.canHandle,
        pagination: pagination,
        locate: 'runtime',
        sortStack: sortStack,
        filter: {
          status: code,
          plate: search.trim() || '',
        }
      })
      return {items: events, amount: amount}
    }
  },
  mounted () {
    this.mounted = true
    setTimeout(() => {
      this.floatingButton = true
    }, 500)
  },
}
</script>
