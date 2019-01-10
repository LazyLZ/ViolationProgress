<template>
  <div
    id="fill-container"
    ref="container"
    style="overflow-y: hidden"
    v-resize="onWindowResize"
  >
    <!--//{{scrollTop}}//{{offsetTop}}-->
    <div class="fixed-top" ref="top" style="position: relative ;z-index: 2">
      <slot name="fixed-top"></slot>
    </div>
    <slot name="prepend"></slot>
    <div
      id="scroll"
      ref="scroll"
      style="position: relative;z-index: 0; overflow-y: auto"
      v-scroll:#scroll="onScroll"
    >
      <slot></slot>
    </div>
    <slot name="append"></slot>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  name: 'LFixedWindow',
  props: {
    offsetTop: {
      type: Number,
      default: 0
    },
    toBottom: {
      type: Number,
      default: 0,
    }
  },
  data: () => ({
    mounted: false,
    windowHeight: window.innerHeight,
    fixedTop: 0,
    fixedHeight: 0,
    scrollTop: 0,
  }),
  computed: {
    contentHeight () {
      return Math.floor(this.windowHeight - this.scrollTop - this.toBottom) - 1
    },
  },
  watch: {
    // offsetTop (val) {
    //   let sDom = this.$refs.scroll
    //   sDom.scrollTop = val
    // }
    scrollTop (val) {
      if (this.$refs.scroll) {
        // console.log('scrollTopChange', val)
        this.$refs.scroll.style.height = this.contentHeight + 'px'
        this.refreshDom()
      }
    },
    contentHeight () {
      this.$refs.scroll.style.height = this.contentHeight + 'px'
    }
  },
  methods: {
    setOverflowY (val) {
      if (this.$refs.scroll) {
        this.$refs.scroll.style.overflowY = val
      }
    },
    test () {
      console.log('size change')
    },
    onWindowResize () {
      this.windowHeight = window.innerHeight
      this.refreshDom()
    },
    emitScroll: throttle(function (e) {
      // console.log('emit')
      this.$emit('update:offsetTop', e.target.scrollTop)
      this.refreshDom()
    }, 400, {leading: true}),
    onScroll: function (e) {
      // console.log('scroll', e.target.scrollTop)
      if (e.target.scrollTop === 0) {
        this.$emit('update:offsetTop', e.target.scrollTop)
        this.refreshDom()
      }
      else {
        this.emitScroll(e)
      }
    },
    refresh (next = true) {
      // if (next) {
      //   this.$nextTick(() => {
      //     this.refreshDom()
      //   })
      // }
      // else {
      this.refreshDom()
      // }
    },
    refreshDom: throttle(function () {
      // this.fixedTop = this.$refs.top.getBoundingClientRect().top || 0
      // this.fixedHeight = this.$refs.top.offsetHeight

      if (this.$refs.scroll) {
        this.scrollTop = this.$refs.scroll.getBoundingClientRect().top || 0
        // console.log('refresh Dom')
        // console.log('scrollTop', this.scrollTop, this.fixedHeight, this.fixedTop, this.topHeight)
      }
    }, 100, {trailing: true}),
  },
  activated () {
    // console.log('activated')
    if (this.$refs.scroll && this.offsetTop !== this.$refs.scroll.scrollTop) {
      this.$emit('update:offsetTop', this.$refs.scroll.scrollTop)
    }
    this.refreshDom()
  },
  mounted () {
    this.mounted = true
    // this.setOverflowY('hidden')

    // this.syncDom()
    // this.refreshDom()
    // this.$nextTick(() => {
    //   this.refreshDom()
    // })
    // setTimeout(() => {
    //   // console.log('refresh')
    //   this.refreshDom()
    //   this.setOverflowY('auto')
    // }, 250)
    // setTimeout(() => {
    //   // console.log('refresh')
    //   this.refreshDom()
    //   // this.setOverflowY('auto')
    // }, 500)
  }
}
</script>

<style scoped>

</style>
