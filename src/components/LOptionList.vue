<template>
  <v-menu left>
    <slot name="activator" slot="activator"></slot>
    <v-list dense>
      <v-list-tile @click="clickTile(opt, i)" v-for="(opt, i) in options" :key="i">
        <v-list-tile-action class="pr-0">
          <v-icon>{{opt.icon}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-title class="pr-4">{{opt.label}}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'LOptionList',
  props: {
    options: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    clickTile (opt, i) {
      // console.log('emit', opt)
      if (opt.event) {
        this.$emit(opt.event)
      }
      else {
        this.$emit('click:' + i)
      }
    }
  }
}
</script>

<style scoped>

</style>
