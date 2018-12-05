<template>
  <div>
    <span @click.stop="value_ = !value_">
    <slot name="activator"></slot>
      </span>
    <l-error-dialog
      :error-message="message || undefined"
      :error-title="title || undefined"
      v-if="isDialog && isError"
      v-model="value_"
    ></l-error-dialog>
    <v-snackbar
      :timeout="3000"
      bottom
      :color="isError? 'error': ''"
      v-if="isSnackbar"
      v-model="value_"
    >
      {{ message || title || defaultSnackbarMessage}}
      <v-btn
        :color="isError? '':'primary'"
        @click="value_ = false"
        flat
      >
        关闭
      </v-btn>
    </v-snackbar>
    <l-success-dialog
      :success-message="message || undefined"
      :success-title="title || undefined"
      v-if="isDialog && isSuccess"
      v-model="value_"
    ></l-success-dialog>
  </div>
</template>

<script>
import LErrorDialog from './LErrorDialog'
import LSuccessDialog from './LSuccessDialog'

export default {
  name: 'LAlert',
  components: {LSuccessDialog, LErrorDialog},
  props: {
    value: {},
    type: {
      type: String,
      default: ''
    },
    title: {type: String, default: ''},
    message: {type: String, default: ''}
  },
  data: () => ({
    activate: false
  }),
  computed: {
    defaultSnackbarMessage () {
      return this.isError ? '发生错误' : '操作成功'
    },
    isError () {
      return (this.type + '').indexOf('error') !== -1
    },
    isSuccess () {
      return (this.type + '').indexOf('success') !== -1
    },
    isDialog () {
      return (this.type + '').indexOf('dialog') !== -1 ||
        (this.isError && (this.type + '').indexOf('snackbar') === -1)
    },
    isSnackbar () {
      return (this.type + '').indexOf('snackbar') !== -1 ||
        (this.isSuccess && (this.type + '').indexOf('dialog') === -1)
    },
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
        console.log('set', val, this.isError, this.isSuccess, this.isDialog, this.isSnackbar)
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
