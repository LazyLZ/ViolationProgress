<template>
  <l-layout :layout="['xs12', 'md10']" bottom-space>
    <vehicle-viewer :vehicle="event.vehicle" class="mb-3"></vehicle-viewer>
    <v-card class="mb-3">
      <v-card-title style="height: 64px;">
        <span class="title">违章信息</span>
      </v-card-title>
      <v-card-text>
        <v-container class="pt-0" fluid grid-list-md>
          <v-subheader>违章基本信息</v-subheader>
          <v-layout class="mb-4" wrap>
            <v-flex sm6 xs12>
              <v-text-field
                disabled
                placeholder="N/A"
                prepend-icon="$vuetify.icons.car"
                v-model="event.plate"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                disabled
                label="违章区域"
                placeholder="N/A"
                prepend-icon="$vuetify.icons.location"
                v-model="event.area"
              ></v-text-field>
            </v-flex>
            <v-flex key="rule" xs12>
              <l-select-violation-rule
                :items="ruleList"
                disabled
                label="违章类型"
                leaf-placeholder="N/A"
                root-placeholder="N/A"
                v-model="event.type"
              ></l-select-violation-rule>
            </v-flex>
            <!--文字信息描述-->
            <v-flex xs12>
              <v-textarea
                auto-grow
                disabled
                label="文字信息描述"
                placeholder="可选，撤销时必填"
                prepend-icon="$vuetify.icons.comment"
                rows="1"
                v-model="event.description"
              ></v-textarea>
            </v-flex>
          </v-layout>

          <v-subheader>违章取证</v-subheader>
          <v-layout wrap>
            <v-flex xs12>
              <l-image-view-dialog :key="i" v-for="(image, i) in images">
                <l-image-placeholder :src="image.data" slot="activator"></l-image-placeholder>
              </l-image-view-dialog>
              <l-image-placeholder v-if="images.length === 0"></l-image-placeholder>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card class="mb-3">
      <v-card-title style="height: 64px;">
        <span class="title">违章处理</span>
      </v-card-title>
      <v-card-text>
        <v-container class="pt-0" fluid grid-list-md>
          <v-subheader>短信预览</v-subheader>
          <v-layout class="mb-4">
            <v-flex class="grey--text" v-if="!message || (message && !message.text)">
              未获取到违章短信
            </v-flex>
            <v-flex v-else>
              {{message.text}}
            </v-flex>
          </v-layout>
          <v-subheader>修改规则
            <v-btn @click="isEditRule = true" color="primary" flat small>修改</v-btn>
          </v-subheader>
          <v-layout wrap>
            <v-flex xs12>
              <l-select-violation-rule
                :disabled="!isEditRule"
              ></l-select-violation-rule>
            </v-flex>
            <v-flex v-if="isEditRule" xs12>
              <v-btn @click="changeRule()" color="primary" flat small>确认</v-btn>
              <v-btn @click="resetRule()" color="grey" flat small>取消</v-btn>
            </v-flex>
          </v-layout>
          <v-subheader>附言</v-subheader>
          <v-layout>
            <v-flex xs12>
              <v-textarea
                auto-grow
                label="文字信息描述"
                placeholder="可选，撤销时必填"
                prepend-icon="$vuetify.icons.comment"
                rows="1"
              ></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-layout>
      <v-flex class="text-xs-right">
        <v-btn :loading="cancelLoading" @click="confirmOperation" color="error">撤销违章</v-btn>
        <v-btn :loading="confirmLoading"  @click="confirmEvent" class="mx-0" color="primary">确认违章</v-btn>
      </v-flex>
    </v-layout>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import VehicleViewer from '../../../components/vehicleViewer'
import {mapState} from 'vuex'
import {Evidence} from '../../../object'
import LSelectViolationRule from '../../../components/Inputs/LSelectViolationRule'
import LImagePlaceholder from '../../../components/Image/LImagePlaceholder'
import LImageViewDialog from '../../../components/Image/LImageViewDialog'

export default {
  props: {
    event: {type: Object}
  },
  name: 'finalHandleContent',
  components: {LImageViewDialog, LImagePlaceholder, LSelectViolationRule, VehicleViewer, LLayout},
  data: () => ({
    isEditRule: false,
    vehicleLoading: false,
    hasVehicleInfo: false,
    message: {text: '您的车辆在清水河校区有一条违章'},
    confirmLoading: false,
    cancelLoading: false,
  }),
  computed: {
    ...mapState('violation', [
      'areaList',
      'ruleList'
    ]),
    images () {
      return this.event.evidenceList.map(e => e.type === Evidence.IMAGE && e.data)
    }
  },
  watch: {
    'event.vehicle' () {
      // this.getVehicle()
    }
  },
  methods: {
    async confirmOperation () {
      this.$store.dispatch('confirm', {
        title: `确认撤销该违章？`,
        text: `${this.event.plate}`,
        onConfirm: resolve => {
          // console.log('delete success')
          this.cancelEvent().then(res => {
            this.$store.dispatch('alert', {type: 'success', message: '撤销成功'})
          }).catch(e => {
            this.$store.dispatch('alert', {type: 'error', message: e.message})
          }).finally(() => {
            resolve()
          })
        }
      })
    },
    async cancelEvent () {
      try {
        this.cancelLoading = true
        await this.$store.dispatch('violation/cancel', this.event)
      }
      catch (e) {
        this.$alert('error', {message: e.message})
      }
      finally {
        this.cancelLoading = false
      }
    },
    async confirmEvent () {
      try {
        this.confirmLoading = true
        await this.$store.dispatch('violation/finalConfirm', this.event)
      }
      catch (e) {
        throw e
      }
      finally {
        this.confirmLoading = false
      }
    },
    async changeRule () {
      this.isEditRule = false
    },
    resetRule () {
      this.isEditRule = false
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
          this.event.resetVehicle()
        }

        console.log('get v', v)
      }
      catch (e) {
        this.$alert('error', {message: e.message})
      }
      finally {
        this.vehicleLoading = false
      }
    }
  },
  created () {
    this.getVehicle()
  }
}
</script>

<style scoped>

</style>
