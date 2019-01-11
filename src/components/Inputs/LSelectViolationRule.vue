<template>
  <v-layout wrap>
    <v-flex md6 xs12>
      <v-select
        :disabled="disabled"
        :readonly="readonly"
        :items="rootRules"
        :loading="loading"
        :placeholder="rootPlaceholder"
        :rules="rules"
        item-text="name"
        label="违章大类"
        no-data-text="没有可选规则"
        prepend-icon="$vuetify.icons.folder"
        return-object
        v-model="root"
      ></v-select>
    </v-flex>
    <v-flex md6 xs12>
      <v-select
        :readonly="readonly"
        :disabled="noChildrenRoot || disabled"
        :items="noChildrenRoot ? rootRules : leaves"
        :loading="loading"
        :no-data-text="root?'没有可选规则':'请选择违章大类'"
        :placeholder="leafPlaceholder"
        :rules="rules"
        item-text="name"
        label="细分类型"
        prepend-icon="$vuetify.icons.description"
        return-object
        v-model="select"
      ></v-select>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'LSelectViolationRule',
  props: {
    value: {},
    rules: {},
    readonly: {},
    disabled: {},
    rootPlaceholder: {},
    leafPlaceholder: {}
  },
  data: () => ({
    root: null,
    select: null,
    loading: false,
  }),
  computed: {
    noChildrenRoot () {
      return this.root && (!this.root.children || (this.root.children && this.root.children.length === 0))
    },
    leaves () {
      let selects = []
      let queue = this.root && this.root.children ? [...this.root.children] : []
      while (queue.length) {
        let q = []
        queue.forEach(node => {
          if (node.children && node.children.length > 0) {
            q.push(...node.children)
          }
          else {
            selects.push(node)
          }
        })
        queue = q
      }
      return selects
    },
    rootRules () {
      return this.$store.state.violation.ruleList
    }
  },
  watch: {
    value () {
      this.select = this.value
    },
    root () {
      this.syncSelect()
    },
    select (val) {
      if (this.select !== this.value) {
        console.log('submit', this.select, this.value)
        this.$emit('input', val)
      }
    },
    rootRules (val) {
      this.$nextTick(() => {
        console.log('ruleList change', val, this.root)
        if (this.root) {
          if (this.rootRules.find(r => r.id === this.root.id)) {
            this.syncSelect()
          }
          else {
            this.root = null
          }
        }
      })
    }
  },
  methods: {
    syncSelect () {
      if (!this.root) {
        this.select = this.value ? this.value : null
        return
      }
      if (this.select && this.value && this.select.id !== this.value.id) {
        this.select = this.value
      }
      if (!this.select && this.value && this.value.id) {
        let root = this.findRoot(this.value)
        if (root && root.id === this.root.id) {
          this.select = this.value
        }
      }
      if (this.select && this.select.id && !this.value) {
        if (this.noChildrenRoot) {
          this.$emit('input', this.select)
        }
        else {
          this.select = this.value
        }
      }
      if (this.noChildrenRoot) {
        this.select = this.root
      }
      console.log('sync select', this.select, this.value)
    },
    findRoot (rule) {
      let code = rule.code || ''
      let route = code.split('-')
      console.log('findRoot', route)
      if (route.length === 1) {
        return route[0] ? rule: null
      }
      let first = route[0]
      return this.rootRules.find(r => r.code === first)
    },
    async getRules () {
      try {
        this.loading = true
        await this.$store.dispatch('violation/getRules')
      }
      catch (e) {
        this.$alert('error', {message: e.message})
      }
      finally {
        this.loading = false
      }
    }
  },
  created () {
    if (this.rootRules && this.rootRules.length === 0) {
      this.getRules()
    }
    if (this.value instanceof Object) {
      this.root = this.findRoot(this.value)
      console.log('root', this.root)
      if (this.root) {
        this.select = this.value
      }
    }
  }
}
</script>

<style scoped>

</style>
