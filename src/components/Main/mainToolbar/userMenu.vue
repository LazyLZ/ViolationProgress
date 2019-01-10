<template>
  <v-menu
    :close-on-content-click="false"
    bottom
    close-delay="100"
    max-width="300px"
    min-width="300px"
    nudge-bottom="8px"
    offset-y
    open-delay="200"
    open-on-hover
    right
    v-model="value_"
  >
    <slot name="activator" slot="activator"></slot>
    <v-card flat>
      <v-list>
        <v-list-tile avatar>
          <!--<v-list-tile-avatar>-->
          <!--<img alt="LazyLZ" src="@/assets/lazylz_avatar.jpg">-->
          <!--</v-list-tile-avatar>-->
          <v-list-tile-avatar>
            <v-icon size="36">mdi-account-circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title :class="loginName || 'grey--text'">{{loginName || '未命名'}}</v-list-tile-title>
            <v-list-tile-sub-title class="caption">{{loginId}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip bottom disabled>
              <v-btn @click="goCenter" color="primary" flat slot="activator" small>个人中心</v-btn>
              <!--<span>即将开放</span>-->
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-layout></v-layout>
      <v-container class="px-2 pt-0 pb-3">
        <!--<v-subheader>角色</v-subheader>-->
        <v-layout class="pl-2">
          <v-flex>
            <v-chip
              :key="i"
              small
              v-for="(role, i) in roleList"
            >
              {{role.name}}
            </v-chip>
            <span class="caption grey--text px-2" v-if="roleList.length > 1">共 {{roleList.length}} 个角色</span>
            <v-btn color="primary" flat small v-if="roleList.length > 1">展开</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      <!--<v-divider></v-divider>-->
      <!--<v-container>-->
      <!--<v-layout>-->
      <!--<v-flex xs12>-->
      <!--<v-select-->
      <!--:disabled="roleSelects.length <= 1"-->
      <!--:items="roleSelects"-->
      <!--hide-details-->
      <!--item-text="name"-->
      <!--item-value="id"-->
      <!--label="角色"-->
      <!--prepend-icon="person_pin"-->
      <!--v-model="role"-->
      <!--&gt;</v-select>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <!--</v-container>-->
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="logoutLoading" @click="logout" color="grey" flat small>退出系统</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import {createNamespacedHelpers} from 'vuex'

let LOGIN_PAGE_NAME = 'Login'
const {mapState} = createNamespacedHelpers('login')
export default {
  name: 'userMenu',
  components: {},
  props: ['value'],
  data: () => ({
    activate: false,
    logoutLoading: false,
    mouseleave: false,
    fav: true,
    message: false,
    // menu: false,
    hints: true
  }),
  computed: {
    ...mapState({
      loginName: state => state.name,
      loginId: state => state.id,
      self: state => state.self
    }),
    roleList () {
      return (this.self && this.self.roleList) || []
    },
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
    goCenter () {
      this.$router.push({
        name: 'PersonalCenter'
      })
    },
    async logout () {
      this.logoutLoading = true
      try {
        await this.$store.dispatch('login/logout')
        this.value_ = false
        this.$router.push({name: LOGIN_PAGE_NAME})
      }
      catch (e) {
        this.$store.dispatch('alert', {type: 'error', title: '登出时发生错误', message: e.message})
      }
      finally {
        this.logoutLoading = false
      }
    }
  }
}
</script>
