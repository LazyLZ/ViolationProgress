<template>
  <l-content-level2 :layout="['xs12', 'md10']">
    <template slot="toolbar-title">
      <div>{{hadSubmit?'查看违章事件':'上报违章事件'}}
        <span :class="[violationEvent.plate? '':'grey--text', 'pl-4']">{{violationEvent.plate || '车辆号牌'}}</span>
        <span :class="[violationEvent.ownerName? '':'grey--text', 'pl-4']">{{violationEvent.ownerName || '车主姓名'}}</span>
        <span :class="[violationEvent.ownerTel? '':'grey--text', 'pl-4']">{{violationEvent.ownerTel || '联系方式'}}</span>
      </div>
    </template>
    <v-container class="py-0" fluid v-if="errorStatus">
      <v-layout class="py-5" column justify-center>
        <p class="text-xs-center subheading">您没有权限查看此页面</p>
        <p class="text-xs-center caption">如果您是多角色用户，请将角色切换为
          <span class="primary--text">违章管理员</span>、
          <span class="primary--text">报警中心管理员</span> 或
          <span class="primary--text">交通管理员</span>
        </p>
      </v-layout>
    </v-container>
    <template v-else>
      <!--历史违章记录-->
      <v-container class="py-0" fluid>
        <v-subheader class="px-0">违章历史记录</v-subheader>
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
        ></l-data-table>
      </v-container>

      <!--上报违章信息-->
      <v-container class="pb-4 pt-0" fluid grid-list-md>
        <v-subheader class="px-0">违章基本信息</v-subheader>
        <v-form class="pb-4" ref="eventInfoForm">
          <v-layout class="pb-3" wrap>
            <v-flex sm6 xs12>
              <l-plate-input
                :disabled="hadSubmit"
                required="必须填写车牌号"
                v-model="violationEvent.plate"
              ></l-plate-input>
            </v-flex>
            <v-flex sm6 xs12>
              <select-violation-area
                :disabled="hadSubmit"
                :rules="$rules.required('必须填写违章区域')"
                return-name
                v-model="violationEvent.violationAreaName"
              ></select-violation-area>
            </v-flex>
            <v-flex key="rule" v-if="isFirstConfirm || isFinalConfirm" xs12>
              <select-violation-rule
                :disabled="hadSubmit"
                :rules="$rules.required('必须选择违章类型')"
                return-id
                v-model="violationEvent.violationRule"
              ></select-violation-rule>
            </v-flex>
            <!--文字信息描述-->
            <v-flex xs12>
              <v-textarea
                :disabled="hadSubmit"
                :rules="$rules.required('必须填写文字描述')"
                auto-grow
                label="文字信息描述"
                prepend-icon="comment"
                rows="1"
                v-model="violationEvent.textDetails"
              ></v-textarea>
            </v-flex>
            <!--&lt;!&ndash;语音信息描述&ndash;&gt;-->
            <!--<v-flex xs12 layout align-center>-->
            <!--<span class="subheading px-2">语音信息描述</span>-->
            <!--<template-->
            <!--v-for="(v,i) in violationEvent.voiceDetails"-->
            <!--&gt;-->
            <!--<v-btn :key="i" icon>-->
            <!--<v-icon>volume_up</v-icon>-->
            <!--</v-btn>-->
            <!--</template>-->
            <!--<v-btn icon v-if="canEditTraffic">-->
            <!--<v-icon>add</v-icon>-->
            <!--</v-btn>-->
            <!--<span class="grey&#45;&#45;text body-2 pl-2">没有语音描述</span>-->
            <!--</v-flex>-->
          </v-layout>
          <v-subheader class="px-0">车辆详细信息</v-subheader>
          <v-layout row v-if="correctPlate && !noVehicleInfo && !infoLoading" wrap>
            <v-flex sm6 xs12>
              <v-text-field
                disabled
                label="车主姓名"
                placeholder="未知"
                prepend-icon="person"
                readonly
                v-model="violationEvent.ownerName"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                disabled
                label="登记类型"
                placeholder="未知"
                prepend-icon="group"
                readonly
                v-model="violationEvent.ownerGroup"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                disabled
                label="电话号码"
                placeholder="未知"
                prepend-icon="phone"
                readonly
                v-model="violationEvent.ownerTel"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                disabled
                label="所在单位"
                placeholder="未知"
                prepend-icon="account_balance"
                readonly
                v-model="violationEvent.ownerOrg"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout class="mb-4" v-else>
            <v-flex class="text-xs-center">
              <div v-if="infoLoading">正在搜索...</div>
              <div class="grey--text" v-else-if="noVehicleInfo">未查找到车主信息</div>
              <div class="grey--text" v-else>请先输入车辆号牌</div>
            </v-flex>
          </v-layout>
          <!--违章取证-->
          <v-subheader class="px-0">违章取证图片</v-subheader>
          <v-layout class="" wrap>
            <v-flex>
              <template v-for="(img, i) in violationEvent.vehicleImgs">
                <l-image-view-dialog :key="i" :src="img.src">
                  <l-image-placeholder
                    :error="!!img.error"
                    :error-message="img.error"
                    :loading="!!img.loading"
                    :src="img.src"
                    slot="activator"
                    style="float:left;cursor: pointer"
                  >
                    <template slot="action">
                      <v-tooltip :disabled="hadSubmit" bottom>
                        <v-btn
                          :disabled="hadSubmit"
                          @click="deleteImg(i)"
                          icon
                          slot="activator"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                        <span>删除图像</span>
                      </v-tooltip>
                    </template>
                  </l-image-placeholder>
                </l-image-view-dialog>
              </template>
              <template v-if="violationEvent.vehicleImgs.length === 0">
                <l-image-placeholder></l-image-placeholder>
              </template>
            </v-flex>
          </v-layout>
          <v-layout class="pb-3" wrap>
            <v-flex>
              <span class="pl-2 error--text caption" v-if="imgError">必须上传至少两张图片 (车牌取证，违章取证)。</span>
            </v-flex>
            <v-flex v-if="!hadSubmit" xs12>
              <l-select-file
                @input="addFile(arguments[0], violationEvent.vehicleImgs)"
                file-type="image"
                title="添加图片"
              >
                <v-btn class="mx-0" color="primary" flat slot="activator">添加图片</v-btn>
              </l-select-file>
            </v-flex>
          </v-layout>

          <v-layout class="pb-3" wrap>
            <v-flex class="mt-3 mb-4 mx-0" xs12>
              <v-btn
                :disabled="hadSubmit"
                :loading="submitLoading"
                @click="submitEvent"
                color="primary"
              >{{isFinalConfirm? '确认违章': '确认上报'}}
              </v-btn>
              <span class="px-4 grey--text" v-if="isFinalConfirm && !hadSubmit">您提交的违章将直接确认并给车主发送消息！</span>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </template>
    <template slot="dialogs">
      <v-dialog max-width="800px" persistent scrollable v-model="successDialog.activate">
        <view-message-dialog
          :error="msgError"
          :error-message="msgErrorMessage"
          :loading="predictLoading"
          :messages="messages"
          @cancel="successDialog.activate = false"
          @confirm="returnToList()"
          title="处理成功"
        ></view-message-dialog>
      </v-dialog>
    </template>
  </l-content-level2>
