<template>
  <v-app>
    <not-auth-toolbar can-go-back>
      <v-toolbar-title slot="title">
        <span>个人中心</span>
        <span class="mx-2">|</span>
        <span class="font-weight-light primary--text">{{self.name || self.loginId}}</span>
      </v-toolbar-title>
    </not-auth-toolbar>
    <v-content>
      <l-fixed-window :to-bottom="36">
        <l-layout :layout="['xs12', 'lg10']">
          <v-layout>
            <user-details-content :data="self"></user-details-content>
          </v-layout>
          <v-layout class="py-4">
            <v-flex class="text-xs-right">
              <v-btn :loading="logoutLoading" @click="logout" color="primary">退出登录</v-btn>
            </v-flex>
          </v-layout>
        </l-layout>
      </l-fixed-window>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>

import NotAuthToolbar from '../APP/Toolbar/notAuthToolbar'
import AppFooter from '../APP/Footer/appFooter'
import UserDetailsContent from '../UserAdmin/User/userDetailsContent'
import LLayout from '../../components/Layout/LLayout'
import LFixedWindow from '../../components/Layout/LFixedWindow'

let LOGIN_PAGE_NAME = 'Login'
export default {
  name: 'personalCenter',
  components: {LFixedWindow, LLayout, UserDetailsContent, AppFooter, NotAuthToolbar},
  data: () => ({
    logoutLoading: false,
  }),
  computed: {
    self () {
      return this.$store.state.login.self || {}
    }
  },
  methods: {
    async logout () {
      this.logoutLoading = true
      try {
        await this.$store.dispatch('login/logout')
        this.value_ = false
        this.$router.push({name: LOGIN_PAGE_NAME})
      }
      catch (e) {
        this.$store.dispatch('alert', {type: 'error', title: '登出时发生错误', message: e.message})
      }
      finally {
        this.logoutLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
