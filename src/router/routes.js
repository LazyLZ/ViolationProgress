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
  {
    path: '/',
    name: 'L',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "test" */ '../views/testPage/helloWorld'),
        meta: {
          label: '首页',
          subText: '',
          icon: 'mdi-home',
          disabled: true, // 面包屑不能点击
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
      singlePage: true, // 不在Main中显示
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
        component: () => import(/* webpackChunkName: "test" */ '../views/testPage/testRouter1'),
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
  {
    path: '/user-admin',
    name: 'UserAdmin',
    component: Main,
    meta: {
      disabled: true,
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
        // redirect: {name: 'UserList'},
        component: ParentView,
        meta: {
          label: '登记用户管理',
          icon: 'mdi-account'
        },
        children: [
          {
            name: 'UserDetails',
            path: 'readonly-:loginId',
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
            path: 'edit-:loginId',
            component: () => import(/* webpackChunkName: "useradmin" */ '../views/UserAdmin/User/editUser'),
            // component: newUser,
            props: true,
            meta: {
              label: '编辑用户',
              subText: 'params.loginId',
              cacheKey: 'query.id',
              beforeCloseName: 'defaultBeforeClose'
            },
          }
        ]
      },
    ]
  },
  {
    path: '/violation',
    name: 'ViolationParent',
    component: Main,
    children: [
      {
        path: 'event',
        component: () => import(/* webpackChunkName: "violationEvent" */ '../views/ViolationEvent/violationEvent'),
        name: 'ViolationEvent',
        meta: {
          label: '违章事件处理',
        },
      },
      {
        path: 'event',
        name: 'ViolationEventParent',
        redirect: {name: 'ViolationEvent'},
        component: ParentView,
        meta: {
          label: '违章事件处理',
        },
        children: [
          {
            path: 'details-:carNumber',
            name: 'ViolationDetails',
            props: true,
            meta: {
              label: '违章详情',
              subText: 'params.carNumber'
            },
            component: () => import(/* webpackChunkName: "violationEvent" */ '../views/ViolationEvent/violationEventDetails'),
          }
        ]
      }
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
    meta: {
      singlePage: true, // 不在Main中显示
    }
  },
  {
    path: '/access-deny',
    name: 'AccessDeny',
    component: accessDeny,
    meta: {
      singlePage: true, // 不在Main中显示
    }
  },
]
