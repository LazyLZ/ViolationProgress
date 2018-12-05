<template>
  <v-menu
    :disabled="readonly || disabled"
    :close-on-content-click="false"
    v-model="menu"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      :disabled="disabled"
      :clearable="!readonly"
      clear-icon="clear"
      v-model="datetimeFormatted"
      :label="label"
      :error="error"
      :rules="[...rules, datetimeRule]"
      :hint="hint?hint:'格式：YYYY-MM-DD hh:mm'"
      persistent-hint
      @keyup.enter="menu = false"
      :prepend-icon="hideIcon ? '':'event'"
    ></v-text-field>
    <v-card>
      <v-card-text class="px-0 py-0">
        <v-layout row align-end justify-center wrap>
          <!--<v-flex xs12><h1>{{datetimeFormatted}}, {{date}}, {{time}}</h1></v-flex>-->
          <v-flex xs12>
            <v-date-picker
              :max="maxDate"
              :min="minDate"
              class="flat"
              v-model="date"
              no-title
              :first-day-of-week="0"
              locale="zh-cn"
            ></v-date-picker>
          </v-flex>
          <!--<v-flex xs6>-->
          <!--<v-time-picker-->
          <!--v-if="menu"-->
          <!--class="flat"-->
          <!--no-title-->
          <!--v-model="time"-->
          <!--format="24hr"-->
          <!--&gt;</v-time-picker>-->
          <!--</v-flex>-->
        </v-layout>
        <v-divider></v-divider>
        <v-container class="py-2" fluid grid-list-md>
          <v-layout row align-center justify-end>
            <v-flex xs6 class="grey--text text-xs-center subheading">{{dateFormatted}}</v-flex>
            <v-flex xs3>
              <v-text-field
                ref="hour"
                suffix="时"
                v-model="hour"
              ></v-text-field>
            </v-flex>
            <span class="mx-2">:</span>
            <v-flex xs3>
              <v-text-field
                ref="minute"
                suffix="分"
                v-model="minute"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-layout></v-layout>
    </v-card>
  </v-menu>
</template>

<script>
let datePattern = /^\d{4}-\d\d-\d\d$/i
let timePattern = /^(\d\d):(\d\d)$/i
let datetimePattern = /^(\d{4}-\d\d-\d\d) (\d\d:\d\d)$/i
export default {
  name: 'LSelectDatetime',
  props: {
    minDate: {type: String},
    maxDate: {type: String},
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false
    },
    hideIcon: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    hint: {
      type: String,
      default: '',
    },
    value: {}
  },
  data: () => ({
    date: null,
    hour: '',
    minute: '',
    // dateFormatted: '',
    timeFormatted: '',
    menu: false,
    datetimeRule: v => !v || /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (20|21|22|23|[0-1]\d):[0-5]\d$/i.test(v) || '时间格式不正确，格式：YYYY-MM-DD hh:mm',
    datetimeFormatted: ''
  }),
  computed: {
    time: {
      get () {
        if (this.hour && this.minute) {
          return `${this.hour}:${this.minute}`
        }
        else {
          return ''
        }
      },
      set (val) {
        let group = timePattern.exec(val)
        if (group) {
          this.hour = group[1]
          this.minute = group[2]
        }
        else {
          this.hour = ''
          this.minute = ''
        }
      }
    },
    dateFormatted () {
      let group = /^\d{4}-\d\d-\d\d/i.exec(this.datetimeFormatted)
      if (group) {
        let date = group[0]
        return this.parseDate(date)
      }
      else {
        return 'YYYY-MM-DD'
      }
    },
    inputComplete () {
      return timePattern.test(this.time) && datePattern.test(this.formatDate(this.date))
    }
  },
  watch: {
    // datetime () {
    //   this.datetimeFormatted = this.datetime
    // },
    hour (val, oldVal) {
      if (/^\d\d$/i.test(val) && this.$refs.minute && (oldVal.length < 2)) {
        // console.log('get focus', this.$refs.minute)
        this.$refs.minute.focus()
      }
      else if (/^\d\d(\d)+$/i.test(val)) {
        this.hour = val.slice(-1)
      }
    },
    minute (val, oldVal) {
      if (/^\d\d(\d)+$/i.test(val)) {
        this.minute = val.slice(-1)
      }
    },
    date (val, oldVal) {
      if (!this.time && val) {
        // console.log('new time', this.nowTime())
        this.time = '00:00'
        // this.time = this.nowTime()
      }
      this.$nextTick(() => {
        if (this.$refs.hour) {
          this.$refs.hour.focus()
        }
      })
      this.datetimeFormatted = this.computeDatetime(val)
      // console.log('set date', this.datetimeFormatted, this.date)
    },
    time (val) {
      this.datetimeFormatted = this.computeDatetime(val)
      // console.log('set time', this.datetimeFormatted)
    },
    value (val) {
      this.datetimeFormatted = val
      // console.log('input', val)
    },
    datetimeFormatted (val) {
      if (val === null) {
        this.date = ''
        this.time = ''
      }
      let group = datetimePattern.exec(val)
      if (group) {
        // console.log('complete', val)
        let date = group[1]
        let time = group[2]
        this.date = this.parseDate(date)
        this.time = time
        this.submit()
      }
      else if (!val) {
        this.submit()
        // console.log(val)
        // this.date = null
        // this.time = null
      }
    }
  },
  methods: {
    nowTime () {
      let t = new Date()
      return `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`
    },
    computeDatetime () {
      if (timePattern.test(this.time) && datePattern.test(this.formatDate(this.date))) {
        // console.log('all')
        return this.formatDate(this.date) + ' ' + this.time
      }
      else if (datePattern.test(this.formatDate(this.date))) {
        // console.log('date check')
        return this.formatDate(this.date)
      }
      else if (timePattern.test(this.time)) {
        // console.log('time check')
        return 'YY-MM-DD' + ' ' + this.time
      }
      else {
        // console.log('none check', this.date, this.time)
        return ''
      }
    },
    submit () {
      // console.log('submit', this.dateFormatted)
      this.$emit('input', this.datetimeFormatted)
    },
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
      // if (!(year && month && day)) return null
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  },
  created () {
    this.datetimeFormatted = this.value
  }
}
</script>
<style scoped>
  .flat {
    box-shadow: none !important;
  }
</style>
