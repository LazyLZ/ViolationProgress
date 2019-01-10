import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import 'vuetify/src/stylus/app.styl'
// import zhHans from 'vuetify/es5/locale/zh-Hans'
// import colors from 'vuetify/es5/util/colors'
import directives from 'vuetify/lib/directives'
import cfg from '../config'

Vue.use(Vuetify, {
  theme: {
    primary: '#00C4A4', // 170, 100, 77
    // secondary: '#424242',
    accent: '#00D6B3',
    // error: '#FF5252',
    // info: '#2196F3',
    // success: '#4CAF50',
    // warning: '#FFC107'
  },
  customProperties: true,
  iconfont: 'mdi',
  // lang: {
  //   locales: {zhHans},
  //   current: 'zh-Hans',
  //
  // },
  directives: directives,
  icons: {
    ...cfg.icons,
    'clear': 'mdi-close',
    'close': 'mdi-close',
    'date': 'mdi-calendar-blank',
    'datetime': 'mdi-calendar-today',
    'datetimeDuration': 'mdi-calendar-range',
    'time': 'mdi-clock',
    'file': 'mdi-file',
    'refresh': 'mdi-refresh',
    'filter': 'mdi-filter-variant',
    // test: 'mdi-close-circle',
    // next: 'mdi-chevron-right',
    // prev: 'mdi-chevron-left'
  }
})
