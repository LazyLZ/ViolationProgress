<template>
  <l-layout :layout="'xs10'">
    <v-card>
      <v-card-title>日志详情</v-card-title>
      <v-card-text>
        <v-container>
          <v-layout>
            <v-flex xs10 offset-xs1>
              <v-text-field
              disabled
              label="姓名"
              readonly
              v-model="name">
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-text>
        <v-container>
          <v-layout>
            <v-flex xs10 offset-xs1>
              <v-text-field
                disabled
                label="违章区域"
                readonly
                v-model="location">
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </l-layout>
  <!--<v-container>-->
    <!--<v-layout justify-center>-->
      <!--<v-flex xs12>-->
        <!--<v-card>-->
          <!--<v-card-title>Text Title</v-card-title>-->
          <!--<v-card-text>1997年那是一个春天台湾的上空划过一条闪电，闪电过后一个人影</v-card-text>-->
          <!--<v-autocomplete label="misaka"></v-autocomplete>-->
          <!--<l-select-file></l-select-file>-->
          <!--<v-card-actions>-->
            <!--<v-btn color="red" flat>修改</v-btn>-->
          <!--</v-card-actions>-->
        <!--</v-card>-->
      <!--</v-flex>-->
    <!--</v-layout>-->
  <!--</v-container>-->
</template>

<script>

import LLayout from '../../components/Layout/LLayout';
import LSelectFile from '../../components/Inputs/LSelectFile';
export default {
  name: 'violationHistoryDetails',
  components: {LLayout, LSelectFile},
  data: () => ({
    name: 'Misaka Mikoto',
    location: '学园都市',
  }),
}
</script>

<style scoped>

</style>
