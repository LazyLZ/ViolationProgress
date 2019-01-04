<template>
  <v-dialog v-model="value" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="subheading pl-2 py-1">关联模板</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-autocomplete
                  label="选择模板"
                  :items="items"
                  item-text="name"
                  item-value="id"
                  v-model="item"
                  :rules="$rules.required()"
                  :loading="isLoading"
                  :search-input.sync="search"
                  hide-selected
                  placeholder="输入以搜索模板"
                  :no-data-text="search?'没有匹配模板':'输入以搜索模板'"
                  :hide-no-data="isLoading || !search"
                  return-object
                  chips
                  deletable-chips
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn large color="grey" :loading="cancelLoading" flat @click="cancel">取消</v-btn>
        <v-btn large :disabled="!valid" color="primary" :loading="confirmLoading" flat @click="save">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'associateTemplateDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    valid: false,
    textLimit: 30,
    templates: [],
    isLoading: false,
    model: null,
    search: null,
    count: 0,
    activate: false,
    cancelLoading: false,
    confirmLoading: false,
    item: null,
    templateList: [
      {
        id: '一般违章类-教职工-第一次模板',
        name: '一般违章类-教职工-第一次模板',
        text: '学高为师，身正为范！\n' +
          'xx学院xx老师您好！\n' +
          '您的车辆(车牌号：xxxxxx)在禁停区域停车（违章类型），这是第一次警示信息，第二次将予以警告并抄送单位领导，同时在党委保卫部网站予以曝光！第三次将暂停您的车辆进校资格。请您即时将车辆移停到停车场，敬请遵守学校规章制度，共同维护校园良好秩序，实现全员育人！【发送人：党委保卫部（保卫处）】'
      },
      {
        id: '一般违章类-教职工-第二次模板',
        name: '一般违章类-教职工-第二次模板',
        text: '学高为师，身正为范！\n' +
          'xx学院xx老师您好！\n' +
          '您的车辆(车牌号：xxxxxx)在禁停区域停车（违章类型），您的车辆在校内第二次违规。这是第二次警告信息，此信息将抄送单位领导，同时在党委保卫部网站予以曝光！第三次将暂停您的车辆进校资格。请您即时将车辆移停到停车场，敬请遵守学校规章制度，共同维护校园良好秩序，实现全员育人！【发送人：党委保卫部（保卫处）】\n'
      },
      {
        id: '一般违章类-教职工-第三次模板',
        name: '一般违章类-教职工-第三次模板',
        text: '学高为师，身正为范！\n' +
          'xx学院xx老师您好！\n' +
          '您的车辆(车牌号：xxxxxx)在禁停区域停车（违章类型），您的车辆在校内已经违规三次，车辆进校资格已被暂停。请您即时将车辆移停到停车场，敬请遵守学校规章制度，共同维护校园良好秩序，实现全员育人！【发送人：党委保卫部（保卫处）】\n'
      },
    ],
  }),
  computed: {
    items () {
      return this.templates.map(t => {
        const text = t.name.length > this.textLimit
          ? t.text.slice(0, this.textLimit) + '...'
          : t.text

        return Object.assign({}, t, {text})
      })
    }
  },
  watch: {
    search: _.debounce(async function (val) {
      // Items have already been loaded
      if (!this.search) return

      this.isLoading = true

      try {
        let {templates, amount} = await this.$store.dispatch('messageTemplate/getTemplateList', {
          pagination: {page: 1, rowsPerPage: 100},
          filter: {
            name: this.search || '',
          }
        })
        this.count = amount
        this.templates = templates
        console.log('get template', templates)
      }
      catch (e) {
        this.$store.commit('alertError', {title: '获取模板时发生错误', message: e.message, raw: e})
      }

      this.isLoading = false
    }, 600)
  },
  methods: {
    save () {
      // console.log(this.item)
      this.$emit('save', this.item)
      this.$emit('input', false)
    },
    cancel () {
      this.$emit('input', false)
      this.$emit('cancel')
    }
  },
  mounted () {
    if (this.item) {
      console.log(this.item)
      this.$store.dispatch('messageTemplate/getTemplateList', {
        pagination: {page: 1, rowsPerPage: 100},
        filter: {
          name: this.item.name || '',
        }
      })
        .then(res => {
          this.count = res.amount
          this.templates = res.templates
          console.log('get template', res.templates)
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>

<style scoped>

</style>
