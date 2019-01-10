<template>
  <div>
    <!--<div>{{routeName}} {{Object.keys(cache)}}</div>-->
    <slot :data="data_" :id="id" v-if="!isError && !isLoading && isRouterIn"></slot>
    <slot name="loading" v-if="isLoading && !isError">
      <v-layout class="my-5" justify-center>
        <v-progress-circular color="primary" indeterminate size="60"></v-progress-circular>
      </v-layout>
    </slot>
    <slot :code="errorCode_" :message="errorMessage_" name="error" v-if="isError">
      <v-layout align-center class="my-5 text-xs-center" column justify-center>
        <v-flex class="subheading">
          发生错误: {{errorMessage_}}, code: {{errorCode_}}
        </v-flex>
        <v-flex class="py-4">
          <v-btn @click="retry()" color="primary" flat>点击重试</v-btn>
        </v-flex>
      </v-layout>
    </slot>
    <!--<div>{{cache}}</div>-->
  </div>
</template>

<script>
// import F from '../../utils/functional'

class _Error extends Error {
  constructor (msg, code = 0) {
    super(msg)
    this.msg = msg
    this.code = code
  }
}

export default {
  name: 'LCache',
  props: {
    // 必须设置为使用此组件的路由的cacheKey设置的字段名的值，
    // 并且改值必须唯一确定获取的对象
    // 该值作为参数传入getData函数中
    id: {type: String, default: ''},

    // 获取数据的参数，建议为异步函数
    getData: {type: Function},

    // getData是否是异步函数，默认为true
    async: {type: Boolean, default: true},

    // 手动将组件设置为loading状态（不显示data）
    loading: {type: Boolean, default: false},

    // 手动将组件设置为error状态 （不显示data）
    error: {type: Boolean, default: false}
  },
  data: () => ({
    routeName: '',
    isRouterIn: true,
    cache: {},
    errorMessage_: '',
    errorCode_: 0,
    data_: null,
    loading_: false,
    error_: false,
  }),
  computed: {
    lastCloseTab () {
      return this.$store.state.$L.lastCloseTab
    },
    hasLoadingPage () {
      return !!this.$slots.loading || !!this.$scopedSlots.loading
    },
    hasErrorPage () {
      return !!this.$slots.error || !!this.$scopedSlots.error
    },
    isLoading () {
      return (this.loading_ || this.loading)
    },
    isError () {
      return (this.error_ || this.error)
    }
  },
  watch: {
    '$route' (to, from) {
      // 每次路由跳转都重新判断当前是否在该路由（需要缓存数据的路由）中
      this.isRouterIn = to.name === this.routeName

      // 这里直接获取了cacheKey,原因在于：
      // 如果在路由跳转时cacheKey设置的值没有变（规定cacheKey的参数必须等于id设置时的参数），
      // id的watcher就不会触发，所以要手动判断触发
      // let toKey = F.getAttr(to, to.meta.cacheKey)
      // let fromKey = F.getAttr(from, from.meta.cacheKey)
      // if (toKey === fromKey && this.isRouterIn) {
      //   this.refreshData(this.id)
      // }
      // // console.log('router change', to.meta.cacheKey, from.meta.cacheKey)
      // // if (this.data_) {
      // //   this.loading_ = true
      // // }
      // console.log('isRouteIn', this.routeName, this.isRouterIn, !!this.data_)
      // // console.log('$route change', to.fullPath, from.fullPath, this.$route.name)

      // 废弃监听id的思路，将获取逻辑和id解耦，但和路由高度耦合
      // 此处暂时先将LCache和路由紧密结合
      // TODO LCache和路由以及lastCloseTab解耦
      if (this.isRouterIn) {
        this.refreshData(this.id)
      }
    },
    lastCloseTab (val) {
      // 监听标签关闭，关闭标签时销毁该缓存
      // console.log('closeTab', val)
      // 标签需要由cacheKey并且标签的路由名称要为当前路由名称
      // console.log('close tab', val)
      if (val instanceof Array && val.length > 0) {
        val.forEach(tab => {
          if (this.cache.hasOwnProperty(tab.cacheKey) && tab.name === this.routeName) {
            this.clear(tab.cacheKey)
            // console.log('clear', this.routeName, tab.cacheKey)
          }
        })
      }
      else if (val instanceof Object && val.cacheKey) {
        if (this.cache.hasOwnProperty(val.cacheKey) && val.name === this.routeName) {
          this.clear(val.cacheKey)
          // console.log('clear', this.routeName, val.cacheKey)
        }
      }
    },

    // // *注意* 仅仅依靠id来区分是有问题的
    // // 因为有可能存在两个不同名的路由但是传入的id完全相同，这样在路由跳转的时候并不会触发id的watcher
    // id (val) {
    //   console.log('id change', this.routeName, val, this.isRouterIn)
    //   if (val && this.isRouterIn) {
    //     console.log('get data', val)
    //     this.refreshData(val)
    //   }
    //   else if (!val) {
    //     console.log('invalid id', val)
    //     this.data_ = null
    //   }
    //   else {
    //     console.log('route not in', this.routeName)
    //   }
    // }
  },
  methods: {
    clear (key) {
      if (this.cache.hasOwnProperty(key)) {
        delete this.cache[key]
      }
      if (key === this.id && this.isRouterIn) {
        this.refreshData(this.id)
      }
    },
    clearAll () {
      this.cache = {}
      if (this.isRouterIn) {
        this.refreshData(this.id)
      }
    },
    resetError () {
      this.errorCode_ = 0
      this.errorMessage_ = ''
      this.error_ = false
    },

    setData (data) {
      this.data_ = data
      this.cache[this.id] = data
    },

    // 用于错误后的重试,或者强制刷新数据
    async retry (silent = false) {
      let key = this.id
      // 重试前要清掉缓存中的Error对象
      delete this.cache[key]
      // 此时调用refreshData和没报错时状态一样
      await this.refreshData(key, silent)
    },

    // 刷新数据并控制页面显示（loading，error）的函数
    async refreshData (key, silent = false) {
      // 首先启动loading，保证loading未结束时不启用data组件防止报错
      if (!silent) {
        this.loading_ = true
      }

      // 清空 *显示* 错误的字段，但缓存中的Error对象并没有清除
      this.resetError()
      try {
        // 用户传入的获取数据函数，此函数不涉及任何显示字段
        let temp = await this.getData_(key)

        // 如果temp === false表示此时该数据仍未获取到（Promise未resolve）
        if (temp === false) {
          // 直接退出函数，不执行任何操作，loading仍为true
          return
        }

        // 如果缓存是Error对象，说明上一次获取时发生错误，此时不重复获取而是显示上次错误
        // 交给用户决定是否获取数据（调用retry重置错误）
        if (this.cache[key] instanceof _Error) {
          // 重新显示上次（缓存中）的错误
          let e = this.cache[key]
          this.error_ = true
          this.errorMessage_ = e.message || e + ''
          this.errorCode_ = e.code || 0
          // 此时状态已经为error，所以将loading设为false来显示error
          this.loading_ = false
          return
        }

        // 如果函数运行到此处说明获取数据未发生错误

        // 如果此时id === key，说明loading时用户没有切换界面
        // 此时将获取到的数据（temp）赋给data_让页面使用
        if (this.id === key) {
          this.data_ = temp
          this.loading_ = false
        }
        // 如果id ！== data说明此时用户切换了界面，此时将获取到的数据存入缓存，不切换data_
        else {
          this.cache[key] = temp
        }
      }
      catch (e) {
        // 这里cache到的错误理论上全部来源于getData_()函数获取数据的报错
        // 此时将错误包装成Error对象（需要区分Error对象还是正常的data对象），缓存到cache
        this.cache[key] = new _Error(e.message || e + '', e.code || 0)
        // 页面状态设为error并显示错误
        this.error_ = true
        this.errorMessage_ = e.message || e + ''
        this.errorCode_ = e.code || 0
        // 页面状态已经是error，此时将loading设为false
        this.loading_ = false
      }
      finally {
        // 这里的代码即使上边return了也会运行，所以在这里不放任何功能代码以更好的控制代码流程。
        // console.log('loading false', this.routeName, key)
      }
    },
    // 获取数据的函数，封装用户的获取数据函数以处理缓存和报错。
    // 后两个参数为冗余参数，调用时不要设置
    getData_ (key, method = this.getData, asynchronous = this.async) {
      // console.log(key, method, asynchronous)
      let cache = this.cache
      // 如果缓存中有该key值
      if (cache.hasOwnProperty(key)) {
        // 值为false代表该数据仍在获取中（Promise未返回），此时直接返回false
        if (cache[key] === false) {
          return false
        }
        // 否则代表数据已经获取到或者已经报错，此时直接返回缓存对象（也可能是一个错误对象，交给上一级处理）
        if (asynchronous) {
          // 如果是异步函数则返回一个立即resolve的Promise
          return new Promise(resolve => {
            resolve(cache[key])
          })
        }
        // 如果是同步函数则直接返回
        else {
          return cache[key]
        }
      }
      // 如果缓存中没有该key值，则调用用户的获取数据函数
      // 检查是否为函数
      else if (typeof method === 'function') {
        // 如果是异步函数
        if (asynchronous) {
          // getData本身不是async所以使用Promise作为异步函数返回值
          return new Promise((resolve, reject) => {
            // Promise resolve前先将缓存中创建该键，并设为false，表示正在获取中
            cache[key] = false
            // 执行获取数据函数
            method(key).then(res => {
              // 获取成功则添加到缓存并resolve返回
              cache[key] = res
              resolve(cache[key])
            }).catch(e => {
              // 获取失败（报错）则直接返回错误数据，该数据在refreshData中会确保包装成Error对象并缓存
              reject(e)
            })
          })
        }
        else {
          // 同步函数则直接执行并返回
          cache[key] = method(key)
          return cache[key]
        }
      }
      // 用户没有设置函数，直接返回null，此时大概率报错
      else {
        // console.log('invalid method')
        return null
      }
    }
  },
  created () {
    // 在创建时保存该路由的名称，在当前路由不是该路由时不需要显示数据（显示的话因为id大概率为undefined会报错）
    this.routeName = this.$route.name
    // console.log('create', this.routeName)
    if (this.id) {
      this.refreshData(this.id)
    }
  },
}
</script>

<style scoped>

</style>
