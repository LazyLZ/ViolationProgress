<template>
  <v-menu
    :close-on-content-click="false"
    v-model="menu"
    lazy
    :disabled="readonly || disabled"
    transition="scale-transition"
    offset-y
    full-width
  >
    <v-text-field
      slot="activator"
      :clearable="!readonly"
      readonly
      :disabled="disabled"
      clear-icon="clear"
      :rules="[...rules, durationError]"
      v-model="durationFormatted"
      :label="label"
      :error="error"
      hint="年/月/日/时/分 - 年/月/日/时/分"
      persistent-hint
      @keyup.enter="menu = false"
      :prepend-icon="hideIcon ? '':'date_range'"
    ></v-text-field>
    <v-card>
      <v-container grid-list-md>
        <v-layout align-center>
          <v-flex xs6>
            <l-select-datetime
              v-model="startDatetime"
              hide-icon
              :disabled="disabledStart"
              label="起始时间"
            ></l-select-datetime>
          </v-flex>
          <span class="px-2 body-1 grey--text">至</span>
          <v-flex xs6>
            <l-select-datetime
              v-model="endDatetime"
              hide-icon
              :disabled="disabledEnd"
              :min-date="startDate"
              :max-date="maxDurationDate"
              label="终止时间"
            ></l-select-datetime>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script>
import LSelectDatetime from './LSelectDatetime'

// let datePattern = /^\d{4}\.\d\d\.\d\d$/i
// let timePattern = /^\d\d:\d\d$/i
// let datetimePattern = /^(\d{4}.\d\d.\d\d) (\d\d:\d\d)$/i
let durationPattern = /^(\d{4}-\d\d-\d\d \d\d:\d\d) ?- ?(\d{4}-\d\d-\d\d \d\d:\d\d)$/i
let durationRule = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d - [1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/i
export default {
  name: 'LSelectDatetimeDuration',
  components: {LSelectDatetime},
  props: {
    maxDurationDay: {type: Number},
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {type: Boolean, default: false},
    disabledStart: {type: Boolean, default: false},
    disabledEnd: {type: Boolean, default: false},
    label: {
      type: String,
      default: '',
    },
    startPlaceholder: {
      type: String,
      default: '',
    },
    endPlaceholder: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    hideIcon: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    menu: false,
    durationFormated: null,
    startDatetime: null,
    endDatetime: null,
    durationRule: v => !v || durationRule.test(v) || '时间段格式不正确：年/月/日/时/分 - 年/月/日/时/分',
    duration: {}
  }),
  computed: {
    maxDurationDate () {
      if (!this.maxDurationDay || !this.startDatetime) {
        return
      }
      let [year, month, day] = this.startDate.split('-')
      if (year && month && day) {
        let d = new Date(year, month - 1, day)
        d.setDate(d.getDate() + this.maxDurationDay)
        return this.util.formatDatetimefromDate(d, 'date')
      }
    },
    durationError () {
      return !this.startDatetime || !this.endDatetime || this.startDatetime <= this.endDatetime || '起始时间不能大于结束时间'
    },
    startDate () {
      let group = /^\d{4}-\d\d-\d\d/i.exec(this.startDatetime)
      if (group) {
        let date = group[0]
        return date
      }
    },
    durationFormatted: {
      get () {
        if (this.startDatetime || this.endDatetime) {
          return (this.startDatetime || this.startPlaceholder) + ' - ' + (this.endDatetime || this.endPlaceholder)
        }
        else {
          return ''
        }
      },
      set (val) {
        let group = durationPattern.exec(val)
        if (group) {
          this.startDatetime = group[1]
          this.endDatetime = group[2]
        }
        else {
          this.startDatetime = null
          this.endDatetime = null
        }
      }
    }
  },
  watch: {
    startDatetime (val, oldVal) {
      // if (val && !oldVal) {
      //   this.endDatetime = this.startDatetime
      // }
    },
    duration: {
      handler () {
        if (this.duration.hasOwnProperty('startDatetime')) {
          this.startDatetime = this.duration.startDatetime
        }
        if (this.duration.hasOwnProperty('endDatetime')) {
          this.endDatetime = this.duration.endDatetime
        }
      },
      deep: true
    },
    durationFormatted (val) {
      console.log('test', this.maxDurationDay, this.maxDurationDate, this.startDatetime, this.startDate)
      this.submit()
    },
    value (val) {
      console.log('datetime duration value change', val)
      if (val instanceof Object) {
        if (val.hasOwnProperty('startDatetime')) {
          this.$set(this.duration, 'startDatetime', val.startDatetime)
          // this.startDatetime = val.startDatetime
        }
        if (val.hasOwnProperty('endDatetime')) {
          this.$set(this.duration, 'endDatetime', val.endDatetime)
          // this.endDatetime = val.endDatetime
        }
      }
    }
  },
  methods: {
    submit () {
      this.$set(this.duration, 'startDatetime', this.startDatetime)
      this.$set(this.duration, 'endDatetime', this.endDatetime)
      // this.duration.startDatetime = this.startDatetime
      // this.duration.endDatetime = this.endDatetime
      this.$emit('input', this.duration)
      // console.log('submit', this.duration)
    }
  },
  created () {
    if (this.value instanceof Object) {
      this.duration = this.value
    }
    // console.log(this.duration)
  }
}
</script>
<style scoped>
  .flat {
    box-shadow: none !important;
  }
</style>
