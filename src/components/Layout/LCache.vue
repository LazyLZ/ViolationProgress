<template>
  <div>
    <slot :data="data_" :id="id" v-if="!isError && !isLoading"></slot>
    <slot name="loading" v-if="isLoading && !isError"></slot>
    <slot :code="errorCode" :message="errorMessage" name="error" v-if="isError"></slot>
  </div>
</template>

<script>
// TODO 标签关闭时要删除缓存
export default {
  name: 'LCache',
  props: {
    id: {type: String, default: ''},
    getData: {type: Function},
    async: {type: Boolean, default: true},
    loading: {type: Boolean, default: false},
    error: {type: Boolean, default: false}
  },
  data: () => ({
    cache: {},
    errorMessage: '',
    errorCode: 0,
    data_: null,
    loading_: false,
    error_: false,
  }),
  computed: {
    hasLoadingPage () {
      return !!this.$slots.loading || !!this.$scopedSlots.loading
    },
    hasErrorPage () {
      return !!this.$slots.error || !!this.$scopedSlots.error
    },
    isLoading () {
      return (this.loading_ || this.loading) && this.hasLoadingPage
    },
    isError () {
      return (this.error_ || this.error) && this.hasErrorPage
    }
  },
  watch: {
    id (val) {
      if (val) {
        console.log('get data', val)
        this.refreshData(val)
      }
      else {
        this.data_ = null
      }
    }
  },
  methods: {
    async refreshData (key) {
      try {
        this.loading_ = true
        this.data_ = await this.getData_(key)
        this.loading_ = false
      }
      catch (e) {
        this.error_ = true
        this.errorMessage = e.message || e + ''
        this.errorCode = e.code || 0
      }
      finally {
      }
    },
    getData_ (key, method = this.getData, asynchronous = this.async) {
      // console.log(key, method, asynchronous)
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
    if (this.id) {
      this.refreshData(this.id)
    }
  }
}
</script>

<style scoped>

</style>
