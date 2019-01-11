<template>
  <l-layout :layout="['lg10', 'xs12']" bottom-space>
    <l-data-table
      :get-data-func="getEvents"
      :headers="userHeaders"
      init-sort-by="plate"
      ref="dataTable"
      title-text="违章历史记录"
      :filter-items="filterItems"
    >
      <!--<template slot="title-action">-->
      <!--<l-option-list-->
      <!--:options="moreActions"-->
      <!--@delete="deleteUser(selected)"-->
      <!--&gt;-->
      <!--<v-btn icon slot="activator">-->
      <!--<v-icon>$vuetify.icons.more</v-icon>-->
      <!--</v-btn>-->
      <!--</l-option-list>-->
      <!--</template>-->
    </l-data-table>
    <!--<l-dialog-->
    <!--hide-divider-->
    <!--:auto-close="false"-->
    <!--:disable-confirm="!userValid"-->
    <!--:loading="userDialog.loading"-->
    <!--@cancel="userDialog.activate = false"-->
    <!--@confirm="addUser(userDialog.form)"-->
    <!--max-width="400px"-->
    <!--title="新增用户"-->
    <!--v-model="userDialog.activate"-->
    <!--&gt;-->
    <!--<v-container grid-list-md class="pt-0">-->
    <!---->
    <!--</v-container>-->
    <!--</l-dialog>-->
  </l-layout>
</template>

<script>
import LDataTable from '../../../components/Data/LDataTable'
import {time} from '../../../utils/time'
import LLayout from '../../../components/Layout/LLayout'
// import LOptionList from '../../../components/LOptionList'

export default {
  name: 'ViolationHistory',
  components: {LLayout, LDataTable},
  data: () => ({
    role: 'TRAFFIC_ADMIN',
    roleItems: [
      {name: '交通管理员', id: 'TRAFFIC_ADMIN', status: 0, routeName: 'ViolationEventDetails'},
      {name: '报警中心管理员', id: 'ALARM_ADMIN', status: 0, routeName: 'ViolationEventPreliminary'},
      {name: '违章管理员', id: 'VIOLATION_ADMIN', status: 1, routeName: 'ViolationEventFinal'},
    ],
    // userValid: false,
    // selected: [],
    // userDialog: {
    //   activate: false,
    //   form: {
    //     name: '',
    //     loginId: '',
    //     password: '',
    //     passwordAgain: ''
    //   },
    //   checkMessage: '',
    //   loading: false
    // },
    filterItems: [
      {
        key: 'creationTime',
        value: '',
        label: '上报时间',
        type: 'duration',
        layout: ['xs12', 'sm4'],
        f: v => v ? [time.toTimeStamp(v.startDatetime) || 0, time.toTimeStamp(v.endDatetime) || 9999999999999] : [0, 9999999999999],
        range: true
      },
      {
        prependIcon: '$vuetify.icons.description',
        key: 'type',
        value: '',
        label: '违章类型',
        type: 'input',
        layout: ['xs12', 'sm4'],
      },
      {
        prependIcon: '$vuetify.icons.location',
        key: 'area',
        value: '',
        label: '违章区域',
        type: 'input',
        layout: ['xs12', 'sm4'],
      },
    ],
    userHeaders: [
      {text: '车辆号牌', value: 'plate', align: 'left', placeholder: 'N/A'},
      {text: '电话号码', value: 'phone', align: 'right', placeholder: 'N/A'},
      {text: '违章区域', value: 'area', align: 'right', placeholder: 'N/A'},
      {text: '违章类型', value: 'typeName', align: 'right', placeholder: 'N/A'},
      {text: '上报时间', value: 'creationTime', align: 'right', placeholder: 'N/A', f: v => time.stringify(v)},
      // {text: '', value: '', align: 'right', width: '80px', sortable: false}
    ],
  }),
  computed: {
    roleName () {
      return (role) => {
        return (this.roleItems.find(r => r.id === role) || {}).name
      }
    },
    routeName () {
      return (this.roleItems.find(r => r.id === this.role) || {}).routeName || ''
    }
  },
  methods: {
    changeRole (r) {
      this.role = r.id
      this.$refs.dataTable.refresh()
    },
    async submit () {
      if (this.$store.getters.getTab({name: 'ViolationEventSubmit'})) {
        this.$store.dispatch('confirm', {
          title: '提示',
          icon: '$vuetify.icons.alert',
          iconColor: 'warning',
          text: '请您完成当前上报事件后再上报新事件',
          disableCancel: true
        })
      }
      else {
        this.$router.push(
          {
            name: 'ViolationEventSubmit',
            query: {role: this.role + ''}
          },
          () => {
            console.log('onComplete')
          },
          () => {
            console.log('onAbort')
          }
        )
      }
    },
    // openUserDialog () {
    //   this.userDialog = {
    //     activate: true,
    //     form: {
    //       name: '',
    //       loginId: '',
    //       password: '',
    //       passwordAgain: ''
    //     },
    //     checkMessage: ''
    //   }
    //   this.$refs.addUser.reset()
    // },
    handle (event) {
      if (!this.routeName) return
      this.$router.push({
        name: this.routeName,
        query: {id: event.id},
        params: {plate: event.plate},
      })
    },
    async getEvents ({pagination, sortStack, filterItems, search}) {
      let roleFilter = {key: 'status', value: this.role.status}
      return this.$store.dispatch('violation/getEvents', {
        pagination,
        sortStack,
        filter: filterItems ? [...filterItems, roleFilter] : [roleFilter],
        search: {key: 'plate', value: search}
      })
    },
    goDetails (status, item, force) {
      let selectionString = document.getSelection().toString()
      if (!selectionString || force) {
        // if (status === 'new') {
        //   this.$router.push({name: 'NewUser'})
        // }
        // else {
        //   this.$router.push({
        //     name: 'UserDetails',
        //     params: {loginId: item.loginId},
        //     query: {id: item.id}
        //   })
        // }
      }
    }
  },
}
</script>

<style scoped>

</style>
