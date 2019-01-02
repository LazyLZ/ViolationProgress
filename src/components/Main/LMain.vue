<template>
  <div>
    <main-nav-drawer>
      <template slot="logo" slot-scope="{mini}">
        <slot :mini="mini" name="logo">
          <v-layout align-center class="headline" style="height: 96px">
            <!--<v-flex align-center justify-center layout v-if="mini">-->
            <!--<v-avatar>-->
            <!--<img alt="logo" src="@/assets/lazylz_avatar.jpg"/>-->
            <!--</v-avatar>-->
            <!--</v-flex>-->
            <!--<v-flex v-else>-->
            <span class="primary--text pl-3">{{$L.cfg.appName.full}}</span>
            <span class="px-2 font-weight-light white--text" v-if="$L.cfg.appName.subTitle">|</span>
            <span class="font-weight-light white--text">{{$L.cfg.appName.subTitle}}</span>
            <!--</v-flex>-->
          </v-layout>
        </slot>
      </template>
    </main-nav-drawer>
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
        <transition mode="out-in">
          <keep-alive :exclude="notCachePage">
            <router-view/>
          </keep-alive>
        </transition>
      </l-fixed-window>
    </v-content>
  </div>
</template>

<script>
import LFixedWindow from '../Layout/LFixedWindow'
import MainNavDrawer from './mainNavDrawer/mainNavDrawer'
import MainToolbar from './mainToolbar/mainToolbar'
import MainTabs from './mainTabs'
import {createHelpers} from 'vuex-map-fields'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})

import route from '../../router/routes'

export default {
  name: 'LMain',
  components: {
    MainTabs,
    MainToolbar,
    MainNavDrawer,
    LFixedWindow,
  },
  data: () => ({
    offsetTop: 0,
    viewHeight: 0,
    notCachePage: []
  }),
  computed: {
    // a () {
    //   return this.globalAlert
    // },
    // o () {
    //   return this.globalOperation
    // },
    ...mapFields([
      'dark',
      'floatingTabs',
      'mainTabItems',
      'pageLoading',
      // 'globalAlert',
      // 'globalAlertActivate',
      // 'globalOperation',
      // 'globalOperationActivate',
      'pageloading'
    ]),
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
      let route = this.$route
      if (route.meta.notCache) {
        this.notCachePage.push(route.name)
      }
      else if (route.name) {
        let i = this.notCachePage.indexOf(route.name)
        if (i !== -1) {
          this.notCachePage.splice(i, 1)
        }
      }
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
  .v-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  /*.v-leave-active {*/
  /*transition: all 0.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
  /*}*/
  .v-enter, .v-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateY(7px);
    opacity: 0;
  }
</style>
