<template>
  <div class="d-inline-block">
    <div v-if="buttonSelect && haveActivator" @click.stop="selectFile" class="d-inline-block">
      <slot name="activator">
        <!--<v-btn>{{title}}</v-btn>-->
      </slot>
    </div>
    <!--<v-btn-->
    <!--v-if="buttonSelect"-->
    <!--:color="color"-->
    <!--@click="selectFile()"-->
    <!--:flat="flat"-->
    <!--:small="small"-->
    <!--:large="large"-->
    <!--:medium="medium"-->
    <!--:disabled="readonly"-->
    <!--&gt;{{title}}-->
    <!--</v-btn>-->
    <template v-else-if="dialogSelect">
      <span class="d-inline-block" @click.stop="dialog.activate = true">
        <slot name="activator"></slot>
      </span>
      <v-dialog scrollable v-model="dialog.activate" persistent :max-width="dialogProps.maxWidth || '600px'">
        <v-card flat>
          <v-card-title style="height: 64px">
            <slot name="title">
              <span class="title py-1">{{dialogProps.title || dialogTitleText}}</span>
              <!--<span>{{dialogProps}}</span>-->
            </slot>
          </v-card-title>
          <v-progress-linear
            class="py-0 my-0"
            v-if="dialogProps.loading"
            height="2"
            :value="dialogProps.progress"
            :indeterminate="!dialogProps.hasOwnProperty('progress')"
          ></v-progress-linear>
          <v-divider v-else></v-divider>
          <v-card-text :style="{maxHeight: dialogProps.maxHeight || '600px'}">
            <v-container fluid class="py-0 px-0">
              <slot></slot>
              <slot name="before-drag"></slot>
              <v-layout
                style="min-height: 300px"
                justify-center align-center column
                id="dragArea"
                ref="dragArea"
                fill-height
                @dragenter.prevent.stop="dragInBox"
                @dragleave.prevent.stop="dragOutBox"
                @drop.prevent.stop="getFile"
                @dragover.prevent
                :class="dragAreaColor">
                <div :style="preventPointer">
                  <v-layout column align-center>
                    <!--<v-scale-transition>-->
                    <span v-if="readonly && files.length === 0">没有选择文件</span>
                    <span
                      v-else-if="files.length === 0"
                      class="subheading grey--text"
                    >{{dragIn?'松开上传':'拖拽到此处'}}</span>
                    <v-layout row wrap align-center justify-center v-else>
                      <v-flex :style="{width: dialogProps.maxWidth ? dialogDropWidth : '500px'}"
                              xs12 :key="i+name" v-for="(name, i) in files.map(f => f.name)">
                        <div
                          style="word-wrap: break-word; word-break: break-all"
                          class="text-xs-center grey--text text--darken-2 subheading"
                        >{{name}}
                        </div>
                      </v-flex>
                    </v-layout>
                    <!--</v-scale-transition>-->
                    <!--<v-btn flat color="primary">选择文件</v-btn>-->
                    <div>
                      <span v-if="errorData.error && hadChose" class="error--text">{{errorData.message}}</span>
                      <span v-else class="caption grey--text">{{hint || ''}}</span>
                    </div>
                    <v-scale-transition>
                      <v-btn
                        :disabled="readonly"
                        color="primary"
                        @click="selectFile()"
                        flat
                      >{{label}}
                      </v-btn>
                    </v-scale-transition>
                  </v-layout>
                </div>
              </v-layout>
              <slot name="after-drag"></slot>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              large
              flat
              color="grey"
              @click="cancel()"
            >{{dialogProps.cancelText || '取消'}}
            </v-btn>
            <v-btn
              :disabled="errorInput"
              :loading="dialogProps.loading"
              large
              flat
              color="primary"
              @click="submit()"
            >{{dialogProps.confirmText || '确认'}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <div v-else-if="inputSelect" @click.stop="selectFile()">
      <v-autocomplete
        item-disabled
        :prepend-icon="prependIcon"
        :rules="rules"
        :readonly="files.length === 0 || readonly"
        :label="label"
        multiple
        :hint="hint"
        :items="files && files.map(f => f.name)"
        v-model="files"
        item-text="name"
        :chips="multiple"
        :deletable-chips="multiple"
        hide-selected
        hide-no-data
        return-object
        :small-chips="multiple"
        :search-input.sync="hideInput"
      >
      </v-autocomplete>
    </div>
    <!--<v-flex class="grey" style="height: 100px">-->
    <!--<div ref="imggg"><div></div></div>-->
    <!--</v-flex>-->
  </div>
</template>

<script>
let MIME = {
  'image': 'image/*',
  'audio': 'audio/*',
  'pdf': 'application/pdf',
  // 'ppt': 'application/vnd.ms-powerpoint',
  'ppt': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'doc': 'application/msword',
  'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'xls': 'application/vnd.ms-excel',
  'text': 'text/plain',
  'txt': 'text/plain',
  'zip': 'aplication/zip',
}
export default {
  name: 'LSelectFile',
  props: {
    value: {},
    flat: {type: Boolean, default: false},
    small: {type: Boolean, default: false},
    large: {type: Boolean, default: false},
    medium: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false},
    selectType: {type: String, default: 'button'},
    fileType: {type: String, default: ''},
    label: {type: String, default: '选择文件'},
    color: {type: String, default: 'primary'},
    prependIcon: {type: String, default: 'description'},
    hint: {type: String, default: ''},
    nameSplit: {type: String, default: '\n'},
    rules: {type: Array, default: () => ([])},
    dialogProps: {
      type: [String, Object],
      default: () => ({
        maxHeight: '600px',
        autoClose: true,
        activate: false,
        loading: false
      })
    },
    dialogTitleText: {type: String, default: '选择文件'},
    dark: {type: Boolean, default: false},
    clearDialogData: {type: Boolean, default: true},
    readonly: {type: Boolean, default: false}
  },
  data: () => ({
    hadChose: false,
    dialog: {
      activate: false
    },
    dragIn: false,
    // fileName: [],
    errorData: {
      error: false,
      message: '',
      // index: 0
    },
    files: [],
    inputDom: null,
    getSuccess: false,
    imgDom: null,
    hideInput: ''
  }),
  computed: {
    buttonSelect () {
      return this.selectType === 'button'
      // return true
    },
    dialogSelect () {
      return this.selectType === 'dialog'
    },
    inputSelect () {
      return this.selectType === 'input'
    },
    multipleAttr () {
      return this.multiple ? 'true' : 'false'
    },
    acceptAttr () {
      return MIME[this.fileType] || ''
    },
    dialogDropWidth () {
      if (this.dialogProps.maxWidth) {
        let text = this.dialogProps.maxWidth
        text.replace(/\d+/i, (word) => Number.isNaN(Number(word)) ? 500 : Math.max(50, Number(word) - 100))
      }
      else {
        return '500px'
      }
    },
    dragAreaColor () {
      let cls = ['grey']
      let s = (this.dark || this.dark_) ? 'darken' : 'lighten'
      let base = (this.dark || this.dark_) ? 2 : 4
      base = this.dragIn ? base - 1 : base
      cls.push(s + '-' + base)
      // console.log('drag area class', cls)
      return cls
    },
    preventPointer () {
      let s = {'pointer-events': 'none'}
      return this.dragIn ? s : {}
      // return s
    },
    errorInput () {
      return this.rules.some(r => r(this.files) !== true)
    },
    dark_ () {
      if (this.$store && this.$store.state.hasOwnProperty('dark')) {
        return this.$store.state.dark
      }
      else {
        return false
      }
    },
    haveActivator () {
      return this.$slots.hasOwnProperty('activator')
    }
  },
  watch: {
    'dialog.activate' (val, oldVal) {
      if (!val && oldVal) {
        this.dragIn = false
      }
      if (val && !oldVal) {
        this.hadChose = false
        if (this.clearDialogData) {
          this.files = []
        }
        if (!this.dialogProps.autoClose) {
          this.dialogProps.activate = true
        }
      }
    },
    value (val) {
      // console.log(this.files === val, this.files, this.value)
      if (!val) {
        this.files = []
      }
      else if (val === this.files) {
      }
      else if (val instanceof Object) {
        let fileList = val
        let files = []
        for (let i of Object.keys(fileList)) {
          files.push(fileList[i])
        }
        if (!this.multiple && files.length > 0) {
          files = [files[0]]
        }
        this.files = files
        // this.fileName = this.files.map(f => f.name)
      }
      else if (val instanceof Object && val.length === 0) {
        if (this.files.length !== 0) {
          this.files = []
        }
      }
    },
    imgDom () {
      // console.log(this.$refs, this.$refs['imggg'])
      // this.$refs.imggg.insertBefore(this.imgDom, null)
    },
    // fileName: {
    //   handler () {
    //     let d = []
    //     // console.log('fileNameChange', this.util.deepClone(this.fileName), this.files)
    //     this.files.forEach((f, i) => {
    //       if (this.fileName.indexOf(f.name) === -1) {
    //         d.push(i)
    //       }
    //     })
    //     d.sort((a, b) => a - b)
    //     // console.log(d)
    //     for (let i = d.length - 1; i >= 0; --i) {
    //       this.files.splice(d[i], 1)
    //     }
    //     if (!this.dialogSelect) {
    //       this.$emit('input', this.files)
    //       console.log('emit file', this.files)
    //     }
    //     else {
    //       this.checkRules()
    //       // this.resetError()
    //     }
    //   },
    //   deep: true
    // },
    'dialogProps.activate' (val) {
      console.log('change props', val)
      if (!this.dialogProps.autoClose) {
        this.dialog.activate = val
      }
    },
    files: {
      handler (val) {
        // let d = []
        // this.fileName.forEach((name, i) => {
        //   let t = this.files.find(f => f.name === name)
        //   if (t) {
        //     d.push(i)
        //   }
        // })
        // d.sort((a, b) => a - b)
        // // console.log(d)
        // for (let i = d.length - 1; i >= 0; --i) {
        //   this.fileName.splice(d[i], 1)
        // }
        if (this.files && this.files.length > 0) {
          this.hadChose = true
        }
        if (!this.dialogSelect) {
          this.$emit('input', this.files)
          this.$emit('submit', this.files)
          console.log('emit file', this.files)
        }
        else {
          this.checkRules()
          // this.resetError()
        }
        // this.fileName
      },
      deep: true
    },
    hideInput (val) {
      // console.log('change', val)
      if (val) {
        this.$nextTick(() => {
          this.hideInput = ''
        })
      }
    }
  },
  methods: {
    open () {
      this.selectFile()
    },
    resetError () {
      this.errorData = {
        error: false,
        message: '',
        // index: 0
      }
    },
    checkRules () {
      let correct = !this.rules.some(r => {
        if (r(this.files) !== true) {
          this.errorData = {
            error: true,
            message: r(this.files) + '',
            // index: i
          }
          return true
        }
        return false
      })
      if (correct) {
        this.resetError()
      }
      return correct
    },
    dragInBox () {
      // console.log('drag in')
      this.dragIn = true
    },
    dragOutBox () {
      // console.log('drag out')
      this.dragIn = false
    },
    getFile (event) {
      let fileList = event.dataTransfer.files
      console.log(event, fileList)

      let files = []
      for (let i of Object.keys(fileList)) {
        files.push(fileList[i])
      }
      if (!this.multiple && files.length > 0) {
        files = [files[0]]
      }
      this.files = files
      // this.fileName = this.files.map(f => f.name)
      // this.checkRules()
      this.dragIn = false
    },
    submit () {
      // console.log(this.util.deepClone(this.dialogProps))
      if (!this.errorInput) {
        this.hadChose = false
        this.$emit('input', this.files)
        console.log('emit file', this.files)
        this.$emit('submit', this.files)
        if (this.dialogProps.autoClose) {
          this.dialog.activate = false
        }
        if (this.dialogProps.hasOwnProperty('progress')) {
          this.dialogProps.progress = 0
        }
      }
    },
    cancel () {
      if (this.clearDialogData) {
        this.$emit('input', this.files)
        console.log('emit file', this.files)
      }
      this.$emit('cancel')
      if (this.dialogProps.autoClose) {
        this.dialog.activate = false
      }
    },
    selectFile () {
      // console.log('in')
      // if (!this.inputDom) {
      // this.files = []
      // this.fileName = []
      let f = document.createElement('input')
      f.setAttribute('id', '__FILE_INPUT__')
      f.setAttribute('type', 'file')
      if (this.multiple) {
        f.setAttribute('multiple', this.multipleAttr)
      }
      f.setAttribute('accept', this.acceptAttr)
      f.setAttribute('style', 'display:none')
      document.body.appendChild(f)
      this.inputDom = f
      // console.dir(this.inputDom)
      // }
      this.inputDom.click()
      this.inputDom.addEventListener('change', () => {
        let fileList = this.inputDom.files
        let files = []
        for (let i of Object.keys(fileList)) {
          files.push(fileList[i])
        }
        if (!this.multiple && files.length > 0) {
          files = [files[0]]
        }
        this.files = files
        // this.fileName = this.files.map(f => f.name)
        // console.log('get', fileList, this.fileName)
        // let f = this.inputDom.files[0]
        // let reader = new FileReader()
        // reader.onload = ((theFile) => {
        //   return (e) => {
        //     // Render thumbnail.
        //     let span = document.createElement('span')
        //     span.innerHTML = ['<img class="thumb" src="', e.target.result,
        //       '" title="', escape(theFile.name), '"/>'].join('')
        //     this.getSuccess = true
        //     this.imgDom = span
        //   }
        // })(f)
        //
        // // Read in the image file as a data URL.
        // reader.readAsDataURL(f)
      })
    }
  },
  created () {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      console.error('The File APIs are not fully supported in this browser.')
    }
  },
  mounted () {
    // let dropbox = document.querySelector('#dragArea')
    // dropbox.addEventListener('dragenter', this.dragInBox, false)
  }
}
</script>

<style scoped>

</style>
