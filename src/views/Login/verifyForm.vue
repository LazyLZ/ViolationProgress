<template>
  <v-layout align-center justify="center" row>
    <v-flex xs6>
      <v-text-field
        :error="isError"
        :error-messages="computedErrorMessage"
        :suffix="expire+'s'"
        class="pb-1"
        label="验证码"
        placeholder="请输入验证码"
        prepend-icon="mdi-spellcheck"
        single-line
        @change="clearError"
        v-model="verifyCode"
      ></v-text-field>
    </v-flex>
    <v-flex v-if="loading" xs6>
      <v-layout justify-center layout>
        <v-progress-circular :width="2" color="primary" indeterminate></v-progress-circular>
      </v-layout>
    </v-flex>
    <v-flex v-else>
      <v-layout align-center justify-center>
        <v-tooltip bottom>
          <img
            :src="'data:image/jpg;base64,' + verifySrc"
            @click="refresh()"
            alt="verify image"
            slot="activator" style="cursor:pointer"
          />
          <span>点击刷新验证码</span>
        </v-tooltip>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
import {alert} from '../../store/handleError'

export default {
  name: 'verifyForm',
  props: {
    value: {},
    error: {type: Boolean, default: false},
    errorMessage: {type: String, default: ''},
  },
  data: () => ({
    error_: false,
    errorMessage_: '',
    loading: false,
    verifySrc: null,
    verifyKey: '',
    expire: 0,
    verifyCode: '',
    counter: null
  }),
  computed: {
    isError () {
      return this.error || this.error_
    },
    computedErrorMessage () {
      return this.errorMessage || this.errorMessage_
    }
  },
  watch: {
    expire (val, oldVal) {
      if (val > oldVal) {
        if (this.counter) {
          clearInterval(this.counter)
          this.counter = null
        }
        this.counter = setInterval(() => {
          if (this.expire > 0) {
            this.expire -= 1
          }
          else {
            this.error_ = true
            this.errorMessage_ = '验证码已过期，请重新获取'
            clearInterval(this.counter)
            this.counter = null
          }
        }, 1000)
      }
    }
  },
  methods: {
    clearError () {
      this.error_ = false
      this.errorMessage_ = ''
    },
    async refresh () {
      this.clearError()
      await this.getVerifyImg()
    },
    getVerifyImg: alert(async function () {
      this.loading = true
      let {key, img, msg} = await this.$store.dispatch('login/getVerifyImg')
      // console.log('get', key, img, msg)
      this.verifySrc = img
      this.verifyKey = key
      this.expire = 60
      this.$emit('input', key)
    }, null, function () {
      this.loading = false
    }),
    check: async function () {
      try {
        let res = await this.$store.dispatch('login/checkVerify', {key: this.verifyKey, code: this.verifyCode})
        console.log(res)
        return true
      }
      catch (e) {
        this.errorMessage_ = e.message
        this.error_ = true
        this.getVerifyImg()
        return false
      }
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style scoped>

</style>
