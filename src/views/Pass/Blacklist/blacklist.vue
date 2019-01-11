<template>
  <l-layout :layout="['lg10', 'xs12']" bottom-space>
    <l-data-table
      :get-data-func="getVehicles"
      :headers="headers"
      init-sort-by="plate"
      ref="dataTable"
      title-text="冻结车牌列表"
    >
      <template slot="row-action">
        <td @click.stop>
          <v-btn icon small>
            <v-icon small>$vuetify.icons.delete</v-icon>
          </v-btn>
        </td>
      </template>
      <!--<template slot="title-action">-->
      <!--<l-option-list-->
      <!--:options="moreActions"-->
      <!--@delete="deleteUser(selected)"-->
      <!--&gt;-->
      <!--<v-btn icon slot="activator">-->
      <!--<v-icon>$vuetify.icons.more</v-icon>-->
      <!--</v-btn>-->
      <!--</l-option-list>-->
      <!--</template>-->
    </l-data-table>
    <!--<l-dialog-->
    <!--hide-divider-->
    <!--:auto-close="false"-->
    <!--:disable-confirm="!userValid"-->
    <!--:loading="userDialog.loading"-->
    <!--@cancel="userDialog.activate = false"-->
    <!--@confirm="addUser(userDialog.form)"-->
    <!--max-width="400px"-->
    <!--title="新增用户"-->
    <!--v-model="userDialog.activate"-->
    <!--&gt;-->
    <!--<v-container grid-list-md class="pt-0">-->
    <!---->
    <!--</v-container>-->
    <!--</l-dialog>-->
  </l-layout>
</template>

<script>
import LLayout from '../../../components/Layout/LLayout'
import LDataTable from '../../../components/Data/LDataTable'
import {Vehicle} from '../../../object'

export default {
  name: 'blacklist',
  components: {LDataTable, LLayout},
  data: () => ({
    headers: [
      {text: '车辆号牌', value: 'plate', align: 'left', placeholder: 'N/A'},
      {text: '车主姓名', value: 'name', align: 'right', placeholder: 'N/A'},
      {text: '联系方式', value: 'phone', align: 'right', placeholder: 'N/A'},
      {text: '电子邮箱', value: 'email', align: 'right', placeholder: 'N/A'},
      {text: '登记类型', value: 'typeName', align: 'right', placeholder: 'N/A'},
      {text: '', value: '', align: 'right', width: '80px', sortable: false}
    ]
  }),
  methods: {
    getVehicles () {
      return new Promise(resolve => {
        setTimeout(() => {
          let items = [
            new Vehicle({
              plate: '川ALZ000',
              owner: {
                name: 'LZ',
                phone: '18618164058',
                email: 'laizhi727@126.com',
                typeName: '在校学生'
              }
            })
          ]
          resolve({items, amount: 10})
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>

</style>
