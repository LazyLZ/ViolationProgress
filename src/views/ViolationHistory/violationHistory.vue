<template>
  <l-layout :layout="['xs12', 'lg10']">
    <l-data-table
      :items="items"
      :headers="headers"
      @click:row="goDetails($event)"
      clickable
      title-text="历史日志列表">

    </l-data-table>
  </l-layout>
</template>

<script>
import LLayout from '../../components/Layout/LLayout'
import LDataTable from '../../components/Data/LDataTable'

export default {
  name: 'violationHistory',
  components: {LDataTable, LLayout},
  data: () => ({
    headers: [
      {text: '车辆号牌', value: 'carNumber', align: 'left'},
      {text: '车主姓名', value: 'name', align: 'right'},
      {text: '违章区域', value: 'area', align: 'right', placeholder: 'N/A'},
      {text: '违章状态', value: 'status', align: 'right', placeholder: 'N/A'},
    ],
    items: [
      {carNumber: '学66666', name: 'Misaka Mikoto', area: '学园都市', status: '已审核'}
    ]

  }),
  methods: {
    goDetails (event) {
      this.$router.push({
        name: 'ViolationHistoryDetails',
        params: {
          carNumber: event.item.carNumber,
        },
      })
    }
  }

}
</script>

<style scoped>

</style>
