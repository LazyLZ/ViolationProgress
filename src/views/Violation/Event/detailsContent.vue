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
  name: 'detailsContent',
  components: {LImageViewDialog, LImagePlaceholder, LSelectViolationRule, VehicleViewer, LLayout},
  data: () => ({
    vehicleLoading: false,
    hasVehicleInfo: false,
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
