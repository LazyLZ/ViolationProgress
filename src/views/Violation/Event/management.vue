<template>
  <l-layout :layout="['lg10', 'xs12']" bottom-space>
    <l-data-table
      :get-data-func="getEvents"
      :headers="userHeaders"
      init-sort-by="plate"
      ref="userList"
      title-text="待处理事件列表"
    >
      <template slot="title">
        <span class="pr-4">待处理事件列表</span>
        <span class="font-weight-medium body-2">角色: </span>
        <v-menu bottom offset-y>
          <v-btn color="primary" flat slot="activator">{{role}}</v-btn>
          <v-list dense>
            <v-list-tile :key="r.id" @click="role = r.id" v-for="r in roleItems">{{r.name}}</v-list-tile>
          </v-list>
        </v-menu>
      </template>
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
      <template slot="row-action" slot-scope="{item}">
        <td @click.stop class="px-0 mx-0 text-xs-center">
          <v-btn @click="handle(item)" color="primary" flat>处理</v-btn>
        </td>
      </template>
    </l-data-table>
    <l-fixed-btn
      @click="submit()"
      icon="$vuetify.icons.add"
    ></l-fixed-btn>
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
import LFixedBtn from '../../../components/LFixedBtn'
// import LOptionList from '../../../components/LOptionList'

export default {
  name: 'ViolationEventManagement',
  components: {LFixedBtn, LLayout, LDataTable},
  data: () => ({
    role: 'TRAFFIC_ADMIN',
    roleItems: [
      {name: '交通管理员', id: 'TRAFFIC_ADMIN'},
      {name: '报警中心管理员', id: 'ALARM_ADMIN'},
      {name: '违章管理员', id: 'VIOLATION_ADMIN'},
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
    // filterItems: [
    //   {
    //     key: 'creationTime',
    //     value: '',
    //     label: '登记时间',
    //     type: 'duration',
    //     layout: ['xs12', 'sm4'],
    //     f: v => v ? [time.toTimeStamp(v.startDatetime) || 0, time.toTimeStamp(v.endDatetime) || 9999999999999] : [0, 9999999999999],
    //     range: true
    //   },
    //   {
    //     prependIcon: '$vuetify.icons.person',
    //     key: 'loginId',
    //     value: '',
    //     label: '登录ID',
    //     type: 'input',
    //     layout: ['xs12', 'sm4'],
    //   },
    //   {
    //     prependIcon: '$vuetify.icons.phone',
    //     key: 'phone',
    //     value: '',
    //     label: '电话号码',
    //     type: 'input',
    //     layout: ['xs12', 'sm4'],
    //   },
    // ],
    userHeaders: [
      {text: '车辆号牌', value: 'plate', align: 'left', placeholder: 'N/A'},
      {text: '电话号码', value: 'phone', align: 'right', placeholder: 'N/A'},
      {text: '违章区域', value: 'area', align: 'right', placeholder: 'N/A'},
      {text: '违章类型', value: 'typeName', align: 'right', placeholder: 'N/A'},
      {text: '上报时间', value: 'creationTime', align: 'right', placeholder: 'N/A', f: v => time.stringify(v)},
      {text: '', value: '', align: 'right', width: '80px', sortable: false}
    ],
  }),
  methods: {
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
    handle (user) {
    },
    async getEvents ({pagination, sortStack, filterItems, search}) {
      return this.$store.dispatch('violation/getEvents', {
        pagination,
        sortStack,
        filter: filterItems,
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
