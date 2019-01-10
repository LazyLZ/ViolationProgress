<template>
  <v-toolbar :color="dark?'':'blue-grey darken-4'" dark app dense>
    <v-toolbar-side-icon @click="goBack()" v-if="canGoBack">
      <v-icon color="white">$vuetify.icons.back</v-icon>
    </v-toolbar-side-icon>
    <slot name="title">
    <v-toolbar-title v-if="xsScreen">
      <span class=" white--text font-weight-light">{{$L.cfg.appName.attr}}</span>
    </v-toolbar-title>
    <v-toolbar-title v-else>
      <span :class="'primary--text'">{{$L.cfg.appName.subTitle}}</span>
      <span class="px-2 white--text font-weight-light">|</span>
      <span class=" white--text font-weight-light">{{$L.cfg.appName.full}}</span>
    </v-toolbar-title>
    </slot>
    <v-spacer></v-spacer>
    <v-btn @click="dark = !dark" icon>
      <v-icon color="white">mdi-invert-colors</v-icon>
    </v-btn>
    <v-toolbar-items style="width: 64px" v-if="showLogin">
      <user-menu>
        <v-btn flat slot="activator">
          <span class="subheading primary--text">{{loginName || '未命名'}}</span>
        </v-btn>
      </user-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import UserMenu from '../../../components/Main/mainToolbar/userMenu'

export default {
  name: 'notAuthToolbar',
  components: {UserMenu},
  props: {
    showLogin: {type: Boolean, default: false},
    canGoBack: {type: Boolean, default: false}
  },
  computed: {
    loginName () {
      return this.$store.state.login.name
    },
    dark: {
      get () {
        return this.$store.getters.dark
      },
      set (val) {
        this.$store.commit('setDark', val)
      }
    },
    xsScreen () {
      return this.$vuetify.breakpoint.xsOnly
    },
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
  }
}
</script>

<style scoped>

</style>
