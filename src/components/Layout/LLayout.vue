<template>
  <v-container :class="smallScreen?'py-0 px-0':''" fluid>
    <v-layout justify-center row wrap>
      <v-flex :class="layout">
        <slot></slot>
      </v-flex>
    </v-layout>
    <div :style="bottomSpaceStyle" v-if="bottomSpace"></div>
    <slot name="dialogs"></slot>
  </v-container>
</template>

<script>

export default {
  name: 'LLayout',
  props: {
    layout: {},
    bottomSpace: {type: Boolean, default: false}
  },
  computed: {
    bottomSpaceStyle () {
      return {
        height: typeof this.bottomSpace === 'string' ? this.bottomSpace : '72px'
      }
    },
    smallScreen () {
      return this.$vuetify.breakpoint.smAndDown
    }
  },
}
</script>

<style scoped>

</style>
