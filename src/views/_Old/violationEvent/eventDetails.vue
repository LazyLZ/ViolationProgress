<template>
  <l-content-level2 :layout="['xs12', 'md10']">
    <template slot="toolbar-title">
      <div>查看违章详情
        <span :class="[violationEvent.plate? '':'grey--text', 'pl-4']">{{violationEvent.plate || '车辆号牌'}}</span>
        <span :class="[violationEvent.ownerName? '':'grey--text', 'pl-4']">{{violationEvent.ownerName || '车主姓名'}}</span>
        <span :class="[violationEvent.ownerTel? '':'grey--text', 'pl-4']">{{violationEvent.ownerTel || '联系方式'}}</span>
      </div>
    </template>
    <v-container fluid v-if="errorPage">
      <v-layout justify-center>
        <v-flex class="subheading text-xs-center">{{errorPageMessage}}</v-flex>
      </v-layout>
    </v-container>
    <template v-else>
      <v-container class="py-0" fluid>
        <v-subheader class="px-0" v-if="showHistory">违章历史记录</v-subheader>
        <l-data-table
          :auto-headers="5"
          :auto-title="5"
          :headers="historyHeaders"
          :init-pagination="{sortBy: 'createTime', descending: true, rowsPerPage: 5}"
          :items="historyList"
          :loading="historyLoading"
          auto-actions
          flat
          hide-refresh
          no-data-text="没有违章历史记录"
          v-if="showHistory"
        ></l-data-table>
        <v-layout>
          <v-flex class="text-xs-center">
            <v-btn @click="toggleHistory" color="primary" flat>{{(showHistory?'隐藏':'查看') + '违章历史记录'}}</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid>
        <violation-info :info-obj="violationEvent" open></violation-info>
      </v-container>
    </template>
  </l-content-level2>
</template>
<script>
import LContentLevel2 from '../../../components/LContentLevel2'
import ViolationInfo from './violationInfo'
import S from '@/utils/SpavaObj'
import LDataTable from '../../../components/LDataTable'
import _ from 'lodash'

