<template>
  <l-layout :layout="['xs12', 'lg10']">
    <v-card>
      <v-card-title class="pl-4" style="height: 64px">
        <span :class="data.name ? '':'grey--text'" class="title">{{data.name || '新增用户'}}</span>
        <v-spacer></v-spacer>
        <div v-if="!newItem">
          <v-layout class="text-xs-right" wrap>
            <v-flex xs6>
              <span class="grey--text caption mr-2">登记时间</span>
              <span class="pr-4">{{timeStringify(data.creationTime)}}</span>
            </v-flex>
            <v-flex xs6>
              <span class="grey--text caption mr-2">上次更新</span>
              <span class="pr-4">{{timeStringify(data.lastUpdateTime)}}</span>
            </v-flex>
          </v-layout>
        </div>
      </v-card-title>
      <v-card-text>
        <!--<h3>{{data === null}}/{{data}}/</h3>-->
        <v-container fluid grid-list-md>
          <v-layout class="mb-4" wrap>
            <v-flex xs4>
              <v-text-field
                :rules="$rules.required()"
                hint="必填"
                label="用户姓名"
                persistent-hint
                prepend-icon="$vuetify.icons.person"
                v-model="data.name"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                :disabled="editing"
                :rules="$rules.required()"
                hint="必填"
                label="用户账号"
                persistent-hint
                prepend-icon="$vuetify.icons.loginId"
                v-model="data.loginId"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="电子邮箱"
                prepend-icon="$vuetify.icons.email"
                v-model="data.email"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="电话号码"
                prepend-icon="$vuetify.icons.phone"
                v-model="data.phone"
              ></v-text-field>
            </v-flex>
            <!--<v-flex xs4>-->
            <!--<v-text-field-->
            <!--label="证件类型"-->
            <!--prepend-icon="$vuetify.icons.idCardType"-->
            <!--&gt;</v-text-field>-->
            <!--</v-flex>-->
            <!--<v-flex xs4>-->
            <!--<v-text-field-->
            <!--label="证件号码"-->
            <!--prepend-icon="$vuetify.icons.idCard"-->
            <!--&gt;</v-text-field>-->
            <!--</v-flex>-->
            <v-flex xs4>
              <v-text-field
                :value="data.typeName"
                disabled
                label="登记类型"
                placeholder="N/A"
                prepend-icon="$vuetify.icons.group"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                :value="data.orgGroupName"
                disabled
                label="所在单位"
                placeholder="请绑定单位用户组"
                prepend-icon="$vuetify.icons.org"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <!--<v-btn color="grey" flat v-if="editing">取消</v-btn>-->
              <v-btn :disabled="!hasChanged" :loading="infoLoading" @click="setUser()" color="primary" flat>提交修改</v-btn>
              <v-btn color="primary" flat>修改密码</v-btn>
            </v-flex>
          </v-layout>
          <v-subheader>绑定用户组</v-subheader>
          <v-layout class="mb-4" wrap>
            <v-flex xs12>
              <l-data-table
                :headers="groupHeaders"
                :items="data.groupList"
                flat
                hide-actions
                hide-headers
                hide-title
                no-data-text="没有绑定用户组"
              >
                <template slot="row-action" slot-scope="{item}">
                  <td @click.stop class="px-0 mx-0 text-xs-right">
                    <v-btn @click="deleteGroup(item)" icon>
                      <v-icon small>$vuetify.icons.delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </l-data-table>
            </v-flex>
            <v-flex xs12>
              <v-btn @click="openGroupDialog" class="mx-0" color="primary" flat>添加用户组</v-btn>
            </v-flex>
          </v-layout>
          <v-subheader>绑定角色</v-subheader>
          <v-layout class="mb-4" wrap>
            <v-flex xs12>
              <l-data-table
                :headers="roleHeaders"
                :items="data.roleList"
                flat
                hide-actions
                hide-headers
                hide-title
                no-data-text="没有绑定角色"
              >
                <template slot="row-action" slot-scope="{item}">
                  <td @click.stop class="px-0 mx-0 text-xs-center">
                    <v-btn @click="deleteRole(item)" icon>
                      <v-icon small>$vuetify.icons.delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </l-data-table>
            </v-flex>
            <v-flex xs12>
              <v-btn @click="openRoleDialog" class="mx-0" color="primary" flat>添加角色</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <!--<v-flex class="text-xs-right my-4">-->
    <!--<v-btn color="grey" flat v-if="editing">取消</v-btn>-->
    <!--<v-btn color="primary">提交</v-btn>-->
    <!--</v-flex>-->
    <l-dialog
      :auto-close="newItem"
      :loading="roleDialog.loading"
      @cancel="roleDialog.activate = false"
      @confirm="addRoles(roleDialog.roles)"
      hide-divider
      max-width="500px"
      title="添加角色"
      v-model="roleDialog.activate"
    >
      <v-container>
        <l-autocomplete
          :get-data="getRoles"
          item-text="name"
          label="添加角色"
          multiple
          prepend-icon="$vuetify.icons.role"
          v-model="roleDialog.roles"
        ></l-autocomplete>
      </v-container>
    </l-dialog>
    <l-dialog
      :auto-close="newItem"
      :loading="groupDialog.loading"
      @cancel="groupDialog.activate = false"
      @confirm="addGroups(groupDialog.groups)"
      hide-divider
      max-width="500px"
      title="添加用户组"
      v-model="groupDialog.activate"
    >
      <v-container>
        <l-autocomplete
          :get-data="getGroups"
          item-text="name"
          label="添加用户组"
          multiple
          prepend-icon="$vuetify.icons.group"
          v-model="groupDialog.groups"
        ></l-autocomplete>
      </v-container>
    </l-dialog>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import {time} from '../../../utils/time'
