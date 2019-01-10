<template>
  <v-dialog :max-width="maxWidth" :width="width" persistent scrollable v-model="value_">
    <slot name="activator" slot="activator"></slot>
    <v-card>
      <v-card-title class="title" style="height: 64px">
        <span>{{title}}</span>
        <slot name="title-append"></slot>
        <v-spacer></v-spacer>
        <slot name="title-action"></slot>
        <v-btn @click="cancel()" icon v-if="closeable">
          <v-icon>$vuetify.icons.close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider v-if="!hideDivider"></v-divider>
      <v-card-text :style="{maxHeight:maxHeight, minHeight: minHeight}">
        <slot></slot>
      </v-card-text>
      <v-divider v-if="!hideDivider"></v-divider>
      <v-card-actions v-if="!noAction">
        <v-spacer></v-spacer>
        <slot name="card-actions"></slot>
        <v-btn
          :disabled="disableCancel"
          @click="cancel()"
          color="grey"
          flat
          large v-if="!hideCancel"
        >{{cancelText}}
        </v-btn>
        <v-btn
          :disabled="disableConfirm"
          :loading="loading"
          @click="confirm()"
          color="primary"
          flat
          large
          v-if="!hideConfirm">{{confirmText}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'LDialog',
  props: {
    maxWidth: {type: String, default: '800px'},
    width: {type: String},
    maxHeight: {type: String},
    minHeight: {type: String},
    title: {type: String, default: ''},
    cancelText: {type: String, default: '取消'},
    confirmText: {type: String, default: '确认'},
    hideDivider: {type: Boolean, default: true},
    persistent: {type: Boolean, default: true},
    closeable: {type: Boolean, default: false},
    autoClose: {type: Boolean, default: true},
    disableCancel: {type: Boolean, default: false},
    disableConfirm: {type: Boolean, default: false},
    hideCancel: {type: Boolean, default: false},
    hideConfirm: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    value: {}
  },
  data: () => ({
    activate: false,
  }),
  computed: {
    noAction () {
      return this.disableCancel && this.disableConfirm && !this.$slots.cardActions
    },
    value_: {
      get () {
        return this.value === undefined ? this.activate : this.value
      },
      set (val) {
        this.value === undefined ? this.activate = val : this.$emit('input', val)
      }
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
      if (this.autoClose) {
        this.value_ = false
      }
    },
    confirm () {
      this.$emit('confirm')
      if (this.autoClose) {
        this.value_ = false
      }
    }
  }
}
</script>

<style scoped>

</style>
