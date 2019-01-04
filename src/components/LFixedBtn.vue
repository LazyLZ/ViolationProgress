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
      <v-icon>
        <slot></slot>
      </v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'LFixedBtn',
  data: () => ({
    show: false
  }),
  activated () {
    setTimeout(() => {
      this.show = true
    }, 300)
  },
  deactivated () {
    this.show = false
  },
  created () {
    setTimeout(() => {
      this.show = true
    }, 300)
  }
}
</script>

<style scoped>

</style>
