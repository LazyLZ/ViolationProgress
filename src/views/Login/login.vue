<template>
  <v-app :dark="dark">
    <not-auth-toolbar :show-login="isGetToken"></not-auth-toolbar>
    <v-content>
      <v-alert
        class="ma-0"
        :value="true"
        type="warning"
        v-if="smallScreen"
      >
        屏幕分辨率过低, 系统部分内容可能不能正常显示
      </v-alert>
      <v-slide-y-transition mode="out-in">
        <v-container justify-center v-if="!isGetToken">
          <v-layout class="pt-5" fill-height justify-center>
            <v-slide-y-transition group hide-on-leave>
              <v-card class="elevation-4" key="account" max-width="500px" v-if="loginType === 'account'">
                <v-card-title>
                  <span class="headline pl-2">用户登录</span>
                </v-card-title>
                <!--<v-divider></v-divider>-->
                <v-card-text class="py-0">
                  <v-container class="pb-0 pt-2">
                    <v-form ref="accountForm">
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-text-field
                            :rules="[ v=> !!v || '请输入用户名']"
                            @keyup.enter="$refs.accountPassword.focus()"
                            label="用户ID"
                            placeholder="请输入用户ID"
                            prepend-icon="mdi-account"
                            v-model="accountForm.loginId"
                          ></v-text-field>
                        </v-flex>
                        <v-flex class="py-1" xs12>
                          <v-text-field
                            :rules="[ v=> !!v || '请输入密码']"
                            @keyup.enter="login()"
                            label="密码"
                            placeholder="请输入密码"
                            prepend-icon="mdi-lock"
                            ref="accountPassword"
                            type="password"
                            v-model="accountForm.password"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-form>
                    <v-expand-transition>
                      <v-layout v-if="error">
                        <v-flex class="pl-2 error--text">{{errorMessage}}</v-flex>
                      </v-layout>
                    </v-expand-transition>
                    <v-expand-transition>
                      <verify-form ref="accountVerify" v-if="needVerify" v-model="verifyKey"></verify-form>
                    </v-expand-transition>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :loading="loginLoading" @click="login" color="primary" flat large>登录</v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="elevation-4" key="portal" max-width="500px" v-if="loginType ==='portal'">
                <v-card-title>
                  <span class="headline pl-2">Portal登录</span>
                </v-card-title>
                <!--<v-divider></v-divider>-->
                <v-card-text class="py-0">
                  <v-container class="pb-0 pt-2">
                    <v-form ref="portalForm">
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-text-field
                            :rules="[ v=> !!v || '请输入学号或工号']"
                            @keyup.enter="$refs.portalPassword.focus()"
                            label="学号/工号"
                            placeholder="请输入学号/工号"
                            prepend-icon="mdi-account-card-details"
                            v-model="portalForm.loginId"
                          ></v-text-field>
                        </v-flex>
                        <v-flex class="py-1" xs12>
                          <v-text-field
                            :rules="[ v=> !!v || '请输入密码']"
                            @keyup.enter="login()"
                            label="密码"
                            placeholder="请输入密码"
                            prepend-icon="mdi-lock"
                            ref="portalPassword"
                            type="password"
                            v-model="portalForm.password"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-form>
                    <v-expand-transition>
                      <v-layout v-if="error">
                        <v-flex class="pl-2 error--text">{{errorMessage}}</v-flex>
                      </v-layout>
                    </v-expand-transition>
                    <v-expand-transition>
                      <verify-form ref="portalVerify" v-if="needVerify" v-model="verifyKey"></verify-form>
                    </v-expand-transition>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :loading="loginLoading" @click="login" color="primary" flat large>登录</v-btn>
                </v-card-actions>
              </v-card>
            </v-slide-y-transition>
          </v-layout>
          <!--<v-layout class="pt-4" justify-center>-->
            <!--<v-btn :disabled="loginLoading"-->
                   <!--@click="loginType = loginType === 'account'?'portal':'account', resetLoginError()"-->
                   <!--color="primary" flat>-->
              <!--{{loginType === 'account'? 'portal账号':'用户账号'}}登录-->
            <!--</v-btn>-->
          <!--</v-layout>-->
        </v-container>
        <v-container align-center fill-height v-else>
          <v-layout align-center class="pt-4" column style="height: 200px">
            <span class="headline pb-3" v-if="!initError.error">加载系统信息中...</span>
            <span class="headline pb-3" v-else>加载系统信息出错</span>
            <v-progress-linear
              :color="initError.error? 'error': 'accent'"
              :height="3"
              :indeterminate="!initError.error"
            ></v-progress-linear>
            <div class="subheading" v-if="initError.error">
              <span>{{initError.message}}</span>
              <span class="px-3">code: {{initError.code}}</span>
            </div>
            <div class="py-2" v-if="initError.error">
              <v-btn @click="initSystemInfo()" class="mx-0" color="primary" flat>重新加载</v-btn>
              <v-btn @click="initSystemInfo(true)" class="mx-0" color="error" flat>直接进入</v-btn>
            </div>
          </v-layout>
        </v-container>
      </v-slide-y-transition>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import AppFooter from '../APP/Footer/appFooter'
