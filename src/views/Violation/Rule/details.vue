<template>
  <l-layout :layout="['xs12', 'md10']">
    <v-card>
      <v-card-text>{{$route.query.id}}{{$route.params.name}}</v-card-text>
    </v-card>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'

export default {
  name: 'ViolationRuleDetails',
  components: {LLayout},
  computed: {
    rules: {
      get () {
        return this.$store.state.violation.ruleList
      },
      // set (val) {
      //   this.$store.commit('violation/setRuleList', val)
      // },
    },
  },
  watch: {
    '$route' (to) {
      if (to.name === 'ViolationRuleDetails') {
        if (this.rules.length === 0) {
          this.getRules()
        }
      }
    }
  },
  methods: {
    async getRules () {
      try {
        await this.$store.dispatch('violation/getRules')
      }
      catch (e) {
        this.$store.dispatch('alert', {type: 'error', message: e.message})
      }
    },
  }
}
</script>

<style scoped>

</style>
