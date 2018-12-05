<template>
  <l-operation-dialog
    :title="title"
    disable-cancel
    v-model="value_"
  >
    <slot name="activator" slot="activator"></slot>
    <v-layout column>
      <v-flex align-center column justify-center layout>
        <v-icon class="pb-3" color="error" large>mdi-alert-circle</v-icon>
        <span class="subheading">{{errorTitle}}</span>
      </v-flex>
      <!--<v-flex slot="scroll">-->
      <!--<div style="word-wrap: break-word; word-break: break-all" class="text-xs-center pt-2 pb-1">-->
      <!--{{'This is a error message'.repeat(25)}}-->
      <!--</div>-->
      <!--</v-flex>-->
    </v-layout>
    <v-flex slot="scroll" class="pb-2">
      <div class="text-xs-center pt-2 pb-1" style="word-wrap: break-word; word-break: break-all">
        {{errorMessage}}
      </div>
    </v-flex>
  </l-operation-dialog>
</template>

<script>
import LOperationDialog from './LOperationDialog'

export default {
  name: 'LErrorDialog',
  components: {LOperationDialog},
  props: {
    value: {},
    title: {type: String, default: '发生错误'},
    errorTitle: {type: String, default: '发生错误'},
    errorMessage: {type: String, default: ''},
  },
  data: () => ({
    activate: false
  }),
  computed: {
    value_: {
      get () {
        if (this.value === undefined) {
          return this.activate
        }
        else {
          return this.value
        }
      },
      set (val) {
        if (this.value === undefined) {
          this.activate = val
        }
        else {
          this.$emit('input', val)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
