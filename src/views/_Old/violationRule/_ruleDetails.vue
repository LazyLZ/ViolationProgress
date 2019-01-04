<template>
  <div>
    <v-slide-y-reverse-transition>
      <v-card v-if="mounted" flat tile>
        <fixed-window ref="fixedWindow" :offset-top.sync="offsetTop">
          <!--固定次级导航-->
          <template slot="fixed-top">
            <v-toolbar
              ref="subToolbar"
              flat
              :class="flatToolbar ? '' : 'elevation-2'"
              :color="dark ? 'grey darken-3' : 'white'"
              tabs
            >
              <v-toolbar-side-icon @click="cancel">
                <v-icon>arrow_back</v-icon>
              </v-toolbar-side-icon>

              <!--导航文字-->
              <v-toolbar-title class="subheading">
                <!--<span>{{offsetTop}}</span>-->
                <span v-if="newItem" class="mr-4">添加规则</span>
                <span v-if="editing" class="mr-4">编辑规则</span>
                <span v-if="readonly" class="mr-4">查看规则</span>
              </v-toolbar-title>
              <v-toolbar-items>
                <v-flex layout align-center>
                  <template v-for="(item, i) in ruleStack.slice(1)">
                    <span :key="item.id" class="subheading">{{ item.name }}</span>
                    <v-icon v-if="i < ruleStack.length - 2" small class="px-2">chevron_right</v-icon>
                  </template>
                  <v-icon v-if="ruleStack.length > 1" small class="px-2">chevron_right</v-icon>
                  <span v-if="!violationRule.name" class="subheading grey--text">规则名称</span>
                  <span v-else class="subheading">{{violationRule.name}}</span>
                </v-flex>
              </v-toolbar-items>
              <!--<v-tabs slot="extension" grow v-model="messageTab">-->
              <!--<v-tab key="baseInfo">基本信息</v-tab>-->
              <!--<v-tab key="template">关联模板</v-tab>-->
              <!--&lt;!&ndash;<v-tab>微信关联模板</v-tab>&ndash;&gt;-->
              <!--</v-tabs>-->
            </v-toolbar>
            <v-divider v-show="flatToolbar"></v-divider>
          </template>

          <v-container>
            <v-layout v-if="pageLoading" justify-center row class="mt-5">
              <v-flex justify-center layout>
                <v-progress-circular
                  v-if="pageLoading"
                  :size="50"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </v-flex>
            </v-layout>
            <v-layout v-else row justify-center>
              <v-flex xs12 md10>
                <v-subheader>基本信息</v-subheader>
                <v-form v-model="baseInfoForm" ref="baseInfoForm">
                  <v-container grid-list-md class="px-4">
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-select
                          prepend-icon="account_balance"
                          label='机构单位'
                          :items="orgList"
                          :rules="$rules.required()"
                          item-value="id"
                          item-text="name"
                          v-model="violationRule.orgId"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm9>
                        <v-text-field
                          label="规则名称"
                          :counter="$rules.NAME_MAX"
                          :rules="$rules.nameRequired"
                          prepend-icon="bookmark"
                          v-model="violationRule.name"
                        ></v-text-field>
                      </v-flex>
                      <!--<v-flex xs4>-->
                      <!--<v-text-field-->
                      <!--label="细分类型"-->
                      <!--&gt;</v-text-field>-->
                      <!--</v-flex>-->
                      <v-flex xs12 sm3>
                        <v-text-field
                          label="最大违章次数"
                          prepend-icon="timer"
                          type="number"
                          :disabled="!rootRule"
                          v-model="violationRule.maxViolation"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-textarea
                          label="规则描述"
                          :counter="$rules.DETAILS_MAX"
                          :rules="$rules.detailsRules"
                          prepend-icon="comment"
                          :rows="1"
                          auto-grow
                          v-model="violationRule.details"
                        ></v-textarea>
                      </v-flex>
                      <!--<v-flex xs12>-->
                      <!--<v-switch-->
                      <!--label="可选择"-->
                      <!--disabled-->
                      <!--hint="只有最末细分类型可作为违章类型的选项"-->
                      <!--persistent-hint-->
                      <!--prepend-icon=""-->
                      <!--v-model="violationRule.isSelectable"-->
                      <!--&gt;</v-switch>-->
                      <!--</v-flex>-->
                    </v-layout>
                  </v-container>
                </v-form>
                <!--<v-layout v-if="rootRule">-->
                <!--<v-flex>-->
                <!--<v-switch-->
                <!--label="不计入违章次数"-->
                <!--&gt;</v-switch>-->
                <!--</v-flex>-->
                <!--</v-layout>-->
                <!--根节点关联分组及模板-->
                <v-subheader v-if="rootRule">关联分组</v-subheader>
                <v-form v-if="rootRule">
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-select
                          prepend-icon="group"
                          label="关联分组"
                          :items="groupInfos"
                          item-text="name"
                          item-value="id"
                          multiple
                          chips
                          v-model="groups"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>

                <v-subheader v-if="rootRule">关联模板</v-subheader>
                <v-container v-if="rootRule">
                  <v-tabs v-model="messageTab" grow>
                    <v-tab key="message"><span class="px-2">短信模板</span></v-tab>
                    <v-tab key="wechat"><span class="px-2">微信模板</span></v-tab>
                    <v-tab key="email"><span class="px-2">邮件模板</span></v-tab>
                  </v-tabs>
                  <v-divider></v-divider>
                  <v-tabs-items v-model="messageTab">
                    <v-tab-item
                      v-for="(list, key, index) in groupTemplateList"
                      :key="key"
                    >
                      <!--<p>{{list}}</p>-->
                      <v-list expand class="py-0">
                        <v-list-group
                          v-for="group in list"
                          v-if="groups.some(g => group.id === g)"
                          :key="group.id"
                          prepend-icon="group"
                        >
                          <v-list-tile slot="activator">
                            <v-list-tile-content>
                              <v-list-tile-title>
                                {{group.name}}
                              </v-list-tile-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-list dense three-line>
                            <template
                              v-for="(template, i) in group.templates.slice(0,maxViolation)"
                            >
                              <v-list-tile
                                class="pl-2"
                                :key="i"
                              >
                                <v-list-tile-action>
                                  <v-icon>mail</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                  <v-list-tile-title class="subheading">
                                    第{{template.times}}次违章模板
                                  </v-list-tile-title>
                                  <v-list-tile-sub-title>
                                    <v-tooltip top max-width="56em" open-delay="600">
                                      <span slot="activator">{{template.text}}</span>
                                      <span>{{template.text}}</span>
                                    </v-tooltip>

                                    <!--<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>-->
                                  </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                  <v-tooltip left v-if="!template.id">
                                    <v-btn
                                      slot="activator"
                                      icon
                                      @click="selectDialog={activate: true, item: template}"
                                    >
                                      <v-icon>add</v-icon>
                                    </v-btn>
                                    <span>关联模板</span>
                                  </v-tooltip>
                                  <v-tooltip left v-else>
                                    <v-btn
                                      slot="activator"
                                      icon
                                      @click="deAssociate(group.templates, i)"
                                    >
                                      <v-icon>clear</v-icon>
                                    </v-btn>
                                    <span>取消关联</span>
                                  </v-tooltip>

                                </v-list-tile-action>
                              </v-list-tile>
                              <v-divider
                                inset
                                v-if="i < group.templates.slice(0,maxViolation).length-1"
                              ></v-divider>
                            </template>
                          </v-list>
                        </v-list-group>
                      </v-list>
                      <p v-if="groups.length===0" class="py-4 body-2 text-xs-center">请先关联分组</p>
                    </v-tab-item>
                  </v-tabs-items>
                </v-container>
                <v-container class="px-0">
                  <v-layout>
                    <v-btn :disabled="!dataChanged" :loading="submitLoading" @click="submitRule"
                           color="primary">提交
                    </v-btn>
                    <!--<v-btn :disabled="!dataChanged" @click="reset()" color="error">重置</v-btn>-->
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>

          <!--<v-tabs-items v-model="messageTab">-->
          <!--<v-tab-item key="baseInfo">-->
          <!--<v-form>-->
          <!--<v-container>-->
          <!--<v-layout>-->
          <!---->
          <!--</v-layout>-->
          <!--</v-container>-->

          <!--</v-form>-->
          <!--</v-tab-item>-->
          <!--<v-tab-item key="template">-->
          <!--关联模板-->
          <!--</v-tab-item>-->
          <!--</v-tabs-items>-->

        </fixed-window>
      </v-card>
    </v-slide-y-reverse-transition>

    <confirm-oeration-dialog
      v-model="errorDialog.activate"
      auto-close
      title="发生错误"
      disable-cancel
    >
      <v-layout column>
        <v-flex layout column align-center justify-center>
          <v-icon large class="pb-3" color="error">error</v-icon>
          <span>{{newItem?'添加':'修改'}}规则时发生错误</span>
        </v-flex>
        <v-flex>
          <div class="text-xs-center pt-2 pb-1">{{errorDialog.message}}</div>
        </v-flex>
      </v-layout>

    </confirm-oeration-dialog>

    <associate-template-dialog
      v-if="selectDialog.activate"
      v-model="selectDialog.activate"
      @save="associateTemplate"
    ></associate-template-dialog>
  </div>
