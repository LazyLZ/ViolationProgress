<template>
  <v-card>
    <v-tabs v-model="tabs" color="grey lighten-3">
      <template v-if="exist.length > 0">
        <v-tab v-for="(t, i) in tabItems" v-if="exist.indexOf(t) !== -1" :key="t" :href="'#tab-' + i">{{t}}</v-tab>
      </template>
      <template v-else>
        <v-tab disabled href="#tab-0" key="props">Props</v-tab>
      </template>
      <!--<v-tab :disabled="!(api.props && api.props.length > 0)" href="#tab-0">Props</v-tab>-->
      <!--<v-tab v-if="api.slots && api.slots.length > 0" href="#tab-1">Slots</v-tab>-->
      <!--<v-tab v-if="api.scopedSlots && api.scopedSlots.length > 0" href="#tab-2">ScopedSlots</v-tab>-->
      <!--<v-tab v-if="api.events && api.events.length > 0"  href="#tab-3">Events</v-tab>-->
      <!--<v-tab v-if="api.functions && api.functions.length > 0" href="#tab-4">Functions</v-tab>-->
    </v-tabs>
    <v-container fluid class="pb-2 px-2">
      <v-layout row wrap>
        <v-flex xs6 class="px-2">
          <v-select
            label="组件名称"
            :items="apis"
            item-text="name"
            return-object
            v-model="api"
            :disabled="disabled"
          ></v-select>
        </v-flex>
        <v-flex xs6>
        </v-flex>
        <v-flex class="grey py-3 px-3 lighten-4" xs12>
          <div class="caption grey--text text--darken-1">组件说明</div>
          <div class="grey--text py-1 text--darken-2">{{api.description}}</div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-tabs-items v-model="tabs">
      <v-tab-item
        v-for="(text,index) in tabItems"
        :key="index"
        :value="'tab-' + index"
        v-if="api[text] && api[text].length > 0"
      >
        <v-container fluid class="pt-2 pb-0 px-2">
          <template v-for="(item, i) in api[text]">
            <v-layout class="pb-2" column :key="i+item.name">
              <v-flex class="grey lighten-4 py-3 px-3">
                <v-layout row wrap>
                  <v-flex xs12 v-if="item.deprecated" class="pb-1">
                    <div class="error--text caption font-weight-medium">Deprecated</div>
                  </v-flex>
                  <v-flex xs4 class="px-1 red--text text--darken-4">
                    <div class="caption text--darken-1 grey--text">Name</div>
                    <div class="subheading font-weight-medium">
                      {{item.name}}
                    </div>
                  </v-flex>
                  <v-flex v-if="text==='props'" xs4 class="px-1">
                    <div class="caption text--darken-1 grey--text">
                      <span v-if="text === 'props'">Default</span>
                    </div>
                    <div class="body-2 font-weight-medium">
                        <span v-if="text === 'props'">
                          {{typeof item.default === 'string' ? `'${item.default}'` : item.default + ''}}
                        </span>
                    </div>
                  </v-flex>
                  <v-flex :class="text === 'props' ? 'xs4':'xs8'" class="text-xs-right px-1">
                    <div class="caption text--darken-1 grey--text">
                      <span v-if="text === 'props'">Type</span>
                      <span v-if="text === 'scopedSlots'">Props</span>
                      <span v-if="text === 'events'">Value</span>
                      <span v-if="text === 'functions'">Signature</span>
                    </div>
                    <div class="body-2 font-weight-medium">
                      <span v-if="text === 'props'">{{item.type + ''}}</span>
                      <span v-if="text === 'scopedSlots'">{{item.props + ''}}</span>
                      <span v-if="text === 'events'">{{item.value + ''}}</span>
                      <span v-if="text === 'functions'">{{item.signature + ''}}</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex class="py-3 px-3 grey lighten-3">
                <div v-html="withLineBreak(item.explain)" class="grey--text text--darken-2">
                </div>
              </v-flex>
            </v-layout>
          </template>
        </v-container>
      </v-tab-item>
      <!--<v-tab-item v-if="api.props && api.props.length > 0" :key="0">-->
      <!--<v-container fluid class="pt-2 pb-0 px-2">-->
      <!--<template v-for="(item, i) in api.props">-->
      <!--<v-layout class="pb-2" column :key="i+item.name">-->
      <!--<v-flex class="grey lighten-4 py-3 px-3">-->
      <!--<v-layout>-->
      <!--<v-flex xs4 class="px-1 red&#45;&#45;text text&#45;&#45;darken-4">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Name</div>-->
      <!--<div class="subheading font-weight-medium">-->
      <!--{{item.name}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--<v-flex xs4 class="px-1">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Default</div>-->
      <!--<div class="body-2 font-weight-medium">-->
      <!--{{typeof item.default === 'string' ? `'${item.default}'` : item.default + ''}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--<v-flex xs4 class="text-xs-right px-1">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Type</div>-->
      <!--<div class="body-2 font-weight-medium">-->
      <!--{{item.type}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</v-flex>-->
      <!--<v-flex class="py-3 px-3 grey lighten-3">-->
      <!--<div v-html="withLineBreak(item.explain)" class="grey&#45;&#45;text text&#45;&#45;darken-2">-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</template>-->
      <!--</v-container>-->
      <!--</v-tab-item>-->
      <!--<v-tab-item v-if="api.slots && api.slots.length > 0" :key="1">-->
      <!--<v-container fluid class="py-2 px-2">-->
      <!--<template v-for="(item, i) in api.slots">-->
      <!--<v-layout column :key="i+item.name">-->
      <!--<v-flex class="grey lighten-4 py-3 px-3">-->
      <!--<v-layout>-->
      <!--<v-flex xs12 class="px-1 red&#45;&#45;text text&#45;&#45;darken-4">-->
      <!--<div class="caption  text&#45;&#45;darken-1 grey&#45;&#45;text">Name</div>-->
      <!--<div class="subheading font-weight-medium">-->
      <!--{{item.name}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</v-flex>-->
      <!--<v-flex class="py-3 px-3 grey lighten-3">-->
      <!--<div class="grey&#45;&#45;text text&#45;&#45;darken-2">-->
      <!--{{item.explain}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</template>-->
      <!--</v-container>-->
      <!--</v-tab-item>-->
      <!--<v-tab-item v-if="api.scopedSlots && api.scopedSlots.length > 0" :key="2">-->
      <!--<v-container fluid class="py-2 px-2">-->
      <!--<template v-for="(item, i) in api.scopedSlots">-->
      <!--<v-layout column :key="i+item.name">-->
      <!--<v-flex class="grey lighten-4 py-3 px-3">-->
      <!--<v-layout>-->
      <!--<v-flex xs4 class="px-1 red&#45;&#45;text text&#45;&#45;darken-4">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Name</div>-->
      <!--<div class="subheading font-weight-medium">-->
      <!--{{item.name}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--<v-flex xs8 class="text-xs-right px-1">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Props</div>-->
      <!--<div class="body-2 font-weight-medium">-->
      <!--{{item.props}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</v-flex>-->
      <!--<v-flex class="py-3 px-3 grey lighten-3">-->
      <!--<div class="grey&#45;&#45;text text&#45;&#45;darken-2">-->
      <!--{{item.explain}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</template>-->
      <!--</v-container>-->
      <!--</v-tab-item>-->
      <!--<v-tab-item v-if="api.events && api.events.length > 0" :key="3">-->
      <!--<v-container fluid class="py-2 px-2">-->
      <!--<template v-for="(item, i) in api.events">-->
      <!--<v-layout column :key="i+item.name">-->
      <!--<v-flex class="grey lighten-4 py-3 px-3">-->
      <!--<v-layout>-->
      <!--<v-flex xs4 class="px-1 red&#45;&#45;text text&#45;&#45;darken-4">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Name</div>-->
      <!--<div class="subheading font-weight-medium">-->
      <!--{{item.name}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--<v-flex xs8 class="text-xs-right px-1">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Value</div>-->
      <!--<div class="body-2 font-weight-medium">-->
      <!--{{item.value}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</v-flex>-->
      <!--<v-flex class="py-3 px-3 grey lighten-3">-->
      <!--<div class="grey&#45;&#45;text text&#45;&#45;darken-2">-->
      <!--{{item.explain}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</template>-->
      <!--</v-container>-->
      <!--</v-tab-item>-->
      <!--<v-tab-item v-if="api.functions && api.functions.length > 0" :key="4">-->
      <!--<v-container fluid class="py-2 px-2">-->
      <!--<template v-for="(item, i) in api.functions">-->
      <!--<v-layout column :key="i+item.name">-->
      <!--<v-flex class="grey lighten-4 py-3 px-3">-->
      <!--<v-layout>-->
      <!--<v-flex xs4 class="px-1 red&#45;&#45;text text&#45;&#45;darken-4">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Name</div>-->
      <!--<div class="subheading font-weight-medium">-->
      <!--{{item.name}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--<v-flex xs8 class="text-xs-right px-1">-->
      <!--<div class="caption text&#45;&#45;darken-1 grey&#45;&#45;text">Signature</div>-->
      <!--<div class="body-2 font-weight-medium">-->
      <!--{{item.signature}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</v-flex>-->
      <!--<v-flex class="py-3 px-3 grey lighten-3">-->
      <!--<div class="grey&#45;&#45;text text&#45;&#45;darken-2">-->
      <!--{{item.explain}}-->
      <!--</div>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</template>-->
      <!--</v-container>-->
      <!--</v-tab-item>-->
    </v-tabs-items>
  </v-card>
</template>

<script>
let tabTexts = ['props', 'slots', 'scopedSlots', 'events', 'functions']

export default {
  name: 'apiViewer',
  props: {
    apis: {
      type: Array
    }
  },
  data: () => ({
    api: {},
    tabs: 0,
    tabItems: tabTexts,
  }),
  computed: {
    disabled () {
      return this.apis instanceof Array && this.apis.length < 2
    },
    exist () {
      return tabTexts.filter(t => this.api[t] && this.api[t].length > 0)
    },
    withLineBreak () {
      return (text) => {
        if (typeof text === 'string') {
          return text.replace(/\n/g, '<br>')
        }
        else {
          return ''
        }
      }
    }
  },
  watch: {
    api (api) {
      let exist = tabTexts.filter(t => api[t] && api[t].length > 0)
      this.tabs = exist.length > 0 ? exist[0] : tabTexts[0]
      // let a1 = this.util.deepClone(api.props).map(a => a.name)
      // let a2 = this.util.deepClone(api.props).map(a => a.name)
      // a2.sort((a, b) => a > b ? 1 : -1)
      // console.log('test', a1, a2)
      // console.log('sorted', api)
      // console.log(api.props[0].name, api.props[1].name, api.props[0].name > api.props[1].name)
      exist.forEach(t => {
        api[t].sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1)
      })
      // api.props.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1)
      // api.slots.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1)
      // api.scopedSlots.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1)
      // api.events.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1)
      // api.functions.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1)
    }
  },
  created () {
    if (this.apis instanceof Array) {
      this.api = this.apis[0]
    }
  }
}
</script>

<style scoped>

</style>
