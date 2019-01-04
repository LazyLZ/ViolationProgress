<template>
  <l-content-level2 :layout="['xs12', 'md10']">
    <template slot="toolbar-title">
      <div>违章最终确认
        <span :class="[violationEvent.plate? '':'grey--text', 'pl-4']">{{violationEvent.plate || '车辆号牌'}}</span>
        <span :class="[violationEvent.ownerName? '':'grey--text', 'pl-4']">{{violationEvent.ownerName || '车主姓名'}}</span>
        <span :class="[violationEvent.ownerTel? '':'grey--text', 'pl-4']">{{violationEvent.ownerTel || '联系方式'}}</span>
      </div>
    </template>
    <v-container v-if="errorPage" fluid>
      <v-layout justify-center>
        <v-flex class="subheading text-xs-center">{{errorPageMessage}}</v-flex>
      </v-layout>
    </v-container>
    <template v-else>
      <v-container fluid class="py-0">
        <v-subheader class="px-0">违章历史记录</v-subheader>
        <l-data-table
          flat
          :loading="historyLoading"
          auto-actions
          hide-refresh
          :auto-headers="5"
          :auto-title="5"
          no-data-text="没有违章历史记录"
          :items="historyList"
          :init-pagination="{sortBy: 'createTime', descending: true, rowsPerPage: 5}"
          :headers="historyHeaders"
        ></l-data-table>
      </v-container>
      <v-container fluid>
        <violation-info :info-obj="violationEvent"></violation-info>
      </v-container>
      <v-container fluid grid-list-md class="pt-0">
        <v-form ref="violationForm">
          <v-subheader class="px-0">违章最终确认</v-subheader>
          <v-layout class="" row wrap>
            <v-flex key="rule" xs12>
              <v-layout raw align-center>
                <v-flex>
                  <select-violation-rule
                    :disabled="!isChangingType"
                    v-model="violationEvent.violationRuleVA"
                    :rules="isCancel ? [] : $rules.required('必须选择违章类型')"
                    return-id
                  ></select-violation-rule>
                </v-flex>
                <v-btn
                  :disabled="hadSubmit"
                  v-if="!isChangingType"
                  small
                  flat
                  class="mx-0"
                  color="primary"
                  @click="isChangingType = !isChangingType"
                >
                  修改
                </v-btn>
              </v-layout>

            </v-flex>
            <v-flex v-if="isChangingType" class="text-xs-right" xs12>
              <v-btn
                flat
                small
                color="grey"
                @click="isChangingType = false,violationEvent.violationRuleVA = violationEvent.violationRuleId "
              >
                取消
              </v-btn>
              <v-btn
                small
                flat
                class="mx-0"
                color="primary"
                @click="isChangingType = false"
              >
                确认
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout class="pb-4" wrap>
            <v-flex xs12>
              <v-textarea
                :disabled="hadSubmit"
                prepend-icon="comment"
                label="违章管理员附言"
                rows="1"
                hint="撤销违章时必填"
                :rules="isCancel?$rules.required('必须填写取消原因'):[]"
                auto-grow
                persistent-hint
                v-model="violationEvent.violationAdminComment"
              ></v-textarea>
            </v-flex>
          </v-layout>

          <v-subheader class="px-0">发送消息预览
            <v-btn
              class="ml-2"
              flat
              small
              color="primary"
              @click="predictMessage(false)"
              :loading="predictLoading"
              :disabled="hadSubmit"
            >
              刷新
            </v-btn>
          </v-subheader>
          <v-layout v-if="!msgError" class="" row wrap>
            <v-flex class="pb-4" :key="i" v-for="(m, i) in messages" xs12>
              <v-subheader>{{m.label}}</v-subheader>
              <div class="px-5">
                {{m.text}}
              </div>
            </v-flex>
            <v-flex v-if="messages.length === 0" class="pb-4" xs12>
              <div class="px-4 grey--text">
                {{'不发送消息'}}
              </div>
            </v-flex>
          </v-layout>
          <v-layout v-else>
            <v-flex class="pb-4" xs12>
              <div class="px-4 error--text">
                {{msgErrorMessage ? '未获取到消息模板: ' + msgErrorMessage : '未获取到消息模板'}}
              </div>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
      <v-container class="px-4 pt-0 pb-5" fluid>
        <v-layout class="" wrap>
          <v-flex xs12>
            <v-tooltip bottom :disabled="!msgError">
              <v-btn
                :disabled="hadSubmit"
                slot="activator"
                class="ml-0 mr-2"
                :color="messages.length === 0 ?'error':'primary'"
                :loading="submitLoading && !isCancel"
                @click="confirmDialog = {activate: true, operation: true,}"
              >
                {{msgError? '确认违章':'确认发送'}}
              </v-btn>
              <span>未获取到发送消息模板，违章车主将无法收到消息</span>
            </v-tooltip>

            <v-btn
              :disabled="hadSubmit"
              :color="'error'"
              :loading="submitLoading && isCancel"
              @click="confirmDialog = {activate: true, operation: false}"
            >
              撤销违章
            </v-btn>
            <!--<v-btn @click="successDialog.activate = true, hadSubmit = true">test</v-btn>-->
          </v-flex>
        </v-layout>
      </v-container>
    </template>
    <template slot="dialogs">
      <v-dialog v-model="successDialog.activate" scrollable persistent max-width="800px">
        <view-message-dialog
          title="处理成功"
          :messages="messages"
          :loading="predictLoading"
          :error="msgError"
          :error-message="msgErrorMessage"
          @cancel="successDialog.activate = false"
          @confirm="returnToList()"
        ></view-message-dialog>
        <!--<v-card flat>-->
          <!--<v-card-title style="height: 64px;">-->
            <!--<span class="title">处理成功</span>-->
          <!--</v-card-title>-->
          <!--<v-divider></v-divider>-->
          <!--<v-card-text style="min-height: 300px; max-height: 600px">-->
            <!--<v-container fluid class="pt-0">-->
              <!--<v-layout>-->
                <!--<v-flex v-if="predictLoading" justify-center layout>-->
                  <!--<v-progress-circular-->
                    <!--:size="50"-->
                    <!--:width="3"-->
                    <!--color="primary"-->
                    <!--indeterminate-->
                  <!--&gt;</v-progress-circular>-->
                <!--</v-flex>-->
                <!--<v-flex v-else>-->
                  <!--<v-subheader class="px-0 pt-0">以下为真实发送消息</v-subheader>-->
                  <!--<v-layout v-if="!msgError" class="" row wrap>-->
                    <!--<v-flex class="pb-4" :key="i" v-for="(m, i) in messages" xs12>-->
                      <!--<v-subheader>{{m.label}}</v-subheader>-->
                      <!--<div class="px-5 subheading">-->
                        <!--{{m.text}}-->
                      <!--</div>-->
                    <!--</v-flex>-->
                    <!--<v-flex v-if="messages.length === 0" class="pb-4" xs12>-->
                      <!--<div class="px-4 grey&#45;&#45;text subheading">-->
                        <!--{{'未发送消息'}}-->
                      <!--</div>-->
                    <!--</v-flex>-->
                  <!--</v-layout>-->
                  <!--<v-layout v-else>-->
                    <!--<v-flex class="pb-4" xs12>-->
                      <!--<div class="px-4 error&#45;&#45;text">-->
                        <!--{{msgErrorMessage ? '未获取到消息模板: ' + msgErrorMessage : '未获取到消息模板'}}-->
                      <!--</div>-->
                    <!--</v-flex>-->
                  <!--</v-layout>-->
                <!--</v-flex>-->
              <!--</v-layout>-->
            <!--</v-container>-->
          <!--</v-card-text>-->
          <!--<v-divider></v-divider>-->
          <!--<v-card-actions>-->
            <!--<v-spacer></v-spacer>-->
            <!--<v-btn large flat color="grey" @click="successDialog.activate = false">留在此页</v-btn>-->
            <!--<v-btn-->
              <!--large-->
              <!--flat-->
              <!--color="primary"-->
              <!--@click="returnToList()"-->
            <!--&gt;-->
              <!--返回到列表-->
            <!--</v-btn>-->
          <!--</v-card-actions>-->
        <!--</v-card>-->
      </v-dialog>
      <confirm-operation-dialog
        v-model="confirmDialog.activate"
        @cancel="confirmDialog.activate = false"
        @confirm="submitViolationConfirm(confirmDialog.operation)"
      >
        <v-layout column justify-center align-center>
          <div v-if="confirmDialog.operation" class="subheading py-1">确认该违章并发送短信？</div>
          <div v-else class="subheading py-1">确认撤销该违章？</div>
          <div v-if="msgError && confirmDialog.operation" class="py-1 error--text caption">未获取到发送消息模板，违章车主将无法收到消息</div>
        </v-layout>
      </confirm-operation-dialog>
    </template>
  </l-content-level2>
