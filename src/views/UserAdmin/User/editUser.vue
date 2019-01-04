<template>
  <l-cache :get-data="getUser" :id="this.$route.query.id">
    <template slot-scope="{data}">
    <user-details-edit :data="data" status="edit"></user-details-edit>
    </template>
    <template slot="loading">
      <v-layout class="py-5" justify-center>
        <v-progress-circular color="primary" indeterminate size="50"></v-progress-circular>
      </v-layout>
    </template>
  </l-cache>
</template>

<script>
import {Person} from '../../../utils/SpavaObj'
import UserDetailsEdit from './userDetailsEdit'
import LCache from '../../../components/Layout/LCache'

export default {
  name: 'NewUser',
  components: {LCache, UserDetailsEdit},
  data: () => ({
    editUserData: new Person()
  }),
  methods:{
    getUser (key) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('userAdmin/getUsers', {
          pagination: {page: 1},
          filter: {id: key}
        }).then(res => {
          setTimeout(() => {
            resolve(res.items[0])
          }, 1000)
        }).catch(e => {
          reject(e)
        })
      })
    },
  },
  created () {
    console.log('new user create')
  },
}
</script>

<style scoped>

</style>
