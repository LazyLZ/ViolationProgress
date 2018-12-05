<template>
  <h1>details page {{this.$route.query.id}} {{Math.random() * 1000}} {{testdata}} </h1>
</template>

<script>
export default {
  name: 'detailsPage',
  data: () => ({
    testdata: 0
  }),
  created () {
    this.testdata = Math.random() * 1000
    console.log('in details', this.$route)
  }
}
</script>

<style scoped>

</style>