import NotAuthToolbar from '../APP/Toolbar/notAuthToolbar'
import VerifyForm from './verifyForm'

export default {
  name: 'login',
  components: {VerifyForm, NotAuthToolbar, AppFooter},
  data: () => ({
    verifyKey: '',
    needVerify: false,
    loginType: 'account',
    error: true,
    errorMessage: '',
    loginLoading: false,
    portalForm: {
      loginId: '',
      password: '',
    },
    accountForm: {
      loginId: '',
      password: '',
    },
    initError: {
      error: false,
      message: '',
      code: 0
    }
  }),
  computed: {
    smallScreen () {
      return this.$vuetify.breakpoint.smAndDown
    },
    isLogin () {
      return this.$store.getters['login/isLogin']
    },
    isGetToken () {
      return this.$store.getters['login/isGetToken']
    },
    dark: {
      get () {
        return this.$store.getters.dark
      },
      set (val) {
        this.$store.commit('setDark', val)
      }

    }
  },
  methods: {
    showLoginError (e) {
      this.error = true
      this.errorMessage = e.message
      console.error(e)
    },
    resetLoginError () {
      this.error = false
      this.errorMessage = ''
    },
    resetInitError () {
      this.initError = {error: false, message: ''}
    },
    showInitError (e) {
      this.initError = {error: true, message: e.message || e + '', code: e.code || 0}
    },
    async initSystemInfo (force = false) {
      this.resetInitError()
      try {
        await this.$store.dispatch('login/initSystemInfo', force)
        // let e = {
        //   message: '测试错误',
        //   code: -9
        // }
        // throw e
        let to = this.$route.params.to
        this.$router.replace(to ? to.fullPath : '/')
      }
      catch (e) {
        this.showInitError(e)
        if (force) {
          let to = this.$route.params.to
          this.$router.replace(to ? to.fullPath : '/')
        }
      }
    },
    async login () {
      this.resetLoginError()
      this.resetInitError()
      let type = this.loginType
      if (!this.$refs[type + 'Form'].validate()) {
        return
      }
      let verify = this.$refs[type + 'Verify'] || {}
      try {
        this.loginLoading = true
        if (this.needVerify) {
          verify.clearError()
          let result = await verify.check()
          console.log(result)
          if (!result) {
            this.loginLoading = false
            return
          }
        }
        let f = this[type + 'Form']
        await this.$store.dispatch('login/login', Object.assign({verifyKey: this.verifyKey, type: type}, f))
        await this.initSystemInfo()
      }
      catch (e) {
        if (e.message === '请进行验证码验证！' || e.message === '无验证状态！') {
          if (this.needVerify) {
            verify.refresh()
          }
          this.needVerify = true
        }
        else {
          this.showLoginError(e)
          if (this.needVerify) {
            verify.refresh()
          }
        }
      }
      finally {
        this.loginLoading = false
      }
    }
  },
  async created () {
    if (this.isGetToken) {
      this.initSystemInfo()
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   console.log(to.path, from.path, to, from)
  //   next()
  // }
}
</script>

<style scoped>

</style>
