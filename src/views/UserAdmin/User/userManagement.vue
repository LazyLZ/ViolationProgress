<template>
  <l-layout :layout="['lg10', 'xs12']" bottom-space>
    <!--//{{selected.map(t => t.loginId)}}//-->
    <l-data-table
      :filter-items="filterItems"
      :get-data-func="getUsers"
      :headers="userHeaders"
      @click:row="goDetails('readonly',$event.item)"
      clickable
      init-sort-by="name"
      ref="userList"
      selectable
      title-text="登记用户列表"
      v-model="selected"
    >
      <template slot="title-action">
        <l-option-list
          :options="moreActions"
          @delete="deleteUser(selected)"
        >
          <v-btn icon slot="activator">
            <v-icon>$vuetify.icons.more</v-icon>
          </v-btn>
        </l-option-list>
      </template>
      <template slot="row-action" slot-scope="{item}">
        <td @click.stop class="px-0 mx-0 text-xs-center">
          <v-btn @click="deleteUser(item)" icon>
            <v-icon small>$vuetify.icons.delete</v-icon>
          </v-btn>
        </td>
      </template>
    </l-data-table>
    <l-fixed-btn
      @click="goDetails('new',{}, true)"
      icon="$vuetify.icons.add"
    ></l-fixed-btn>
    <l-dialog
      hide-divider
      :auto-close="false"
      :disable-confirm="!userValid"
      :loading="userDialog.loading"
      @cancel="userDialog.activate = false"
      @confirm="addUser(userDialog.form)"
      max-width="400px"
      title="新增用户"
      v-model="userDialog.activate"
    >
      <v-container grid-list-md class="pt-0">
        <v-form ref="addUser" v-model="userValid">
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                :rules="$rules.required()"
                hint="必填"
                label="用户姓名"
                persistent-hint
                prepend-icon="$vuetify.icons.person"
                v-model="userDialog.form.name"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :rules="$rules.required()"
                hint="必填"
                label="用户账号"
                persistent-hint
                prepend-icon="$vuetify.icons.loginId"
                v-model="userDialog.form.loginId"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :rules="$rules.required()"
                hint="必填"
                label="用户密码"
                persistent-hint
                prepend-icon="$vuetify.icons.lock"
                type="password"
                v-model="userDialog.form.password"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :rules="[$rules.requiredS(), v => v === userDialog.form.password || '两次密码输入不一致']"
                hint="必填"
                label="再次输入"
                persistent-hint
                prepend-icon="$vuetify.icons.lock"
                type="password"
                v-model="userDialog.form.passwordAgain"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </l-dialog>
  </l-layout>
</template>

<script>
import LDataTable from '../../../components/Data/LDataTable'
import {time} from '../../../utils/time'
import LLayout from '../../../components/Layout/LLayout'
import LFixedBtn from '../../../components/LFixedBtn'
import LOptionList from '../../../components/LOptionList'
import LDialog from '../../../components/Layout/LDialog'

export default {
  name: 'UserList',
  components: {LDialog, LOptionList, LFixedBtn, LLayout, LDataTable},
  data: () => ({
    userValid: false,
    selected: [],
    userDialog: {
      activate: false,
      form: {
        name: '',
        loginId: '',
        password: '',
        passwordAgain: ''
      },
      checkMessage: '',
      loading: false
    },
    floatingButton: false,
    moreActions: [
      {
        event: 'delete',
        label: '批量删除',
        icon: '$vuetify.icons.deleteAll'
      },
      // {
      //   event: 'export',
      //   label: '导出PDF',
      //   icon: '$vuetify.icons.description'
      // }
    ],
    filterItems: [
      {
        key: 'creationTime',
        value: '',
        label: '登记时间',
        type: 'duration',
        layout: ['xs12', 'sm4'],
        f: v => v ? [time.toTimeStamp(v.startDatetime) || 0, time.toTimeStamp(v.endDatetime) || 9999999999999] : [0, 9999999999999],
        range: true
      },
      {
        prependIcon: '$vuetify.icons.person',
        key: 'loginId',
        value: '',
        label: '登录ID',
        type: 'input',
        layout: ['xs12', 'sm4'],
      },
      {
        prependIcon: '$vuetify.icons.phone',
        key: 'phone',
        value: '',
        label: '电话号码',
        type: 'input',
        layout: ['xs12', 'sm4'],
      },
    ],
    userHeaders: [
      {text: '用户姓名', value: 'name', align: 'left', placeholder: 'N/A'},
      {text: '用户ID', value: 'loginId', align: 'right', placeholder: 'N/A'},
      {text: '电话号码', value: 'phone', align: 'right', placeholder: 'N/A'},
      {text: '登记时间', value: 'creationTime', align: 'right', placeholder: 'N/A', f: v => time.stringify(v)},
      {text: '', value: '', align: 'right', width: '80px', sortable: false}
    ],
  }),
  methods: {
    msg (m) {
      console.log(m)
    },
    async addUser ({name, loginId, password, passwordAgain}) {
      if (this.$refs.addUser && this.$refs.addUser.validate()) {
        this.$set(this.userDialog, 'loading', true)
        // console.log(this.userDialog.loading)
        try {
          let person = await this.$store.dispatch('userAdmin/setUser', {
            name,
            loginId,
            password,
          })

          this.$set(this.userDialog, 'activate', false)
          this.$refs.userList.refresh()
          this.$router.push({
            name: 'EditUser',
            params: {loginId: person.loginId},
            query: {id: person.id}
          })
        }
        catch (e) {
          this.$store.dispatch('alert', {type: 'error', message: e.message})
        }
        finally {
          this.userDialog.loading = false
        }
      }
    },
    openUserDialog () {
      this.userDialog = {
        activate: true,
        form: {
          name: '',
          loginId: '',
          password: '',
          passwordAgain: ''
        },
        checkMessage: ''
      }
      this.$refs.addUser.reset()
    },
    deleteUser (user) {
      // console.log(user)
      let multiple = user instanceof Array
      if (!user) return
      if (multiple && user.length === 0) {
        this.$store.dispatch('alert', {type: 'success', message: '未选中任何项'})
        return
      }
      this.$store.dispatch('confirm', {
        title: multiple ? '确认删除选中项目？' : '确认删除该用户？',
        text: multiple ? '' : user.name || `N/A(${user.loginId})`,
        subText: multiple ? user.map(u => u.name || `N/A(${u.loginId})`) : undefined,
        onConfirm: resolve => {
          // console.log('delete success')
          this.$store.dispatch('userAdmin/deleteUsers', user).then(res => {
            this.$store.dispatch('alert', {type: 'success', message: '删除成功'})
          }).catch(e => {
            this.$store.dispatch('alert', {type: 'error', message: e.message})
          }).finally(() => {
            resolve()
          })
        }
      })
      if (multiple) {
        this.selected = []
      }
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
  // created () {
  //   console.log('userlist created')
  // },
}
</script>

<style scoped>

</style>
