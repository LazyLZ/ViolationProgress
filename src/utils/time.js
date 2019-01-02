let cnShort = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
let cnLong = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
let cnNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
let AM = 'am'
let PM = 'pm'

function preZero (s, n) {
  if (!isNaN(n)) {
    return s.toString().padStart(2, '0')
  }
  else {
    return '0'.repeat(n)
  }
}

function to24 (l, p) {
  if (Number(l) === 12) {
    if (p === AM) {
      return '12'
    }
    else {
      return '00'
    }
  }
  if (p === AM) {
    return l
  }
  else {
    return preZero(Number(l) + 12 + '', 2)
  }
}

let transRegMap = {
  '%a': '(周[一二三四五六日])', // 本地简化星期
  '%A': '(星期[一二三四五六日])', // 本地完整星期
  '%b': `([${cnNumber.slice(1).join('')}]月)`, // 本地简化月份名称
  '%B': `([${cnNumber.slice(1).join('')}]月)`, // 本地完整月份名称
  // '%c' 本地相应的日期和时间表示
  '%d': '([123][0-9]|0[0-9])', // 一个月中的第几天(01-31)
  '%H': '([0-1][0-9]|2[0-3])', // 一天中的第几个小时(24小时制，00-23)
  '%l': '(0[1-9]|1[0-2])', //  一天中的第几个小时(12小时制，01-12)
  // '%j': d => d.getFullYear(), // 一年中的第几天(01-366)
  '%m': '(0[1-9]|1[0-2])', // 月份(01-12)
  '%M': '([0-5][0-9])', // 分钟数(00-59)
  '%p': `(${AM}|${PM})`, // 本地am或者pm的相应符
  '%S': '([0-5][0-9]|6[01])', // 秒(01-61)
  // '%U': d => d.getW     一年中的星期数(00-53,星期天是一个星期的开始,第一个星期天之前的所有天数都放在第０周)
  '%w': '([0-6])', // 一个星期中的第几天(0-6,0是星期天)
  '%W': '([0-6])', // 和%U基本相同，不同的是%W以星期一为一个星期的开始
  // '%x':     本地相应日期
  // '%X'      本地相应时间
  '%y': '(\\d\\d)', // 去掉世纪的年份(00-99)
  '%Y': '(\\d\\d\\d\\d)', // 完整的年份
  // '%z':     用+HHMM或者-HHMM表示距离格林威治的时区偏移(H代表十进制的小时数，M代表十进制的分钟数)
  // '%Z'      时区的名字(如果不存在为空字符)
  '%%': '(%)' // % 号本身
}
let transMap = {
  '%a': d => cnShort[d.getDay()], // 本地简化星期
  '%A': d => cnLong[d.getDay()], // 本地完整星期
  '%b': d => cnNumber[d.getMonth() + 1] + '月', // 本地简化月份名称
  '%B': d => cnNumber[d.getMonth() + 1] + '月', // 本地完整月份名称
  // '%c' 本地相应的日期和时间表示
  '%d': d => preZero(d.getDate(), 2), // 一个月中的第几天(01-31)
  '%H': d => preZero(d.getHours(), 2), // 一天中的第几个小时(24小时制，00-23)
  '%l': d => {
    let h = d.getHours()
    if (h === 0) {
      return '12'
    }
    else if (h > 12) {
      return (h - 12).toString().padStart(2, '0')
    }
    else {
      return h.toString().padStart(2, '0')
    }
  }, //  一天中的第几个小时(12小时制，01-12)
  // '%j': d => d.getFullYear(), // 一年中的第几天(01-366)
  '%m': d => preZero(d.getMonth() + 1, 2), // 月份(01-12)
  '%M': d => preZero(d.getMinutes(), 2), // 分钟数(00-59)
  '%p': d => d.getHours() > 12 || d.getHours() === 0 ? AM : PM, // 本地am或者pm的相应符
  '%S': d => preZero(d.getSeconds(), 2), // 秒(01-61)
  // '%U': d => d.getW     一年中的星期数(00-53,星期天是一个星期的开始,第一个星期天之前的所有天数都放在第０周)
  '%w': d => d.getDay(), // 一个星期中的第几天(0-6,0是星期天)
  '%W': d => d.getDay() === 0 ? 6 : d.getDay() - 1, // 和%U基本相同，不同的是%W以星期一为一个星期的开始
  // '%x':     本地相应日期
  // '%X'      本地相应时间
  '%y': d => preZero(Number(d.getFullYear()) % 100, 2), // 去掉世纪的年份(00-99)
  '%Y': d => preZero(d.getFullYear(), 4), // 完整的年份
  // '%z':     用+HHMM或者-HHMM表示距离格林威治的时区偏移(H代表十进制的小时数，M代表十进制的分钟数)
  // '%Z'      时区的名字(如果不存在为空字符)
  '%%': () => '%' // % 号本身
}

