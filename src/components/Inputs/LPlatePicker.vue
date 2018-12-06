<template>
  <v-menu
    :close-on-content-click="false"
    :disabled="readonly || disabled"
    :max-width="xsScreen?'320px':'400px'"
    :min-width="xsScreen?'320px':'400px'"
    :offset-x="offsetX"
    :offset-y="!offsetX"
    full-width
    lazy
    ref="menu"
    transition="scale-transition"
    v-model="menu"
  >
    <v-text-field
      :autofocus="autofocus"
      :disabled="disabled"
      :error="error"
      :error-messages="errorMessages"
      :hide-details="hideDetails"
      :hint="hint"
      :label="label"
      :loading="loading"
      :placeholder="placeholder"
      :prependIcon="prependIcon"
      :readonly="readonly"
      :rules="rules_"
      :single-line="singleLine"
      :suffix="specialPlateType"
      :validate-on-blur="validateOnBlur"
      @blur="value_ = (value_ + '').toUpperCase()"
      @keydown="$emit('keydown', $event)"
      @keypress="$emit('keypress', $event)"
      @keyup="formatAndEmitKeyup"
      clearable
      ref="input"
      slot="activator"
      v-model="plateFormatted"
    ></v-text-field>
    <v-card>
      <v-card-title style="height: 48px;">
        <div class="pl-2" :class="xsScreen?'subheading':'title'">
          <span
            :class="[inputCount === i ? 'grey--text':'', i === 0?'mr-2':'']" :key="i"
            :style="menuLabelStyle(false, inputCount === i)"
            @click="inputCount = i"
            class="d-inline-block text-xs-center"
            v-for="(c, i) in limitPlateValue"
          >
            <v-hover><span :class="hover? 'primary--text':''" slot-scope="{hover}">{{c}}</span></v-hover>
          </span>
          <span
            :style="menuLabelStyle(false, true)"
            class="d-inline-block text-xs-center"
            style="width: 20px"
            v-if="!value_[inputCount]"
          ></span>
        </div>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <v-btn class="ma-0" color="primary" flat slot="activator">{{plateTypeMap[plateType].label}}</v-btn>
          <v-list dense>
            <v-list-tile
              :key="t.id"
              @click="plateType = t.id"
              v-for="t in plateTypeMap"
            >
              <v-list-tile-title>{{t.label}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <!--<v-container class="pa-0">-->
        <v-fade-transition mode="out-in">
          <v-layout>
            <v-flex class="text-xs-center">
              <v-btn
                :disabled="(charSet[platePattern[plateType][inputCount]].disabled || '').indexOf(p) !== -1"
                :key="p"
                :small="xsScreen"
                @click="inputChar(p, plateType)"
                class="ma-0"
                icon v-for="p in charSet[platePattern[plateType][inputCount]].key"
                v-if="p !== seq">
                <span class="subheading">{{p}}</span>
              </v-btn>
              <br v-else>
            </v-flex>
          </v-layout>
        </v-fade-transition>
        <!--</v-container>-->
      </v-card-text>

    </v-card>
  </v-menu>
</template>

<script>
import throttle from 'lodash/throttle'

let province = '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼'
let codeReg = 'A-HJ-NP-Z\\d'
let allPlateCharReg = RegExp(`^([${province}领警学挂港澳临试超使A-Z\\d]*)$`, 'i')
let allPattern = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](([A-HJ-NP-Z\d]{4}[A-HJ-NP-Z\d领警学挂港澳临试超])|([DF][A-HJ-NP-Z\d]{5})|([A-HJ-NP-Z\d]{5}[DF])))|([使]\d{6}))$/i
let regMap = {
  // all: RegExp(`/^(([${province}][A-Z](([${codeReg}]{4}[${codeReg}领警学挂港澳临试超])|([DF][${codeReg}]{5})|([${codeReg}]{5}[DF])))|([使]\\d{6}))$/i`),
  normal: RegExp(`^([${province}][A-Z][${codeReg}]{5})$`, 'i'),
  newLarge: RegExp(`^([${province}][A-Z][${codeReg}]{5}[DF])$`, 'i'),
  newSmall: RegExp(`^([${province}][A-Z][DF][${codeReg}]{5})$`, 'i'),
  special: RegExp(`^([${province}][A-Z][${codeReg}]{4}[警学挂临试超])$`, 'i'),
  HAccess: RegExp(`^([${province}][A-Z][${codeReg}]{4}[港])$`, 'i'),
  MAccess: RegExp(`^([${province}][A-Z][${codeReg}]{4}[澳])$`, 'i'),
  embassy: /^([使]\d{6})$/i,
  consulate: RegExp(`^([${province}][A-Z][${codeReg}]{4}[领])$`, 'i'),
}
export default {
  name: 'LPlatePicker',
  props: {
    value: {},
    offsetX: {type: Boolean, default: false},
    offsetY: {type: Boolean, default: false},
    label: {type: String, default: '车辆号牌'},
    hint: {type: String, default: ''},
    placeholder: {type: String, default: ''},
    hideDetails: {type: Boolean, default: false},
    singleLine: {type: Boolean, default: false},
    required: {type: [Boolean, String], default: false},
    restrict: {type: Boolean, default: true},
    error: {type: Boolean, default: false},
    readonly: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    autofocus: {type: Boolean, default: false},
    errorMessages: {type: [String, Array], default: () => []},
    rules: {type: Array, default: () => []},
    validateOnBlur: {type: Boolean, default: true},
    prependIcon: {type: String, default: 'directions_car'},
  },
  data: () => ({
    menu: false,
    inputCount: 0,
    seq: ';',
    plateType: 'normal',
    charSet: {
      province: {key: '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼', disabled: ''},
      code: {key: '1234567890;QWERTYUIOP;ASDFGHJKL;ZXCVBNM', disabled: 'IO'},
      direction: {key: 'QWERTYUIOP;ASDFGHJKL;ZXCVBNM', disabled: ''},
      newEnergyCode: {key: '1234567890;QWERTYUIOP;ASDFGHJKL;ZXCVBNM', disabled: '1234567890QWERTYUIOPASGHJKLZXCVBNM'},
      specialChar: {key: '警学挂临试超'},
      embassyChar: {key: '使'},
      consulateChar: {key: '领'},
      HChar: {key: '港'},
      MChar: {key: '澳'},
      number: {key: '1234567890'},
    },
    plateTypeMap: {
      normal: {label: '普通车牌', id: 'normal', hint: ''},
      newLarge: {label: '新能源大型车', id: 'newLarge', hint: '新能源'},
      newSmall: {label: '新能源小型车', id: 'newSmall', hint: '新能源'},
      special: {label: '特种车辆', id: 'special', hint: '特'},
      HAccess: {label: '香港通行车辆', id: 'HAccess', hint: '港'},
      MAccess: {label: '澳门通行车辆', id: 'MAccess', hint: '澳'},
      embassy: {label: '大使馆车辆', id: 'embassy', hint: '使'},
      consulate: {label: '领事馆车辆', id: 'consulate', hint: '领'}
    },
    platePattern: {
      normal: ['province', 'direction', 'code', 'code', 'code', 'code', 'code'],
      newLarge: ['province', 'direction', 'code', 'code', 'code', 'code', 'code', 'newEnergyCode'],
      newSmall: ['province', 'direction', 'newEnergyCode', 'code', 'code', 'code', 'code', 'code'],
      special: ['province', 'direction', 'code', 'code', 'code', 'code', 'specialChar'],
      HAccess: ['province', 'direction', 'code', 'code', 'code', 'code', 'HChar'],
      MAccess: ['province', 'direction', 'code', 'code', 'code', 'code', 'MChar'],
      embassy: ['embassyChar', 'number', 'number', 'number', 'number', 'number', 'number'],
      consulate: ['province', 'direction', 'code', 'code', 'code', 'code', 'consulateChar'],
    }
  }),
  computed: {
    limitPlateValue () {
      let plate = this.value_ || ''
      let maxLength = this.platePattern[this.plateType].length
      if (plate.length <= maxLength) {
        return plate
      }
      else {
        return plate.slice(0, maxLength)
      }
    },
    xsScreen () {
      return this.$vuetify.breakpoint.xsOnly
    },
    menuLabelStyle: throttle(function () {
      return (hover, isInput) => {
        let s = {height: '32px', lineHeight: '32px', cursor: 'pointer', width: this.xsScreen ? '1em' : '1em'}
        if (hover) {
          s.cursor = 'pointer'
        }
        if (isInput) {
          s.borderBottom = '2px solid ' + this.$vuetify.theme.primary.base
          // console.log(s.borderBottom, this.$vuetify.theme.primary)
        }
        return s
      }
    }, 100),
    specialPlateType () {
      let plate = this.value_
      if (this.allPlatePattern.test(plate)) {
        for (let key of Object.keys(regMap)) {
          if (regMap[key].test(plate)) {
            return this.plateTypeMap[key].hint
          }
        }
      }
      return ''
    },
    disableTransFormInputValue () {
      return this.$store.state.platform.isApple
    },
    plateFormatted: {
      get () {
        return this.value_
      },
      set (val) {
        if (this.disableTransFormInputValue) {
          this.value_ = val || ''
        }
        else {
          this.value_ = (val || '').toUpperCase()
        }
      }
    },
    allPlatePattern () {
      if (this.$rules) {
        return this.$rules.reg.PLATE_PATTERN
      }
      else {
        return allPattern
      }
    },
    plateRules () {
      // let platePattern = null
      // if (this.$rules) {
      //   platePattern = this.$rules.reg.PLATE_PATTERN
      // }
      // else {
      //   platePattern = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](([A-HJ-NP-Z\d]{4}[A-HJ-NP-Z\d领警学挂港澳临试超])|([DF][A-HJ-NP-Z\d]{5})|([A-HJ-NP-Z\d]{5}[DF])))|([使]\d{6}))$/i
      // }
      // console.log(this.allPlatePattern, this.plateFormatted, this.allPlatePattern.test(this.plateFormatted))
      return [
        v => this.allPlatePattern.test(v) || '车牌格式错误'
      ]
    },
    value_: {
      get () {
        return this.value || ''
      },
      set (val) {
        this.$emit('input', val || '')
      }
    },
    rules_ () {
      let rules = []
      if (this.menu) {
        return rules
      }
      if (this.required) {
        let s = typeof this.required === 'string' ? this.required : '必填'
        rules.push(v => !!v || s)
      }
      if (this.restrict) {
        rules.push(...this.plateRules)
      }
      if (this.rules instanceof Array && this.rules.length > 0) {
        rules.push(...this.rules)
      }
      return rules
    }
  },
  watch: {
    menu (val) {
      if (val) {
        let plate = this.value_ || ''
        if (!this.allPlatePattern.test(plate)) {
          if (plate.length > 9) {
            plate = plate.slice(0, 9)
          }
          // console.log(allPlateCharReg)
          if (!allPlateCharReg.test(plate)) {
            this.value_ = ''
          }
          if (plate.length < this.platePattern[this.plateType].length) {
            this.inputCount = Math.max(0, plate.length)
          }
        }
        else {
          if (this.allPlatePattern.test(plate)) {
            for (let key of Object.keys(regMap)) {
              if (regMap[key].test(plate)) {
                this.plateType = this.plateTypeMap[key].id
                break
              }
            }
          }
          this.inputCount = 0
        }
        let charSet = this.charSet[this.platePattern[this.plateType][this.inputCount]]
        let pattern = this.platePattern[this.plateType]
        if (charSet.key.length === 1) {
          this.inputChar(charSet.key, this.plateType)
        }
        if (plate.length > pattern.length) {
          this.value_ = plate.slice(0, pattern.length)
        }
      }
    },
    plateType (val) {
      let charSet = this.charSet[this.platePattern[val][0]]
      let pattern = this.platePattern[val]
      let plate = this.value_ || ''
      if (charSet.key.length === 1) {
        this.inputChar(charSet.key, val, 0)
      }
      if (plate.length > pattern.length) {
        this.value_ = plate.slice(0, pattern.length)
      }
    }
  },
  methods: {
    inputChar (char, type, index = null) {
      let plate = this.value_ || ''
      let i = this.inputCount
      if (typeof index === 'number' && (plate[index] || !index)) {
        if (plate.length) {
          this.value_ = plate.slice(0, index) + char + plate.slice(index + 1, plate.length)
        }
        else {
          this.value_ = char
        }
        return
      }

      if (plate[i]) {
        let l = plate.length
        this.value_ = plate.slice(0, i) + char + plate.slice(i + 1, l)
      }
      else {
        this.value_ = this.value_ + char
      }
      if (this.inputCount < this.platePattern[type].length - 1) {
        let charSet = this.charSet[this.platePattern[type][i + 1]]
        if (charSet.key.length === 1) {
          this.inputCount++
          this.$nextTick(() => {
            this.inputChar(charSet.key, type)
          })
        }
        else {
          this.inputCount++
        }
      }
      else {
        this.$nextTick(() => {
          this.menu = false
        })
      }
      console.log('input', char, type, this.inputCount, plate, this.platePattern[type].length, this.menu)
    },
    // inputProvince (p) {
    //   let pattern = RegExp(`/[${this.province}]/i`)
    //   if (pattern.test(this.value_)) {
    //     this.value_ = this.value_.replace(pattern, 'p')
    //   }
    //   else {
    //     this.value_ = p
    //   }
    //   this.$refs.input.focus()
    //   this.inputStatus = 'number'
    // },
    formatAndEmitKeyup (event) {
      if (event.code === 'Enter') {
        this.value_ = (this.value_ + '').toUpperCase()
      }
      this.$emit('keyup', event)
    }
  }
}
</script>

<style scoped>

</style>
