<template>
  <transition-group
    name="l-expand"
    @after-enter="afterEnter"
    @enter="enter"
    @leave="leave"
  >
    <slot></slot>
  </transition-group>
</template>

<script>
export default {
  name: 'LExpandTransitionGroup',
  methods: {
    enter (el) {
      // console.log('enter', el)
      el._parent = el.parentNode
      el.style.height = 0
      el.style.overflow = 'hidden'
      // el.style.display = 'block'
      setTimeout(() => {
        el.style.height = !el.scrollHeight
          ? 'auto'
          : `${el.scrollHeight}px`
      }, 100)
    },
    leave (el) {
      el.style.overflow = 'hidden'
      el.style.height = `${el.scrollHeight}px`

      setTimeout(() => (el.style.height = 0), 100)
      // console.log('leave', el)
    },
    afterEnter (el) {
      el.style.overflow = null
      el.style.height = null
      // console.log('after enter', el, el.offsetHeight)
    },
    // afterLeave (el) {
    //   // console.log('after leave', el, el.offsetHeight)
    // },
  }
}
</script>

<style>
  .l-expand-move {
    transition: all 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .l-expand-leave-active {
    transition: all 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .l-expand-enter-active {
    transition: all 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  }
</style>
