<template>
  <v-card>
    <v-card-title class="pl-4" style="height: 64px">
      <span :class="data.name ? '':'grey--text'" class="title pr-4">{{data.name || '未命名'}}</span>
      <div>
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
      <v-spacer></v-spacer>
      <slot name="actions"></slot>
    </v-card-title>
    <v-card-text>
      <!--<h3>{{data === null}}/{{data}}/</h3>-->
      <v-container fluid grid-list-md>
        <v-layout wrap>
          <v-flex xs4>
            <v-text-field
              disabled
              label="用户姓名"
              placeholder="N/A"
              prepend-icon="$vuetify.icons.person"
              v-model="data.name"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              disabled
              label="用户账号"
              placeholder="N/A"
              prepend-icon="$vuetify.icons.loginId"
              v-model="data.loginId"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              disabled
              label="电子邮箱"
              placeholder="N/A"
              prepend-icon="$vuetify.icons.email"
              v-model="data.email"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              disabled
              label="电话号码"
              placeholder="N/A"
              prepend-icon="$vuetify.icons.phone"
              v-model="data.phone"
            ></v-text-field>
          </v-flex>
          <!--<v-flex xs4>-->
          <!--<v-text-field-->
          <!--disabled-->
          <!--label="证件类型"-->
          <!--placeholder="N/A"-->
          <!--prepend-icon="$vuetify.icons.idCardType"-->
          <!--&gt;</v-text-field>-->
          <!--</v-flex>-->
          <!--<v-flex xs4>-->
          <!--<v-text-field-->
          <!--disabled-->
          <!--label="证件号码"-->
          <!--placeholder="N/A"-->
          <!--prepend-icon="$vuetify.icons.idCard"-->
          <!--&gt;</v-text-field>-->
          <!--</v-flex>-->
          <v-flex xs4>
            <v-text-field
              disabled
              label="登记类型"
              placeholder="N/A"
              prepend-icon="$vuetify.icons.group"
              v-model="data.typeName"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              :value="data.orgGroupName"
              disabled
              label="所在单位"
              placeholder="N/A"
              prepend-icon="$vuetify.icons.org"
            ></v-text-field>
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
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import {time} from '../../../utils/time'
import LDataTable from '../../../components/Data/LDataTable'

export default {
  name: 'userDetailsContent',
  components: {LDataTable},
  props: {
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
  computed: {},
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
