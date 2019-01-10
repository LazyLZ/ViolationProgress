<template>
  <v-toolbar :color="dark ? '':'white'" app dense flat>
    <v-toolbar-side-icon @click="mainNavDrawer = !mainNavDrawer"></v-toolbar-side-icon>
    <v-toolbar-title class="headline">
      <v-flex style="min-width: 1000px">
        <main-breadcrumbs></main-breadcrumbs>
        <!--<v-icon small>mdi-home</v-icon>-->
        <!--<span class="px-2 body-2">首页</span>-->
      </v-flex>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip bottom class="hidden-sm-and-down">
      <v-btn @click="fullScreen = !fullScreen" icon slot="activator">
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>
      <span>全屏</span>
    </v-tooltip>
    <!--<color-menu>-->
    <v-tooltip bottom>
      <span>切换主题</span>
      <v-btn @click="dark = !dark" icon slot="activator">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
    </v-tooltip>
    <!--</color-menu>-->
    <v-tooltip bottom>
      <v-btn @click="goNotification" icon slot="activator">
        <v-badge
          overlap=""
          size="4px"
          v-model="haveNotification"
        >
          <span slot="badge">2</span>
          <v-icon size="20">mdi-bell</v-icon>
        </v-badge>
      </v-btn>
      <span>系统消息</span>
    </v-tooltip>

    <v-toolbar-items style="width: 64px">
      <user-menu>
        <v-btn flat slot="activator">
          <span class="subheading primary--text">{{loginName || '未命名'}}</span>
          <!--<div class="primary&#45;&#45;text l-avatar">L</div>-->
          <!--<v-avatar size="36px">-->
          <!--<img alt="lazylz" src="@/assets/lazylz_avatar.jpg"/>-->
          <!--</v-avatar>-->
        </v-btn>
      </user-menu>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
import {createHelpers} from 'vuex-map-fields'
import MainBreadcrumbs from './mainBreadcrumbs'
import UserMenu from './userMenu'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})
export default {
  name: 'mainToolbar',
  components: {UserMenu, MainBreadcrumbs},
  data: () => ({
    full_: false
  }),
  computed: {
    fullScreen: {
      get () {
        return this.full_
      },
      set (val) {
        if (val) {
          this.inFullScreen()
        }
        else {
          this.exitFullscreen()
        }
        this.full_ = val
      }
    },
    loginName () {
      return this.$store.state.login.name
    },
    ...mapFields([
      'dark',
      'mainNavDrawer',
      'haveNotification',
      'bcItems'
    ])
  },
  methods: {
    goNotification () {
      this.$router.push({
        name: 'Notification'
      })
    },
    inFullScreen () {
      let el = document.documentElement
      let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
      if (rfs instanceof Function) {
        rfs.call(el)
      }
    },
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
      else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
  },
}
</script>

<style scoped>
  .l-avatar {
    width: 36px;
    height: 36px;
    border-radius: 36px;
    line-height: 36px;
    border: 1px solid;
    font-size: 24px;
  }
</style>
