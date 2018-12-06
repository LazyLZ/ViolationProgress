<template>
  <div class="d-inline-block">
    <div v-if="haveActivator" class="d-inline-block" @click.stop="open()">
      <slot name="activator"></slot>
    </div>
    <v-dialog scrollable v-model="activate" :max-width="maxWidth">
      <v-card flat>
        <slot name="title">
          <v-card-title style="height: 64px">
            <span class="title py-1">{{titleText}}</span>
          </v-card-title>
        </slot>
        <v-divider></v-divider>
        <v-card-text :style="{maxHeight: maxHeight, height: height}">
          <slot name="prepend"></slot>
          <v-layout
            v-if="imgs.length === 0"
            align-center
            justify-center
            fill-height
            column
            style="height: 300px"
            :class="imgPlaceholder"
          >
            <span class="grey--text subheading">{{noImageText}}</span>
          </v-layout>
          <div v-else>
            <template v-for="(src,i) in imgs">
              <v-img
                width="100%"
                :key="i"
                :src="src"
              >
                <v-layout
                  fill-height
                  class="ma-0"
                  slot="placeholder"
                  justify-center
                  align-center
                  column
                >
                  <v-progress-circular
                    class="mb-4"
                    indeterminate
                    size="30"
                    :width="2"
                    color="primary"
                  ></v-progress-circular>

                  <div class="text-xs-center grey--text body-2">
                    {{loadingTitle}}
                  </div>
                </v-layout>
              </v-img>
              <div :key="i + 'divider'" class="my-2" v-if="i < imgs.length - 1">
                <v-divider></v-divider>
              </div>
            </template>
          </div>
          <slot name="append"></slot>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large flat color="primary" @click="close()">{{closeText}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'LImageViewDialog',
  props: {
    src: {type: [String, Array], default: ''},
    value: {},
    maxHeight: {type: String, default: '600px'},
    maxWidth: {type: String, default: '700px'},
    // minHeight: {type: String, default: '400px'},
    height: {type: String, default: '100%'},
    dark: {type: Boolean, default: false},
    titleText: {type: String, default: '查看图片'},
    noImageText: {type: String, default: '没有图像'},
    loadingTitle: {type: String, default: '加载中'},
    closeText: {type: String, default: '关闭'},
  },
  data: () => ({
    active: false
  }),
  computed: {
    activate: {
      get () {
        return typeof this.value === 'undefined' ? this.active : this.value
      },
      set (val) {
        // console.log('set activate to', val)
        if (typeof this.value === 'undefined') {
          this.active = val
        }
        else {
          this.$emit('input', val)
        }
      }
    },
    dark_ () {
      if (this.$store && this.$store.state.hasOwnProperty('dark')) {
        return this.$store.state.dark
      }
      else {
        return false
      }
    },
    imgPlaceholder () {
      let cls = ['grey']
      let p = (this.dark || this.dark_) ? 'darken-2' : 'lighten-4'
      cls.push(p)
      return cls
    },
    imgs () {
      let select = []
      if (this.src instanceof Array) {
        for (let item of this.src) {
          select.push(item)
        }
      }
      else {
        if (this.src) {
          select = [this.src]
        }
      }
      return select
    },
    haveActivator () {
      return this.$slots.hasOwnProperty('activator')
    }
  },
  // watch: {
  //   value (val) {
  //     this.active = val
  //   },
  //   active (val) {
  //     this.$emit('input', val)
  //   }
  // },
  methods: {
    close () {
      this.activate = false
      // this.$emit('input', false)
    },
    open () {
      this.activate = true
      // this.$nextTick(() => {
      //   console.log('open Dialog', this.value, this.activate, this.active)
      // })

      // this.$emit('input', true)
    }
  },
}
</script>

<style scoped>

</style>
