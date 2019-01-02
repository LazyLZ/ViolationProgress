export default {
  dark (state) {
    return state.$L.dark
  },
  isDevelopment () {
    return process.env.NODE_ENV !== 'production'
  },
  platform (state) {
    return state.$L.platform
  }
}
