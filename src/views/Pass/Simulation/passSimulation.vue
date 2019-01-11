<template>
  <v-container fluid >
    <v-layout row justify-center>
      <v-flex xs5 layout justify-end>
        <v-card width="400px" class="card" ref="card">
          <v-card-title style="height: 64px" class="py-2">
            <span class="subheading ml-2">模拟入场</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container class="py-0" fluid grid-list-md>
              <v-form ref="checkForm" v-model="checkFormValid">
                <v-layout row wrap>
                  <v-flex xs12>
                    <l-plate-picker
                      label="车辆号牌"
                      :rules="[$rules.requiredS('必须输入车牌')]"
                      v-model="plate"
                    ></l-plate-picker>
                  </v-flex>
                  <v-flex xs12>
                    <l-select-datetime
                      v-model="datetime"
                      label="通行时间"
                      :rules="[$rules.requiredS('必须输入时间')]"
                    ></l-select-datetime>
                  </v-flex>
                  <v-flex xs12>
                    <!--<h1>{{controllerId}}</h1>-->
                    <l-select-controller
                      two-line
                      single-select
                      return-id
                      v-model="controllerId"
                      :rules="[$rules.requiredArray('必须选择通行关口')]"
                    ></l-select-controller>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="checkAuthority" color="primary" flat large>模拟通行</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs1 layout align-center justify-center>
        <v-icon large>mdi-arrow-right</v-icon>
      </v-flex>
      <v-flex xs5 layout justify-start>
        <v-card width="400px" class="card" ref="card">
          <v-card-title style="height: 64px" class="py-2">
            <span class="subheading ml-2">关口返回结果</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-md>
            <v-flex v-if="loading" justify-center layout>
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-flex>
            <v-layout v-else class="subheading" row wrap>
              <v-flex xs12>
                通行结果:
              </v-flex>
              <v-flex xs12>
                {{result}}
              </v-flex>
              <!--<v-flex xs4>-->
                <!--语音提示:-->
              <!--</v-flex>-->
              <!--<v-flex xs8>-->
                <!--{{audioPrompt}}-->
              <!--</v-flex>-->
              <!--<v-flex xs4>-->
                <!--屏显提示:-->
              <!--</v-flex>-->
              <!--<v-flex xs8>-->
                <!--{{ledPrompt}}-->
              <!--</v-flex>-->
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout style="height:30px"></v-layout>
  </v-container>
</template>

<script>
import LSelectDatetime from '../../../components/Inputs/Time/LSelectDatetime'
import LSelectController from '../../../components/Inputs/LSelectController'
import LPlatePicker from '../../../components/Inputs/LPlatePicker'
export default {
  name: 'PassSimulation',
  components: {LPlatePicker, LSelectController, LSelectDatetime},
  data: () => ({
    loading: false,
    text: '',
    checkFormValid: false,
    filter: false,
    mounted: false,
    plate: '',
    datetime: '',
    controllerId: '',
  }),
  computed: {
    controllersGroup () {
      return this.$store.state.controllersGroup
    },
    parkingLotList () {
      return this.$store.state.parkingLotList
    },
    result () {
      if (this.checkFormValid && !!this.text) {
        if (this.text instanceof Object) {
          return '抬杆放行'
        }
        else {
          return '禁止通行'
        }
      }
      else {
        return '等待输入'
      }
    },
    audioPrompt () {
      return this.result === '抬杆放行' ? this.text.voice : ''
    },
    ledPrompt () {
      return this.result === '抬杆放行' ? this.text.ledPlus : ''
    },
  },
  methods: {
    checkAuthority () {
      this.loading = true
      if (this.$refs.checkForm.validate()) {
        this.text = ''
        this.loading = false
        this.text = {text: '处理成功'}
        // this.$store.dispatch('passLog/checkPassAuthority', {
        //   plate: this.plate,
        //   datetime: this.datetime,
        //   cId: this.controllerId
        // }).then(res => {
        //   this.text = res
        //   console.log(res)
        // }).catch(e => {
        //   this.$store.commit('alertError', {title: '模拟通行时发生错误', message: e.message})
        //   console.error(e)
        // }).finally(() => {
        //   this.loading = false
        // })
      }
      else {
        this.loading = false
      }
    }
  },
  mounted () {
    this.mounted = true
  }
}
</script>

<style scoped>

</style>