export let time = {
  DT: '%Y-%m-%d %H:%M',
  DTS: '%Y-%m-%d %H:%M:?%S?',
  TS: '%H:%M:%S',
  T: '%H:%M',
  D: '%Y-%m-%d',
  stringify (o, format = this.DTS) {
    if (o instanceof Date) {
      return this.dateToStr(o, format)
    }
    else if (!isNaN(o)) {
      return this.dateToStr(new Date(o))
    }
    else if (o === 'now') {
      return this.now(format)
    }
    else {
      return ''
    }
  },
  parse (s, format = this.DTS) {
    return this.strToDate(s, format)
  },

  _parse (s, format = this.DTS) {
    let pattern = format
    console.log('get', s, format)
    let params = format.match(/%[aAbBdHlmMpSwWyY%]/g)
    params.forEach(param => {
      pattern = pattern.replace(param, transRegMap[param])
    })
    let reg = new RegExp(pattern, 'gm')
    let groups = reg.exec(s) || []

    let v = {}
    for (let key of Object.keys(transRegMap)) {
      v[key.slice(1)] = params.indexOf(key) === -1 ? null : groups[params.indexOf(key) + 1] || null
    }
    return v
  },

  strToDate (s, format = this.DTS) {
    let v = this._parse(s, format)
    console.log('parsev', v)
    let year, month, day, hour, minute, second
    year = v.Y ? v.Y : v.y ? this.now('%Y').slice(0, 2) + v.y : this.now('%Y')
    month = v.m ? v.m : v.b ? cnNumber.indexOf(v.b[0]) : v.B ? cnNumber.indexOf(v.B[0]) : this.now('%m')
    day = v.d ? v.d : this.now('%d')
    hour = v.H ? v.H : v.l && v.p ? to24(v.l, v.p) : '00'
    minute = v.M ? v.M : '00'
    second = v.S ? v.S : '00'

    // console.log('compute', year, month, day, hour, minute, second)
    // if(!(year && month && day && hour && minute && second))

    if (!v.Y && !v.y) return null
    if (!v.m && !v.b && !v.B) return null
    if (!v.d) return null
    if (!v.H && !v.l) return null
    if (!v.M) return null
    let date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))
    console.log('result', date)

    return date
    // console.log(v)
  },
  dateToStr (d, format = this.DTS) {
    let s = format
    if (d instanceof Date) {
      for (let key of Object.keys(transMap)) {
        s = s.replace(new RegExp(`${key}`, 'g'), transMap[key](d))
      }
      s = s.replace(/[^%]\?/g, (w) => w[0])
      s = s.replace(/%\?/g, '?')
      return s
    }
    else {
      throw TypeError('dateToStr: d is not Date')
    }
  },
  toTimeStamp (s, format = this.DTS, n = 13) {
    if (s instanceof Date) {
      return s.valueOf()
    }
    let d = this.strToDate(s, format)
    // console.log('totimestamp', s, d)
    return d ? d.valueOf() : null
  },
  // fromTimeStamp (t, format = this.DTS, n = 13) {
  // },

  transFormat (s, f1, f2) {
    // let v = this._parse(s, f1)
  },
  now (format = this.DTS) {
    let d = new Date()
    return this.dateToStr(d, format)
  },

  // date is Date() or string
  addYear (date, year, format = this.DTS) {

  },

  // date is Date() or string
  addMonth (date, month, format = this.DTS) {

  },
  // date is Date() or string
  addDay (date, day, format = this.DTS) {

  },
  // date is Date() or string
  addHour (date, hour, format = this.DTS) {

  },
  // date is Date() or string
  addMinute (date, minute, format = this.DTS) {

  },
  // date is Date() or string
  addSecond (date, second, format = this.DTS) {

  },
  addDateStr (s1, s2, f1, f2) {

  },
}
