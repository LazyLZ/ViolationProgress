<template>
  <v-app :dark="dark">
    <main-nav-drawer></main-nav-drawer>
    <main-toolbar></main-toolbar>
    <v-content>
      <v-divider></v-divider>
      <l-fixed-window
        :offset-top.sync="offsetTop"
        :to-bottom="$route.meta.showFooter ? 36: 0"
        ref="fixedWindow"
      >
        <template slot="fixed-top">
          <v-progress-linear class="py-0 my-0" height="2" indeterminate v-if="pageLoading"></v-progress-linear>
          <main-tabs></main-tabs>
        </template>
        <keep-alive :exclude="noCachePage">
          <router-view/>
        </keep-alive>

        <!--全局提示-->
        <l-alert :message="a.message" :title="a.title" :type="a.type" v-model="globalAlertActivate"></l-alert>

        <!--全局操作确认-->
        <l-operation-dialog
          :cancelText="o.cancelText"
          :confirmText="o.confirmText"
          :disableCancel="o.disableCancel"
          :disableConfirm="o.disableConfirm"
          :icon="o.icon"
          :iconColor="o.iconColor"
          :onCancel="o.onCancel"
          :onConfirm="o.onConfirm"
          :subText="o.subText"
          :text="o.text"
          :title="o.title"
          :width="o.width"
          v-model="globalOperationActivate"
        ></l-operation-dialog>

        <!--全局删除提示-->

        <!--登录过期计时退出对话框-->
        <l-exit-dialog></l-exit-dialog>
      </l-fixed-window>
    </v-content>
    <v-footer
      app
      class="footer"
      fixed
      height="36px"
      inset
      v-if="$route.meta.showFooter"
    >
      <v-layout class="caption grey--text text-xs-center" justify-cetner>
        <v-flex>&copy;{{(new Date()).getFullYear()}} Design by LZ</v-flex>
        <div class="px-2">Ver. 0.1.0</div>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import LFixedWindow from '../Layout/LFixedWindow'
import MainNavDrawer from './mainNavDrawer/mainNavDrawer'
import MainToolbar from './mainToolbar/mainToolbar'
import MainTabs from './mainTabs'
import {createHelpers} from 'vuex-map-fields'

import LAlert from '@/components/Alerts/LAlert'
import LOperationDialog from '@/components/Alerts/LOperationDialog'
import LExitDialog from '../Alerts/LExitDialog'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})

export default {
  name: 'Main',
  components: {
    MainTabs,
    MainToolbar,
    MainNavDrawer,
    LFixedWindow,
    LOperationDialog,
    LAlert,
    LExitDialog,
  },
  data: () => ({
    offsetTop: 0,
    viewHeight: 0,
  }),
  computed: {
    a () {
      return this.globalAlert
    },
    o () {
      return this.globalOperation
    },
    ...mapFields([
      'dark',
      'floatingTabs',
      'mainTabItems',
      'pageLoading',
      'globalAlert',
      'globalAlertActivate',
      'globalOperation',
      'globalOperationActivate'
    ]),
    noCachePage () {
      let pages = []
      return pages
    }
  },
  watch: {
    offsetTop (val, oldVal) {
      if (val && !oldVal) {
        this.floatingTabs = true
      }
      if (!val && oldVal) {
        this.floatingTabs = false
      }
    },
    '$route' (to, from) {
      console.log('$route change', to.fullPath, from.fullPath, to)
      // this.$refs.fixedWindow.refresh(false)
      this.$refs.fixedWindow.refresh()
      let t = this.mainTabItems.find(item => item.to === to.fullPath)
      if (t) {
        // this.tab = this.tabItems.indexOf(t)
      }
      else {
        this.$store.commit('$L/addTab', this.$route)
        // this.tabItems.push({key: route.name, label: route.name, to: route.path})
      }
    },
    mainTabItems (val) {
      if (val.length === 0) {
        this.$router.replace('/')
        this.$store.commit('$L/addTab', this.$route)
      }
    }
  },
  methods: {
    onResize () {
      this.viewHeight = window.innerHeight
    },
    go (p) {
      if (p) {
        this.$refs.fixedWindow.refresh()
        this.$router.push(p)
      }
    }
  },
  created () {
    console.log('in main', this.$route)
    this.$store.commit('$L/recoveryTab', this.$route)
  },
}
</script>

<style scoped>

</style>