</template>

<script>
import FixedWindow from '../../../components/fixedWindow'
import AssociateTemplateDialog from './associateTemplateDialog'
import violationRule from '../../../store/modules/violationRule'
import ConfirmOerationDialog from '../../../components/confirmOperationDialog'

export default {
  name: 'ruleDetails',
  components: {ConfirmOerationDialog, AssociateTemplateDialog, FixedWindow},
  props: {
    status: {
      type: String,
      default: 'new'
    },
    ruleName: null,
    ruleId: null,
    rawItem: {},
    ruleStack: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    errorDialog: {
      activate: false,
      message: ''
    },
    baseInfoForm: false,
    ruleChanged: false,
    detectionChanged: false,
    selectDialog: {
      activate: false,
      item: {
        templateId: ''
      }
    },
    pageLoading: false,
    submitLoading: false,
    groupInfos: [],
    groups: [],
    groupTemplateList: {
      message: {},
      wechat: {},
      email: {}
    },
    messageTab: 'message',
    violationRule: {
      name: '',
      id: '',
      detectionId: '',
      details: '',
      orgId: '',
      orgName: '',
      maxViolation: 0,
    },
    offsetTop: 0,
    mounted: false,
    maxViolation: 0,
  }),
  computed: {
    editing () {
      return this.status === 'edit'
    },
    detectionRuleValid () {
      return !!this.violationRule.detectionId
    },
    readonly () {
      return this.status === 'readonly'
    },
    newItem () {
      return this.status === 'new' || this.status === 'child'
    },
    flatToolbar () {
      return this.offsetTop === 0
    },
    rootRule () {
      return this.ruleStack.length === 1
    },
    dark () {
      return this.$store.state.dark
    },
    orgList () {
      return this.$store.getters.orgListSelect
    },
    allChecked () {
      return this.baseInfoForm
    },
    dataChanged () {
      return this.ruleChanged || this.detectionChanged
    }
  },
  watch: {
    violationRule: {
      deep: true,
      handler () {
        this.ruleChanged = true
      }
    },
    'violationRule.orgId' () {
      this.getGroupList()
    },
    groups (val) {
      this.detectionChanged = true
      val.forEach(g => {
        let group = this.groupInfos.find(item => item.id === g) || {}
        // console.log(g)
        for (let type of Object.keys(this.groupTemplateList)) {
          let list = this.groupTemplateList[type]
          if (!list.hasOwnProperty(g)) {
            // 模板对应角色
            list[g] = {
              name: group.name,
              id: group.id,
              templates: []
            }
          }
          let tmps = list[g].templates
          for (let i = 0; i < this.maxViolation; ++i) {
            // 第i次模板关联
            if (!tmps[i]) {
              this.$set(tmps, i, {
                name: '',
                id: '',
                times: i + 1,
                text: ''
              })
            }
            // list[g].templates.push({
            //   name: '',
            //   id: '',
            //   times: i + 1,
            //   text: ''
            // })
          }
        }
      })
    },
    'violationRule.maxViolation' (val) {
      this.maxViolation = val
    },
    groupTemplateList: {
      deep: true,
      handler () {
        this.detectionChanged = true
      }
    },
    maxViolation (val) {
      this.detectionChanged = true
      this.violationRule.maxViolation = this.maxViolation
      for (let type of Object.keys(this.groupTemplateList)) {
        let list = this.groupTemplateList[type]
        for (let g of Object.keys(list)) {
          let tmps = list[g].templates
          for (let i = 0; i < this.maxViolation; ++i) {
            // 第i次模板关联
            if (!tmps[i]) {
              this.$set(tmps, i, {
                name: '',
                id: '',
                times: i + 1,
                text: ''
              })
            }
          }
          // if (list[g].templates.length < val) {
          //   list[g].templates.push({
          //     name: '',
          //     id: '',
          //     times: list[g].templates.length + 1,
          //     text: ''
          //   })
          // }
        }
      }
    }
  },
  methods: {
    go (path) {
      if (path) {
        this.$router.push(path)
      }
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    cancel () {
      if (this.status === 'child') {
        this.ruleStack.pop()
      }
      this.goBack()
    },
    associateTemplate (select) {
      console.log(select)
      if (select) {
        console.log('saved')
        let item = this.selectDialog.item
        item.name = select.name
        item.id = select.id
        item.text = select.text
      }
    },
    // async reset () {
    //   throw Error('未完成模块')
    //   if (this.editing) {
    //     this.pageLoading = true
    //     Object.assign(this.violationRule, this.util.deepClone(this.rawItem))
    //     await this.getDetectionRule()
    //     this.pageLoading = false
    //   }
    //   else {
    //     this.groupTemplateList = {
    //       message: {},
    //       wechat: {},
    //       email: {}
    //     }
    //     this.messageTab = 'message'
    //     this.violationRule = {
    //       name: '',
    //       id: '',
    //       detectionId: '',
    //       details: '',
    //       orgId: '',
    //       orgName: '',
    //       maxViolation: 0,
    //     }
    //   }
    //   this.offsetTop = 0
    //   // this.initDetectionData().then(() => {
    //   // }).catch(error => {
    //   //   console.log('init error', error)
    //   // }).finally(() => {
    //   //   this.pageLoading = false
    //   // })
    // },

    deAssociate (templates, i) {
      let times = templates[i].times
      // console.log('deassociate', templates[i])
      templates.splice(i, 1, {
        name: '',
        id: '',
        times: times,
        text: ''
      })
      this.$forceUpdate()
      // console.log('deassociate', templates[i])
    },
    async getTemplate (id) {
      let tmp = {}
      await this.$store.dispatch('messageTemplate/getTemplateById', {id: id}).then(res => {
        tmp = res
      })
      return tmp
    },
    async getDetectionRule () {
      let rule = this.violationRule
      if (!this.rootRule) {
        rule = this.ruleStack[1]
        await this.$store.dispatch('violationRule/getDetectionRule', {
          id: rule.id
        }).then(res => {
          console.log('get detectionRule', res)
          this.maxViolation = res.maxViolation
        })
        return
      }
      await this.$store.dispatch('violationRule/getDetectionRule', {
        id: rule.id
      }).then(res => {
        this.maxViolation = res.maxViolation
        this.violationRule.detectionId = res.id
        // console.log('get detect', res)
        let msgSet = res.msgTmpltSet

        this.groups.push(...Object.keys(msgSet))

        let msgTempList = this.groupTemplateList.message
        for (let g of Object.keys(msgSet)) {
          let group = this.groupInfos.find(item => item.id === g)
          if (!group) continue
          msgTempList[g] = {
            name: group.name,
            id: group.id,
            templates: []
          }
          let tmps = msgTempList[g].templates
          msgSet[g].forEach(tmp => {
            this.getTemplate(tmp.imtpl).then(res => {
              // console.log(res)
              this.$set(tmps, tmp.times - 1, {
                ...res,
                times: tmp.times
              })
            })
          })
        }
      }).catch(err => {
        console.error('get detect error', err)
      })
    },
    async getGroupList () {
      // console.log(this.violationRule.orgId)
      if (!this.violationRule.orgId) {
        this.groupInfos = [
          {header: '请先选择机构单位'}
        ]
      }
      else {
        await this.$store.dispatch('groupType/getGroupList', {
          orgId: this.violationRule.orgId
        }).then(res => {
          console.log('get groups', res)
          this.groupInfos = res
        }).catch(err => {
          console.error('get groups error', err)
        })
      }
    },
    async initDetectionData () {
      try {
        await this.$store.dispatch('groupOrg/getOrgList').then(res => {
          console.log('get orgs', res)
        })
        if (this.rootRule) {
          await this.getGroupList()
        }
        if (!(this.newItem && this.rootRule)) {
          await this.getDetectionRule()
        }
      }
      catch (e) {
        if (e.hasOwnProperty('message')) {
          this.errorDialog.message = e.message
        }
        else {
          this.errorDialog.message = e.toString()
        }
        this.errorDialog.activate = true
      }
    },
    async submitRule () {
      this.$refs.baseInfoForm.validate()
      if (this.allChecked) {
        this.submitLoading = true
        try {
          if (this.editing) {
            if (this.ruleChanged) {
              const v = await this.updateRule()
              Object.assign(this.violationRule, v)
            }
            if (this.detectionRuleValid && this.rootRule) {
              await this.updateDetection()
            }
            else if (this.detectionChanged && this.rootRule) {
              await this.addDetection()
            }
          }
          else if (this.newItem) {
            const v = await this.addRule()
            Object.assign(this.violationRule, v)
            if (this.detectionChanged && this.rootRule) {
              await this.addDetection()
            }
          }
          this.cancel()
        }
        catch (e) {
          console.log('submit error', e)
          this.errorDialog.activate = true
          this.errorDialog.message = e.message ? e.message : e.toString()
        }
        finally {
          this.submitLoading = false
        }
      }
      else {
        this.offsetTop = 0
      }
    },
    async addDetection () {
      let v = this.violationRule

      let msgSet = {}
      for (let g of Object.keys(this.groupTemplateList.message)) {
        let list = this.groupTemplateList.message[g]
        let tmps = list.templates.filter(tmp => !!tmp.id && tmp.times <= this.maxViolation)
        msgSet[g] = []
        msgSet[g].push(...tmps.map(tmp => {
          return {
            times: tmp.times,
            imtpl: tmp.id
          }
        }))
      }
      let detectData = {
        viogrpFstlvlId: v.id,
        maxToBan: v.maxViolation.toString(),
        msgTmpltSet: JSON.stringify(msgSet)
      }
      console.log('add Detect data', detectData)
      await this.$store.dispatch('violationRule/addDetectionRule', detectData)
        .then((res) => {
          console.log('add Detection success')
        })
        .catch((error) => {
          console.error('add detection error', error)
          throw error
        })
    },
    async updateDetection () {
      let v = this.violationRule
      let msgSet = {}
      for (let g of Object.keys(this.groupTemplateList.message)) {
        let list = this.groupTemplateList.message[g]
        let tmps = list.templates.filter(tmp => !!tmp.id && tmp.times <= this.maxViolation)
        msgSet[g] = []
        msgSet[g].push(...tmps.map(tmp => {
          return {
            times: tmp.times,
            imtpl: tmp.id
          }
        }))
      }
      let detectData = {
        id: v.detectionId,
        viogrpFstlvlId: v.id,
        maxToBan: v.maxViolation.toString(),
        msgTmpltSet: JSON.stringify(msgSet)
      }
      console.log('update Detect data', detectData)
      await this.$store.dispatch('violationRule/updateDetectionRule', detectData)
        .then((res) => {
          console.log('update Detection success')
        })
        .catch((error) => {
          console.error('update detection error', error)
          throw error
        })
    },
    async addRule () {
      let code = ''
      if (this.rootRule) {
        code = this.ruleStack[0].children.length + 1
        code = code.toString()
        console.log('code root', code, this.ruleStack[0])
      }
      else {
        let last = this.ruleStack[this.ruleStack.length - 1]
        let c = 1
        if (last.children instanceof Array) {
          last.children.forEach(v => {
            let cs = v.code.split('_')
            let lastCode = cs[cs.length - 1]
            c = c <= lastCode ? (+lastCode + 1) : c
          })
        }
        code = last.code + '_' + c
        console.log('code ', code, last)
      }

      // console.log('code ', code)
      let v = this.violationRule
      let addV = {}
      let data = {
        name: v.name,
        orgId: v.orgId,
        code: code,
        description: v.details
      }
      // console.log('submit', data)
      await this.$store.dispatch('violationRule/addViolationRule', data)
        .then((res) => {
          addV = res
          console.log('add Rule success')
        })
        .catch((error) => {
          console.error('add rule error', error)
          throw error
        })
      return addV
    },
    async updateRule () {
      let v = this.violationRule
      let newV = {}
      let data = {
        id: v.id,
        name: v.name,
        // orgId: v.orgId,
        // code: v.code,
        description: v.details
      }
      await this.$store.dispatch('violationRule/updateViolationRule', data)
        .then((res) => {
          newV = res
          console.log('update success')
        })
        .catch((error) => {
          console.log(error)
          throw error
        })
      return newV
    },

    // 废弃
    async changeRule () {
      this.submitLoading = true
      let data = {
        id: this.violationRule.id,
        name: this.violationRule.name,
        orgId: this.violationRule.orgId,
        code: this.violationRule.code,
        description: this.violationRule.details
      }
      await this.$store.dispatch('violationRule/updateViolationRule', data)
        .then((res) => {
          console.log('update success')
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.submitLoading = false
          this.cancel()
        })
    },
    // 废弃
    async addNewRule () {
      this.submitLoading = true
      let code = ''
      if (this.rootRule) {
        code = this.ruleStack[0].children.length + 1
        code = code.toString()
        console.log('code root', code, this.ruleStack[0])
      }
      else {
        let last = this.ruleStack[this.ruleStack.length - 1]
        let c = last.children ? last.children.length + 1 : 1
        code = last.code + '_' + c
        console.log('code ', code, last)
      }

      let v = this.violationRule
      let addV = {}
      let data = {
        name: v.name,
        orgId: v.orgId,
        code: code,
        description: v.details
      }
      // console.log('submit', data)
      await this.$store.dispatch('violationRule/addViolationRule', data)
        .then((res) => {
          addV = res
          console.log('add Rule success')
        })
        .catch((error) => {
          console.error('add rule error', error)
        })

      if (!this.detectionChanged) {
        this.submitLoading = false
        this.cancel()
        return
      }

      let msgSet = {}
      for (let g of Object.keys(this.groupTemplateList.message)) {
        let list = this.groupTemplateList.message[g]
        let tmps = list.templates.filter(tmp => !!tmp.id)
        msgSet[g] = []
        msgSet[g].push(...tmps.map(tmp => {
          return {
            times: tmp.times,
            imtpl: tmp.id
          }
        }))
      }
      let detectData = {
        viogrpFstlvlId: addV.id,
        maxToBan: v.maxViolation.toString(),
        msgTmpltSet: JSON.stringify(msgSet)
      }
      console.log('Detect data', detectData)
      await this.$store.dispatch('violationRule/addDetectionRule', detectData)
        .then((res) => {
          console.log('add Detection success')
        })
        .catch((error) => {
          console.error('add detection error', error)
        })
        .finally(() => {
          this.submitLoading = false
          this.cancel()
        })
    },
  },
  async created () {
    if (this.editing || this.readonly) {
      this.pageLoading = true
      let rule = null
      if (this.rawItem) {
        rule = this.rawItem
        // console.log('get from rawItem', rule)
      }
      else {
        if (!this.ruleStack || this.ruleStack.length === 0) {
          this.cancel()
          return
        }
        let id = this.$store.getters.getDataFromLocal('violationRule/id')
        if (id) {
          try {
            rule = await this.$store.dispatch('violationRule/findViolationRule', id)
            // console.log('get from local', rule)
          }
          catch (e) {
            this.errorDialog.activate = true
            this.errorDialog.message = e.message || e + ''
          }
        }
      }
      if (rule) {
        Object.assign(this.violationRule, this.util.deepClone(rule))
        await this.initDetectionData().then(() => {
        }).catch(error => {
          console.log('init error', error)
        })

        this.$store.commit('setDataToLocal', {key: 'violationRule/id', value: this.violationRule.id})
      }
      else {
        this.errorDialog.activate = true
        this.errorDialog.message = '获取规则信息失败，请返回重试'
      }
      this.pageLoading = false
      console.log('into details', this.violationRule)
    }
    else {
      this.pageLoading = true
      await this.initDetectionData()
      this.pageLoading = false
    }
    console.log(this.rawItem, this.ruleStack)
  },
  mounted () {
    this.mounted = true
  },
  beforeRouteLeave (to, from, next) {
    // console.log('route to', to.name)
    this.$store.commit('deleteLocalData', 'violationRule/id')
    next()
  }
}
</script>

<style scoped>

</style>