</template>
<script>
import LContentLevel2 from '../../../components/LContentLevel2'
import ViolationInfo from './violationInfo'
import S from '@/utils/SpavaObj'
import LDataTable from '../../../components/LDataTable'
import _ from 'lodash'
import SelectViolationRule from '../../../components/exclusiveSelects/selectViolationRule'
import {logger} from '../../../utils/logger'
import ConfirmOperationDialog from '../../../components/confirmOperationDialog'
import ViewMessageDialog from './viewMessageDialog'

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
  name: 'eventHandleAdmin',
  components: {ViewMessageDialog, ConfirmOperationDialog, SelectViolationRule, LDataTable, ViolationInfo, LContentLevel2},
  props: {
    plate: {},
    rawItem: {},
  },
  data: () => ({
    hadSubmit: false,
    confirmDialog: {
      activate: false,
      operation: undefined,
    },
    successDialog: {
      activate: false,
      messages: []
    },
    predictLoading: false,
    submitLoading: false,
    isChangingType: false,
    msgErrorMessage: '',
    msgError: false,
    messages: [],
    operation: '',
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
  computed: {
    isCancel () {
      return this.operation === 'cancel'
    }
  },
  watch: {
    'violationEvent.violationRule' () {
      console.log('rule change', this.violationEvent.violationRule)
      // if (this.canEditViolation) {
      this.predictMessage(false)
      // }
    },
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
    async violationChangeSilent () {
      let v = this.violationEvent
      // console.log(v)

      let extraVa = !this.violationCancel || this.violationEvent.violationAdminComment
      // console.log(this.violationFormValid && extraVa)
      if (this.$refs.violationForm.validate() && extraVa) {
        let data = {
          violationId: v.id,
          ruleId: v.violationRuleVA,
          comment: v.violationAdminComment,
          fileList: []
        }
        let res = await this.$store.dispatch('violationEvent/violationChangeInfo', data)
        console.log('violiaton Chanage success', res)
      }
    },
    async submitViolationConfirm (opt) {
      if (this.isChangingType) {
        this.$store.commit('alertError', {
          title: '请先确认或取消违章信息修改'
        })
        return
      }
      this.operation = opt ? 'confirm' : 'cancel'
      this.submitLoading = true
      let v = this.violationEvent

      let extraVa = !this.isCancel || this.violationEvent.violationAdminComment
      if (this.$refs.violationForm.validate() && extraVa) {
        let id = v.id
        try {
          await this.violationChangeSilent()
          if (this.isCancel) {
            await this.$store.dispatch('violationEvent/violationAdminCancel', id)
            this.$store.commit('toggleSnackbar', {message: '撤销成功'})
            this.goBack()
          }
          else {
            if (!this.msgError) {
              await this.predictMessage(true)
            }
            await this.$store.dispatch('violationEvent/violationAdminConfirm', id)
            // this.$store.commit('toggleSnackbar', {message: '处理成功'})
            // this.goBack()
            this.confirmDialog.activate = false
            this.successDialog.activate = true
          }
          // this.goBack()
          this.hadSubmit = true
        }
        catch (e) {
          console.log('send message failed when confirm', e)
          this.$store.commit('alertError', {title: `${opt ? '确认' : '撤销'}违章时发生错误`, message: e.message || e + ''})
        }
        // this.confirmSendDialog.activate = false
      }
      this.submitLoading = false
      this.confirmDialog.activate = false
    },
    async predictMessage (send = false) {
      this.predictLoading = true
      let data = {
        id: this.violationEvent.id,
        plate: this.violationEvent.plate,
        violationRuleId: this.violationEvent.violationRuleId,
        send: send,
      }
      console.log('predict data', data, send)
      if (data.plate && data.violationRuleId) {
        try {
          let res = await this.$store.dispatch('violationEvent/getPredictMessage', data)
          if (res.hasOwnProperty('personLiable')) {
            this.msgError = false
            this.msgErrorMessage = ''
            let l = res.hasOwnProperty('order') ? '受访人' : ''
            let m = res.personLiable
            this.messages = [
              {
                label: m.pipe === 'wechat' ? l + '微信消息' : l + '短信消息',
                text: m.data.realMsg
              }
            ]
            if (res.hasOwnProperty('order')) {
              let m = res.order
              this.messages.push(
                {
                  label: m.pipe === 'wechat' ? '来访人微信消息' : '来访人短信消息',
                  text: m.data.realMsg
                }
              )
            }
          }
          else {
            this.msgError = true
            this.msgErrorMessage = res.msg
            this.messages = []
          }
          console.log('get predict message', res)
        }
        catch (e) {
          this.msgError = true
          this.msgErrorMessage = e.message || e + ''
          this.messages = []
          // this.$store.commit('alertError', {title: '获取预发送短信时发生错误', message: e.message || e + ''})
          logger.error('predictMessage()', e)
          // if (throwError) throw e
        }
      }
      this.predictLoading = false
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
          }
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

        // console.log('get Img success', src)
      }
      catch (e) {
        img.error = e.code + '  ' + e.message
      }
      img.loading = false
    },
    returnToList () {
      // this.$store.commit('toggleSnackbar', {message: `${this.isCancel ? '撤销' : '处理'}成功`})
      this.successDialog.activate = false
      this.goBack()
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
      //   v.vehicleImgs = t.pic.map(p => new Image(p))
      // }
      v.vehicleImgs = v.vehicleImgs.map(p => new Image(p))
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
