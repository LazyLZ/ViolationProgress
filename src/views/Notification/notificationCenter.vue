<template>
  <v-app>
    <not-auth-toolbar can-go-back show-login>
      <v-toolbar-title slot="title">
        <span>通知中心</span>
      </v-toolbar-title>
    </not-auth-toolbar>
    <v-content>
      <v-container fill-height jusify-center>
        <v-layout class="pt-5 subheading">
          <v-flex class="text-xs-center grey--text">没有消息通知</v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import NotAuthToolbar from '../APP/Toolbar/notAuthToolbar'
import AppFooter from '../APP/Footer/appFooter'
export default {
  name: 'NotificationCenter',
  components: {AppFooter, NotAuthToolbar}
}
</script>

<style scoped>

</style>
