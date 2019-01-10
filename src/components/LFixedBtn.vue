<template>
  <v-fab-transition>
    <v-btn
      @click="$emit('click', $event)"
      bottom
      class="ma-4"
      color="primary"
      fab
      fixed
      right
      v-if="show"
    >
      <v-icon>{{(icon + '').trim()}}</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'LFixedBtn',
  props: {
    icon: {type: String, default: ''}
  },
  data: () => ({
    show: false
  }),
  activated () {
    setTimeout(() => {
      this.show = true
    }, 500)
  },
  deactivated () {
    this.show = false
  },
  created () {
    setTimeout(() => {
      this.show = true
    }, 500)
  }
}
</script>

<style scoped>

</style>
