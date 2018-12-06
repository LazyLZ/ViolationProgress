import Main from '../components/Main/main'
import helloWorld from '../views/testPage/helloWorld'
import testRouter1 from '../views/testPage/testRouter1'
import login from '../views/Login/login'
import notFound from '../views/Error/notFound'
import accessDeny from '../views/Error/accessDeny'
import ParentView from '../components/Layout/parentView'
// let pageDefine = [
//   {divider: true, header: 'subheading'},
//   {
//     icon: '',
//     id: '',
//     label: '', // 显示在tab，面包屑，导航栏的名字
//
//     // 后置在label后的文本，为了特殊标识路由，字符串为属性名（如params.id）则定位到router中的变量
//     // 判定: 以. 为分隔，若route[第一个属性名]为falsy，则使用整个字符串直接做为文本，否则取属性值转换为文本（falsy转换为空串）
//     subText: '',
//     persistent: false, // 持久tab，不可关闭，tab在最左侧
//     showFooter: false, // 显示系统footer
//     recoverable: false, // 刷新浏览器时是否重新加载此tab
//     hideInMenu: false, // 在侧边导航中隐藏
//     hideInBread: false, // 在侧边导航中隐藏
//     noLoginRequired: false,
//     access: [],
//     router: {
//       // 同router配置
//     },
//     drawer: {
//       icon: '', // 特殊icon
//       label: '',
//       to: '',
//       hidden: false,
//     },
//     bread: {
//       icon: '', // 特殊icon
//       label: '',
//       hidden: false,
//     },
//     children: [],
//   }
// ]
// const routes = {
//   // 正常设置
// }
// const navDrawerItems = [
//   {
//     id: '',
//     name: '',
//     icon: '',
//     to: '',
//     index: 3, // 排到指定位置
//     insertBefore: '' // 指定id
//   },
//   {divider: true, header: 'subheading'},
// ]

// 直接导出为路由
export default [
  {
    path: '/',
    name: 'L',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: helloWorld,
        meta: {
          label: '首页',
          subText: '',
          icon: 'mdi-home',
          persistent: true, // 持久tab，不可关闭，tab在最左侧
          // showFooter: true, // 显示系统footer
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
  {
    path: '/login',
    name: 'Login',
    component: login,
    meta: {
      persistent: true, // 持久tab，不可关闭，tab在最左侧
      showFooter: false, // 显示系统footer
      hideInMenu: true, // 在侧边导航中隐藏
      hideInBread: true, // 在侧边导航中隐藏
      noLoginRequired: true, // 无需登录即可进入
      access: [], // 页面权限数组
    }
  },
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
        component: testRouter1,
        meta: {
          label: '固定页面',
          // persistent: true
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
                component: () => import('../views/testPage/detailsPage'),
                meta: {
                  label: '违章事件详情',
                  subText: 'query.id',
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
        component: resolve => require(['../views/testPage/testRouter2'], resolve),
        meta: {
          label: '违章事件处理'
        },
        children: [
          {
            path: 'details-:id',
            name: 'TestDetailsParams',
            component: () => import('../views/testPage/paramsPage'),
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
        component: () => import('../views/testPage/testRouter3')
      },
    ],
  },
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
        component: () => import('../views/testPage/testComponents'),
        meta: {
          label: '组件调试',
          icon: 'mdi-cellphone-android'
        }
      }
    ]
  },
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
        component: () => import('../views/Documents/componentsDoc'),
        meta: {
          label: '通用组件',
          icon: 'mdi-file-document-box-multiple'
        }
      },
      {
        name: 'FunctionsDoc',
        path: 'functions',
        component: () => import('../views/Documents/functionsDoc'),
        meta: {
          label: '通用函数',
          icon: 'mdi-function'
        }
      },
      {
        name: 'StoreDoc',
        path: 'store',
        component: () => import('../views/Documents/storeDoc'),
        meta: {
          label: '通用状态',
          icon: 'mdi-function-variant'
        }
      },
    ]
  },
  {
    path: '*',
    redirect: '/not-found'
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: notFound,
  },
  {
    path: '/access-deny',
    name: 'AccessDeny',
    component: accessDeny,
  },
]
