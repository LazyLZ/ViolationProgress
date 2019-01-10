<template>
  <!--<div>-->
    <!--//{{value}}//-->
    <v-autocomplete
      :hide-no-data="loading || !search"
      :hide-selected="multiple"
      :item-text="itemText"
      :items="searchSelects"
      :label="label"
      :loading="loading"
      :no-data-text="typeof search === 'string' && search.trim()?noDataText:needInputText"
      :placeholder="placeholder || needInputText"
      :prepend-icon="prependIcon"
      :rules="rules"
      :search-input.sync="search"
      chips
      deletable-chips
      :multiple="multiple"
      return-object
      v-model="value_"
    >
      <template slot="item" slot-scope="props">
        <v-list-tile-content>
          <v-list-tile-title>
            <v-flex align-center justify-between layout row>
              <span>{{props.item[itemText]}}</span>
            </v-flex>
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <span class="grey--text caption text-xs-right">{{props.item[itemSubText]|| ''}}</span>
        </v-list-tile-action>
      </template>
      <template slot="append-item">
        <v-list-tile v-if="searchItems.length >= max && !loading">
          <v-list-tile-title>
            <span class="grey--text">仅显示前{{max}}个结果</span>
          </v-list-tile-title>
        </v-list-tile>
      </template>
    </v-autocomplete>
  <!--</div>-->
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'LAutocomplete',
  props: {
    label: {type: String, default: ''},
    noDataText: {type: String, default: '没有匹配选项'},
    needInputText: {type: String, default: '输入以搜索'},
    placeholder: {type: String, default: ''},
    rules: {},
    prependIcon: {type: String, default: ''},
    itemText: {type: String, default: 'text'},
    itemId: {type: String, default: 'id'},
    itemSubText: {type: String, default: 'subText'},
    dense: {type: Boolean, default: false},
    value: {},
    multiple: {type: Boolean, default: false},
    max: {type: Number, default: 10},
    getData: {type: Function},
    initData: {type: Boolean, default: false}
  },
  data: () => ({
    data: null,
    search: '',
    loading: false,
    searchItems: [],
  }),
  computed: {
    searchSelects () {
      let selected = this.value_ instanceof Array ? this.value_ : []
      return [...this.searchItems, ...selected]
    },
    value_: {
      get () {
        return typeof this.value === 'undefined' ? this.data : this.value
      },
      set (val) {
        typeof this.value === 'undefined' ? this.data = val : this.$emit('input', val)
      }
    }
  },
  watch: {
    search: function (val) {
      this.getSelection_()
    },
  },
  methods: {
    getSelection_: debounce(async function () {
      if ((typeof this.search === 'string' && this.search.trim()) || this.initData) {
        this.loading = true
        let items = await this.getData(this.search)
        console.log('get selection', items)
        this.searchItems = items
        this.loading = false
      }
    }, 500),
  },
  created () {
    if (this.initData) {
      this.getSelection_(this.search)
    }
    if (this.value_ instanceof Array) {
      this.searchItems.push(...this.value_)
    }
    else if (this.value_ instanceof Object) {
      this.searchItems.push(this.value_)
    }
  }
}
</script>

<style scoped>

</style>
