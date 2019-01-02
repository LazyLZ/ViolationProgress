<!--<template>-->
<!--</template>-->

<script>
import {
  VTextField,
  VTextarea,
  VSelect,
  VAutocomplete,
  // VCheckbox,
  // VRadioGroup,
  // VRadio,
  VSwitch,
  // VSlider,
  // VRangeSlider
} from 'vuetify/lib'
import LSelectDate from './Time/LSelectDate'
import LSelectDatetime from './Time/LSelectDatetime'
import LSelectTime from './Time/LSelectTime'
import LSelectDatetimeDuration from './Time/LSelectDatetimeDuration'
import LSelectWeekday from './Time/LSelectWeekday'
import LSelectFile from './LSelectFile'

export default {
  // components: {VTextField},
  name: 'LInput',
  props: [
    'config',
    'type',
    'value',
    'prependIcon',
    'label',
    'placeholder',
    'rules',
    'loading',
    'error',
    'errorMessages',
    'singleLine',
    'hideDetails',
    'items',
    'itemKey',
    'itemValue',
    'returnObject',
    'multiple',
    'selectType',
  ],
  data: () => ({
    typeMap: {
      'text': VTextField,
      'textarea': VTextarea,
      'select': VSelect,
      'search': VAutocomplete,
      'date': LSelectDate,
      'time': LSelectTime,
      'datetime': LSelectDatetime,
      'duration': LSelectDatetimeDuration,
      'weekday': LSelectWeekday,
      'switch': VSwitch,
      'file': LSelectFile
    }
  }),
  render (createElement) {
    let {type, config, ...props} = this.$props
    if (config instanceof Object && config.type) {
      type = config.type
    }
    let inputProps
    if (config instanceof Object) {
      let {type, layout, value, ...t} = config
      inputProps = t
    }
    else {
      inputProps = props
    }
    for (let key of Object.keys(inputProps)) {
      if (inputProps[key] === undefined) {
        delete inputProps[key]
      }
    }
    // console.log('props', inputProps, this.$slots)
    let self = this
    return createElement(
      this.typeMap[type] || VTextField, // 标签名称
      {
        props: {
          ...inputProps
        },
        attrs: {
          // id: 'foo'
        },
        domProps: {
          value: self.value
        },
        on: {
          input: function (event) {
            self.$emit('input', event)
          }
        }
      },
    )
  }
}
</script>

<style scoped>

</style>
