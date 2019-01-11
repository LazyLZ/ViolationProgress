<template>
  <l-layout :layout="['xs12','lg10']">
    <vehicle-viewer :loading="vehicleLoading" :vehicle="event.vehicle" class="mb-4"
                    v-if="hasVehicleInfo"></vehicle-viewer>
    <v-card>
      <v-card-title style="height: 64px">
        <span class="title pl-2">违章事件上报</span>
        <span class="pl-4 grey--text">{{roleStrMap[$route.query.role]}}</span>
      </v-card-title>
      <v-card-text>
        <!--//{{test.name}}//-->
        <v-container class="pt-0" fluid grid-list-md>
          <v-subheader>违章基本信息</v-subheader>
          <v-form ref="event" v-model="valid">
            <v-layout class="mb-4" wrap>
              <v-flex sm6 xs12>
                <l-plate-picker
                  required="必须填写车辆号牌"
                  v-model="event.plate"
                ></l-plate-picker>
              </v-flex>
              <v-flex sm6 xs12>
                <v-select
                  :items="['清水河', '沙河']"
                  :rules="$rules.required('必须填写违章区域')"
                  item-text="name"
                  item-value="id"
                  label="违章区域"
                  prepend-icon="$vuetify.icons.location"
                  v-model="event[result].area"
                ></v-select>
              </v-flex>
              <v-flex key="rule" v-if="!isTrafficAdmin" xs12>
                <l-select-violation-rule
                  :items="ruleList"
                  :rules="$rules.required('必须选择违章类型')"
                  label="违章类型"
                  v-model="event[result].type"
                ></l-select-violation-rule>
              </v-flex>
              <!--文字信息描述-->
              <v-flex xs12>
                <v-textarea
                  :rules="$rules.required('必须填写文字描述')"
                  auto-grow
                  label="文字信息描述"
                  prepend-icon="$vuetify.icons.comment"
                  rows="1"
                  v-model="event[result].comment"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
          <v-subheader>违章取证</v-subheader>
          <v-layout wrap>
            <v-flex xs12>
              <template v-for="(img, i) in images">
                <l-image-view-dialog :key="i" :src="img.src">
                  <l-image-placeholder
                    :error="!!img.error"
                    :error-message="img.errorMessage"
                    :loading="!!img.loading"
                    :src="img.src"
                    slot="activator"
                    style="float:left;cursor: pointer"
                  >
                    <template slot="action">
                      <v-tooltip bottom>
                        <v-btn
                          @click="deleteImg(i)"
                          icon
                          slot="activator"
                        >
                          <v-icon>$vuetify.icons.delete</v-icon>
                        </v-btn>
                        <span>删除图像</span>
                      </v-tooltip>
                    </template>
                  </l-image-placeholder>
                </l-image-view-dialog>
              </template>
              <template v-if="images.length === 0">
                <l-image-placeholder></l-image-placeholder>
              </template>
            </v-flex>
            <v-flex xs12>
              <l-select-file
                @input="addFile(arguments[0],event.evidenceList)"
                file-type="image"
                title="添加图片"
              >
                <v-btn class="mx-0" color="primary" flat slot="activator">添加图片</v-btn>
              </l-select-file>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-layout class="mt-2 mb-5">
      <v-flex class="text-xs-right">
        <v-btn :loading="submitLoading" @click="submitEvent" color="primary">提交</v-btn>
      </v-flex>
    </v-layout>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import LPlatePicker from '../../../components/Inputs/LPlatePicker'
import {mapState} from 'vuex'
import LImagePlaceholder from '../../../components/Image/LImagePlaceholder'
import LSelectFile from '../../../components/Inputs/LSelectFile'
import VehicleViewer from '../../../components/vehicleViewer'
import LSelectViolationRule from '../../../components/Inputs/LSelectViolationRule'
import {Vehicle, ViolationRule, Evidence, LImage} from '../../../object'
import LImageViewDialog from '../../../components/Image/LImageViewDialog'

