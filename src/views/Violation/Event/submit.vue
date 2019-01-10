<template>
  <l-layout :layout="['xs12','md10']">
    <vehicle-viewer class="mb-4" :vehicle="event.vehicle"></vehicle-viewer>
    <v-card>
      <v-card-title style="height: 64px">
        <span class="title pl-2">违章事件上报</span>
        <span class="pl-4 grey--text">{{roleStrMap[$route.query.role]}}</span>
      </v-card-title>
      <v-card-text>
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
                  :items="areaList"
                  :rules="$rules.required('必须填写违章区域')"
                  item-text="name"
                  item-value="id"
                  label="违章区域"
                  prepend-icon="$vuetify.icons.location"
                  v-model="event[result].area"
                ></v-select>
              </v-flex>
              <v-flex key="rule" xs12>
                <v-select
                  :items="ruleList"
                  :rules="$rules.required('必须选择违章类型')"
                  item-text="name"
                  item-value="id"
                  label="违章类型"
                  prepend-icon="$vuetify.icons.description"
                  return-object
                  v-model="event[result].type"
                ></v-select>
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
              <l-image-placeholder></l-image-placeholder>
            </v-flex>
            <v-flex xs12>
              <l-select-file>
                <v-btn color="primary" flat slot="activator">上传图片</v-btn>
              </l-select-file>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-layout class="mt-2 mb-5">
      <v-flex class="text-xs-right">
        <v-btn @click="submitEvent" color="primary">提交</v-btn>
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

export default {
  name: 'ViolationEventSubmit',
  components: {VehicleViewer, LSelectFile, LImagePlaceholder, LPlatePicker, LLayout},
  data: () => ({
    valid: false,
    event: null,
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
    ...mapState('violation', [
      'areaList',
      'ruleList'
    ]),
  },
  watch: {
    '$route' (to) {
      if (to.name === 'ViolationEventSubmit') {
        this.result = this.eventResultMap[this.$route.query.role]
      }
    }
  },
  methods: {
    submitEvent () {
      console.log('submit', this.event)
    }
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
