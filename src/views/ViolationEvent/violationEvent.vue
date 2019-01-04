<template>
  <l-layout :layout="['xs12', 'lg10']">
    <l-fixed-btn>$vuetify.icons.add</l-fixed-btn>
    <l-data-table
      :get-data-func="getData"
      :headers="headers"
      @click:row="goDetails($event)"
      clickable
      title-text="测试列表"
    >
      <template slot="row-action" slot-scope="{item}">
        <td @click.stop>
          <v-btn @click="deleteEvent(item)" icon small>
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </td>
      </template>
    </l-data-table>
  </l-layout>
</template>

<script>
import LDataTable from '../../components/Data/LDataTable'
import LLayout from '../../components/Layout/LLayout'
import LFixedBtn from '../../components/LFixedBtn'

export default {
  name: 'violationEvent',
  components: {LFixedBtn, LLayout, LDataTable},
  data: () => ({
    headers: [
      {text: '车辆号牌', value: 'carNumber', align: 'left'},
      {text: '车主姓名', value: 'name', align: 'right'},
      {text: '违章区域', value: 'area', align: 'right', placeholder: 'N/A'},
      {text: '违章状态', value: 'status', align: 'right', placeholder: 'N/A'},
      {text: '', value: '', align: 'center', width: '80px', sortable: false},
    ],
  }),
  methods: {
    async getData ({pagination, filterItems, sortStack, search, titleSwitch}) {
      try {
        let {items, amount} = await this.$store.dispatch('getDataList', {
          pagination,
          url: '/api/peccancy/getAll'
        })
        let e = {
          code: -1,
          message: 'this. is  a message'
        }
        throw e
        return {items, amount}
      }
      catch (e) {

        this.$store.dispatch('alert', {type: 'error', title: '发生错误', message: e.message})
      }
    },
    deleteEvent (item) {
      console.log('delete item', item)
    },
    goDetails (event) {
      console.log('get row', event)
      this.$router.push({
        name: 'ViolationDetails',
        params: {
          carNumber: event.item.carNumber,
          item: event.item
        },
        query: {id: event.item.peccancyId}
      })
    }
  }
}
</script>

<style scoped>

</style>
