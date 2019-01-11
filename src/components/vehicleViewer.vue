<template>
  <v-card>
    <v-card-title class="pr-2" style="height: 64px">
      <span class="title">{{vehicle.plate}}</span>
      <span class="caption grey--text pl-5 pr-2">姓名</span>
      <span class="subheading">{{vehicle.name || 'N/A'}}</span>
      <span class="caption grey--text pl-5 pr-2">电话</span>
      <span class="subheading">{{vehicle.phone || 'N/A'}}</span>
      <span class="caption grey--text pl-5 pr-2">邮箱</span>
      <span class="subheading">{{vehicle.email || 'N/A'}}</span>
      <span class="caption grey--text pl-5 pr-2">登记类型</span>
      <span class="subheading">{{vehicle.typeName || 'N/A'}}</span>
      <v-spacer></v-spacer>

      <!--<v-btn @click="expand = !expand" color="primary" flat>{{expand?'收起':'展开'}}</v-btn>-->
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
