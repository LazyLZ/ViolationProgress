<template>
  <v-card :flat="smallScreen || flat">
    <v-card-title style="height: 64px" v-if="!hideTitle && !hideTitle_">
      <slot name="title">
        <v-flex align-center layout row>
          <span class="subheading ml-2 pr-4">{{titleText}}</span>
          <v-switch
            :label="switchLabel"
            v-if="titleSwitch"
            v-model="switchValue"
          ></v-switch>
        </v-flex>
      </slot>
      <v-spacer></v-spacer>
      <slot name="title-search">
        <v-text-field
          :label="searchText"
          append-icon="mdi-magnify"
          class="my-0 pt-0"
          hide-details
          single-line
          v-if="!hideTitleSearch"
          v-model="search"
        ></v-text-field>
      </slot>
      <div class="ml-3" v-if="!hideRefresh||(filterItems && !persistentFilter)"></div>
      <v-tooltip bottom>
        <v-btn @click.stop="filter = !filter" icon slot="activator" v-if="filterItems && !persistentFilter"
               v-model="filter">
          <v-icon>filter_list</v-icon>
        </v-btn>
        <span>筛选</span>
      </v-tooltip>
      <v-tooltip bottom v-if="!hideRefresh">
        <v-btn
          @click="refreshData_()"
          icon
          slot="activator"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <span>刷新</span>
      </v-tooltip>
      <slot name="title-action"></slot>
    </v-card-title>
    <v-divider></v-divider>
    <l-expand-transition-group>
      <div :key="'filter'" class="filter" v-if="filter">

        <!--筛选插槽-->
        <slot name="filter">
          <v-container class="pb-3" fluid grid-list-md v-if="filterItems && filterItems.length > 0">
            <v-form ref="filterForm">
              <v-layout row wrap>
                <v-flex :class="item.layout" :key="'flex' + i" :ref="'filter' + i" lg4 v-for="(item, i) in filterItems"
                        xl4>
                  <template v-if="item.type === 'select'">
                    <v-select
                      :hint="item.hint"
                      :item-text="item.itemText || 'text'"
                      :item-value="item.itemValue || 'value'"
                      :items="item.items"
                      :label="item.label"
                      :multiple="item.multiple"
                      :prepend-icon="item.icon"
                      :readonly="item.readonly"
                      :return-object="item.returnObject || false"
                      :rules="item.rules || []"
                      v-model="item.value"
                    ></v-select>
                  </template>
                  <template v-else-if="item.type==='textarea'">
                    <v-text-field
                      :hint="item.hint"
                      :label="item.label"
                      :prepend-icon="item.icon"
                      :readonly="item.readonly"
                      :rows="1"
                      :rules="item.rules"
                      auto-grow
                      v-model="item.value"
                    ></v-text-field>
                  </template>
                  <template v-else-if="item.type==='select-time' || item.type==='selectTime'">
                    <l-select-time
                      :label="item.label"
                      :readonly="item.readonly"
                      :rules="items.rules"
                      v-model="item.value"
                    ></l-select-time>
                  </template>
                  <template v-else-if="item.type==='select-date' || item.type==='selectDate'">
                    <l-select-date
                      :label="item.label"
                      :readonly="item.readonly"
                      :rules="items.rules"
                      v-model="item.value"
                    ></l-select-date>
                  </template>
                  <template v-else-if="item.type==='select-datetime' || item.type==='selectDatetime'">
                    <l-select-datetime
                      :label="item.label"
                      :readonly="item.readonly"
                      :rules="items.rules"
                      v-model="item.value"
                    ></l-select-datetime>
                  </template>
                  <template v-else-if="item.type==='select-weekday' || item.type==='selectWeekday'">
                    <l-select-weekday
                      :label="item.label"
                      :mode="item.weekdayMode"
                      :multiple="item.multiple"
                      :readonly="item.readonly"
                      :return-number="item.returnNumber"
                      :rules="items.rules"
                      :start-number="item.startNumber"
                      v-model="item.value"
                    ></l-select-weekday>
                  </template>
                  <template v-else-if="item.type==='select-datetime-duration' || item.type==='selectDatetimeDuration'">
                    <l-select-datetime-duration
                      :label="item.label"
                      :readonly="item.readonly"
                      :rules="items.rules"
                      v-model="item.value"
                    ></l-select-datetime-duration>
                  </template>
                  <template v-else>
                    <v-text-field
                      :hint="item.hint"
                      :label="item.label"
                      :prepend-icon="item.icon"
                      :readonly="item.readonly"
                      :rules="item.rules"
                      v-model="item.value"
                    ></v-text-field>
                  </template>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex>
                  <v-btn @click="getData_(initPage)" class="mx-0" color="primary" small>
                    筛选
                  </v-btn>
                  <v-btn @click="resetFilter()" small>
                    重置
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </slot>
      </div>
      <div :key="'table'">
        <v-divider v-if="filter"></v-divider>
        <v-data-table
          :disable-initial-sort="!mustSort && !initSortBy"
          :headers="headers"
          :hide-actions="hideActions || hideActions_"
          :hide-headers="hideHeaders || hideHeaders_"
          :item-key="itemKey"
          :items="(error || errorData.error) ? [] : data_"
          :loading="loading || loading_"
          :must-sort="mustSort"
          :no-results-text="noResultsText"
          :pagination.sync="pagination"
          :rows-per-page-items="rowsPerPageItems"
          :search="innerSort?search:undefined"
          :select-all="selectable"
          :total-items="innerSort ? undefined : (error || errorData.error) ? 0 : computeTotal"
          rows-per-page-text="每页行数"
          v-model="selected_"
        >
          <template slot="no-data">
            <slot :error="error ? errorMessage : errorData" :loading="loading_ || loading" name="no-data">
              <v-flex class="body-2 text-xs-center">
                <div v-if="loading_ || loading">{{loadingText}}</div>
                <div v-else-if="error">
                  <span>加载出错</span><span v-if="errorMessage">: {{errorMessage}}</span>
                  <v-btn @click="getData_(initPage)" class="mx-2" color="primary" flat>重新加载</v-btn>
                </div>
                <div v-else-if="errorData.error">
                  <span>加载出错: {{errorData.message}}, code: {{errorData.code}}</span>
                  <v-btn @click="getData_(initPage)" class="mx-2" color="primary" flat>重新加载</v-btn>
                </div>
                <div class="grey--text" v-else>{{noDataText}}</div>
              </v-flex>
            </slot>
          </template>
          <template slot="items" slot-scope="p">
            <tr :active="p.selected" :style="clickable ? 'cursor: pointer':''"
                @click="clickRow(p.item, p.index, p.selected)">
              <td style="width: 80px" v-if="selectable">
                <div @click.stop style="width: 0">
                  <v-checkbox
                    hide-details
                    primary
                    v-model="p.selected"
                  ></v-checkbox>
                </div>
              </td>
              <td
                :class="['text-xs' + (header.align||'left')]"
                :key="i"
                v-for="(header, i) in headers"
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
                        :class="header.monospaced? 'monospaced':''"
                        :style="header.monospaced? {'width': header.monospaced + '!important'}:''"
                        v-if="tdItemValue(p.item[header.value], header) || !header.placeholder"
                      >{{tdItemValue(p.item[header.value], header)}}
                      </div>
                      <span class="grey--text" v-else>{{header.placeholder}}</span>
                    </div>
                    <span>{{tdItemValue(p.item[header.value], header)}}</span>
                  </v-tooltip>
                  <span class="grey--text caption pl-4"
                        v-if="header.remark && header.remark.filter(p.item[header.value])">{{header.remark.text}}</span>
                </div>
                <!--<div v-else>-->
                <!--<div-->
                <!--:style="header.maxWidth?'max-width: ' + header.maxWidth:''"-->
                <!--:class="header.maxWidth? 'hide-more-content':'' "-->
                <!--&gt;-->
                <!--<span v-if="tdItemValue(p.item[header.value], header) || !header.placeholder">{{tdItemValue(p.item[header.value], header)}}</span>-->
                <!--<span v-else class="grey&#45;&#45;text">{{header.placeholder}}</span>-->
                <!--</div>-->
                <!--</div>-->
              </td>

              <!--行操作插槽-->
              <slot :index="p.index" :item="p.item" :selected="p.selected" name="row-action"></slot>
            </tr>
          </template>
          <template slot="pageText" slot-scope="props">
            <v-layout align-center row>
              <span>第</span>
              <v-text-field
                @input="jumpPage"
                class="d-inline-block mx-2 caption pt-0 mt-0"
                hide-details
                single-line
                style="width: 44px"
                v-model="tablePage"
              ></v-text-field>
              <span>页</span>
              <span>， {{props.pageStart}} - {{props.pageStop}} 条，共 {{props.itemsLength}} 条，
                {{Math.ceil(props.itemsLength/pagination.rowsPerPage)}} 页</span>
            </v-layout>
          </template>
        </v-data-table>
      </div>
    </l-expand-transition-group>
  </v-card>
