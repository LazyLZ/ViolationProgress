<template>
  <div>
    <div>test router 1 {{Math.random() * 1000}}</div>
    <v-icon v-html="i('test')"></v-icon>
    <!--<div>{{'/home/homepage/i'.split('/')}}</div>-->
  </div>
</template>

<script>
export default {
  name: 'testRouter1',
  methods: {
    i (icon) {
      return '$vuetify.icons.' + icon
    }
  }
}
</script>

<style scoped>

</style>
