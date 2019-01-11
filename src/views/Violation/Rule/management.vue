<template>
  <l-layout :layout="['xs12', 'md10']">
    <v-card>
      <v-card-title class="py-2">
        <span class="px-1"></span>
        <span
          :class="bcItems.length === 0 ? '':'primary--text'"
          :style="{cursor: bcItems.length === 0? '':'pointer'}"
          @click="pop(rules)"
          class="subheading"
        >违章事件列表</span>
        <v-icon class="mx-2" v-if="bcItems.length !== 0">$vuetify.icons.chevronRight</v-icon>
        <template v-for="(item, i) in bcItems">
          <span
            :class="i === bcItems.length - 1 ? 'grey--text':'primary--text'"
            :key="i"
            :style="{cursor: i === bcItems.length - 1 ? '':'pointer'}"
            @click="pop(item)"
            class="subheading"
          >{{item.name}}</span>
          <v-icon :key="i + 'divider'" class="mx-2" v-if="i < bcItems.length - 1">$vuetify.icons.chevronRight</v-icon>
        </template>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn @click="refresh" icon slot="activator">
            <v-icon>$vuetify.icons.refresh</v-icon>
          </v-btn>
          <span>刷新</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn
            @click="goNew(items[0])"
            icon
            slot="activator"
          >
            <v-icon>$vuetify.icons.add</v-icon>
          </v-btn>
          <span>添加规则</span>
        </v-tooltip>

      </v-card-title>
      <v-divider></v-divider>
      <!--<v-tooltip bottom open-delay="1500">-->
      <div>
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
          disable-initial-sort
          hide-actions
          item-key="name"
        >
          <template slot="no-data">
            <v-flex class="body-2 text-xs-center">
              <div v-if="loading">数据加载中...</div>
              <div v-else-if="errorData.error">
                <span>数据加载出错: {{errorData.message}}, code: {{errorData.code}}</span>
                <v-btn @click="refresh()" color="primary" flat>重新加载</v-btn>
              </div>
              <div class="grey--text" v-else>没有规则</div>
            </v-flex>
          </template>
          <template slot="items" slot-scope="p">
            <tr
              @click="selected = selected === p.index ? -1: p.index"
              @dblclick="go(p.item)"
            >
              <td>
                <v-flex align-center layout>
                  <v-icon :color="selected === p.index ? 'primary' : ''" class="pr-4"
                  >{{hasChildren(p.item)? 'mdi-folder' : 'mdi-file-document'}}
                  </v-icon>
                  {{p.item.name}}
                </v-flex>
              </td>
              <td
                :class="['text-xs-' + (header.align||'left')]"
                :key="i"
                v-for="(header, i) in headers.slice(1)"
                v-if="header.value"
              >
                <div>
                  <v-tooltip :disabled="!header.tooltip" bottom max-width="48em">
                    <div
                      :class="header.maxWidth? 'hide-more-content':'' "
                      :style="header.maxWidth?'max-width: ' + header.maxWidth:''"
                      class="d-inline-block"
                      slot="activator"
                    >
                      <div
                        :class="[header.monospaced? 'monospaced':'']"
                        :style="header.monospaced? {'width': header.monospaced + '!important'}:''"
                        v-if="hasValue(tdItemValue(p.item[header.value], header)) || !header.placeholder"
                      >
                        <span
                          :class="[header.clickable?'primary--text':'']"
                          :style="header.clickable?'cursor: point':''"
                        >{{tdItemValue(p.item[header.value], header)}}</span>
                      </div>
                      <span class="grey--text" v-else>{{header.placeholder}}</span>
                    </div>
                    <span>{{tdItemValue(p.item[header.value], header)}}</span>
                  </v-tooltip>
                  <span class="grey--text caption pl-4"
                        v-if="header.remark && header.remark.filter(p.item[header.value])">{{header.remark.text}}</span>
                </div>
              </td>

              <td @dblclick.stop class="text-xs-right" style="width: 100px">
                <v-menu left>
                  <v-btn class="mx-0 px-0" icon slot="activator">
                    <v-icon small>$vuetify.icons.more</v-icon>
                  </v-btn>
                  <v-list dense>
                    <v-list-tile
                      @click="goDetails(p.item)"
                    >
                      <v-list-tile-title class="pr-1">
                        <v-icon class="pr-3" small>$vuetify.icons.details</v-icon>
                        查看规则
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      @click="goNew(p.item)"
                    >
                      <v-list-tile-title class="pr-1">
                        <v-icon class="pr-3" small>$vuetify.icons.add</v-icon>
                        添加细分规则
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      @click="deleteRule(p.item)"
                    >
                      <v-list-tile-title class="pr-1">
                        <v-icon class="pr-3" small>$vuetify.icons.delete</v-icon>
                        删除规则
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <!--<span>双击跳转</span>-->
      <!--</v-tooltip>-->
    </v-card>
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import {time} from '../../../utils/time'

