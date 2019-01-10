<template>
  <l-cache :get-data="getUser" :id="this.$route.query.id" ref="cache">
    <template slot-scope="{data}">
      <user-details-edit :data="data" @refresh="refresh()" status="edit"></user-details-edit>
    </template>
  </l-cache>
</template>

<script>
import UserDetailsEdit from './userDetailsEdit'
import LCache from '../../../components/Layout/LCache'

export default {
  name: 'EditUser',
  components: {LCache, UserDetailsEdit},
  data: () => ({
  }),
  methods: {
    getUser (key) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('userAdmin/getUsers', {
          pagination: {page: 1},
          filter: {id: key}
        }).then(res => {
          setTimeout(() => {
            resolve(res.items[0])
            // reject(Error('test'))
          }, 2000)
        }).catch(e => {
          reject(e)
        })
      })
    },
    refresh () {
      if (this.$refs.cache) {
        this.$refs.cache.retry(true)
      }
    }
  },
  created () {
    console.log('new user create')
  },
}
</script>

<style scoped>

</style>
