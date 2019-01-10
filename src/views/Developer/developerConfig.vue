<template>
  <v-container fluid>
    <v-layout justify-center row>
      <v-flex xs10>
        <v-container fluid grid-list-md>
          <v-subheader class="subheading px-0">日志级别</v-subheader>
          <v-layout class="pa-5" column>
            <v-slider
              :tick-labels="seasons"
              always-dirty
              max="5"
              min="0"
              thumb-label
              thumb-size="64"
              ticks="always"
              v-model="level"
            >
              <template
                slot="thumb-label"
                slot-scope="props"
              >
                <span>{{ season(props.value)}}</span>
              </template>
            </v-slider>
          </v-layout>
          <v-layout class="px-5 pb-5">
            <v-btn>test logger</v-btn>
          </v-layout>
          <v-subheader class="px-0 subheading">console设置</v-subheader>
          <v-layout class="px-5 pb-5">
            <v-switch
              hint="禁用log, warn, error函数"
              label="禁用console输出"
              persistent-hint
              v-model="disableConsole"
            ></v-switch>
          </v-layout>

        </v-container>
      </v-flex>
    </v-layout>
    <v-layout>
      <div style="height: 72px"></div>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'developerConfig',
  data: () => ({
    mounted: false,
    level: 3,
    disableConsole: false,
    seasons: [
      'Debug',
      'Info',
      'Warning',
      'Error',
      'Critical',
      'Disabled'
    ]
  }),
  methods: {
    season (val) {
      return this.seasons[val]
    },
  },
}
</script>

<style scoped>

</style>
