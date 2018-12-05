<template>
  <v-layout :class="floatingTabs ? 'elevation-1':''"
            align-center style="transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)">
    <v-flex style="width: calc(100% - 36px)">
      <v-tabs :color="dark ? 'grey darken-4':'grey lighten-3'" :value="tab" height="36px" hide-slider
              show-arrows v-if="mainTabItems.length > 0">
        <template v-for="(t, i) in mainTabItems">
          <v-tab
            :class="tab === i ? dark ? 'grey darken-3 primary--text':'grey lighten-5 primary--text':''"
            :key="i"
            @click="$router.push(t.to)"
          >
            <span class="px-2">{{t.label}}</span>
            <span class="pr-2 grey--text caption" v-if="t.subText">{{t.subText}}</span>
            <v-btn
              @click.stop="checkClose(i, t)"
              class="ml-2 mr-0"
              icon
              small
              v-if="!t.persistent"
            >
              <v-icon clickable small>mdi-close</v-icon>
            </v-btn>
          </v-tab>
          <v-divider :key="i + 'd'" vertical></v-divider>
        </template>
      </v-tabs>
    </v-flex>
    <v-divider vertical></v-divider>
    <div :class="dark ? 'grey darken-4':'grey lighten-3'"
         style="width: 36px; height: 36px">
      <v-layout align-center fill-height justify-center>
        <v-menu bottom close-delay="300ms" open-on-hover>
          <v-icon clickable color="grey" size="20px" slot="activator">mdi-close-circle-outline</v-icon>
          <v-list dense>
            <v-list-tile @click="closeAll">
              关闭所有
            </v-list-tile>
            <v-list-tile @click="closeOther">
              关闭其他
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>
import {createHelpers} from 'vuex-map-fields'
import BCFunctions from '@/router/beforeClose'
const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})
export default {
  name: 'mainTabs',
  computed: {
    ...mapFields([
      'dark',
      'mainTabItems',
      'floatingTabs'
    ]),
    tabNow () {
      let routePath = this.$route.fullPath
      return this.mainTabItems.find(t => t.to === routePath)
      // this.mainTabItems.forEach((t, i) => {
      //   if (routePath.indexOf(t.to) !== -1) {
      //     // console.log('find route', t.to, routePath, i)
      //     tab = t
      //   }
      // })
      // return tab
    },
    tab () {
      return this.mainTabItems.indexOf(this.tabNow)
    }
  },
  methods: {
    async checkClose (i, t) {
      let f = BCFunctions[t.beforeCloseName]
      if (t.beforeCloseName && this.$L.F.is(f, Function)) {
        let v = await f()
        // console.log('return', v)
        if (v) {
          this.closeTabSafe(i)
        }
      }
      else {
        this.closeTabSafe(i)
      }
    },
    closeTabSafe (i) {
      if (this.tab === i) {
        this.$router.replace(i > 0 ? this.mainTabItems[i - 1].to : '/')
      }
      this.$store.commit('$L/closeTab', i)
    },
    closeAll () {
      let tabs = []
      this.mainTabItems.forEach(t => {
        if (t.persistent) {
          tabs.push(t)
        }
      })
      this.$store.commit('$L/changeTab', tabs)
      this.$router.push('/')
    },
    closeOther () {
      let tabs = []
      this.mainTabItems.forEach(t => {
        if (t.persistent) {
          tabs.push(t)
        }
      })
      if (!tabs.find(t => t.key === this.tabNow.key)) {
        tabs.push(this.tabNow)
      }
      this.$store.commit('$L/changeTab', tabs)
    }
  }
}
</script>

<style scoped>

</style>
