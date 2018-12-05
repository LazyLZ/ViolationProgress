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
      <v-btn icon slot="activator">
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
      <v-btn @click="haveNotification = !haveNotification" icon slot="activator">
        <v-badge
          overlap=""
          size="4px"
          v-model="haveNotification"
        >
          <span slot="badge">2</span>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
      <span>系统消息</span>
    </v-tooltip>
    <user-menu>
      <v-btn icon slot="activator">
        <v-avatar size="36px">
          <img alt="lazylz" src="@/assets/lazylz_avatar.jpg"/>
        </v-avatar>
      </v-btn>
    </user-menu>
  </v-toolbar>
</template>

<script>
import {createHelpers} from 'vuex-map-fields'
import MainBreadcrumbs from './mainBreadcrumbs'
import ColorMenu from './colorMenu'
import UserMenu from './userMenu'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})
export default {
  name: 'mainToolbar',
  components: {UserMenu, ColorMenu, MainBreadcrumbs},
  computed: {
    ...mapFields([
      'dark',
      'mainNavDrawer',
      'haveNotification',
      'bcItems'
    ])
  },
  data: () => ({})
}
</script>

<style scoped>

</style>
