<template>
  <l-layout :layout="['xs12', 'lg10']">
    <l-cache :get-data="getUser" :id="this.$route.query.id" ref="cache">
      <template slot-scope="{data}">
        <user-details-content
          :data="data"
        >
          <template slot="actions">
            <v-btn @click="goEdit(data)" class="mx-0" color="primary" flat>编辑</v-btn>
            <v-btn :loading="loading" @click="refresh()" class="mx-0" color="primary" flat>刷新</v-btn>
          </template>
        </user-details-content>
      </template>
    </l-cache>
  </l-layout>
</template>

<script>
import UserDetailsContent from './userDetailsContent'
import LCache from '../../../components/Layout/LCache'
import LLayout from '../../../components/Layout/LLayout'

export default {
  name: 'UserDetails',
  components: {LLayout, UserDetailsContent, LCache},
  data: () => ({
    status: 'edit',
    loading: false,
  }),
  methods: {
    goEdit (person = {}) {
      // this.$store.commit('closeTab', this.$route.fullPath)
      this.$store.commit('routerInTab', () => {
        this.$router.push({
          name: 'EditUser',
          params: {loginId: person.loginId},
          query: {id: person.id}
        })
      })
    },
    async refresh () {
      if (this.$refs.cache) {
        this.loading = true
        await this.$refs.cache.retry(true)
        this.loading = false
      }
    },
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
  }
}
</script>

<style scoped>

</style>
