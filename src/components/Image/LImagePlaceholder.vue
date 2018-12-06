<template>
  <v-flex
    @click="$emit('click')"
    @mouseover="showAction = true"
    @mouseleave="showAction = false"
    class="ma-2 pa-0 l-image-placeholder"
    align-center
    justify-center
    layout
    column
    :style="shape"
    :class="imgPlaceholder"
  >
    <v-slide-y-reverse-transition>
      <div @click.stop v-if="!hideActions && hasAction && showAction" class="l-image-action text-xs-center"
           :style="actionColor">
        <slot name="action"></slot>
      </div>
    </v-slide-y-reverse-transition>
    <v-img
      class="ma-0 pa-0"
      v-if="!error && !loading && src"
      :src="src"
      width="100%"
      height="100%"
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
    <div class="text-xs-center" v-else-if="loading">
      <div>
        <v-progress-circular
          class="mb-4"
          :indeterminate="this.progress === undefined"
          size="30"
          :width="2"
          color="primary"
          :value="progress||0"
        ></v-progress-circular>
      </div>
      <div v-if="loading" class="text-xs-center grey--text body-2">
        {{loadingTitle}}{{progress ? progress + '%': ''}}
      </div>
    </div>
    <div class="text-xs-center" v-else-if="error">
      <div class="error--text py-2 body-2">{{errorTitle}}</div>
      <div class="grey--text caption">{{errorMessage}}</div>
    </div>
    <div class="text-xs-center" v-else>
      <span class="grey--text body-2">{{noImageText}}</span>
    </div>
  </v-flex>
</template>

<script>
export default {
  name: 'LImagePlaceholder',
  props: {
    dark: {type: Boolean, default: false},
    src: {type: String, default: ''},
    loading: {type: Boolean, default: false},
    // uploading: {type: Boolean, default: false},
    progress: {type: Number},
    error: {type: Boolean, default: false},
    errorMessage: {type: String, default: ''},
    width: {type: String, default: '200px'},
    height: {type: String, default: '200px'},
    hideActions: {type: Boolean, default: false},
    errorTitle: {type: String, default: '加载错误'},
    loadingTitle: {type: String, default: '加载中'},
    noImageText: {type: String, default: '没有图像'}
  },
  data: () => ({
    showAction: false,
  }),
  computed: {
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
    shape () {
      return {
        position: 'relative',
        height: this.height,
        width: this.width
      }
    },
    actionColor () {
      return {
        background: (this.dark || this.dark_) ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'
      }
    },
    hasAction () {
      return this.$slots.hasOwnProperty('action')
    }
  },
  mounted () {
    // console.log('slot', this.$slots)
  }
}
</script>

<style scoped>
  .l-image-placeholder {
    overflow: hidden;
  }

  .l-image-action {
    /*opacity: 50% !important;*/
    width: 200px;
    height: 48px;
    position: absolute;
    top: 100%;
    z-index: 1;
    transform: translateY(-100%)
  }
</style>
