<template>
  <v-card flat>
    <v-card-title style="height: 64px;">
      <span class="title">{{title}}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text style="min-height: 300px; max-height: 600px">
      <v-container class="pt-0" fluid>
        <v-layout>
          <v-flex justify-center layout v-if="loading">
            <v-progress-circular
              :size="50"
              :width="3"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-flex>
          <v-flex v-else>
            <v-subheader class="px-0 pt-0">以下为真实发送消息</v-subheader>
            <v-layout class="" row v-if="!error" wrap>
              <v-flex :key="i" class="pb-4" v-for="(m, i) in messages" xs12>
                <v-subheader>{{m.label}}</v-subheader>
                <div class="px-5 subheading">
                  {{m.text}}
                </div>
              </v-flex>
              <v-flex class="pb-4" v-if="messages.length === 0" xs12>
                <div class="px-4 grey--text subheading">
                  {{'未发送消息'}}
                </div>
              </v-flex>
            </v-layout>
            <v-layout v-else>
              <v-flex class="pb-4" xs12>
                <div class="px-4 error--text">
                  {{errorMessage ? '未获取到消息模板: ' + errorMessage : '未获取到消息模板'}}
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="cancel" color="grey" flat large>留在此页</v-btn>
      <v-btn
        @click="confirm"
        color="primary"
        flat
        large
      >
        返回到列表
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'viewMessageDialog',
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    loading: {type: Boolean, default: false},
    error: {type: Boolean, default: false},
    errorMessage: {type: String, default: ''},
    title: {type: String, default: ''},
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