export default {
  name: 'ViolationRuleManagement',
  components: {LLayout},
  data: () => ({
    bcItems: [],
    selected: -1,
    errorData: {
      error: false,
      message: '',
      code: 1
    },
    loading: false,
    items: [],
    headers: [
      {text: '规则名称', value: 'name', align: 'left', placeholder: 'N/A'},
      {text: '严重程度', value: 'severity', align: 'right', placeholder: 'N/A'},
      // {text: '创建时间', value: 'creationTime', align: 'right', placeholder: 'N/A', f: v => time.stringify(v)},
      {text: '', value: '', align: 'right', width: '80px', sortable: false}
    ]
  }),
  computed: {
    hasValue () {
      return (v) => {
        return v !== undefined && v !== null && v !== ''
      }
    },
    rules: {
      get () {
        return this.$store.state.violation.ruleList
      },
      set (val) {
        this.$store.commit('violation/setRuleList', val)
      },
    },
    hasChildren () {
      return (item) => {
        return item.children && item.children.length !== 0
      }
    },
    tdItemValue () {
      return (val, header) => {
        if (header instanceof Object && typeof header.f === 'function') {
          return header.f(val)
        }
        else {
          return val
        }
      }
    },
  },
  methods: {
    pop (item) {
      let bcs = this.bcItems
      while (this.bcItems.length > 0) {
        let bc = bcs[bcs.length - 1]
        if (item.id === bc.id) {
          this.items = bc.children
          break
        }
        else {
          bcs.pop()
        }
      }
      if (bcs.length === 0) {
        this.items = this.rules
      }
    },
    go (item) {
      // console.log('go', item)
      if (this.hasChildren(item)) {
        this.push(item)
      }
      else {
        this.goDetails(item)
      }
    },
    push (item) {
      this.bcItems.push(item)
      this.items = item.children || []
    },
    showError (msg, code) {
      this.errorData = {
        error: true,
        message: msg,
        code: code
      }
    },
    resetError () {
      this.errorData = {
        error: false,
        code: 1,
        message: ''
      }
    },
    findDir () {
      let newItems = this.rules

      for (let bc of this.bcItems) {
        let i = newItems.findIndex(item => item.id === bc.id)
        if (i >= 0) {
          newItems = newItems[i].children
        }
        else {
          break
        }
      }
      this.items = newItems
    },
    async refresh () {
      this.loading = true
      this.resetError()
      this.rules = []
      await this.getRules()
      this.loading = false
    },
    async getRules () {
      try {
        await this.$store.dispatch('violation/getRules')
        this.findDir()
      }
      catch (e) {
        this.showError(e.message, e.code)
      }
    },
    goDetails (item) {
      this.$router.push({
        name: 'ViolationRuleDetails',
        params: {name: item.name},
        query: {id: item.id}
      })
    },
    goNew (item) {
      if (this.$store.getters.getTab({name: 'NewViolationRule'})) {
        this.$store.dispatch('confirm', {
          title: '提示',
          icon: '$vuetify.icons.alert',
          iconColor: 'warning',
          text: '请您完成当前规则提交后再添加新规则',
          disableCancel: true
        })
      }
      else {
        this.$router.push({
          name: 'NewViolationRule',
          query: {parent: item.code}
        })
      }
    },
    goEdit (item) {
      this.$router.push({
        name: 'EditViolationRule',
        params: {name: item.name},
        query: {id: item.id}
      })
    },
    deleteRule (item) {
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style scoped>

</style>
