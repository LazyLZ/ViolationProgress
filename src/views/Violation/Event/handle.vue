<template>
  <l-cache :get-data="getEvent" :id="($route.query.id|| '').toString()">
    <handle-content slot-scope="{data}" :event="data"></handle-content>
  </l-cache>
</template>

<script>

import LCache from '../../../components/Layout/LCache'
import HandleContent from './handleContent'
import {ViolationEvent} from '../../../object'

export default {
  name: 'ViolationEventPreliminary',
  components: {HandleContent, LCache},
  methods: {
    getEvent () {
      return new Promise(resolve => {
        setTimeout(() => {
          let event = new ViolationEvent({
            id: this.$route.query.id,
            vehicle: {
              plate: '川ALZ000',
            },
            area: '清水河',
            description: '该车在禁停区域停车',
            trafficResult: {
              area: '清水河',
              comment: '该车在禁停区域停车',
            }
          })
          console.log('event', event)
          resolve(event)
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>

</style>