</template>

<script>
import LExpandTransitionGroup from '../Transition/LExpandTransitionGroup'
import debounce from 'lodash/debounce'
import LSelectTime from '../Inputs/Time/LSelectTime'
import LSelectDatetime from '../Inputs/Time/LSelectDatetime'
import LSelectWeekday from '../Inputs/Time/LSelectWeekday'
import LSelectDatetimeDuration from '../Inputs/Time/LSelectDatetimeDuration'
// import {logger} from '../utils/logger'
import LSelectDate from '../Inputs/Time/LSelectDate'

let logger = {
  debug: console.log,
  warning: console.warn,
  info: console.log,
  error: console.error,
  critical: console.error
}
export default {
  name: 'LDataTable',
  components: {
    LSelectDate,
    LSelectDatetimeDuration,
    LSelectWeekday,
    LSelectDatetime,
    LSelectTime,
    LExpandTransitionGroup
  },
  props: {
    color: {
      type: String,
    },
    titleText: {
      type: String,
      default: ''
    },
    titleSwitch: {
      type: [Boolean, Object],
    },
    titleSwitchLabel: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: () => ([])
    },
    items: {
      type: Array,
    },
    filterItems: {
      type: [Array, undefined],
      default: undefined
    },
    totalItems: {
      type: Number,
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    flat: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    mustSort: {
      type: Boolean,
      default: true
    },
    initPagination: {
      type: Object,
      default: () => ({})
    },
    selected: {
      type: Array,
    },
    hideTitleSearch: {
      type: Boolean,
      default: false
    },
    hideHeaders: {
      type: Boolean,
      default: false
    },
    hideRefresh: {
      type: Boolean,
      default: false
    },
    hideTitle: {
      type: Boolean,
      default: false
    },
    hideActions: {
      type: Boolean,
      default: false
    },
    autoActions: {
      type: Boolean,
      default: false
    },
    autoTitle: {
      type: [Boolean, Number],
      default: false
    },
    autoHeaders: {
      type: [Boolean, Number],
      default: false
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: '数据加载中...'
    },
    noDataText: {
      type: String,
      default: '没有数据'
    },
    noResultsText: {
      type: String,
      default: '未检索到相关结果'
    },
    searchText: {
      type: String,
      default: '搜索'
    },
    getDataFunc: {
      type: Function,
    },
    persistentFilter: {
      type: Boolean,
      default: false
    },
    initSortBy: {
      type: String,
      default: '',
    },
    error: {},
    errorMessage: {
      type: String,
      default: ''
    },
  },
  model: {
    prop: 'selected',
    event: 'select'
  },
  data: () => ({
    loading_: false,
    refreshLoading: false,
    totalItems_: 0,
    switchValue: false,
    selected_: [],
    items_: [],
    filter: false,
    search: '',
    sortStack: [],
    rowsPerPageItems: [5, 10, 15, 20, 30, 50, 100, 200],
    tablePage: 1,
    pagination: {
      sortBy: '',
      page: 1,
      rowsPerPage: 10,
    },
    initPage: {
      sortBy: '',
      page: 1,
      rowsPerPage: 10,
    },
    errorData: {
      error: false,
      code: 1,
      message: ''
    },
  }),
  computed: {
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
    computeTotal () {
      if (this.totalItems !== undefined) {
        if (this.items === undefined) {
          logger.warning('[LDataTable]', '未定义items, total-items定义的值将不准确')
        }
        return this.totalItems
      }
      else {
        if (this.items === undefined) {
          return this.totalItems_
        }
        else {
          return this.items.length
        }
      }
    },
    isLoading () {
      return this.loading || this.loading_
    },
    hideActions_ () {
      // logger.debug(this.computeTotal, this.pagination.rowsPerPage)
      return this.autoActions && this.pagination.rowsPerPage >= (this.computeTotal)
    },
    hideHeaders_ () {
      let maxNum = typeof this.autoHeaders === 'number' ? this.autoHeaders : 10
      return this.autoHeaders && this.computeTotal < maxNum
    },
    hideTitle_ () {
      let maxNum = typeof this.autoTitle === 'number' ? this.autoTitle : 10
      return this.autoTitle && this.computeTotal < maxNum
    },
    smallScreen () {
      return this.$vuetify.breakpoint.smAndDown
    },
    data_ () {
      return this.items || this.items_
    },
    switchLabel () {
      if (this.titleSwitch instanceof Object && this.titleSwitch.label) {
        return this.titleSwitch.label || ''
      }
      else {
        return this.titleSwitchLabel || ''
      }
    },
    innerSort () {
      return this.getDataFunc === undefined && this.totalItems === undefined
    }
  },
  watch: {
    switchValue () {
      this.getData_(this.initPage)
    },
    search: debounce(function (val) {
      if (typeof val === 'string' && val.trim()) {
        if (this.pagination.page !== 1) {
          this.pagination.page = 1
        }
        else {
          this.getData_()
        }
      }
    }, 600),
    selected_: {
      handler (val) {
        // if (this.selected_ && this.selected && this.selected.length !== this.selected_.length) {
        this.$emit('select', val)
        // }
      },
      deep: true
    },
    selected: {
      handler (val) {
        this.selected_ = this.selected
      },
      deep: true,
    },
    pagination: {
      handler (pagination) {
        // console.log('pagination change', this.util.deepClone(pagination))
        if (pagination.sortBy) {
          let stack = this.sortStack
          let t = stack.find(s => s.by === pagination.sortBy)
          if (t) {
            let i = stack.indexOf(t)
            stack.splice(i, 1)
          }
          stack.push({by: pagination.sortBy, descending: pagination.descending || false})
        }
        this.getData_()
        this.tablePage = pagination.page
      },
      deep: true
    },
    getDataFunc () {
      this.getData_(this.initPage)
    },
    filterItems () {
      this.getData_()
    },

  },
  methods: {
    jumpPage: debounce(function (page) {
      let total = this.totalItems || this.totalItems_
      if (page > 0 && page <= Math.ceil(total / this.pagination.rowsPerPage)) {
        this.pagination.page = page
        this.tablePage = page
      }
      else {
        this.tablePage = this.pagination.page
      }
    }, 300),
    clickRow (item, index, selected) {
      if (this.clickable) {
        this.$emit('click-row', {item: item, index: index, selected: selected})
      }
    },
    resetFilter () {
      this.$refs.filterForm.reset()
      this.getData_(this.initPage)
    },
    async refreshData_ () {
      this.refreshLoading = true
      await this.getData_()
      this.refreshLoading = false
    },
    async getData_ (pagination = null, payload) {
      if (typeof this.getDataFunc !== 'function') {
        return
      }
      if (pagination) {
        this.pagination = this.util.deepClone(pagination)
        return
      }
      let F = this.getDataFunc
      this.errorData = {
        error: false,
        code: 1,
        message: ''
      }
      this.loading_ = true
      try {
        let params = {
          pagination: this.pagination,
          sortStack: this.sortStack,
          filterItems: this.filterItems,
          search: this.search,
          titleSwitch: this.switchValue
        }
        let res = await F(params, payload)
        logger.debug('[LDataTable]', 'get Data', this.util.deepClone(params), res.items, res.amount)
        this.items_ = res.items || []
        this.totalItems_ = res.amount || 0
        this.$emit('update:data', this.items_)
        this.$emit('update:total-items', this.totalItems_)
      }
      catch (e) {
        logger.error('[LDataTable]', 'get Data error', e)
        this.errorData = {
          error: true,
          code: e.code,
          message: e.message
        }
        this.items_ = []
        this.totalItems_ = 0
      }
      this.loading_ = false
    },

    async refreshData (init = false, payload) {
      let pagination = init ? this.initPage : null
      await this.getData_(pagination, payload)
      return {items: this.data_, amount: this.totalItems_ || this.totalItems}
    }
  },
  created () {
    if (this.titleSwitch instanceof Object) {
      if (this.titleSwitch.hasOwnProperty('value')) {
        this.switchValue = this.titleSwitch.value
      }
    }
    if (this.getDataFunc !== undefined && (this.items !== undefined || this.totalItems !== undefined)) {
      logger.warning('[LDataTable]', '若同时指定items/total-items和get-data-func，可能会造成数据显示错误, 优先显示items和total-items')
    }
    if (this.persistentFilter && !this.filterItems) {
      logger.error('[LDataTable]', '若指定persistent-filter，必须指定filterItems属性(不能为空数组)')
    }

    if (this.persistentFilter && this.filterItems && this.filterItems.length > 0) {
      this.filter = true
    }

    if (this.mustSort && (!this.initPagination && !this.initSortBy)) {
      logger.error('[LDataTable]', '若指定must-sort，必须指定init-sort-by属性或init-pagination')
    }
    let h = this.headers.find(h => h.sortable !== false)
    if (!h && this.mustSort) {
      logger.error('[LDataTable]', '若指定must-sort，必须至少有一列数据可排序 (sortable !== false)')
    }

    let pagination = this.pagination
    let initPage = this.initPage
    if (this.initPagination instanceof Object) {
      initPage.sortBy = pagination.sortBy = this.initPagination.sortBy
      initPage.descending = pagination.descending = this.initPagination.descending || false
      initPage.page = pagination.page = this.initPagination.page || 1
      initPage.rowsPerPage = pagination.rowsPerPage = this.initPagination.rowsPerPage || 10
    }
    if (this.initSortBy) {
      initPage.sortBy = pagination.sortBy = this.initSortBy
    }

    // logger.debug('row action', this.$scopedSlots)
  }
}
</script>

<style scoped>
  .hide-more-content {
    display: inline-block;
    overflow: hidden;
    vertical-align: middle;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .monospaced {
    text-align-last: justify !important;
  }
</style>
