<template>
  <l-cache :get-data="getRule" :id="($route.query.id || '').toString()">
    <l-layout :layout="['xs12', 'md10']" slot-scope="{data}">
      <v-card>
        <v-card-title style="height: 64px;">
          <span class="title">{{data.name}}</span>
        </v-card-title>
        <v-card-text>
          <v-container class="pt-0" grid-list-md>
            <v-layout wrap>
              <v-flex xs8>
                <v-text-field
                  label="规则名称"
                  prepend-icon="$vuetify.icons.title"
                  v-model="data.name"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field
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
      <v-layout>
      <v-flex class="text-xs-right">
        <v-btn class="mx-0" :loading="loading" @click="editRule(data.id, data.name, data.severity, data.code)" color="primary">提交</v-btn>
      </v-flex>
      </v-layout>
    </l-layout>
  </l-cache>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import LCache from '../../../components/Layout/LCache'

export default {
  name: 'EditViolationRule',
  components: {LCache, LLayout},
  props: ['id'],
  data: () => ({
    loading: false,
  }),
  methods: {
    async getRule (key) {
      let item = await this.$store.dispatch('violation/getRules', {id: key})
      // console.log('findg', item)
      return item
    },
    async editRule (id, name, severity, code) {
      // let opArray = code.split('-')
      // let fid
      // if (opArray.length === 1) {
      //   fid = 0
      // }
      // else {
      //   fid = opArray[opArray.length - 2]
      // }
      try {
        this.loading = true
        await this.$store.dispatch('violation/editRules', {id, name, severity, code})
        this.$store.dispatch('alert', {type: 'success', message: '修改成功'})
        this.$store.commit('closeTab', this.$route.fullPath)
        this.$router.push({
          name: 'EditViolationRule',
          params: {name: name},
          query: {id: id}
        })
      }
      catch (e) {
        this.$store.dispatch('alert', {type: 'error', message: e.message})
      }
      finally {
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>

</style>
