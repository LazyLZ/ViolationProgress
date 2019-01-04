<template>
  <l-cache :get-data="getData" :id="(this.$route.query.id || '').toString()">
    <l-layout slot-scope="{data}">
      <v-card>
        <v-card-title>{{data.carNumber}}</v-card-title>
        <v-card-text>
          <v-container>
            <v-layout>
              <v-flex>
                <v-text-field
                  disabled
                  label="车辆号牌"
                  readonly
                  v-model="data.carNumber"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="submit" color="primary" flat>修改</v-btn>
        </v-card-actions>
      </v-card>
    </l-layout>
    <template slot="loading">
      <v-layout class="py-5" justify-center>
        <v-progress-circular color="primary" indeterminate size="50"></v-progress-circular>
      </v-layout>
    </template>
  </l-cache>
</template>

<script>
import LLayout from '../../components/Layout/LLayout'
import LCache from '../../components/Layout/LCache'

export default {
  name: 'ViolationDetails',
  components: {LCache, LLayout},
  data: () => ({}),
  methods: {
    submit () {

    },
    getData (key) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            carNumber: Math.floor(Math.random() * 1000000)
          })
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>

</style>
