<template>
  <l-layout :layout="['xs12', 'md10']">
    <v-card>
      <v-card-title class="pl-4" style="height: 64px">
        <span :class="data.name ? '':'grey--text'" class="title pr-4">{{data.name || '新增用户'}}</span>
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
        <v-btn @click="goEdit" class="mx-0" color="primary" flat>编辑</v-btn>
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
                v-model="data.name"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                disabled
                label="用户账号"
                placeholder="N/A"
                v-model="data.loginId"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                disabled
                label="登记类型"
                placeholder="N/A"
                v-model="data.typeName"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                disabled
                label="电话号码"
                placeholder="N/A"
                v-model="data.phone"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                disabled
                label="电子邮箱"
                placeholder="N/A"
                v-model="data.email"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                disabled
                label="所在单位"
                placeholder="N/A"
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
        </v-container>
      </v-card-text>
    </v-card>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import {time} from '../../../utils/time'
import LDataTable from '../../../components/Data/LDataTable'

export default {
  name: 'userDetailsContent',
  components: {LLayout, LDataTable},
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
    goEdit () {
      this.$store.commit('closeTab', this.$route.fullPath)
      this.$router.push({
        name: 'EditUser',
        params: {loginId: this.data.loginId},
        query: {id: this.data.id}
      })
    },
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
