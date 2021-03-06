let navDrawerItems = [
  // // {icon: 'mdi-lightbulb-outline', label: 'Notes'},
  // // {icon: 'mdi-reminder', label: 'Reminders'},
  // // {divider: true},
  // {heading: 'Documents'},
  // {
  //   icon: 'mdi-file-document-box-multiple',
  //   label: 'Components',
  //   to: '/documents/components'
  // },
  // {
  //   icon: 'mdi-function',
  //   label: 'Functions',
  //   to: '/documents/functions'
  // },
  // {
  //   icon: 'mdi-function-variant',
  //   label: 'Store',
  //   to: '/documents/store'
  // },
  // {divider: true},
  // {heading: 'Debug'},
  // {
  //   icon: 'mdi-share-variant',
  //   label: 'Test Router',
  //   children: [
  //     {icon: 'mdi-numeric-1', label: 'Test Router 1', to: '/test-router-parent/test-router-1'},
  //     {icon: 'mdi-numeric-2', label: 'Test Router 2', to: '/test-router-parent/test-router-2'},
  //     {icon: 'mdi-numeric-3', label: 'Test Router 3', to: '/test-router-parent/test-router-3'},
  //   ]
  // },
  // {
  //   access: ['Re'],
  //   hidden: true,
  //   icon: 'mdi-cellphone-android',
  //   label: 'Test Component',
  //   to: '/test-components/test-component-page'
  // }
  {
    development: true,
    icon: 'mdi-file-document-box-multiple',
    label: 'Documents',
    children: [
      {
        icon: 'mdi-file-document-box-multiple',
        label: 'Components',
        to: '/documents/components'
      },
      {
        icon: 'mdi-function',
        label: 'Functions',
        to: '/documents/functions'
      },
      {
        icon: 'mdi-function-variant',
        label: 'Store',
        to: '/documents/store'
      },
    ],
  },
  // {
  //   development: true,
  //   icon: 'mdi-share-variant',
  //   label: 'Test Router',
  //   children: [
  //     {icon: 'mdi-numeric-1', label: 'Test Router 1', to: '/test-router-parent/test-router-1'},
  //     {icon: 'mdi-numeric-2', label: 'Test Router 2', to: '/test-router-parent/test-router-2'},
  //     {icon: 'mdi-numeric-3', label: 'Test Router 3', to: '/test-router-parent/test-router-3'},
  //   ]
  // },
  {
    // hidden: true,
    id: 'developer_config',
    development: true,
    icon: '$vuetify.icons.code',
    label: '开发者选项',
    to: '/developer/config'
  },
  {
    development: true,
    icon: 'mdi-bug',
    label: '测试Debug',
    children: [
      {
        label: '组件调试',
        to: '/test-components/test-component-page'
      },
      {
        label: '系统Bug汇总',
      },
      {
        label: '代码任务汇总',
      },
    ],
  },
  // {
  //   access: 'Home',
  //   icon: 'mdi-home',
  //   label: '系统首页',
  //   to: '/home',
  //   children: [],
  // },
  {
    // access: 'UserAdmin',
    icon: 'mdi-account-multiple',
    label: '用户管理',
    firstShow: 'user_info',
    children: [
      {
        // access: 'User',
        label: '登记用户管理',
        to: '/user-admin/user'
      },
      {
        access: 'Group',
        label: '用户组信息',
        to: '/groupList'
      },
      {
        access: 'Role',
        label: '角色信息',
        to: '/roleList'
      },
      {
        access: 'Org',
        label: '单位管理',
        to: '/orgList'
      },
      {
        access: 'Auth',
        label: '权限管理',
        to: 'permissionList'
      }
    ]
  },
  {
    hidden: true,
    icon: 'mdi-parking',
    label: '停车场区',
    development: true,
    children: [
      {
        label: 'List Item'
      }
    ]
  },
  {
    access: 'VehicleRegister',
    icon: 'mdi-clipboard-check',
    label: '车辆登记',
    to: '/vehicle-register',
    children: [
      {
        access: 'Verify',
        label: '车辆登记审核',
        to: '/vehicle-register'
      },
      {
        access: 'Config',
        label: '登记规则配置',
        to: '/register-config'
      },
      {
        access: 'Search',
        label: '登记车辆查询',
        to: '/search-vehicle'
      },
    ]
  },
  {
    icon: 'mdi-phone-log',
    label: '车辆预约',
    access: 'VisitorReservation',
    children: [
      {
        access: 'Letter',
        label: '函件预约',
        to: '/letterReservation_box',
      },
      {
        access: 'Admin',
        label: '管理预约',
        to: '/admin-reservation'
      },
      {
        access: 'Org',
        label: '单位预约',
        to: '/org-reservation'
      },
      {
        access: 'Person',
        label: '个人预约',
        to: '/person-reservation'
      },
      {
        access: 'Config',
        label: '预约配置',
        // to: '/reservation-config',
        children: [
          {
            label: '全局配置'
          },
          {
            label: '单位配置'
          },
          {
            label: '个人配置'
          },
        ]
      },

    ]
  },
  {
    hidden: true,
    icon: 'mdi-currency-usd',
    label: '停车缴费',
    development: true,
    children: [
      {
        label: '预付款管理'
      },
      {
        label: '收费记录'
      }
    ]
  },
  {
    // access: 'PassControl',
    icon: 'mdi-bus-clock',
    label: '通行管控',
    children: [
      {
        access: 'Authority',
        label: '通行权限配置',
        to: '/pass-authority',
      },
      {
        // access: 'Blacklist',
        label: '冻结车牌管理',
        to: '/pass/blacklist'
      },
    ]
  },
  {
    access: 'ViolationProgress',
    icon: 'mdi-alert',
    label: '违章处理',
    development: true,
    children: [
      {
        development: true,
        access: 'Event',
        label: '违章事件处理',
        to: '/violation/event',
      },
      {
        development: true,
        access: 'Rule',
        label: '违章规则管理',
        to: '/violation/rule'
      },
      {
        hidden: true,
        development: true,
        access: 'Area',
        label: '违章区域管理',
        to: '/violation/area'
      },
      {
        development: true,
        access: 'History',
        label: '历史日志查询',
        to: '/violation/history'
      }
    ]
  },
  {
    // access: 'Message',
    icon: 'mdi-message-bulleted',
    label: '消息管理',
    children: [
      {
        access: 'Template',
        key: 'message_template_management',
        label: '消息模板管理',
        to: '/message-template'
      },
      {
        access: 'Manual',
        label: '消息手动填发',
        to: '/manual-send'
      },
      {
        // access: 'Log',
        label: '消息日志查询',
        to: '/message/history'
      }
    ]
  },
  {
    access: 'Statistics',
    icon: 'mdi-poll-box',
    label: '统计查询',
    children: [
      {
        access: 'SearchVehicle',
        label: '车辆信息查询',
        to: '/statistics/search-vehicle'
      },
      {
        access: 'PassLog',
        label: '通行日志查询',
        to: '/passing-log'
      }
    ]
  },
  {
    // access: 'PassSimulation',
    icon: 'mdi-car',
    label: '通行模拟',
    to: '/pass/simulation',
    children: [],
  }

]
export {navDrawerItems}
