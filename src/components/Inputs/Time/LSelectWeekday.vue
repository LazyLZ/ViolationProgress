<template>
  <v-select
    :readonly="readonly"
    :disabled="disabled"
    :label="label"
    :items="weekdays"
    :error="error"
    :rules="rules"
    v-model="select"
    :multiple="multiple"
  ></v-select>
</template>

<script>
let cnShort = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
let cnLong = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
let enLong = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
let enShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export default {
  name: 'LSelectWeekday',
  props: {
    readonly: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    value: {},
    mode: {
      type: String,
      default: 'cn-long'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    error: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    returnNumber: {
      type: Boolean,
      default: false,
    },
    startNumber: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    select: '',
  }),
  computed: {
    weekdays () {
      let ws = cnLong
      switch (this.mode) {
        case 'cn-long':
          ws = cnLong
          break
        case 'cn-short':
          ws = cnShort
          break
        case 'en-long':
          ws = enLong
          break
        case 'cen-short':
          ws = enShort
          break
      }
      if (this.returnNumber) {
        let s = this.startNumber
        return [
          {text: ws[0], value: s},
          {text: ws[1], value: s + 1},
          {text: ws[2], value: s + 2},
          {text: ws[3], value: s + 3},
          {text: ws[4], value: s + 4},
          {text: ws[5], value: s + 5},
          {text: ws[6], value: s + 6},
        ]
      }
      else {
        return ws
      }
    },
  },
  watch: {
    select () {
      this.submit()
    },
    value () {
      this.select = this.value
    }
  },
  methods: {
    submit () {
      this.$emit('input', this.select)
    }
  },
  created () {
    this.select = this.value
    if (this.multiple && !(this.select instanceof Array)) {
      this.select = []
      if (this.value && this.weekdays.indexOf(this.value) !== -1) {
        this.select.push(this.value)
      }
    }
  }
}
</script>

<style scoped>

</style>
