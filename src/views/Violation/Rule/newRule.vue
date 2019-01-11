<template>
  <l-layout :layout="['xs12', 'md10']">
    <v-card class="mb-2">
      <v-card-title class="pl-4 pr-2" style="height: 64px;">
        <span v-if="rule.name" class="title">{{rule.name}}</span>
        <span v-else class="title grey--text">规则名称</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-container class="pt-0" grid-list-md>
          <v-layout wrap>
            <v-flex xs8>
              <v-text-field
                label="规则名称"
                prepend-icon="$vuetify.icons.title"
                v-model="rule.name"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="严重程度"
                prepend-icon="$vuetify.icons.level"
                type="number"
                v-model="rule.severity"
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
        <v-btn class="mx-0" @click="" color="primary">提交</v-btn>
      </v-flex>
    </v-layout>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
export default {
  name: 'NewViolationRule',
  components: {LLayout},
  data: () => ({
    rule: null
  }),
  created () {
    this.rule = this.$store.getters['violation/getNewRule']()
  }
}
</script>

<style scoped>

</style>