</template>

<script>
import LContentLevel2 from '../../../components/LContentLevel2'
import S from '@/utils/SpavaObj'
import LDataTable from '../../../components/LDataTable'
import LPlateInput from '../../../components/l-plate-input'
import SelectViolationArea from '../../../components/exclusiveSelects/selectViolationArea'
import LImagePlaceholder from '../../../components/LImagePlaceholder'
import LImageViewDialog from '../../../components/LImageViewDialog'
import LSelectFile from '../../../components/LSelectFile'
import _ from 'lodash'
import SelectViolationRule from '../../../components/exclusiveSelects/selectViolationRule'
import ViewMessageDialog from './viewMessageDialog'
import {logger} from '../../../utils/logger'

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
let {Image, ViolationEvent} = S
let imageCheckType = ['jpg', 'jpeg', 'png', 'gif']
let IMAGE_MAX_SIZE = 5 * 1000 * 1000
export default {
  name: 'eventSubmit',
  components: {
    ViewMessageDialog,
    SelectViolationRule,
    LSelectFile,
    LImageViewDialog,
    LImagePlaceholder,
    SelectViolationArea,
    LPlateInput,
    LDataTable,
    LContentLevel2
  },
  data: () => ({
    hadSubmit: false,
    successDialog: {
      activate: false,
      messages: []
    },
    predictLoading: false,
    isChangingType: false,
    msgErrorMessage: '',
    msgError: false,
    messages: [],
    roleMap: {
      'trafficController': true,
      'violationAdmin': true,
      'alertCenterAdmin': true
    },
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
    submitLoading: false,
  }),
  computed: {
    errorStatus () {
      return !(this.role in this.roleMap)
    },
    role () {
      return this.$store.state.userRole
    },
    isFirstConfirm () {
      return this.role === 'alertCenterAdmin'
    },
    isFinalConfirm () {
      return this.role === 'violationAdmin'
    },
    correctPlate () {
      let plate = this.violationEvent.plate || ''
      return this.$rules.reg.PLATE_PATTERN.test(plate)
    },
    imgError () {
      return this.violationEvent.vehicleImgs.length < 2
    }
  },
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
    async predictMessage (v = {}, send = false) {
      this.predictLoading = true
      let data = {
        id: v.id || '',
        plate: v.plate || '',
        violationRuleId: v.violationRuleId || '',
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
    deleteImg (i) {
      this.violationEvent.vehicleImgs.splice(i, 1)
    },
    async submitEvent () {
      this.submitLoading = true
      let v = this.violationEvent
      // console.log(v)
      let errorImgs = []
      v.vehicleImgs.forEach((img, index) => {
        if (img.status !== 2) {
          errorImgs.push(index)
        }
      })
      errorImgs.reverse()
      errorImgs.forEach(i => {
        v.vehicleImgs.splice(i, 1)
      })

      if (this.$refs.eventInfoForm.validate() && !this.imgError) {
        // let data = {
        //   objectCode: v.plate,
        //   // ruleId: '',
        //   area: v.violationAreaName,
        //   comment: v.textDetails,
        //   // time: this.util.datetimeStrNow(),
        //   fileList: []
        // }
        // for (let img of this.violationEvent.vehicleImgs) {
        //   data.fileList.push({
        //     'type': 'pic',
        //     'path': img.url
        //   })
        // }
        try {
          let rv = await this.$store.dispatch('violationEvent/submitEvent', {violationEvent: v, type: this.role})
          if (this.isFinalConfirm) {
            if (rv instanceof Object && rv.id) {
              await this.predictMessage(rv, true)
            }
            this.successDialog.activate = true
          }
          else {
            this.$store.commit('toggleSnackbar', {message: '上报成功'})
            this.goBack()
          }
          this.hadSubmit = true
        }
        catch (e) {
          this.$store.commit('alertError', {title: '提交时发生错误', message: e.message, raw: e})
        }
      }
      else {
        if (!this.imgError) {
          this.offsetTop = 0
        }
      }
      this.submitLoading = false
    },
    async getViolationHistory () {
      this.historyLoading = true
      if (this.violationEvent.plate) {
        try {
          let {events, amount} = await this.$store.dispatch('violationEvent/getViolationHistory', this.violationEvent.plate)
          console.log('测试违章历史', events, amount)
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
    refreshVehicleInfo_: _.debounce(function () {
      this.infoLoading = true
      let v = this.violationEvent
      // console.log('get info', v.plate)
      this.$store.dispatch('vehicleCheck/getVehicleInfo', v.plate).then(res => {
        // console.log('get info success', res)
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
    async addFile (file, target) {
      // file 实际上为fileList
      for (let f of file) {
        let checkType = imageCheckType
        let maxSize = IMAGE_MAX_SIZE
        // console.log('get file', f)
        let suffix = /\.([^.]*)$/i.exec(f.name)[1]
        if (checkType.indexOf(suffix) === -1) {
          this.$store.commit('alertError', {
            title: '上传文件格式错误',
            message: `上传格式: ${suffix}, 支持的格式: ${checkType.join(',')}`
          })
          return
        }
        else if (f.size > maxSize) {
          this.$store.commit('alertError', {
            title: '文件容量过大',
            message: `文件大小: ${Math.round(f.size / 1000)}KB, 最大限制: ${Math.round(maxSize / 1000)}KB`
          })
          return
        }
      }

      let temp = new Image()
      temp.loading = true
      if (target instanceof Array) {
        target.push(temp)
      }
      else {
        target = temp
      }

      let img = await this.uploadFile(file)

      if (target instanceof Array) {
        this.$set(target, target.length - 1, img)
      }
      else {
        target = img
      }
    },
    async uploadFile (files) {
      if (files instanceof Object && files.length > 0) {
        let file = files[0]
        let img = new Image()
        try {
          let res = await this.$store.dispatch('violationEvent/uploadViolationFile', file)
          img.url = res
        }
        catch (e) {
          img.error = e.message ? e.message : e + ''
        }
        return img
      }
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
  }
}
</script>

<style scoped>

</style>
