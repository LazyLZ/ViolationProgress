<template>
  <v-menu
    :close-on-content-click="false"
    bottom
    open-delay="200"
    open-on-hover
    min-width="256px"
    nudge-bottom=""
    nudge-left="64px"
    offset-y
    close-delay="100"
    v-model="value_"
  >
    <slot name="activator" slot="activator"></slot>
    <v-card flat>
      <v-container class="py-0">
        <v-layout row wrap>
          <v-flex xs12>
            <v-switch
              label="夜间模式"
              v-model="dark"
            ></v-switch>
          </v-flex>
          <!--<v-flex layout justify-end align-center>-->
          <!--<v-icon large :color="systemColor">lens</v-icon>-->
          <!--</v-flex>-->
        </v-layout>
      </v-container>
      <!--<v-divider></v-divider>-->
      <v-progress-linear :indeterminate="changing" :value="100" class="py-0 my-0" height="2"></v-progress-linear>
      <v-container class="pt-0">
        <v-subheader class="px-0">主题颜色</v-subheader>
        <v-layout justify-center>
          <v-flex class="text-xs-center">
            <template
              v-for="color in themeColors"
            >
              <v-tooltip :key="color.key" bottom>
                <v-btn
                  icon
                  slot="activator"
                >
                  <v-icon :color="color.alias">mdi-invert-colors</v-icon>
                </v-btn>
                <span>{{color.name}}</span>
              </v-tooltip>
            </template>
          </v-flex>
        </v-layout>
      </v-container>

    </v-card>
  </v-menu>
</template>

<script>
import colors from 'vuetify/es5/util/colors'
import {createHelpers} from 'vuex-map-fields'

const {mapFields} = createHelpers({
  getterType: '$L/getField',
  mutationType: '$L/updateField',
})
export default {
  name: 'colorMenu',
  props: ['value'],
  data: () => ({
    leaveMenu: true,
    changing: false,
    mouseleave: false,
    fav: true,
    message: false,
    activator: false,
    hints: true,
    themeColors: [
      {name: '薄荷蓝', key: 'cyan', alias: 'cyan'},
      {name: '绿色', key: 'green', alias: 'green'},
      {name: '靛蓝', key: 'indigo', alias: 'indigo'},
      {name: '蓝色', key: 'blue', alias: 'blue'},
      {name: '橄榄绿', key: 'teal', alias: 'teal'},
      {name: '紫色', key: 'deepPurple', alias: 'deep-purple'},
      {name: '橙色', key: 'orange', alias: 'orange'},
    ]
  }),
  computed: {
    ...mapFields([
      'dark'
    ]),
    value_: {
      get () {
        if (this.value === undefined) {
          return this.activate
        }
        else {
          return this.value
        }
      },
      set (val) {
        if (this.value === undefined) {
          this.activate = val
        }
        else {
          this.$emit('input', val)
        }
      }
    },
  },
  methods: {
    changeColor (c) {
      if (colors[c.key]) {
        this.changing = true
        this.$store.commit('setSystemColor', c.alias)
        this.$vuetify.theme.primary = colors[c.key]
        this.$vuetify.theme.accent = colors[c.key].lighten1
        setTimeout(() => {
          this.changing = false
        }, 1000)
      }
    },
  }
}
</script>

<style scoped>

</style>
