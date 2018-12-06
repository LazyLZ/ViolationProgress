<template>
  <div
    :style="{display: haveContent? 'inline-block':'none'}"
    @mousedown="count('down')"
    @mouseup="inputCode"
  >
    <div style="pointer-events: none">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {morse} from '../utils/morseCode'
import _ from 'lodash'

let tick = 250
let start = (new Date()).getTime()
export default {
  name: 'l-morse-click-input',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    haveContent () {
      return !!this.$slots.default
    }
  },
  data: () => ({
    tick: tick,
    buffer: '',
    noInput: false
  }),
  methods: {
    test () {
    },
    count (v) {
      let r = ''
      if (v === 'down') {
        this.noInput = false
        let interval = (new Date()).getTime() - start
        if (interval <= this.tick) {
          r = ''
        }
        else if (interval > this.tick && interval <= 3 * this.tick) {
          r = ''
        }
        else if (interval > 3 * this.tick && interval <= 7 * this.tick) {
          r = ' '
        }
        else {
          r = ' '
          // this.$emit('input', this.value + morse.getLetter(this.buffer))
          // this.buffer = ''
        }
        start = (new Date()).getTime()
        this.buffer += r
        return r
      }
      if (v === 'up') {
        let interval = (new Date()).getTime() - start
        if (interval <= this.tick) {
          r = morse.DI
        }
        else if (interval > this.tick && interval <= 3 * this.tick) {
          r = morse.DA
        }
        else if (interval > 3 * this.tick && interval <= 7 * this.tick) {
          r = morse.DA
        }
        else {
          r = ' '
        }
        this.noInput = true
        start = (new Date()).getTime()
      }
      this.submit()
      return r
    },
    submit: _.debounce(function () {
      this.$emit('input', this.value + morse.getLetter(this.buffer))
      this.buffer = ''
    }, 3 * tick),
    inputCode () {
      let code = this.count('up')
      if (!this.value && !this.buffer && code === '') {
      }
      else {
        this.buffer += code
      }
    }
  },
}
</script>

<style scoped>

</style>
