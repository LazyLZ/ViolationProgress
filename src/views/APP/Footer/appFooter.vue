<template>
  <v-footer
    app
    class="footer"
    fixed
    height="auto"
  >
    <v-layout class="caption grey--text text-xs-center" justify-cetner>
      <v-flex offset-xs2 xs8>
        <span class="grey--text caption">&copy;{{(new Date()).getFullYear()}} 电子科技大学党委保卫部（保卫处）</span>
        <br v-if="xsScreen">
        <span class="ml-4 grey--text caption">技术支持：阳辰科技</span>
      </v-flex>
      <v-flex class="px-2 text-xs-right" xs2>
        <span v-if="!xsScreen">Ver. {{$L.cfg.version}}</span>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  name: 'appFooter',
  computed: {
    xsScreen () {
      return this.$vuetify.breakpoint.xsOnly
    },
  }
}
</script>

<style scoped>

</style>
