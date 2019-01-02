<template>
  <v-container fluid :class="$vuetify.breakpoint.smAndDown ? 'pa-0':''">
    <v-layout justify-center>
      <v-flex lg10 xs12>
        <l-data-table
          :get-data-func="getUsers"
          :headers="userHeaders"
          init-sort-by="name"
          title-text="登记用户列表"
          :filter-items="filterItems"
        ></l-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LDataTable from '../../../components/Data/LDataTable'
import {time} from '../../../utils/time'

export default {
  name: 'userManagement',
  components: {LDataTable},
  data: () => ({
    filterItems: [
      {
        key: 'creationTime',
        value: '',
        label: '登记时间',
        type: 'duration',
        layout: ['xs12', 'sm6'],
        f: v => v ? [time.toTimeStamp(v.startDatetime) || 0, time.toTimeStamp(v.endDatetime) || 9999999999999] : [0, 9999999999999],
        range: true
      },
      {
        key: 'loginId',
        value: '',
        label: '登录ID',
        type: 'input',
        layout: ['xs12', 'sm6'],
      }
    ],
    userHeaders: [
      {text: '用户姓名', value: 'name', align: 'left', placeholder: 'N/A'},
      {text: '用户ID', value: 'loginId', align: 'right', placeholder: 'N/A'},
      {text: '电话号码', value: 'mobilePhone', align: 'right', placeholder: 'N/A'},
      {text: '登记时间', value: 'creationTime', align: 'right', placeholder: 'N/A', f: v => time.stringify(v)},
    ],
  }),
  methods: {
    async getUsers ({pagination, sortStack, filterItems, search}) {
      return this.$store.dispatch('userAdmin/getUsers', {
        pagination,
        sortStack,
        filter: filterItems,
        search: {key: 'name', value: search}
      })
    }
  }
}
</script>

<style scoped>

</style>
