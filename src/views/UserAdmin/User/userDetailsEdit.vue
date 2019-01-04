<template>
  <l-layout :layout="['xs12', 'md10']">
    <v-card>
      <v-card-title class="pl-4" style="height: 64px">
        <span class="title" :class="data.name ? '':'grey--text'">{{data.name || '新增用户'}}</span>
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
          <v-layout wrap>
            <v-flex xs4>
              <v-text-field
                label="用户姓名"
                v-model="data.name"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="用户账号"
                v-model="data.loginId"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="登记类型"
                v-model="data.typeName"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="电话号码"
                v-model="data.phone"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="电子邮箱"
                v-model="data.email"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                label="所在单位"
                v-model="data.groupName"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-subheader>绑定角色</v-subheader>
          <v-layout wrap>
            <v-flex xs12>
              <l-data-table
                :headers="roleHeaders"
                :items="[]"
                flat
                hide-actions
                hide-headers
                hide-title
                no-data-text="没有绑定角色"
              ></l-data-table>
            </v-flex>
            <v-flex xs12>
              <v-btn class="mx-0" color="primary" flat>添加角色</v-btn>
            </v-flex>
          </v-layout>
          <v-subheader>绑定用户组</v-subheader>
          <v-layout wrap>
            <v-flex xs12>
              <l-data-table
                :headers="groupHeaders"
                :items="[]"
                flat
                hide-actions
                hide-headers
                hide-title
                no-data-text="没有绑定用户组"
              ></l-data-table>
            </v-flex>
            <v-flex xs12>
              <v-btn class="mx-0" color="primary" flat>添加角色</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-flex class="text-xs-right my-4">
      <v-btn color="grey" flat v-if="editing">取消</v-btn>
      <v-btn color="primary">提交</v-btn>
    </v-flex>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import {time} from '../../../utils/time'
import LDataTable from '../../../components/Data/LDataTable'

export default {
  name: 'userDetailsEdit',
  components: {LLayout, LDataTable},
  props: {
    status: {type: String, default: 'readonly'},
    data: {type: Object, default: () => ({})},
  },
  data: () => ({
    groupHeaders: [
      {text: '用户组名称', value: 'name', align: 'left', placeholder: 'N/A'},
      {text: '用户组描述', value: 'description', align: 'right', placeholder: 'N/A'},
      {text: '创建时间', value: 'creationTIme', align: 'right', placeholder: 'N/A'},
    ],
    roleHeaders: [
      {text: '角色名称', value: 'name', align: 'left', placeholder: 'N/A'},
      {text: '角色描述', value: 'description', align: 'right', placeholder: 'N/A'},
      {text: '创建时间', value: 'creationTIme', align: 'right', placeholder: 'N/A'},
    ]
  }),
  computed: {
    newItem () {
      return this.status === 'new'
    },
    editing () {
      return this.status === 'edit'
    }
  },
  watch: {},
  methods: {
    timeStringify (t) {
      return time.stringify(t)
    },
  },
  create () {
  }
}
</script>

<style scoped>

</style>
