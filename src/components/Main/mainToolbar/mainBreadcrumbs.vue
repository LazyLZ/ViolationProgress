<template>
  <v-breadcrumbs :items="bcItems">
    <v-icon slot="divider">mdi-chevron-right</v-icon>
    <template slot="item" slot-scope="{item}">
      <router-link
        v-if="!item.disabled"
        style="text-decoration : none"
        :to="item.to"
        :disabled="item.disabled"
        :class="['primary--text', 'body-1']"
      >
        <v-icon small color="primary" v-if="item.icon" class="pr-1">{{item.icon}}</v-icon>
        {{ item.text.toUpperCase() }}
      </router-link>
      <span class="grey--text body-1" v-else>
        <v-icon small color="grey" v-if="item.icon" class="pr-1">{{item.icon}}</v-icon>
        {{ item.text.toUpperCase() }}
      </span>
    </template>

  </v-breadcrumbs>
</template>

<script>
import F from '@/utils/functional'

let HOME_PAGE_NAME = 'Home'
let routeToBread = function (route) {
  return {
    text: `${route.meta.label || route.name || ''} ${F.getAttr(route, route.meta.subText) || ''}`,
    disabled: !!route.meta.disabled,
    to: route.fullPath || route.path,
    name: route.name || '',
    icon: route.meta.icon || ''
  }
}
export default {
  name: 'mainBreadcrumbs',
  computed: {
    bcItems () {
      let stack = []
      let matched = this.$route.matched || []
      for (let i = 0; i < matched.length; ++i) {
        let route = matched[i]
        route.params = this.$route.params
        route.query = this.$route.query
        if (!route.meta.hideInBread) {
          stack.push(routeToBread(route))
        }
      }
      if (!stack.length || stack[0].name !== HOME_PAGE_NAME) {
        // let name = stack.length ? stack[0].name : 'empty stack'
        // console.log(name)
        let home = {
          text: '首页',
          disabled: false,
          to: '/home',
          name: HOME_PAGE_NAME,
          icon: 'mdi-home',
        }
        stack.unshift(home)
      }
      // console.log('get stack', stack)
      let length = stack.length
      stack.forEach((s, i) => {
        if (i === length - 1) {
          s.disabled = i === length - 1
        }
      })
      return stack
    }
  }
  // data: () => ({
  //
  // })
}
</script>

<style scoped>

</style>
