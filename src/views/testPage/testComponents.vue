<template>
  <v-container fluid>
    <v-layout justify-center row>
      <v-flex lg10 md12>
        <l-data-table
          :get-data-func="getData"
          :headers="vheaders"
          title-text="测试列表"
        ></l-data-table>
      </v-flex>
    </v-layout>
    <v-btn @click="post">test post</v-btn>
  </v-container>
</template>
<script>
import LDataTable from '../../components/Data/LDataTable'

export default {
  name: 'TestComponents',
  components: {LDataTable},
  data: () => ({
    vheaders: [
      {text: '车辆号牌', value: 'carNumber', align: 'left'},
      {text: '车主姓名', value: 'name', align: 'right'},
      {text: '违章区域', value: 'area', align: 'right'},
      {text: '违章状态', value: 'status', align: 'right'},
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
  }),
  methods: {
    async post () {
      this.$axios.post('/passApi/pass/log/list', {}, {
      })
    },
    async getData ({pagination, sortStack, filterItems, titleSwitch, search}) {
      let url = '/api/peccancy/getAll'
      try {
        return this.$store.dispatch('getDataList', {pagination, url})
      }
      catch (e) {
        this.$store.dispatch('alert', {type: 'error', title: '获取列表时发生错误', message: e.message})
      }
    }
  }
}
</script>

<style scoped>

</style>
