<template>
  <v-app :dark="dark">
    <not-auth-toolbar></not-auth-toolbar>
    <v-content>
      <v-container justify-center fill-height>
        <v-layout align-center justify-center column>
          <v-icon color="grey" size="64">mdi-help-circle</v-icon>
          <div class="display-2 grey--text mt-5 mb-3">401 Unauthorized</div>
          <v-btn flat color="primary" @click="goBack">返回</v-btn>
        </v-layout>
      </v-container>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import AppFooter from '../APP/Footer/appFooter'
import NotAuthToolbar from '../APP/Toolbar/notAuthToolbar'
export default {
  name: 'AccessDeny',
  components: {NotAuthToolbar, AppFooter},
  computed: {
    dark () {
      return this.$store.getters.dark
    }
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
