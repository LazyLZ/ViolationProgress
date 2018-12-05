<template>
  <div>

    <!--<v-tabs grow>-->
    <!--<v-tab>Item 1</v-tab>-->
    <!--<v-tab>Item 2</v-tab>-->
    <!--<v-tab>Item 3</v-tab>-->
    <!--</v-tabs>-->
    <!--<v-divider></v-divider>-->
    <div>test router 3 {{Math.random() * 1000}}</div>
    <!--<h1>//{{$vuetify.breakpoint.name}}//</h1>-->
    <v-btn @click="dialog = !dialog">trigger error</v-btn>
    <l-operation-dialog sub-text="您所做的操作将不会保存" text="确认离开此页?" title="确认离开">
      <v-btn slot="activator">trigger operation</v-btn>
    </l-operation-dialog>
    <l-error-dialog :error-message="'this is an error message'" error-title="手动触发错误"
                    v-model="dialog"></l-error-dialog>
    <l-success-dialog>
      <v-btn slot="activator">trigger success</v-btn>
    </l-success-dialog>
    <l-alert type="success snackbar dialog">
      <v-btn slot="activator">alert</v-btn>
    </l-alert>
    <v-btn @click="testLogout">logout</v-btn>
  </div>
</template>

<script>
import LOperationDialog from '../../components/Alerts/LOperationDialog'
import LErrorDialog from '../../components/Alerts/LErrorDialog'
import LSuccessDialog from '../../components/Alerts/LSuccessDialog'
import LAlert from '../../components/Alerts/LAlert'

export default {
  name: 'testRouter3',
  components: {LAlert, LSuccessDialog, LErrorDialog, LOperationDialog},
  data: () => ({
    dialog: false,
  }),
  methods: {
    testLogout () {
      this.$store.dispatch('login/logoutCount', {second: 10})
    }
  }
}
</script>

<style scoped>

</style>
