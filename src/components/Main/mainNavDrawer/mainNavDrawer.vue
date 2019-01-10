<template>
  <v-navigation-drawer
    :class="dark? 'grey darken-3':'blue-grey darken-4'"
    :mini-variant="(smallScreen ? false : !mainNavDrawer) && !closeDrawer"
    :permanent="!smallScreen && !closeDrawer"
    :width="$L.cfg.navDrawerWidth"
    app
    dark
    fixed
    v-model="drawerModel"
  >
    <!--系统logo区域-->
    <slot :mini="!smallScreen && !mainNavDrawer" name="logo"></slot>
    <v-divider></v-divider>

    <!--导航区域-->
    <v-list :dense="$L.cfg.denseNavDrawer || (!smallScreen && !mainNavDrawer)" class="pt-0">
      <template v-for="(item, i) in navDrawerItem">
        <!--副标题-->
        <v-layout
          :key="i"
          align-center
          row
          v-if="item.heading"
        >
          <v-flex xs6>
            <v-subheader>{{ item.heading }}</v-subheader>
          </v-flex>
        </v-layout>

        <!--分隔线-->
        <v-divider
          :key="i"
          class="my-3"
          dark
          v-else-if="item.divider"
        ></v-divider>

        <!--一级直接跳转-->
        <v-list-tile
          :key="i"
          @click="go(item.to)"
          v-else-if="noChildren(item)"
        >
          <v-tooltip :disabled="!miniNavDrawer" open-delay="50" right>
            <v-list-tile-action slot="activator">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <span>{{item.label}}</span>
          </v-tooltip>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text text--lighten-1">
              {{ item.label }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!--展开子标题 导航栏展开-->
        <v-list-group
          :key="i"
          :prepend-icon="item.icon"
          append-icon=""
          no-action
          v-else-if="!miniNavDrawer"
          v-model="item.activate"
        >
          <!--一级标题 不跳转-->
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title class="grey--text text--lighten-1">
                {{ item.label }}
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon :class="item.activate? 'reverse':''" color="grey lighten-1">mdi-chevron-down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <template v-for="(subItem, j) in item.children">
            <!--二级标题 无子标题-->
            <v-list-tile :key="j" @click="go(subItem.to)" v-if="noChildren(subItem)">
              <v-list-tile-content>
                <v-list-tile-title class="grey--text text--lighten-1">
                  {{ subItem.label }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <!--二级标题 有子标题-->
            <v-list-group :key="j" sub-group v-else>
              <!--二级标题 不跳转-->
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title class="grey--text text--lighten-1">
                    {{ subItem.label }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <!--三级标题-->
              <v-list-tile :key="k" @click="go(ssItem.to)" v-for="(ssItem, k) in subItem.children">
                <v-list-tile-content>
                  <v-list-tile-title class="grey--text text--lighten-1">
                    {{ ssItem.label }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <!--<v-list-tile-action>-->
                <!--<v-icon small>{{ssItem.icon}}</v-icon>-->
                <!--</v-list-tile-action>-->
              </v-list-tile>
            </v-list-group>
          </template>
        </v-list-group>

        <!--展开子标题 导航栏缩进 不跳转-->
        <v-list-tile :key="i" v-else>
          <drawer-menu :item="item" open-delay="50">
            <v-list-tile-action slot="activator">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <span>{{item.label}}</span>
          </drawer-menu>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text text--lighten-1">
              {{ item.label }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {createHelpers} from 'vuex-map-fields'
import {navDrawerItems} from '@/router/navDrawerItems'
import DrawerMenu from './drawerMenu'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})
export default {
  name: 'mainNavDrawer',
  components: {DrawerMenu},
  data: () => ({
    navDrawerItems_: navDrawerItems,
    closeDrawer: false
  }),
  computed: {
    isDevelopment () {
      return this.$store.getters.isDevelopment
    },
    permission () {
      return this.$store.state.login.permission
    },
    navDrawerItem: {
      get () {
        let navs = this.navDrawerItems_
        let permission = this.permission
        // console.log('getP', this.permission)
        let views = this.buildNavDrawer(navs, permission)
        // console.log('navdrawer', views)
        return views
      },
      set (val) {
        // 必须设置set使v-list-group能修改activate值
        // console.log('set', val)
      }
    },
    noChildren () {
      return (item) => {
        return !item.children || item.children.length === 0
      }
    },
    miniNavDrawer () {
      return !this.mainNavDrawer && !this.smallScreen
    },
    smallScreen () {
      return this.$vuetify.breakpoint.smAndDown
    },
    mdScreen () {
      return this.$vuetify.breakpoint.mdOnly
    },
    largeScreen () {
      return this.$vuetify.breakpoint.lgAndUp
    },
    ...mapFields([
      'dark',
      'mainNavDrawer'
    ]),
    drawerModel: {
      get () {
        if (this.closeDrawer) {
          return false
        }
        if (this.smallScreen) {
          return this.mainNavDrawer
        }
        else {
          return true
        }
      },
      set (val) {
        if (this.smallScreen) {
          this.mainNavDrawer = val
        }
      }
    }
  },
  watch: {
    '$route' (to) {
      let c = to.matched[0] && to.matched[0].components
      if (c && c.default && c.default.name === 'Main') {
        this.closeDrawer = false
      }
      else {
        this.closeDrawer = true
        console.log('close drawer', this.drawerModel)
      }
    },
    largeScreen (val, oldVal) {
      if (val && !oldVal) {
        this.mainNavDrawer = true
      }
      if (!val && oldVal) {
        if (this.mdScreen) {
          this.mainNavDrawer = false
        }
      }
    }
  },
  methods: {
    buildNavDrawer (navs, permission = {}) {
      // console.log('np', navs, permission)
      let views = []
      for (let i = 0; i < navs.length; ++i) {
        let nav = navs[i]
        let view = Object.assign(nav)
        if (nav.hidden) continue
        if (nav.divider || nav.heading) {
          views.push(nav)
          continue
        }
        if (!nav.children) nav.children = []
        if (this.isDevelopment && nav.development) {
          view.children = this.buildNavDrawer(nav.children, permission[nav.access] || {})
          views.push(view)
        }
        else if (!nav.access) {
          if (!nav.development) {
            view.children = this.buildNavDrawer(nav.children, {})
            views.push(view)
          }
        }
        else if (this.havPermission(permission, nav.access)) {
          view.children = this.buildNavDrawer(nav.children, permission[nav.access] || {})
          views.push(nav)
        }
      }
      return views
    },
    havPermission (permission, access) {
      // console.log(permission, access)
      return this.$L.F.haveTruthyAttr(permission, access, false, true, ':')
    },
    click (e, delay = 0) {
      if (delay) {
        setTimeout(() => {
          e.target.click()
        }, delay)
      }
      else {
        e.target.click()
      }
    },
    test (e) {
      console.log('mouseleave', e)
    },
    go (p) {
      if (p) {
        this.$router.push(p)
      }
    }
  },
  created () {
    if (this.mdScreen) {
      this.mainNavDrawer = false
    }
  }
}
</script>

<style scoped>
  .reverse {
    transition: 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
    transform: rotate(180deg);
  }
</style>
