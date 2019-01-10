import F from '../utils/functional'

let availablePlatform = {
  'Linux': true,
  'Mac68K': true,
  'MacPPC': true,
  'Macintosh': true,
  'MacIntel': true,
  'Win32': true,
  'Win64': true,
  // 'WinCE': false,
  'Windows': true,
  'iPhone': true,
  'iPad': true,
  'Android': true,
}

export default {
  setDark (state) {
    state.$L.dark = !state.$L.dark
  },
  checkPlatform (state) {
    let p = navigator.platform
    if (!p) return
    let platform = 'Unknown'
    for (let key of Object.keys(availablePlatform)) {
      if (p.indexOf(key) !== -1) {
        platform = key
        break
      }
    }
    let s = state.$L.platform
    s.name = platform
    if (availablePlatform[platform]) {
      switch (platform) {
        case 'Linux':
          s.isLinux = true
          break
        case 'Mac68K':
          s.isMacOS = true
          break
        case 'MacPPC':
          s.isMacOS = true
          break
        case 'Macintosh':
          s.isMacOS = true
          break
        case 'MacIntel':
          s.isMacOS = true
          break
        case 'Win32':
          s.isWindows = true
          break
        case 'Win64':
          s.isWindows = true
          break
        case 'Windows':
          s.isWindows = true
          break
        case 'iPhone':
          s.isIPhone = true
          break
        case 'iPad':
          s.isIPad = true
          break
        case 'Android':
          s.isAndroid = true
          break
      }
      s.isIOS = s.isIPad || s.isIPhone
      s.isApple = s.isIOS || s.isMacOS
    }
  },
  closeTab (state, i) {
    let $L = state.$L
    let index
    if (typeof i === 'number') {
      index = i
    }
    if (typeof i === 'string') {
      index = $L.mainTabItems.findIndex(tab => tab.to === i)
    }
    console.log('close tab ', i, index, $L.mainTabItems.map(tab => tab.to))
    if (index >= 0) {
      $L.lastCloseTab = $L.mainTabItems[index]
      $L.mainTabItems.splice(index, 1)
      F.saveToLocal('$mainTabItems', $L.mainTabItems)
    }
  },
  routerInTab (state, callback) {
    state.$L.replaceTabNext = true
    if (callback instanceof Function) {
      callback()
    }
  },
}
