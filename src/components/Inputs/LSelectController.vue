<template>
  <v-layout row wrap>
    <v-flex xs12>
      <!--<h3>{{gateways}}</h3>-->
      <!--<h3>{{selectP.map(p => p.name)}}</h3>-->
      <!--<h3>{{selectC.map(c => c.name)}}</h3>-->
    </v-flex>
    <v-flex :class="twoLine?'xs12':'xs6'">
      <v-select
        :multiple="multiple"
        :readonly="readonly"
        :disabled="disabled"
        :rules="[...rules, ...rulesP, required? v => selectP instanceof Array && selectP.length > 0 || '请选择停车场区': true]"
        chips
        small-chips
        :placeholder="placeholderP || placeholder"
        deletable-chips
        :error="error || errorP"
        :error-messages="errorMessage || errorPMessage"
        :label="labelP"
        :items="parkingLotSelects"
        item-text="name"
        prepend-icon="$vuetify.icons.parkingLot"
        v-model="selectP"
        return-object
        clearable
      ></v-select>
    </v-flex>
    <v-flex :class="twoLine?'xs12':'xs6'">
      <v-tooltip bottom max-width="42em" :disabled="!selectC || (selectC instanceof Array && selectC.length === 0)">
        <span v-if="selectC instanceof Array">{{selectC.map(c => c.name).join('、')}}</span>
        <span v-else-if="selectC instanceof Object">{{selectC.name}}</span>
        <v-select
          slot="activator"
          chips
          deletable-chips
          :placeholder="placeholderC || placeholder"
          :multiple="multiple"
          small-chips
          :readonly="readonly"
          :disabled="disabled"
          :rules="[...rules, ...rulesC, required? v => selectC instanceof Array && selectC.length > 0 || '请选择通行关口': true]"
          :error="error || errorC"
          :error-messages="errorMessage || errorCMessage"
          :label="labelC"
          :items="controllerSelectable"
          item-text="name"
          prepend-icon="$vuetify.icons.controller"
          v-model="selectC"
          return-object
          clearable
        >
          <template v-if="multiple && !noControllerSelects" slot="prepend-item">
            <v-list-tile
              ripple
              class="mb-2"
            >
              <v-list-tile-action>
                <v-checkbox v-model="selectAllController" :indeterminate="someSelect"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-title>全选</v-list-tile-title>
            </v-list-tile>
          </template>
          <template
            slot="selection"
            slot-scope="{ item, index }"
          >
            <v-chip small v-if="index === 0">
              <span>{{ item.name }}</span>
            </v-chip>
            <span
              v-if="index === 1"
              class="grey--text caption"
            >(等{{ selectC.length}}个关口{{ selectAllController ? ', 已全选':''}})</span>
          </template>
        </v-select>
      </v-tooltip>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'LSelectController',
  props: {
    labelP: {type: String, default: '停车场区'},
    labelC: {type: String, default: '通行关口'},
    placeholderC: {type: String},
    placeholderP: {type: String},
    placeholder: {type: String},
    value: {},
    readonly: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    rules: {type: Array, default: () => []},
    rulesP: {type: Array, default: () => []},
    rulesC: {type: Array, default: () => []},
    error: {type: Boolean, default: false},
    errorMessage: {type: String, default: ''},
    errorP: {type: Boolean, default: false},
    errorPMessage: {type: String, default: ''},
    errorC: {type: Boolean, default: false},
    errorCMessage: {type: String, default: ''},
    multiple: {type: Boolean, default: true},
    itemsP: {type: Array},
    itemsC: {type: Array},
    items: {type: Array},
    twoLine: {type: Boolean, default: false},
    returnControllers: {type: Boolean, default: false},
    required: {type: Boolean, default: false}
  },
  data: () => ({
    selectP: [],
    selectC: [],
  }),
  computed: {
    gateways () {
      if (!(this.selectP instanceof Array)) {
        return this.selectC
      }
      let gateways = [...this.selectP]
      gateways.forEach(p => {
        p.controllers = [
          ...this.selectC.filter(c => c.parkingLotId === p.id)
        ]
      })
      return gateways
    },
    selectAllController: {
      get () {
        if (this.selectC instanceof Array) {
          let t = this.controllerRealSelects
          return this.selectC.length === t.length
        }
        return false
      },
      set (val) {
        if (val) {
          this.selectC = [...this.controllerRealSelects]
        }
        else {
          this.selectC = []
        }
      }
    },
    someSelect () {
      if (this.selectC instanceof Array) {
        let t = this.controllerRealSelects
        return this.selectC.length > 0 && this.selectC.length < t.length
      }
      return false
    },
    noControllerSelects () {
      let t = this.controllerRealSelects
      // console.log(t)
      return !t.length
    },
    parkingLotSelects () {
      let selects = []
      if (this.items instanceof Array) {
        selects = this.items
      }
      else if (this.itemsP instanceof Array) {
        selects = this.itemsP
      }
      else if (this.$store.state.parkingLot.parkingLotList instanceof Array) {
        selects = this.$store.state.parkingLot.parkingLotList.slice()
      }
      if (selects.length === 0) {
        selects.push({header: '没有可选停车场区'})
      }
      return selects
    },
    controllers () {
      let cs = []
      if (this.items instanceof Array) {
        cs = Array.prototype.concat.apply([], this.items.map(t => t.controllers))
      }
      else if (this.itemsC instanceof Array) {
        cs = this.itemsC
      }
      else if (this.$store.state.parkingLot.controllerList instanceof Array) {
        cs = this.$store.state.parkingLot.controllerList.slice()
      }
      return cs
    },
    controllerRealSelects () {
      return this.controllerSelectable.filter(c => !!c.name)
    },
    controllerSelectable () {
      let selects = []
      if (this.selectP instanceof Array) {
        this.selectP.forEach(p => {
          selects.push({divider: true})
          selects.push({header: p.name})
          this.controllers.forEach(c => {
            if (c.parkingLotId === p.id) {
              selects.push(c)
            }
          })
        })
      }
      else if (this.selectP instanceof Object) {
        this.controllers.forEach(c => {
          if (c.parkingLotId === this.selectP.id) {
            selects.push(c)
          }
        })
      }
      if (selects.length === 0) {
        if ((this.selectP instanceof Object && this.selectP.name) || (this.selectP instanceof Array && this.selectP.length > 0)) {
          selects.push({header: '没有可选通行关口'})
        }
        else {
          selects.push({header: '请先选择停车场区'})
        }
      }
      return selects
    },
  },
  watch: {
    value () {
      // console.log('value change')
      if (this.value instanceof Array) {
        if (this.returnControllers) {
          if (this.value === this.selectC) return
          this.selectC = this.value
          let ps = []
          this.selectC.forEach(c => {
            if (!ps.find(p => p.id === c.parkingLotId)) {
              let t = this.parkingLotSelects.find(p => p.id === c.parkingLotId)
              if (t) {
                ps.push(t)
              }
            }
          })
          this.selectP = ps
        }
        else {
          if (this.gateways === this.value) return
          this.selectP = [...this.value]
          let cs = []
          this.value.forEach(v => {
            if (v instanceof Object && v.controllers instanceof Array) {
              cs.push(...v.controllers)
            }
          })
          this.selectC = cs
        }
      }
      else if (this.value instanceof Object && this.value.name) {
        let t = this.parkingLotSelects.find(p => p.id === this.value.parkingLotId) || null
        this.selectP = t
        if (t) {
          this.selectC = this.value
        }
      }
      else {
        if (this.multiple) {
          if (!(this.selectC instanceof Array && this.selectC.length === 0)) this.selectC = []
          if (!(this.selectP instanceof Array && this.selectP.length === 0)) this.selectP = []
        }
        else {
          this.selectC = null
          this.selectP = null
        }
      }
    },
    gateways () {
      // logger.debug('gateways change', this.gateways, this.value)
      if (this.returnControllers) {
        this.$emit('input', this.selectC)
      }
      else {
        this.$emit('input', this.gateways)
      }
    },
    selectP: {
      handler () {
        if (this.selectP instanceof Array) {
          if (this.selectC instanceof Array && this.selectC.length > 0) {
            this.selectC = this.selectC.filter(c => !!this.selectP.find(p => p.id === c.parkingLotId))
          }
        }
        else if (this.selectP instanceof Object && this.selectC instanceof Object) {
          this.selectC = this.selectP.name === this.selectC.parkingLotId ? this.selectC : null
        }
        else {
          this.selectC = null
        }
      },
    }
  },
  created () {
    // console.log('controller created', this.value, this.selectC, this.selectP)
    if (!this.multiple) {
      this.selectP = this.selectC = null
    }
  },
  async mounted () {
    if (this.value instanceof Array) {
      if (this.returnControllers) {
        if (this.value === this.selectC) return
        this.selectC = this.value
        let ps = []
        this.selectC.forEach(c => {
          if (!ps.find(p => p.id === c.parkingLotId)) {
            let t = this.parkingLotSelects.find(p => p.id === c.parkingLotId)
            if (t) {
              ps.push(t)
            }
          }
        })
        this.selectP = ps
      }
      else {
        if (this.gateways === this.value) return
        this.selectP = [...this.value]
        let cs = []
        this.value.forEach(v => {
          if (v instanceof Object && v.controllers instanceof Array) {
            cs.push(...v.controllers)
          }
        })
        this.selectC = cs
      }
    }
    else if (this.value instanceof Object && this.value.name) {
      let t = this.parkingLotSelects.find(p => p.id === this.value.parkingLotId) || null
      this.selectP = t
      if (t) {
        this.selectC = this.value
      }
    }
    else {
      if (this.multiple) {
        if (!(this.selectC instanceof Array && this.selectC.length === 0)) this.selectC = []
        if (!(this.selectP instanceof Array && this.selectP.length === 0)) this.selectP = []
      }
      else {
        this.selectC = null
        this.selectP = null
      }
    }
  }
}
</script>

<style scoped>

</style>
