<template>
  <v-app :dark="dark">
    <!--全局提示-->
    <l-alert :message="a.message" :title="a.title" :type="a.type" v-model="globalAlertActivate"></l-alert>
    <!--全局操作确认-->
    <l-operation-dialog
      :cancelText="o.cancelText"
      :confirmText="o.confirmText"
      :disableCancel="o.disableCancel"
      :disableConfirm="o.disableConfirm"
      :icon="o.icon"
      :iconColor="o.iconColor"
      :onCancel="o.onCancel"
      :onConfirm="o.onConfirm"
      :subText="o.subText"
      :text="o.text"
      :title="o.title"
      :width="o.width"
      v-model="globalOperationActivate"
    ></l-operation-dialog>

    <!--全局删除提示-->

    <!--登录过期计时退出对话框-->
    <l-exit-dialog></l-exit-dialog>

    <transition mode="out-in" name="page">
      <router-view></router-view>
    </transition>
  </v-app>

</template>

<script>
import {createHelpers} from 'vuex-map-fields'

import LAlert from '@/components/Alerts/LAlert'
import LOperationDialog from '@/components/Alerts/LOperationDialog'
import LExitDialog from '@/components/Alerts/LExitDialog'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})
export default {
  name: 'App',
  components: {
    LOperationDialog,
    LAlert,
    LExitDialog,
  },
  computed: {
    a () {
      return this.globalAlert
    },
    o () {
      return this.globalOperation
    },
    ...mapFields([
      'dark',
      'globalAlert',
      'globalAlertActivate',
      'globalOperation',
      'globalOperationActivate',
    ]),
  },
  created () {
    this.$store.commit('checkPlatform')
    // this.$store.commit('login/recoveryLogin')
  }
}
</script>
<style>
  html, body {
    overflow: auto !important;
  }

  .page-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .page-enter, .page-leave-to {
    transform: translateY(7px);
    opacity: 0;
  }
</style>
