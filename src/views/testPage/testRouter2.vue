<template>
  <div>
    <div>test router 2 {{Math.random() * 1000}}</div>
    <v-btn @click="goDetails">test query</v-btn>
    <v-btn @click="goDetailsParams">test params</v-btn>
  </div>
</template>

<script>
export default {
  name: 'testRouter2',
  computed: {
    inChildren () {
      return false
    },
    notCacheName () {
      return (this.$route.meta && this.$route.meta.notCache) ? this.$route.name : ''
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log('test route 2', this.$route)
    }
  },
  methods: {
    goDetails () {
      this.$router.push({name: 'TestDetails', query: {id: Math.round(Math.random() * 1000) + ''}})
    },
    goDetailsParams () {
      this.$router.push({name: 'TestDetailsParams', params: {id: Math.round(Math.random() * 1000) + ''}})
    }
  }
}
</script>

<style scoped>

</style>