let imageCheckType = ['jpg', 'jpeg', 'png', 'gif']
let IMAGE_MAX_SIZE = 5 * 1000 * 1000
export default {
  name: 'ViolationEventSubmit',
  components: {
    LImageViewDialog,
    LSelectViolationRule,
    VehicleViewer,
    LSelectFile,
    LImagePlaceholder,
    LPlatePicker,
    LLayout
  },
  data: () => ({
    hasVehicleInfo: false,
    test: new ViolationRule({
      'id': 6,
      'name': '毒驾1',
      'serious': null,
      'code': '1-2-1'
    }),
    vehicleLoading: false,
    valid: false,
    event: null,
    submitLoading: false,
    result: '',
    roleStrMap: {
      TRAFFIC_ADMIN: '交通管理员',
      ALARM_ADMIN: '报警中心管理员',
      VIOLATION_ADMIN: '违章管理员'
    },
    eventResultMap: {
      TRAFFIC_ADMIN: 'trafficResult',
      ALARM_ADMIN: 'alarmResult',
      VIOLATION_ADMIN: 'adminResult'
    }
  }),
  computed: {
    isTrafficAdmin () {
      return this.$route.query.role === 'TRAFFIC_ADMIN'
    },
    ...mapState('violation', [
      'areaList',
      'ruleList'
    ]),
    images () {
      return this.event.evidenceList.map(e => e.type === Evidence.IMAGE && e.data)
    }
  },
  watch: {
    'event.plate' (val) {
      if (this.$rules.reg.PLATE_PATTERN.test(val)) {
        this.getVehicle()
      }
    },
    '$route' (to) {
      if (to.name === 'ViolationEventSubmit') {
        this.result = this.eventResultMap[this.$route.query.role]
      }
    }
  },
  methods: {
    deleteImg (i) {

    },
    async submitEvent () {
      try {
        this.submitLoading = true
        let res = await this.$store.dispatch('violation/submit', this.event)
        console.log('submited', res)
        this.$store.commit('closeTab', this.$route.fullPath)
        this.$router.push({
          name: 'ViolationEventManagement',
        })
      }
      catch (e) {
        this.$alert('error', {message: e.message})
      }
      finally {
        this.submitLoading = false
      }
    },
    async getVehicle () {
      try {
        this.vehicleLoading = true
        let v = await this.$store.dispatch('pass/getVehicle', {plate: this.event.plate})
        if (v) {
          this.event.vehicle = v
          this.hasVehicleInfo = true
        }
        else {
          this.hasVehicleInfo = false
          this.event.vehicle = new Vehicle({plate: this.event.plate})
        }
        // console.log('get v', v)
      }
      catch (e) {
        this.$alert('error', {message: e.message})
      }
      finally {
        this.vehicleLoading = false
      }
    },
    async addFile (file, target) {
      // file 实际上为fileList
      for (let f of file) {
        let checkType = imageCheckType
        let maxSize = IMAGE_MAX_SIZE
        // console.log('get file', f)
        let suffix = /\.([^.]*)$/i.exec(f.name)[1]
        if (checkType.indexOf(suffix) === -1) {
          this.$store.commit('alert', {
            type: 'error',
            title: '上传文件格式错误',
            message: `上传格式: ${suffix}, 支持的格式: ${checkType.join(',')}`
          })
          return
        }
        else if (f.size > maxSize) {
          this.$store.commit('alert', {
            type: 'error',
            title: '文件容量过大',
            message: `文件大小: ${Math.round(f.size / 1000)}KB, 最大限制: ${Math.round(maxSize / 1000)}KB`
          })
          return
        }
      }

      let temp = new LImage()
      temp.loading = true
      if (target instanceof Array) {
        target.push(new Evidence({type: Evidence.IMAGE, data: temp}))
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
          let res = await this.$store.dispatch('uploadFile', {file, url: '/violationApi/violation/file'})
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
  },
  created () {
    this.event = this.$store.getters['violation/getNewEvent']()
    this.result = this.eventResultMap[this.$route.query.role]
  },
  beforeRouteEnter (to, from, next) {
    if (to.query.role) {
      next()
    }
    else {
      next(false)
    }
  }
}
</script>

<style scoped>

</style>
