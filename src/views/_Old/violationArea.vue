<template>
  <div>

    <v-slide-y-transition mode="out-in">
      <v-container v-if="mounted" :class="[$vuetify.breakpoint.smAndDown ? 'px-0 py-0' : '']" fluid>
        <v-layout row justify-center>
          <v-flex xs12 md8 lg6>
            <v-card>
            <v-list>
              <template v-for="(area,i) of areaList">
              <v-list-tile
                :key="area.id"
              >
                <v-list-tile-action>
                  <v-icon>location_on</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{area.name}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider :key="i + 'divider'" v-if="i < areaList.length - 1"></v-divider>
              </template>
            </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-slide-y-transition>
    <confirm-operation-dialog
      v-model="errorDialog.activate"
      auto-close
      title="发生错误"
      disable-cancel
    >
      <v-layout column>
        <v-flex layout column align-center justify-center>
          <v-icon large class="pb-3" color="error">error</v-icon>
          <span>加载违章区域时发生错误</span>
        </v-flex>
        <v-flex>
          <div class="text-xs-center pt-2 pb-1">{{errorDialog.message}}</div>
        </v-flex>
      </v-layout>

    </confirm-operation-dialog>
  </div>
</template>

<script>
import ConfirmOperationDialog from '@/components/confirmOperationDialog'

export default {
  name: 'violationArea',
  components: {ConfirmOperationDialog},
  data: () => ({
    mounted: false,
    areaList: [],
    errorDialog: {
      activate: false,
      message: ''
    },
  }),
  methods: {
    async getViolationArea () {
      await this.$store.dispatch('violationArea/getViolationArea')
        .then(res => {
          this.areaList = res
          console.log('area list', this.areaList)
        })
        .catch(error => {
          this.errorDialog.activate = true
          this.errorDialog.message = error.message ? error.message : error.toString()
        })
    }
  },
  created () {
    this.getViolationArea()
  },
  mounted () {
    this.mounted = true
  }
}
</script>

<style scoped>

</style>
