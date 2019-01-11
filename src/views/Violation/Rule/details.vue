<template>
  <l-cache :get-data="getRule" :id="($route.query.id || '').toString()">
    <l-layout :layout="['xs12', 'md10']" slot-scope="{data}">
      <v-card>
        <v-card-title class="pl-4 pr-2" style="height: 64px;">
          <span class="title">{{data.name}}</span>
          <v-spacer></v-spacer>
          <v-btn @click="goEdit(data)" color="primary" flat>编辑</v-btn>
        </v-card-title>
        <v-card-text>
          <v-container class="pt-0" grid-list-md>
            <v-layout wrap>
              <v-flex xs8>
                <v-text-field
                  disabled
                  label="规则名称"
                  prepend-icon="$vuetify.icons.title"
                  v-model="data.name"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field
                  disabled
                  label="严重程度"
                  prepend-icon="$vuetify.icons.level"
                  type="number"
                  v-model="data.severity"
                ></v-text-field>
              </v-flex>
              <!--<v-flex xs12>-->
              <!--<v-text-field-->
              <!--prepend-icon="$vuetify.icons.description"-->
              <!--label="规则描述"-->
              <!--v-model="data.description"-->
              <!--&gt;</v-text-field>-->
              <!--</v-flex>-->

            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </l-layout>
  </l-cache>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import LCache from '../../../components/Layout/LCache'

export default {
  name: 'ViolationRuleDetails',
  components: {LCache, LLayout},
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
    goEdit (data) {
      this.$router.push({
        name: 'EditViolationRule',
        params: {name: data.name},
        query: {id: data.id}
      })
    },
    async getRule () {
      return this.$store.dispatch('violation/getRules', {id: this.$route.query.id})
    },
  }
}
</script>

<style scoped>

</style>
