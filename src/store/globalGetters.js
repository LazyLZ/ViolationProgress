export default {
  dark (state) {
    return state.$L.dark
  },
  isDevelopment () {
    return process.env.NODE_ENV !== 'production'
  },
  getTab: (state) => (o) => {
    let tabs = state.$L.mainTabItems
    if (typeof o === 'string') {
      return tabs.find(t => t.to === o)
    }
    if (o instanceof Object) {
      let name = o.name
      return tabs.find(t => t.name === name)
    }
  },
  platform (state) {
    return state.$L.platform
  }
}
