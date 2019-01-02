<template>
  <l-main>
    <template slot="logo" slot-scope="{mini}">
      <v-layout align-center class="headline text-truncate" style="height: 96px">
        <v-flex align-center justify-center layout v-if="mini">
          <v-avatar>
            <img alt="logo" src="@/assets/BWC_logo_no_char.svg"/>
          </v-avatar>
        </v-flex>
        <v-flex class="pl-3 pt-4" v-else layout column>
          <span class="white--text title">{{$L.cfg.appName.full}}</span>
          <span class="font-weight-light primary--text subheading">{{$L.cfg.appName.subTitle}}</span>
        </v-flex>
      </v-layout>
    </template>
  </l-main>
</template>

<script>
import LMain from '../components/Main/LMain'

export default {
  name: 'Main',
  components: {LMain}
}
</script>

<style scoped>

</style>
