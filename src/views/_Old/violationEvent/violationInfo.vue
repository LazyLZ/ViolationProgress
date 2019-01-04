<template>
  <div>
    <!--<v-card>-->
    <v-subheader class="px-0">违章详细信息</v-subheader>
    <v-layout key="info1" row wrap>
      <v-flex xs12>
        <v-container grid-list-md>
          <v-layout row wrap xs8>
            <v-flex class="grey--text" xs4 md2>
              车辆号牌：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.plate}}
            </v-flex>
            <v-flex class="grey--text" xs4 md2>
              车主姓名：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.ownerName}}
            </v-flex>
            <v-flex class="grey--text" xs4 md2>
              登记类型：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.ownerGroup}}
            </v-flex>
            <v-flex class="grey--text" xs4 md2>
              联系方式：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.ownerTel}}
            </v-flex>
            <v-flex class="grey--text" xs4 md2>
              用户单位：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.ownerOrg}}
            </v-flex>
            <v-flex class="grey--text" xs4 md2>
              违章区域：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.violationAreaName}}
            </v-flex>
            <!--<v-flex class="grey&#45;&#45;text" xs4 md2>-->
            <!--违章大类：-->
            <!--</v-flex>-->
            <!--<v-flex xs8 md4>-->
            <!--{{infoObj.violationRule.name}}-->
            <!--</v-flex>-->
            <v-flex class="grey--text" xs4 md2>
              违章类型：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.violationRuleName}}
            </v-flex>
            <v-flex class="grey--text text-truncate" xs4 md2>
              违章上报时间：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.trafficHandleTime}}
            </v-flex>
            <v-flex class="grey--text text-truncate" xs4 md2>
              初步处理时间：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.alertHandleTime}}
            </v-flex>
            <v-flex class="grey--text text-truncate" xs4 md2>
              最终处理时间：
            </v-flex>
            <v-flex xs8 md4>
              {{infoObj.adminHandleTime}}
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <l-expand-transition-group>
      <v-container v-if="expand" key="info2" grid-list-md class="py-0">
        <v-layout row wrap>
          <v-flex class="grey--text text-truncate" xs3 md2>
            交通管理员描述：
          </v-flex>
          <v-flex xs9 md10>
            {{infoObj.textDetails}}
          </v-flex>
          <v-flex class="grey--text text-truncate" xs3 md2>
            交通管理员语音：
          </v-flex>
          <v-flex xs9 md10>
            <!--<v-icon>volume_up</v-icon>-->
          </v-flex>
          <v-flex class="grey--text text-truncate" xs3 md2>
            报警中心附言：
          </v-flex>
          <v-flex xs9 md10>
            {{infoObj.alertCenterComment}}
          </v-flex>
          <v-flex class="grey--text text-truncate" xs3 md2>
            违章管理员附言：
          </v-flex>
          <v-flex xs9 md10>
            {{infoObj.violationAdminComment || ''}}
          </v-flex>
        </v-layout>
      </v-container>
      <v-layout key="action">
        <v-flex @click="expand = !expand" class="pb-3" layout justify-center align-center>
          <span style="cursor: pointer" class="primary--text">{{expand?'收起详细描述':'展开详细描述'}}</span>
          <v-icon @click="expand = !expand" clickable>{{expand ? 'expand_less':'expand_more'}}</v-icon>
        </v-flex>
      </v-layout>
    </l-expand-transition-group>
    <v-subheader class="px-0">违章取证图片</v-subheader>
    <v-layout class="px-3 pb-3" wrap>
      <v-flex>
        <template v-for="(img,i) in vehicleImgs">
          <l-image-view-dialog :key="i" :src="img.src">
            <l-image-placeholder
              slot="activator"
              style="float:left;cursor: pointer"
              :src="img.src"
              :error="!!img.error"
              :error-message="img.error"
              :loading="!!img.loading"
            ></l-image-placeholder>
          </l-image-view-dialog>
        </template>
        <template v-if="vehicleImgs.length === 0">
          <l-image-placeholder></l-image-placeholder>
        </template>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import LExpandTransitionGroup from '../../../components/l-expand-transition-group'
import LImagePlaceholder from '../../../components/LImagePlaceholder'
import LImageViewDialog from '../../../components/LImageViewDialog'

export default {
  name: 'violationInfo',
  components: {LImageViewDialog, LImagePlaceholder, LExpandTransitionGroup},
  props: {
    open: {type: Boolean, default: false},
    infoObj: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    viewImage: false,
    expand: false,
  }),
  computed: {
    haveImg () {
      return !!this.vehicleImgs.length
    },
    vehicleImgs () {
      let imgs = []
      if (this.infoObj.vehicleImgs instanceof Array) {
        this.infoObj.vehicleImgs.forEach(img => {
          if (img.url) {
            imgs.push(img)
          }
        })
      }

      return imgs
    }
  },
  created () {
    if (this.open) {
      this.expand = true
    }
  }
}
</script>

<style scoped>

</style>
