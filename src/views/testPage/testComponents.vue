<template>
  <v-container fluid>
    <v-layout row justify-center>
      <v-flex md12 lg10>
        <l-data-table
          title-text="测试列表"
          :headers="vheaders"
          :items="items"
        ></l-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import LDataTable from '../../components/Data/LDataTable'

export default {
  name: 'TestComponents',
  components: {LDataTable},
  data: () => ({
    vheaders: [
      {text: '车辆号牌', value: 'plate', align: 'left'},
      {text: '手机号码', value: 'ownerTel', align: 'right'},
      {text: '车主姓名', value: 'ownerName', align: 'right'},
      {text: '所在单位', value: 'ownerOrg', align: 'right'},
    ],
    items: [
      {plate: '川ALZ000', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ001', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ002', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ003', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ004', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ005', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ006', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ007', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
      {plate: '川ALZ008', ownerTel: '18611111111', ownerName: 'LZ', ownerOrg: 'UESTC'},
    ]
  })
}
</script>

<style scoped>

</style>