import LDataTable from '../../../components/Data/LDataTable'
import LAutocomplete from '../../../components/Inputs/LAutocomplete'
import LDialog from '../../../components/Layout/LDialog'

export default {
  name: 'userDetailsEdit',
  components: {LAutocomplete, LDialog, LLayout, LDataTable},
  props: {
    status: {type: String, default: 'readonly'},
    data: {type: Object, default: () => ({})},
  },
  data: () => ({
    hasChanged: false,
    infoLoading: false,
    roleDialog: {
      activate: false,
      loading: false,
      roles: [],
    },
    passDialog: {},
    groupDialog: {
      activate: false,
      loading: false,
      groups: [],
    },
    groupHeaders: [
      {text: '用户组名称', value: 'name', align: 'left', placeholder: 'N/A'},
      // {text: '用户组描述', value: 'description', align: 'right', placeholder: 'N/A'},
      {text: '用户组类型', value: 'type', align: 'right', placeholder: 'N/A'},
      {text: '创建时间', value: 'creationTIme', align: 'right', placeholder: 'N/A'},
      {text: '', value: '', sortable: false, width: '80px'},
    ],
    roleHeaders: [
      {text: '角色名称', value: 'name', align: 'left', placeholder: 'N/A'},
      {text: '角色描述', value: 'description', align: 'right', placeholder: 'N/A'},
      {text: '创建时间', value: 'creationTIme', align: 'right', placeholder: 'N/A'},
      {text: '', value: '', align: 'center', sortable: false, width: '80px'},
    ]
  }),
  computed: {
    newItem () {
      return this.status === 'new'
    },
    editing () {
      return this.status === 'edit'
    },
  },
  watch: {
    data: {
      handler () {
        this.hasChanged = true
      },
      deep: true,
    }
  },
  methods: {
    openRoleDialog () {
      this.roleDialog = {
        activate: true,
        loading: false,
        roles: []
      }
    },
    openGroupDialog () {
      this.groupDialog = {
        activate: true,
        loading: false,
        groups: []
      }
    },
    async getGroups () {
      return [
        {id: '1', name: '组1'},
        {id: '2', name: '组2'},
        {id: '3', name: '组3'},
      ]
    },
    async getRoles () {
      return [
        {id: '1', name: '角色1'},
        {id: '2', name: '角色2'},
        {id: '3', name: '角色3'},
      ]
    },
    deleteGroup (group) {

    },
    deleteRole (role) {

    },
    async setUser () {
      this.infoLoading = true
      try {
        await this.$store.dispatch('userAdmin/setUser', this.data)
        this.$emit('refresh')
        this.$store.dispatch('alert', {type: 'success', message: '修改成功'})
      }
      catch (e) {
        this.$store.dispatch('alert', {type: 'error', message: e.message})
      }
      finally {
        this.infoLoading = false
      }
    },
    async addRoles (items) {
      console.log('addRole', items)
      if (items instanceof Array && items.length) {
        if (this.newItem) {
          this.data.addRole(...items)
        }
        if (this.editing) {
          try {
            this.roleDialog.loading = true
            await this.$store.dispatch('userAdmin/bindRoles', {person: this.data, groups: items})
          }
          catch (e) {
            this.$store.dispatch('alert', {type: 'error', message: 'e'})
          }
          finally {
            this.roleDialog.activate = false
            this.roleDialog.loading = false
          }
        }
      }
    },
    async addGroups (items) {
      console.log('addGroups', items)
      if (items instanceof Array && items.length) {
        if (this.newItem) {
          this.data.addGroup(...items)
        }
        if (this.editing) {
          try {
            this.groupDialog.loading = true
            await this.$store.dispatch('userAdmin/bindGroups', {person: this.data, groups: items})
          }
          catch (e) {
            this.$store.dispatch('alert', {type: 'error', message: 'e'})
          }
          finally {
            this.groupDialog.activate = false
            this.groupDialog.loading = false
          }
        }
      }
    },
    timeStringify (t) {
      return time.stringify(t)
    },
  },
  created () {
  }
}
</script>

<style scoped>

</style>
