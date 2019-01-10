<template>
  <v-footer
    app
    class="footer"
    fixed
    height="auto"
    inset
  >
    <v-layout class="caption grey--text text-xs-center" justify-cetner align-center wrap>
      <v-flex class="px-4" xs12 sm2 :class="xsScreen?'text-xs-center':'text-xs-left'">
        <!--<div class="text-truncate">-->
        <span v-if="isDevelopment">System: {{platformName}}</span>
        <!--</div>-->
        <span
          :class="dark?'text--darken-3':'text--lighten-2'"
          class="text-xs-left caption grey--text pl-2"
        >{{passwordInput}}</span>
      </v-flex>
      <v-flex xs12 sm8>
        <span class="grey--text caption">&copy;{{(new Date()).getFullYear()}} 电子科技大学党委保卫部（保卫处）</span>
        <br v-if="xsScreen">
        <span v-else class="px-2"></span>
        <span class="grey--text caption">技术支持：阳辰科技</span>
      </v-flex>
      <v-flex class="px-2 text-xs-right" xs2 v-if="!xsScreen">
        <l-morse-click-input v-model="passwordInput">
          <div style="min-width: 80px; min-height: 1.5em">
            <span v-if="isDevelopment">Ver. {{$L.cfg.version}}</span>
          </div>
        </l-morse-click-input>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
import LMorseClickInput from '../../../components/Inputs/LMorseClickInput'
import debounce from 'lodash/debounce'
import {navDrawerItems} from '../../../router/navDrawerItems'

export default {
  name: 'appFooter',
  components: {LMorseClickInput},
  data: () => ({
    passwordInput: '',
    developerPassword: 'L'
  }),
  computed: {
    xsScreen () {
      return this.$vuetify.breakpoint.xsOnly
    },
    dark () {
      return this.$vuetify.dark
    },
    platformName () {
      let p = this.$store.getters.platform || {}
      return p.name || 'Unknown'
    },
    isDevelopment () {
      return this.$store.getters.isDevelopment
    }
  },
  watch: {
    passwordInput: debounce(function () {
      if (this.passwordInput === this.developerPassword) {
        this.openDeveloperConfig()
      }
      this.passwordInput = ''
    }, 2400),
  },
  methods: {
    openDeveloperConfig () {
      let d = navDrawerItems.find(nav => nav.id === 'developer_config')
      if (d) {
        d.development = false
        d.hidden = false
      }
    }
  }
}
</script>

<style scoped>

</style>
