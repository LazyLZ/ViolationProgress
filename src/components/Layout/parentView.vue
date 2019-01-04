<template>
  <!--<div>-->
    <!--//{{cacheList}}//-->
    <transition mode="out-in">
      <keep-alive :include="cacheList">
        <router-view ref="child"/>
      </keep-alive>
    </transition>
  <!--</div>-->
</template>
<script>
export default {
  name: 'ParentView',
  computed: {
    tagNavList () {
      return this.$store.state.$L.mainTabItems
    },
    notCacheName () {
      return [(this.$route.meta && this.$route.meta.notCache) ? this.$route.name : '']
    },
    cacheList () {
      // console.log('catchList change')
      let list = this.tagNavList.filter(item => !(item.notCache)).map(item => item.key)
      if (this.tagNavList.some(tab => tab.isChildren)) {
        list.push('ParentView')
      }
      let includeSet = new Set(list)
      console.log('catchList', [...includeSet])
      return [...includeSet]
    }
  },
  activated () {
    console.log('activate parent view')
    this.$forceUpdate()
  }
}
</script>
<style scoped>
  .v-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  /*.v-leave-active {*/
  /*transition: all 0.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
  /*}*/
  .v-enter, .v-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateY(7px);
    opacity: 0;
  }
</style>
