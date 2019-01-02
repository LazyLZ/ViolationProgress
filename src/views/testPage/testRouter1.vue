<template>
  <div>
    <div>test router 1 {{Math.random() * 1000}}</div>
    <v-icon v-html="i('warn')"></v-icon>
    <v-container grid-list-md>
      <v-layout column>
        <v-flex>
          <l-input type="input" label="render" prepend-icon="mdi-account"></l-input>
        </v-flex>
        <v-flex>
          <!--<v-select :items="['1','2','3','4','5']"></v-select>-->
          <l-input type="select" label="render select" prepend-icon="mdi-account" :items="[1,2,3,4,5,6]"></l-input>
        </v-flex>
        <v-flex>
          <l-input type="time"></l-input>
        </v-flex>
        <v-flex>
          <l-input type="date"></l-input>
        </v-flex>
        <v-flex>
          <l-input type="datetime"></l-input>
        </v-flex>
        <v-flex>
          <l-input type="duration"></l-input>
        </v-flex>
        <v-flex>
          <l-input type="weekday"></l-input>
        </v-flex>
        <v-flex>
          <l-select-file select-type="dialog">
            <v-btn slot="activator">open</v-btn>
          </l-select-file>
        </v-flex>
      </v-layout>
    </v-container>
    <!--<div>{{'/home/homepage/i'.split('/')}}</div>-->
  </div>
</template>

<script>
import LInput from '../../components/Inputs/LInput'
import LSelectFile from '../../components/Inputs/LSelectFile'
export default {
  name: 'testRouter1',
  components: {LSelectFile, LInput},
  methods: {
    i (icon) {
      return '$vuetify.icons.' + icon
    }
  }
}
</script>

<style scoped>

</style>
