let HOST = 'http://192.168.1.105:8080'
// let HOST = 'https://mva.uestc.edu.cn'
module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    // host: '192.168.2.239',
    proxy: {
      '/api': {
        target: HOST,
        // target: 'https://mva.uestc.edu.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      // '/violationApi': {
      //   target: `${HOST}:6395`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/violationApi': ''
      //   }
      // },
      // '/messageApi': {
      //   target: `${HOST}:6394`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/messageApi': ''
      //   }
      // },
      // '/passApi': {
      //   target: `${HOST}:6393`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/passApi': ''
      //   },
      // },
      // '/shiroApi': {
      //   target: `${HOST}:6396`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/shiroApi': ''
      //   },
      // },
      // '/verifyApi': {
      //   target: `${HOST}:6392`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/verifyApi': ''
      //   },
      // },
      // '/SSO': {
      //   target: `${HOST}:6396`,
      //   // 是否跨域
      //   changeOrigin: true,
      //   pathRewrite: {
      //     // 需要rewrite重写的
      //     '^/SSO': '/'
      //   }
      // },
      // '/ROC': {
      //   target: `${HOST}:6391/roc`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/ROC': '/'
      //   }
      // },
    }
  }
}
