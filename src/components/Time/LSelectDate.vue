<template>
  <v-menu
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
      :clearable="!readonly"
      clear-icon="clear"
      v-model="dateFormatted"
      :label="label"
      :error="error"
      :rules="[...rules, dateRule]"
      hint="格式：YYYY-MM-DD"
      persistent-hint
      :prepend-icon="hideIcon ? '':'event'"
      @blur="date = parseDate(dateFormatted)"
      @close="date = parseDate(dateFormatted)"
      @keyup.enter="date = parseDate(dateFormatted)"
    ></v-text-field>
    <v-date-picker
      :max="max"
      :min="min"
      v-model="date"
      no-title
      @input="menu = false"
      :first-day-of-week="0"
      locale="zh-cn"
    ></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  name: 'LSelectDate',
  props: {
    readonly: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    offsetX: {type: Boolean, default: false},
    label: {type: String, default: ''},
    hideIcon: {type: Boolean, default: false},
    error: {type: Boolean, default: false},
    rules: {type: Array, default: () => []},
    max: {type: String},
    min: {type: String},
    value: {}
  },
  data () {
    return {
      menu: false,
      date: null,
      dateRule: v => !v || /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/i.test(v) || '日期格式不正确，格式：YYYY-MM-DD',
      dateFormatted: null
    }
  },
  computed: {
    test () {
      return !this.dateFormatted
    },
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
      // this.$emit('change', this.formatDate(this.date))
    },
    dateFormatted (val) {
      let pattern = /^\d{4}-\d\d-\d\d$/i
      if (pattern.test(val)) {
        this.date = this.parseDate(val)
      }
      this.submit()
      // console.log(val, pattern.test(val))
    },
    value (val) {
      this.dateFormatted = val
      // console.log('input', val)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) {
        // if (this.dateFormatted)
        return null
      }
      const [year, month, day] = date.split('-')
      return `${year}-${month}-${day}`
    },
    parseDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      if (!(year && month && day)) return null
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    submit () {
      // console.log('submit', this.dateFormatted)
      this.$emit('input', this.dateFormatted)
    }
  },
  created () {
    this.dateFormatted = this.value
  }
}
</script>

<style scoped>

</style>
