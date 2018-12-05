<template>
  <v-menu
    close-delay="200"
    nudge-right="16px"
    nudge-top="8px"
    offset-x
    open-on-hover
    right
    transition="slide-x-transition"
    v-model="value_"
  >
    <slot name="activator" slot="activator"></slot>
    <v-card class="d-inline-block elevation-1" :width="$L.cfg.navDrawerWidth - 48">
      <v-list dense>
        <template v-for="(t, i) in item.children">
          <!--二级标题 无子标题-->
          <v-list-tile
            :key="i"
            @click="go(t.to)"
            v-if="noChildren(t)"
          >
            <v-list-tile-action>
              <v-icon>{{t.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-medium">
                <!--<v-icon class="pr-3">{{ t.icon }}</v-icon>-->
                {{ t.label }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <!--二级标题 有子标题-->
          <v-list-group
            :key="i"
            :value="true"
            @click.stop
            no-action
            v-else
          >
            <!--二级标题 不跳转-->
            <v-list-tile slot="activator">
              <v-list-tile-action>
                <v-icon>{{t.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content class="pr-3">
                <v-list-tile-title class="font-weight-medium">
                  <!--<v-icon class="pr-3">{{ t.icon }}</v-icon>-->
                  {{ t.label }}
                </v-list-tile-title>
              </v-list-tile-content>
              <!--<v-list-tile-action v-if="!noChildren(t)">-->
              <!--<v-icon>mdi-chevron-right</v-icon>-->
              <!--</v-list-tile-action>-->
            </v-list-tile>

            <!--三级标题 跳转-->
            <v-list-tile
              :key="j"
              @click="go(subT.to)"
              v-for="(subT, j) in t.children"
            >
              <v-list-tile-content>
                <v-list-tile-title class="">
                  {{ subT.label }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <!--<v-menu transition="slide-x-transition" :key="i" v-else close-delay="100" offset-x open-on-hover right>-->
          <!--<v-list-tile slot="activator">-->
          <!--<v-list-tile-content class="pr-3">-->
          <!--<v-list-tile-title class="font-weight-medium">-->
          <!--<v-icon class="pr-3">{{ t.icon }}</v-icon>-->
          <!--{{ t.label }}-->
          <!--</v-list-tile-title>-->
          <!--</v-list-tile-content>-->
          <!--<v-list-tile-action v-if="!noChildren(t)">-->
          <!--<v-icon>mdi-chevron-right</v-icon>-->
          <!--</v-list-tile-action>-->
          <!--</v-list-tile>-->
          <!--<v-card>-->
          <!--<v-list dense>-->
          <!--<v-list-tile-->
          <!--:key="i"-->
          <!--@click=""-->
          <!--v-for="(subT, i) in t.children"-->
          <!--&gt;-->
          <!--<v-list-tile-content>-->
          <!--<v-list-tile-title class="font-weight-medium">-->
          <!--<v-icon class="pr-3">{{ subT.icon }}</v-icon>-->
          <!--{{ subT.label }}-->
          <!--</v-list-tile-title>-->
          <!--</v-list-tile-content>-->
          <!--</v-list-tile>-->
          <!--</v-list>-->
          <!--</v-card>-->
          <!--</v-menu>-->
        </template>

      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'DrawerMenu',
  props: {
    value: {},
    item: {type: Object, default: () => ({})}
  },
  computed: {
    noChildren () {
      return (item) => {
        return !item.children || item.children.length === 0
      }
    },
    value_: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    test (e) {
      console.log('mouseleave', e)
    },
    go (p) {
      if (p) {
        this.$router.push(p)
      }
    }
  },
  watch: {
    // value_ (val) {
    //   console.log('status change')
    //   if (this.val) {
    //     this.item.children.forEach(s => {
    //       if (s.children && s.children.length > 0) {
    //         s.active = true
    //       }
    //     })
    //   }
    // }
  }
}
</script>

<style scoped>

</style>
