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
    let platform = '__UNKNOWN__'
    for (let key of Object.keys(availablePlatform)) {
      if (p.indexOf(key) !== -1) {
        platform = key
        break
      }
    }
    if (availablePlatform[platform]) {
      let s = state.$L.platform
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
  }
}
