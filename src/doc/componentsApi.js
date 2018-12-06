const APIs = [
  {
    name: 'l-data-table',
    description: '高度封装的列表组件，具备获取数据、筛选、搜索、分页、跳页等功能',
    props: [
      {
        name: 'title-text',
        type: 'string',
        default: '',
        explain: '列表表头文字'
      },
      {
        name: 'headers',
        type: 'Array',
        default: [],
        explain: '列表表头，v-data-table的扩展，与v-data-table同名属性作用相同。\n' +
          '增加属性: maxWidth(string), 超出此宽度将隐藏; tooltip(Boolean): 在鼠标悬浮的时候为该列显示tooltip,tooltip中为数据的完整内容'
      },
      {
        name: 'items',
        type: 'Array',
        default: undefined,
        explain: '作用同v-data-table同名属性但非必须, 若设置此属性将屏蔽get-data函数返回的数据'
      },
      {
        name: 'filter-items',
        type: 'Array',
        default: undefined,
        explain: '筛选选项定义数组, 用于定义筛选输入框和内容, 输入将同步到value属性(*无论该属性是否添加.sync*)。\n' +
          '输入框定义对象：{label, layout, key, value, type, icon, items, itemValue, itemText, hint, returnObject, rules}。\n' +
          '其中，layout的值为字符串数组，字符串为布局类（如xs4,lg6）, key 为该筛选的字段名，value为值，另外，与vuetify中input组件同名属性具有相同功能\n' +
          'type字段支持input、select、textarea、select-date/datetime/time/datetime-duration/weekday'
      },
      {
        name: 'total-items',
        type: 'number',
        default: 0,
        explain: '与v-data-table同名属性作用相同，如果不设置此项，将使用内置排序'
      },
      {
        name: 'item-key',
        type: 'string',
        default: 'id',
        explain: '与v-data-table同名属性作用相同'
      },
      {
        name: 'flat',
        type: 'boolean',
        default: false,
        explain: '去除列表边框阴影'
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: false,
        explain: '在表格的开头以及表头增加复选框，选择的行内容使用v-model获取'
      },
      {
        name: 'clickable',
        type: 'boolean',
        default: false,
        explain: '改变鼠标在列表行上的光标样式，并且点击时触发click-row事件'
      },
      {
        name: 'must-sort',
        type: 'boolean',
        default: true,
        explain: '与v-data-table同名属性作用相同'
      },
      {
        name: 'init-sort-by',
        type: 'string',
        default: '',
        explain: '在第一次获取数据时的排序依据（该列的字段名）'
      },
      {
        name: 'hide-headers',
        type: 'boolean',
        default: false,
        explain: '与v-data-table同名属性作用相同'
      },
      {
        name: 'hide-refresh',
        type: 'boolean',
        default: false,
        explain: '隐藏列表抬头的刷新按钮'
      },
      {
        name: 'hide-title',
        type: 'boolean',
        default: false,
        explain: '隐藏整个列表抬头'
      },
      {
        name: 'hide-actions',
        type: 'boolean',
        default: false,
        explain: '隐藏列表分页控制, 与v-data-table同名属性作用相同'
      },
      {
        name: 'auto-actions',
        type: 'boolean',
        default: false,
        explain: '自动列表控制，当列表数据只有一页时隐藏分页控制'
      },
      {
        name: 'loading',
        type: 'boolean',
        default: false,
        explain: '强制使列表进入加载状态'
      },
      {
        name: 'loading-text',
        type: 'string',
        default: '加载数据中...',
        explain: '加载数据时显示的文字'
      },
      {
        name: 'no-data-text',
        type: 'string',
        default: '没有数据',
        explain: '没有数据时显示的文字'
      },
      {
        name: 'no-results-text',
        type: 'string',
        default: '未检索到相关结果',
        explain: '没有检索到数据时（没有数据且搜索不为空或total-items不为0）显示的文字'
      },
      {
        name: 'search-text',
        type: 'string',
        default: '搜索',
        explain: '列表抬头搜索输入框的Label'
      },
      {
        name: 'get-data-func',
        type: 'Function',
        default: undefined,
        explain: '获取数据时调用的函数，({pagination, filterItems, sortStack, search, titleSwitch}, payload): {items, amount}。\n' +
          '该函数的第一个参数为一个对象，属性对应列表的分页、筛选、排序、搜索数据、表头switch, 第二个值为载荷, 调用refreshData函数时传入。\n' +
          '返回值为一个对象，对象的items属性是数据数组，amount为数据总数。\n' +
          '该函数需要在组件外编写并传入，传入后不需要items和total-items属性, 推荐实现该函数而不是使用items和total-items'
      },
      {
        name: 'persistent-filter',
        type: 'boolean',
        default: false,
        explain: '一直显示filter并隐藏filter按钮'
      },
      {
        name: 'error',
        type: 'boolean',
        default: false,
        explain: '强制设置列表进入error状态'
      },
      {
        name: 'error-message',
        type: 'string',
        default: '',
        explain: '错误信息，在error属性为true时显示'
      },
      {
        name: 'title-switch',
        type: 'Boolean || Object',
        default: undefined,
        explain: '在列表抬头文字右侧显示一个switch作为特殊的筛选条件，对应在get-data-func的第一个参数对象中增加titleSwitch字段'
      },
      {
        name: 'title-switch-label',
        type: 'string',
        default: '',
        explain: '控制titleSwitch的label属性'
      }
    ],
    slots: [
      {
        name: 'title',
        explain: '列表抬头，注意该插槽只覆盖抬头的左边，右边的功能按钮不会覆盖，若想完全覆盖请配合hide-refresh等属性',
      },
      {
        name: 'title-search',
        explain: '列表抬头右侧的搜索文本框',
      },
      {
        name: 'title-action',
        explain: '在列表抬头最右侧，建议使用icon型(md icon为more_vertical)的v-btn',
      },
      {
        name: 'filter',
        explain: '筛选插槽，将覆盖默认的筛选区域内容',
      },
    ],
    scopedSlots: [
      {
        name: 'row-action',
        explain: '行操作插槽，该插槽将渲染为列表最后一列，请在headers中设置对应表头',
        props: '{index, item, selected}',
      }
    ],
    events: [
      {
        name: 'click-row',
        explain: '当clickable属性设置为true时，点击单行将触发该事件，该事件返回该行数据描述对象',
        value: '{item, index, selected}',
      },
      {
        name: 'select',
        explain: '绑定到v-model的事件',
        value: 'Array',
      }
    ],
    functions: [
      {
        name: 'resetData',
        explain: '手动调用get-data-func传入的函数更新数据, 该函数的第一个参数若为true则会重置列表的分页和排序, 第二个参数为载荷; 返回值同get-data-func',
        signature: '(Boolean, Object): {items, amount}',
      }
    ]
  },
  {
    name: 'l-select-file',
    description: 'Vuetify输入风格的选择文件组件，支持单选、多选、类型限制',
    props: [
      {
        name: 'value',
        default: undefined,
        type: 'Array',
        explain: 'v-model绑定的属性，*注意*: 组件上传的值为数组(不是FileList/File)，无论是否为multiple'
      },
      {
        name: 'flat',
        type: 'boolean',
        default: false,
        explain: '用于调整按钮型选择的外观，与v-btn同名属性作用相同',
        deprecated: true
      },
      {
        name: 'small',
        type: 'boolean',
        default: false,
        explain: '用于调整按钮型选择的外观，与v-btn同名属性作用相同',
        deprecated: true
      },
      {
        name: 'large',
        type: 'boolean',
        default: false,
        explain: '用于调整按钮型选择的外观，与v-btn同名属性作用相同',
        deprecated: true
      },
      {
        name: 'medium',
        type: 'boolean',
        default: false,
        explain: '用于调整按钮型选择的外观，与v-btn同名属性作用相同',
        deprecated: true
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: false,
        explain: '用于多选文件，*注意* 无论是否多选，返回的值始终是数组',
      },
      {
        name: 'select-type',
        type: 'string',
        default: 'button',
        explain: '选框的类型，可选 button、input、dialog。其中button仅提供activator插槽，监听点击事件'
      },
      {
        name: 'file-type',
        type: 'string',
        default: '',
        explain: '用于指定选择文件的类型，支持大部分常用类型(word,ppt,excel,text,image,video,audio)，具体可查看组件代码'
      },
      {
        name: 'label',
        type: 'string',
        default: '选择文件',
        explain: 'dialog中选择文件按钮的文字，或者input类型input的label'
      },
      {
        name: 'color',
        type: 'string',
        default: 'primary',
        explain: '用于调整按钮型选择的外观，与v-btn同名属性作用相同',
        deprecated: true
      },
      {
        name: 'prepend-icon',
        type: 'string',
        default: 'description',
        explain: 'input类型的前置icon'
      },
      {
        name: 'hint',
        type: 'string',
        default: '',
        explain: '与vuetify Inputs中作用相同，在dialog和input类型显示'
      },
      {
        name: 'rules',
        type: 'Array',
        default: [],
        explain: '与vuetify Inputs组件中同名属性作用相同'
      },
      {
        name: 'dialog-props',
        type: 'Object',
        default: '{maxHeight: \'600px\', maxWidth: \'\', autoClose: true, activate: false, loading: false}',
        explain: '用于dialog显示属性控制，\n' +
          '其中maxHeight指定dialog内容部分最大高度；maxWidth指定dialog宽度；autoClose控制dialog是否自动关闭；\n' +
          'activate控制dialog显示与否（不完全绑定，可能会被内部修改）；loading将使dialog进入loading状态（抬头有进度条，确定按钮loading）'
      },
      {
        name: 'dialog-title-text',
        type: 'string',
        default: '选择文件',
        explain: 'dialog title文字'
      },
      {
        name: 'dark',
        type: 'boolean',
        default: false,
        explain: '控制主题，组件内部会自动检测$store.state中的dark状态，如果有该状态则不必绑定此属性'
      },
      {
        name: 'clear-dialog-data',
        type: 'boolean',
        default: true,
        explain: '每次打开dialog是否清空上次填入的数据，清空时会提交input事件但不会提交submit事件'
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: false,
        explain: '设置输入为只读'
      }
    ],
    slots: [
      {
        name: 'default',
        explain: '默认的slot将渲染在dialog的title下，拖动文件区域上方',
      },
      {
        name: 'activator',
        explain: '同vuetify中activator插槽',
      },
      {
        name: 'title',
        explain: 'dialog抬头',
      },
      {
        name: 'before-drag',
        explain: '在dialog拖拽文件区域上方，默认插槽下方',
      },
      {
        name: 'after-drag',
        explain: '在dialog拖拽文件区域下方',
      },
    ],
    events: [
      {
        name: 'input',
        explain: 'v-model绑定的事件，值为选中文件数组',
        value: 'Array: [File]',
      },
      {
        name: 'submit',
        explain: '在选择完成时触发，dialog模式下则是在点击确认按钮后触发',
        value: 'Array: [File]',
      },
      {
        name: 'cancel',
        explain: 'dialog模式下，在点击取消按钮时触发',
        value: undefined,
      }
    ],
    functions: [
      {
        name: 'open',
        explain: '手动打开选择文件控件，可以代替button模式下的activator插槽',
        signature: '(): undefined',
      }
    ]
  },
  {
    name: 'l-image-placeholder',
    description: '图片显示组件，推荐用于缩略图，支持loading、错误显示、操作插槽',
    props: [
      {
        name: 'dark',
        type: 'boolean',
        default: false,
        explain: '控制主题，组件内部会自动检测$store.state中的dark状态，如果有该状态则不必绑定此属性'
      },
      {
        name: 'src',
        type: 'string',
        default: '',
        explain: '作用同img标签的src属性'
      },
      {
        name: 'loading',
        type: 'boolean',
        default: false,
        explain: '进入loading状态，显示loading加载条和文字'
      },
      {
        name: 'progress',
        type: 'number',
        explain: '0-100的整数，如果设置了该属性，加载进度条将显示进度'
      },
      {
        name: 'error',
        type: 'boolean',
        default: false,
        explain: '强制进入错误模式'
      },
      {
        name: 'error-message',
        type: 'string',
        default: '',
        explain: '错误模式下显示的信息'
      },
      {
        name: 'width',
        type: 'string',
        default: '200px',
        explain: '组件宽度，必须是style属性可接受的值'
      },
      {
        name: 'height',
        type: 'string',
        default: '200px',
        explain: '组件高度，必须是style属性可接受的值'
      },
      {
        name: 'hide-actions',
        type: 'boolean',
        default: false,
        explain: '强制隐藏Action,即使使用了action插槽'
      },
      {
        name: 'error-title',
        type: 'string',
        default: '加载错误',
        explain: '错误模式下的标题文字'
      },
      {
        name: 'loading-title',
        type: 'string',
        default: '加载中',
        explain: '加载模式下的加载文字'
      },
      {
        name: 'no-image-text',
        type: 'string',
        default: '没有图像',
        explain: '没有图像时显示的文字'
      }
    ],
    slots: [
      {
        name: 'action',
        explain: '在图像下边缘显示一个浮动的48px高度的bar，用于添加操作，推荐使用icon型按钮'
      }
    ]
  },
  {
    name: 'l-image-view-dialog',
    description: '图片显示弹窗，用于点击缩略图查看大图，仅用于显示图片，不在dialog中加入任何操作',
    props: [
      {
        name: 'src',
        type: 'string | Array',
        default: '',
        explain: '作用同img的src属性，但是可以是src的数组，用于显示多张图像'
      },
      {
        name: 'value',
        type: 'boolean',
        default: false,
        explain: '绑定v-model的属性，控制dialog显示'
      },
      {
        name: 'max-height',
        type: 'string',
        default: '600px',
        explain: '控制dialog的最大高度，此值必须为style可接受的值'
      },
      {
        name: 'max-width',
        type: 'string',
        default: '700px',
        explain: '控制dialog的最大宽度，此值必须为style可接受的值'
      },
      {
        name: 'height',
        type: 'string',
        default: '100%',
        explain: '指定dialog的高度，此值必须为style可接受的值'
      },
      {
        name: 'dark',
        type: 'boolean',
        default: false,
        explain: '控制主题，组件内部会自动检测$store.state中的dark状态，如果有该状态则不必绑定此属性'
      },
      {
        name: 'title-text',
        type: 'string',
        default: '查看图片',
        explain: 'dialog title 文字'
      },
      {
        name: 'no-image-text',
        type: 'string',
        default: '没有图像',
        explain: '没有图像时显示的文字'
      },
      {
        name: 'loading-title',
        type: 'string',
        default: '加载中',
        explain: '加载图像时显示的文字'
      },
      {
        name: 'close-text',
        type: 'string',
        default: '关闭',
        explain: '关闭dialog按钮的文字'
      },
    ],
    slots: [
      {
        name: 'activator',
        explain: '同vuetify中activator插槽',
      },
      {
        name: 'title',
        explain: 'dialog抬头',
      },
      {
        name: 'prepend',
        explain: '将渲染在图像上方',
      },
      {
        name: 'append',
        explain: '将渲染在图像下方',
      },
    ]
  },
  {
    name: 'l-plate-picker',
    description: '统一车牌输入，以便之后统一更改车牌输入模式以兼容特殊车牌类型',
    props: [
      {
        name: 'value',
        type: 'string',
        default: undefined,
        explain: '绑定v-model的属性'
      },
      {
        name: 'label',
        type: 'string',
        default: '车辆号牌',
        explain: '同v-text-field同名属性'
      },
      {
        name: 'hint',
        type: 'string',
        default: '',
        explain: '同v-text-field同名属性'
      },
      {
        name: 'required',
        type: 'boolean | string',
        default: false,
        explain: '当required为truthy时该输入框的值为falsy将进入error状态，required为字符串时字符串的内容将作为错误信息'
      },
      {
        name: 'restrict',
        type: 'boolean',
        default: true,
        explain: '是否进行车牌格式验证'
      },
      {
        name: 'error',
        type: 'boolean',
        default: false,
        explain: '同v-text-field同名属性'
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: false,
        explain: '同v-text-field同名属性'
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: false,
        explain: '同v-text-field同名属性'
      },
      {
        name: 'autofocus',
        type: 'boolean',
        default: false,
        explain: '同v-text-field同名属性'
      },
      {
        name: 'error-messages',
        type: 'string | Array',
        default: [],
        explain: '同v-text-field同名属性'
      },
      {
        name: 'rules',
        type: 'Array',
        default: [],
        explain: '同v-text-field同名属性'
      },
      {
        name: 'validate-on-blur',
        type: 'boolean',
        default: true,
        explain: '同v-text-field同名属性'
      },
      {
        name: 'prepend-icon',
        type: 'string',
        default: 'directions_car',
        explain: '同v-text-field同名属性'
      },
    ],
  }
]
export {
  APIs
}
