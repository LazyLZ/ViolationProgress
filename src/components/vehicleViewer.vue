<template>
  <v-card>
    <v-card-title class="pr-2" style="height: 64px">
      <span class="title">{{vehicle.plate}}</span>
      <span class="subheading">{{vehicle.name}}</span>
      <span class="subheading">{{vehicle.phone}}</span>
      <span class="subheading">{{vehicle.orgName}}</span>
      <v-spacer></v-spacer>

      <v-btn @click="expand = !expand" color="primary" flat>{{expand?'收起':'展开'}}</v-btn>
    </v-card-title>
    <v-card-text v-if="expand">
      <v-container class="pt-0" fluid grid-list-md>
        <v-layout>
          <v-flex>{{vehicle.plate}}</v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'vehicleViewer',
  props: {
    vehicle: {
      type: Object
    }
  },
  data: () => ({
    expand: false,
  })
}
</script>

<style scoped>

</style>
