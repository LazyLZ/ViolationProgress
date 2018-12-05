<template>
  <v-menu
    ref="menu"
    :disabled="readonly || disabled"
    :close-on-content-click="false"
    v-model="menu"
    lazy
    transition="scale-transition"
    :offset-y="!offsetX"
    :offset-x="offsetX"
    full-width
    max-width="290px"
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      :disabled="disabled"
      v-model="timeFormatted"
      :label="label"
      hint="格式: 24h hh:mm"
      persistent-hint
      :rules="[...rules, timeRule]"
      :prepend-icon="hideIcon ? '' : 'access_time'"
      :clearable="!readonly"
      :error="error"
      clear-icon="clear"
      @blur="date = parseTime(timeFormatted)"
      @close="date = parseTime(timeFormatted)"
      @keyup.enter="date = parseTime(timeFormatted)"
    ></v-text-field>
    <v-time-picker
      v-if="menu"
      :max="max"
      :min="min"
      v-model="time"
      format="24hr"
      @change="$refs.menu.save(timeFormatted)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'LSelectTime',
  data: () => ({
    time: null,
    timeRule: v => !v || /^(20|21|22|23|[0-1]\d):[0-5]\d$/i.test(v) || '时间格式不正确，格式: hh:mm',
    timeFormatted: null,
    menu: false,
  }),
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {type: Boolean, default: false},
    offsetX: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '',
    },
    hideIcon: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    max: {type: String},
    min: {type: String},
    value: {}
  },
  watch: {
    time (val) {
      this.timeFormatted = this.formatTime(this.time)
      // this.$emit('change', this.formattime(this.time))
    },
    timeFormatted (val) {
      let pattern = /^\d\d:\d\d$/i
      if (pattern.test(val)) {
        this.time = this.parseTime(val)
      }
      this.submit()
      // console.log(val, pattern.test(val))
    },
    value (val) {
      this.timeFormatted = val
    }
  },
  methods: {
    formatTime (time) {
      if (!time) {
        // if (this.timeFormatted)
        return null
      }
      const [hour, minute] = time.split(':')
      return `${hour}:${minute}`
    },
    parseTime (time) {
      if (!time) return null
      const [hour, minute] = time.split(':')
      if (!(hour && minute)) return null
      return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
    },
    submit () {
      // console.log('submit', this.timeFormatted)
      this.$emit('input', this.timeFormatted)
    }
  },
  created () {
    this.timeFormatted = this.value
  }
}
</script>

<style scoped>

</style>
