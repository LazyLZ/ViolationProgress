<template>
  <l-layout :layout="['lg10', 'xs12']" bottom-space>
    <l-data-table
      :filter-items="filterItems"
      :get-data-func="getUsers"
      :headers="userHeaders"
      @click:row="goDetails('readonly',$event.item)"
      clickable
      init-sort-by="name"
      title-text="登记用户列表"
    ></l-data-table>
    <v-tooltip left>
      <span>添加用户</span>
      <v-fab-transition slot="activator">
        <v-btn
          @click="goDetails('new',{}, true)"
          bottom
          class="mr-4 mb-4"
          color="primary"
          fab
          fixed
          right
          v-if="floatingButton"
        >
          <v-icon>$vuetify.icons.add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-tooltip>
  </l-layout>
</template>

<script>
import LDataTable from '../../../components/Data/LDataTable'
import {time} from '../../../utils/time'
import LLayout from '../../../components/Layout/LLayout'

export default {
  name: 'UserList',
  components: {LLayout, LDataTable},
  data: () => ({
    floatingButton: true,
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
      {text: '电话号码', value: 'phone', align: 'right', placeholder: 'N/A'},
      {text: '登记时间', value: 'creationTime', align: 'right', placeholder: 'N/A', f: v => time.stringify(v)},
    ],
  }),
  methods: {
    msg (m) {
      console.log(m)
    },
    async getUsers ({pagination, sortStack, filterItems, search}) {
      return this.$store.dispatch('userAdmin/getUsers', {
        pagination,
        sortStack,
        filter: filterItems,
        search: {key: 'name', value: search}
      })
    },
    goDetails (status, item, force) {
      let selectionString = document.getSelection().toString()
      if (!selectionString || force) {
        if (status === 'new') {
          this.$router.push({name: 'NewUser'})
        }
        else {
          this.$router.push({
            name: 'UserDetails',
            params: {loginId: item.loginId},
            query: {id: item.id}
          })
        }
      }
    }
  },
  created () {
    console.log('userlist created')
  }
}
</script>

<style scoped>

</style>
