import Main from '../views/main'
// import helloWorld from '../views/testPage/helloWorld'
// import testRouter1 from '../views/testPage/testRouter1'
import login from '../views/Login/login'
import notFound from '../views/Error/notFound'
import accessDeny from '../views/Error/accessDeny'
import ParentView from '../components/Layout/parentView'
// import newUser from '../views/UserAdmin/User/newUser'
import {startLoading, stopLoading} from './loading'
//
// let resolveComponent = (path, loading = true) => {
//   return resolve => {
//     startLoading()
//     require([path], c => {
//       stopLoading()
//       resolve(c)
//     })
//   }
// }

// 直接导出为路由
export default [
  /* -------------- 首页 -------------- */
  {
    path: '/',
    name: 'L',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "test" */ '../views/Home/homePage'),
        meta: {
          label: '首页',
          subText: '',
          icon: 'mdi-home',
          persistent: true, // 持久tab，不可关闭，tab在最左侧
          showFooter: true, // 显示系统footer
          recoverable: false, // 刷新浏览器时是否重新加载此tab
          hideInMenu: false, // 在侧边导航中隐藏
          hideInBread: false, // 在侧边导航中隐藏
          noLoginRequired: false, // 无需登录即可进入
          access: [], // 页面权限数组
        }
      }
    ],
    meta: {
      hideInBread: true,
    }
  },
  /* -------------- 登录 -------------- */
  {
    path: '/login',
    name: 'Login',
    component: login,
    meta: {
      persistent: true, // 持久tab，不可关闭，tab在最左侧
      showFooter: false, // 显示系统footer
      singlePage: true, // 不在Main中显示
      hideInMenu: true, // 在侧边导航中隐藏
      hideInBread: true, // 在侧边导航中隐藏
      noLoginRequired: true, // 无需登录即可进入
      access: [], // 页面权限数组
    }
  },
  /* -------------- 个人中心 ----------- */
  {
    path: '/personal-center',
    name: 'PersonalCenter',
    component: () => import(/* webpackChunkName: "personal" */ '../views/PersonalCenter/personalCenter'),
    meta: {
      singlePage: true, // 不在Main中显示
    }
  },
  /* -------------- 通知中心 ----------- */
  {
    path: '/notification',
    name: 'Notification',
    component: () => import(/* webpackChunkName: "personal" */ '../views/Notification/notificationCenter'),
    meta: {
      singlePage: true, // 不在Main中显示
    }
  },
  /* -------------- 开发者 ------------- */
  {
    path: '/developer',
    name: 'Developer',
    component: Main,
    meta: {
      hideInBread: true,
      disabled: true
    },
    children: [
      {
        path: 'config',
        name: 'DeveloperConfig',
        component: () => import(/* webpackChunkName: "test" */ '../views/Developer/developerConfig'),
        meta: {
          label: '开发者选项',
          icon: '$vuetify.icons.code'
        }
      },
    ]
  },
  /* -------------- 路由测试 ----------- */
  {
    path: '/test-router-parent',
    name: 'TestRouterParent',
    component: Main,
    meta: {
      label: '违章处理',
      disabled: true
    },
    children: [
      {
        path: 'test-router-1',
        name: 'TestRouter1',
        component: () => import(/* webpackChunkName: "test" */ '../views/testPage/testRouter1'),
        meta: {
          label: '固定页面',
        }
      },
      {
        path: 'test-router-2',
        name: 'TestDetailsParent',
        redirect: {name: 'TestRouter2'},
        component: ParentView,
        meta: {
          label: '违章事件处理',
          // subText: 'query.id'
        },
        children: [
          {
            path: 'admin',
            name: 'TestDetailsSecondParent',
            component: ParentView,
            meta: {
              label: '管理员处理',
              disabled: true
            },
            children: [
              {
                path: 'details',
                name: 'TestDetails',
                component: () => import(/* webpackChunkName: "test" */ '../views/testPage/detailsPage'),
                meta: {
                  label: '违章事件详情',
                  subText: 'query.id',
                  cacheKey: 'query.id',
                  beforeCloseName: 'defaultBeforeClose'
                }
              }
            ]
          }
        ]
      },
      {
        path: 'test-router-2',
        name: 'TestRouter2',
        component: resolve => {
          startLoading()
          require(['../views/testPage/testRouter2'], c => {
            stopLoading()
            resolve(c)
          })
        },
        meta: {
          label: '违章事件处理'
        },
        children: [
          {
            path: 'details-:id',
            name: 'TestDetailsParams',
            component: () => import(/* webpackChunkName: "test" */ '../views/testPage/paramsPage'),
            meta: {
              label: '违章事件上报',
              subText: 'params.id'
            }
          },
        ]
      },
      {
        path: 'test-router-3',
        name: 'TestRouter3',
        component: () => import(/* webpackChunkName: "test" */ '../views/testPage/testRouter3')
      },
    ],
  },
  /* -------------- 组件调试 ----------- */
  {
    path: '/test-components',
    name: 'TestComponentsParent',
    component: Main,
    meta: {
      hideInBread: true,
      disabled: true,
    },
    children: [
      {
        name: 'TestComponents',
        path: 'test-component-page',
        component: () => import(/* webpackChunkName: "test" */ '../views/testPage/testComponents'),
        meta: {
          label: '组件调试',
          icon: 'mdi-cellphone-android'
        }
      }
    ]
  },
  /* -------------- 系统文档 ----------- */
  {
    path: '/documents',
    component: Main,
    name: 'Documents',
    meta: {
      disabled: true,
      label: '文档'
    },
    children: [
      {
        name: 'ComponentsDoc',
        path: 'components',
        component: () => import(/* webpackChunkName: "test" */ '../views/Documents/componentsDoc'),
        meta: {
          label: '通用组件',
          icon: 'mdi-file-document-box-multiple'
        }
      },
      {
        name: 'FunctionsDoc',
        path: 'functions',
        component: () => import(/* webpackChunkName: "test" */ '../views/Documents/functionsDoc'),
        meta: {
          label: '通用函数',
          icon: 'mdi-function'
        }
      },
      {
        name: 'StoreDoc',
        path: 'store',
        component: () => import(/* webpackChunkName: "test" */ '../views/Documents/storeDoc'),
        meta: {
          label: '通用状态',
          icon: 'mdi-function-variant'
        }
      },
    ]
  },
  /* -------------- 用户管理 ----------- */
  {
    path: '/user-admin',
    name: 'UserAdmin',
    component: Main,
    meta: {
      disabled: true,
      hideInBread: true,
      label: '用户管理'
    },
    children: [
      {
        name: 'UserList',
        path: 'user',
        component: () => import(/* webpackChunkName: "useradmin" */ '../views/UserAdmin/User/userManagement'),
        meta: {
          label: '登记用户管理',
          icon: 'mdi-account'
        },
      },
      {
        name: 'UserDetailsParent',
        path: 'user',
        redirect: {name: 'UserList'},
        component: ParentView,
        meta: {
          label: '登记用户管理',
          icon: 'mdi-account'
        },
        children: [
          {
            name: 'UserDetails',
            path: ':loginId/readonly',
            component: () => import(/* webpackChunkName: "useradmin" */ '../views/UserAdmin/User/userDetails'),
            props: true,
            meta: {
              label: '用户详情',
              subText: 'params.loginId',
              cacheKey: 'query.id'
            },
          },
          {
            name: 'NewUser',
            path: 'new',
            component: () => import(/* webpackChunkName: "useradmin" */ '../views/UserAdmin/User/newUser'),
            // component: newUser,
            props: true,
            meta: {
              label: '新增用户',
              beforeCloseName: 'defaultBeforeClose'
            },
          },
          {
            name: 'EditUser',
            path: ':loginId/edit',
            component: () => import(/* webpackChunkName: "useradmin" */ '../views/UserAdmin/User/editUser'),
            // component: newUser,
            props: true,
            meta: {
              label: '编辑用户',
              subText: 'params.loginId',
              cacheKey: 'query.id',
            },
          }
        ]
      },
    ]
  },
  /* -------------- 违章处理 -------------- */
  {
    path: '/violation',
    name: 'Violation',
    component: Main,
    meta: {
      disabled: true,
      label: '违章处理'
    },
    children: [
      {
        name: 'ViolationEventManagement',
        path: 'event',
        component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Event/management'),
        meta: {
          label: '违章事件处理',
        },
      },
      {
        name: 'ViolationEventParent',
        path: 'event',
        redirect: {name: 'ViolationEventManagement'},
        component: ParentView,
        meta: {
          label: '违章事件处理',
        },
        children: [
          {
            name: 'ViolationEventDetails',
            path: ':plate/readonly',
            component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Event/details'),
            props: true,
            meta: {
              label: '事件详情',
              subText: 'params.plate',
              cacheKey: 'query.id'
            },
          },
          {
            name: 'ViolationEventSubmit',
            path: 'new',
            component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Event/submit'),
            // component: newUser,
            props: true,
            meta: {
              label: '上报事件',
              beforeCloseName: 'defaultBeforeClose'
            },
          },
          {
            name: 'ViolationEventPreliminary',
            path: ':plate/handle/preliminary',
            component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Event/handle'),
            props: true,
            meta: {
              label: '初步处理',
              subText: 'params.plate',
              cacheKey: 'query.id',
            },
          },
          {
            name: 'ViolationEventFinal',
            path: ':plate/handle',
            component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Event/finalHandle'),
            props: true,
            meta: {
              label: '最终确认',
              subText: 'params.plate',
              cacheKey: 'query.id',
            },
          }
        ]
      },
      {
        name: 'ViolationRuleManagement',
        path: 'rule',
        component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Rule/management'),
        meta: {
          label: '违章规则管理',
        },
      },
      {
        name: 'ViolationRuleParent',
        path: 'rule',
        redirect: {name: 'ViolationRuleManagement'},
        component: ParentView,
        meta: {
          label: '违章规则管理',
        },
        children: [
          {
            name: 'ViolationRuleDetails',
            path: ':name/readonly',
            component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Rule/details'),
            props: true,
            meta: {
              label: '违章规则',
              subText: 'params.name',
              cacheKey: 'query.id'
            },
          },
          {
            name: 'NewViolationRule',
            path: 'new',
            component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Rule/newRule'),
            // component: newUser,
            props: true,
            meta: {
              label: '新增违章规则',
              beforeCloseName: 'defaultBeforeClose'
            },
          },
          {
            name: 'EditViolationRule',
            path: ':name/edit',
            component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/Rule/editRule'),
            props: true,
            meta: {
              label: '编辑规则',
              subText: 'params.name',
              cacheKey: 'query.id',
            },
          }
        ]
      },
      {
        name: 'ViolationHistory',
        path: 'history',
        component: () => import(/* webpackChunkName: "violation" */ '../views/Violation/History/history'),
        meta: {
          label: '违章历史查询',
        },
      }
    ]
  },
  /* -------------- 消息管理 ----------- */
  {
    name: 'MessageManagement',
    path: '/message',
    component: Main,
    meta: {
      disabled: true,
      label: '消息管理',
    },
    children: [
      {
        name: 'MessageSendHistory',
        path: 'history',
        component: () => import(/* webpackChunkName: "message" */ '../views/Message/History/history'),
        meta: {
          label: '发信历史',
        },
      }
    ]
  },
  /* -------------- 通行管控 ----------- */
  {
    name: 'PassControl',
    path: '/pass',
    component: Main,
    meta: {
      disabled: true,
      label: '通行管控',
    },
    children: [
      {
        name: 'PassSimulation',
        path: 'simulation',
        component: () => import(/* webpackChunkName: "pass" */ '../views/Pass/Simulation/passSimulation'),
        meta: {
          label: '通行模拟',
        },
      },
      {
        name: 'BlackList',
        path: 'blacklist',
        component: () => import(/* webpackChunkName: "pass" */ '../views/Pass/Blacklist/blacklist'),
        meta: {
          label: '冻结车牌管理',
        },
      }
    ]
  },
  /* -------------- 404 -------------- */
  {
    path: '*',
    redirect: '/not-found'
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: notFound,
    meta: {
      singlePage: true, // 不在Main中显示
    }
  },
  /* -------------- 401 -------------- */
  {
    path: '/access-deny',
    name: 'AccessDeny',
    component: accessDeny,
    meta: {
      singlePage: true, // 不在Main中显示
    }
  },
]
