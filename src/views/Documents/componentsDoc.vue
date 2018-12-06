<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xs10>
        <l-api-viewer :apis="apis"></l-api-viewer>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {APIs} from '../../doc/componentsApi'
import LApiViewer from '../../components/LApiViewer'

export default {
  name: 'componentsDoc',
  components: {LApiViewer},
  data: () => ({
    apis: APIs
  })
}
</script>

<style scoped>

</style>
