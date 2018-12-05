<template>
  <l-operation-dialog
    @confirm="timeoutLogout()"
    confirm-text="立即退出"
    disable-cancel
    :auto-close="false"
    max-width="350px"
    title="登录信息失效"
    v-model="exitDialogActivate"
  >
    <slot name="activator" slot="activator"></slot>
    <v-layout class="mx-2" column>
      <v-flex align-center column justify-center layout>
        <v-icon class="pb-3" large>mdi-timer-sand-empty</v-icon>
        <span class="subheading">{{reason}}</span>
      </v-flex>
      <v-flex>
        <div class="text-xs-center pt-2 pb-1">系统将于<span class="px-1 primary--text">{{count}}</span>秒后自动退出
        </div>
      </v-flex>
    </v-layout>
  </l-operation-dialog>
</template>

<script>
import LOperationDialog from '../Alerts/LOperationDialog'
import {createHelpers} from 'vuex-map-fields'

const {mapFields} = createHelpers({
  getterType: 'login/getField',
  mutationType: 'login/updateField',
})
let countId
export default {
  name: 'authDenyDialog',
  components: {LOperationDialog},
  computed: {
    ...mapFields([
      'exitDialog.reason',
      'exitDialog.count',
      'exitDialogActivate',
    ]),
  },
  watch: {
    exitDialogActivate (val) {
      if (val) {
        countId = setInterval(() => {
          if (this.count === 0) {
            // console.log('logout')
            this.$store.dispatch('login/logout', true)
            this.$router.push('/')
            clearInterval(countId)
            this.exitDialogActivate = false
          }
          else if (!val || typeof this.count !== 'number' || isNaN(this.count)) {
            clearInterval(countId)
          }
          else {
            this.count = this.count - 1
            // console.log('count', this.count)
          }
        }, 1000)
      }
    },
    // timeoutCount (val, oldVal) {
    //   if (val > 0) {
    //     if (val > oldVal) {
    //       setTimeout(() => {
    //         this.timeoutCount = val - 1
    //       }, 1000)
    //     }
    //     else {
    //       setTimeout(() => {
    //         this.timeoutCount = this.timeoutCount - 1
    //       }, 1000)
    //     }
    //   }
    //   if (val === 0 && oldVal > 0) {
    //     this.timeoutLogout()
    //   }
    // },
  },
  methods: {
    timeoutLogout () {
      this.$store.dispatch('login/logout', true)
      clearInterval(countId)
      this.exitDialogActivate = false
      this.$router.push('/')
      // this.$store.dispatch('login/logoutCount', {second: 10})
    },
  }
}
</script>

<style scoped>

</style>