let {Image, ViolationEvent} = S
let eventStatus = (v) => {
  switch (Number(v)) {
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
export default {
  name: 'eventDetails',
  components: {LDataTable, ViolationInfo, LContentLevel2},
  props: {
    plate: {},
    rawItem: {},
  },
  data: () => ({
    showHistory: false,
    errorPage: false,
    errorPageMessage: '',
    violationEvent: {},
    infoLoading: false,
    historyHeaders: [
      {text: '上报时间', value: 'createTime', align: 'left'},
      {text: '违章区域', value: 'violationAreaName', align: 'right', sortable: false},
      // {text: '违章大类', value: 'generalType', align: 'right', sortable: false},
      {text: '违章类型', value: 'violationRuleName', align: 'right', sortable: false},
      {text: '状态', value: 'status', align: 'right', f: eventStatus},
      // {text: '是否放行', value: 'status', align: 'right'},
      // {text: '通行详情', value: 'details', align: 'right'},
      // {text: '', value: 'none', sortable: false}
    ],
    historyAmount: 0,
    historyList: [],
    historyLoading: false,
    noVehicleInfo: false,
  }),
  watch: {
    'violationEvent.plate' (val, oldVal) {
      this.noVehicleInfo = false
      let p = this.$rules.reg.PLATE_PATTERN
      let v = this.violationEvent
      // console.log(val, p.test(val))
      if (!p.test(val)) {
        this.historyList = []
        this.historyAmount = 0
        v.ownerName = ''
        v.ownerTel = ''
        v.ownerGroup = ''
        v.ownerOrg = ''
        v.ownerType = ''
        v.beVisited = {}
        return
      }
      this.infoLoading = true
      this.refreshVehicleInfo_()
      this.getViolationHistory()
    },
    'violationEvent.vehicleImgs' (val) {
      // console.log('vehicleImgs chalge', val)
      for (let img of val) {
        // console.log('image status', img.status)
        if (img.status === 1) {
          this.getImg(img)
        }
      }
    }
  },
  methods: {
    toggleHistory () {
      this.showHistory = !this.showHistory
      if (this.showHistory) {
        this.getViolationHistory()
      }
    },
    refreshVehicleInfo_: _.debounce(function () {
      this.infoLoading = true
      let v = this.violationEvent
      this.$store.dispatch('vehicleCheck/getVehicleInfo', v.plate).then(res => {
        if (res) {
          v.ownerName = res.ownerName
          v.ownerTel = res.ownerTel
          v.ownerGroup = res.ownerGroup
          v.ownerOrg = res.ownerOrg
          v.ownerType = res.ownerType
          if (res.ownerType === 'visitor') {
            v.beVisited = res.beVisited
          }
          this.$forceUpdate()
        }
        else {
          this.noVehicleInfo = true
          // throw Error(`未查找到车主信息${this.newItem ? ', 请手动补全' : ''}`)
        }
      }).catch(e => {
        this.$store.commit('alertError', {title: '获取车辆信息时发生错误', message: e.message || e + ''})
      }).finally(() => {
        this.infoLoading = false
      })
    }, 300),
    async getViolationHistory () {
      if (!this.showHistory) return
      this.historyLoading = true
      if (this.violationEvent.plate) {
        try {
          let {events, amount} = await this.$store.dispatch('violationEvent/getViolationHistory', this.violationEvent.plate)

          let now = events.find(h => h.id === this.violationEvent.id)
          if (now) {
            this.historyHeaders[0].remark = {
              text: '本次违章',
              filter: (v) => {
                return v === now.createTime
              }
            }
            // let i = events.indexOf(now)
            // events.splice(i, 1)
            // amount--
          }
          // console.log(this.util.deepClone(events))
          events.forEach(h => {
            // let t = h.handlingResult.trafficController || {}
            // console.log(t, a)
            // h.createTime = t.time || '未知'
            h.createTime = h.trafficHandleTime || '未知'
          })
          this.historyList = events
          this.historyAmount = amount
          // console.log('get history', this.historyList, this.historyAmount)
        }
        catch (e) {
          this.$store.commit('alertError', {title: '获取违章历史时发生错误', message: e.message, raw: e})
        }
      }
      this.historyLoading = false
    },
    toErrorPage (msg) {
      this.errorPage = true
      this.errorPageMessage = msg
    },
    async getImg (img) {
      img.loading = true
      let path = img.url
      let suffix = path[0] === '/' ? path.slice(1) : path
      try {
        let data = await this.$store.dispatch('downloadFile', {url: `/passApi/${suffix}`})
        let reader = new FileReader()
        reader.onload = (e) => {
          this.$set(img, 'src', e.target.result)
          // console.log(img, e.target)
        }
        reader.readAsDataURL(data)
      }
      catch (e) {
        img.error = e.code + '  ' + e.message
      }
      img.loading = false
    },
    go (path) {
      if (path) {
        this.$router.push(path)
      }
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
  },
  created () {
    this.violationEvent = new ViolationEvent()

    if (this.rawItem instanceof Object) {
      let event = this.rawItem
      let v = this.violationEvent
      Object.assign(this.violationEvent, event)
      // let a = event.handlingResult.alarmCenter || {}
      // let t = event.handlingResult.trafficController || {}
      // if (t.pic instanceof Array) {
      v.vehicleImgs = v.vehicleImgs.map(p => new Image(p))
      // }

      // this.$store.dispatch('vehicleCheck/getVehicleInfo', v.plate).then(res => {
      //   if (!res) {
      //     throw Error('未查找到车主信息')
      //   }
      //   v.ownerName = res.ownerName
      //   v.ownerTel = res.ownerTel
      //   v.ownerGroup = res.ownerGroup
      //   v.ownerOrg = res.ownerOrg
      // }).catch(e => {
      //   this.$store.commit('alertError', {title: '获取车辆信息时发生错误', message: e.message || e + ''})
      // })

      console.log('get event details', this.violationEvent)
    }
    else {
      this.toErrorPage('车辆信息丢失，请返回重试')
    }
  }

}
</script>

<style scoped>

</style>
