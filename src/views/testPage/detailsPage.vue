<template>
  <l-cache :get-data="randValue" :id="this.$route.query.id">
    <template slot-scope="{data, id}">
      <h1>details page {{id}} {{data}} {{data === null}}</h1>
    </template>
    <template slot="loading">
      <v-progress-circular size="50" indeterminate></v-progress-circular>
    </template>
  </l-cache>
</template>

<script>
import {createHelpers} from 'vuex-map-fields'
import LCache from '../../components/Layout/LCache'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})
export default {
  name: 'detailsPage',
  components: {LCache},
  data: () => ({
    // testdata: 0,
    cache: {},
    pair: {
      id: -1,
      value: -1,
    }
  }),
  computed: {
    ...mapFields([
      'mainTabItems'
    ])
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'TestDetails') {
        this.pair.value = -1
        this.getData(this.$route.query.id, this.randValue, true).then(v => {
          this.pair = {
            id: this.$route.query.id,
            value: v
          }
        })
      }
    },
  },
  methods: {
    randValue (key) {
      return new Promise(resolve => {
        setTimeout(() => {
          let v = Math.round(Math.random() * 1000) + '' + key
          resolve(v)
        }, 1000)
      })
    },
    getData (key, method, asynchronous = false) {
      let cache = this.cache
      if (cache.hasOwnProperty(key)) {
        if (asynchronous) {
          return new Promise(resolve => {
            resolve(cache[key])
          })
        }
        else {
          return cache[key]
        }
      }
      else if (typeof method === 'function') {
        if (asynchronous) {
          return new Promise(resolve => {
            method(key).then(res => {
              cache[key] = res
              resolve(cache[key])
            })
          })
        }
        else {
          cache[key] = method(key)
          return cache[key]
        }
      }
      else {
        return null
      }
    }
  },
  created () {
    console.log('in details', this.$route)
    this.getData(this.$route.query.id, this.randValue, true).then(v => {
      this.pair = {
        id: this.$route.query.id,
        value: v
      }
    })
  },
  // activated () {
  //   this.pair = {
  //     id: this.$route.query.id,
  //     value: Math.round(Math.random() * 1000)
  //   }
  // }
}
</script>

<style scoped>

</style>
