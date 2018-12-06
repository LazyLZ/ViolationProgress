<template>
  <v-layout :class="floatingTabs ? 'elevation-1':''"
            align-center style="transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)">
    <v-flex
      :class="TAB_CONTAINER"
      @dragover="e => e.preventDefault()"
      @drop="onDrop"
      style="width: calc(100% - 36px)"
    >
      <v-tabs :color="dark ? 'grey darken-4':'grey lighten-3'" :value="tab" height="36px" hide-slider
              show-arrows v-if="mainTabItems.length > 0">
        <template v-for="(t, i) in mainTabItems">
          <v-tab
            :class="[tab === i ? dark ? 'grey darken-3 primary--text':'grey lighten-5 primary--text':'', TAB_KEY]"
            :draggable="t.persistent ? 'false':'true'"
            :key="i"
            :style="tabWidthStyle(i)"
            @click="$router.push(t.to)"
            @dragend.native="onDragEnd"
            @dragover.stop="onDragOver($event, i)"
            @dragstart.native="onDragStart($event, t, i)"
            @drop.stop="onDrop"
            v-show="onDragIndex !== i"
          >
            <v-layout align-center>
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
            </v-layout>
          </v-tab>
          <v-divider :class="dropTargetIndex === i ? 'primary': ''" :key="i + 'd'" style="" vertical></v-divider>
          <template
            v-if="dropTargetIndex === i && dropTargetIndex !== onDragIndex - 1"
          >
            <v-tab
              :class="dark ? 'grey darken-3':'grey lighten-4'"
              :key="i + 'p'"
              :style="tabWidthStyle(onDragIndex)"
            >{{tabText(onDragEvent && onDragEvent.target)}}
            </v-tab>
            <v-divider :key="i + 'd2'" class="primary" vertical></v-divider>
          </template>
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
// import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
// TODO: 不使用Vuetify的Tab Pagination，重写以支持js控制，来支持拖放tab

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})

let TAB_KEY = '__TAB__'
let TAB_CONTAINER = '__TAB_CONTAINER__'
export default {
  name: 'mainTabs',
  data: () => ({
    isOnDrag: false,
    ondragEvent: null,
    TAB_KEY: TAB_KEY,
    onDragIndex: -1,
    onDragTabWidth: 0,
    dragEnterTabDom: null,
    dropTargetIndex: -5,
    TAB_CONTAINER: TAB_CONTAINER
  }),
  computed: {
    ...mapFields([
      'dark',
      'mainTabItems',
      'floatingTabs'
    ]),
    tabText () {
      return (d) => {
        if (!d) return ''
        let t = d
        while (t.firstElementChild) {
          t = t.firstElementChild
        }
        return t.innerText
      }
    },
    tabWidthStyle () {
      return (i) => {
        // console.log(i, this.ondragEvent, this.onDragIndex)
        return {
          width: this.onDragIndex === i && this.onDragEvent ? this.onDragTabWidth + 'px' : ''
        }
      }
    },
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
    onDragEnd (e) {
      // console.log('dragEnd', e)
      this.isOnDrag = false
      this.resetDragEvent()
    },
    resetDragEvent () {
      this.ondragEvent = null
      this.onDragIndex = -1
      this.dragEnterTabDom = null
      this.dropTargetIndex = -5
      this.onDragTabWidth = 0
    },
    hasClass (d, classname) {
      if (!d) return false
      let list = d.classList
      if (!list) return false
      return list.contains(classname)
    },
    isTab (d) {
      return this.hasClass(d, TAB_KEY)
    },
    isContainer (d) {
      return this.hasClass(d, TAB_CONTAINER)
    },
    getContainer (d) {
      // console.log('get c', d)
      if (this.isContainer(d)) {
        return d
      }
      else if (d) {
        return this.getContainer(d.parentNode)
      }
      else {
        return null
      }
    },
    getTabDom (d) {
      if (this.isTab(d)) {
        return d
      }
      else if (d) {
        return this.getTabDom(d.parentNode)
      }
      else {
        return null
      }
    },
    onDragOver (e, i, isContainer = false) {
      e.preventDefault()
      if (!this.isOnDrag) return
      let w = e.target.offsetWidth
      let x = e.offsetX
      if (isContainer) {
        this.dropTargetIndex = i
      }
      else {
        if (x > w / 2) {
          this.dropTargetIndex = i
        }
        else {
          this.dropTargetIndex = Math.max(0, i - 1)
        }
      }

      // this.onEnter(e, i)
      // console.log('de', w, x, x > w / 2, this.onDragIndex, this.dropTargetIndex, isContainer)
    },
    onEnter: throttle(function (e, i) {
      // console.log(this.isOnDrag)
      if (!this.isOnDrag) return
      let enterTab = this.getTabDom(e.target)
      let startDragTab = this.getTabDom(this.onDragEvent.target)
      if (enterTab !== startDragTab && enterTab !== this.dragEnterTabDom) {
        this.dragEnterTabDom = enterTab
        // console.log('enter', e)
      }
    }, 500, {leading: true}),
    onDrop (e) {
      this.isOnDrag = false
      // let tab = this.getTabDom(e.target)
      let i = this.onDragIndex
      let j = this.dropTargetIndex < 0 ? this.onDragIndex : this.dropTargetIndex
      // console.log('drop', `from ${i} to ${j}, drop in tab: ${!!tab}`)
      this.$store.commit('$L/moveTab', {from: i, to: j})
      this.resetDragEvent()
    },
    onDragStart (e, tabDefine, i) {
      this.onDragEvent = e
      this.onDragIndex = i
      this.isOnDrag = true
      this.onDragTabWidth = e.target.offsetWidth
      // console.log(e, e.target.offsetWidth)
    },
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
