class SpavaObj {
  creationTime = ''
  lastUpdateTime = ''
  creator = ''
  lastEditor = ''

  constructor (o) {
    if (o instanceof SpavaObj) {
      return o
    }
    else if (o instanceof Object) {
      this.id = o.id || ''
      this.creationTime = o.creationTime || ''
      this.lastUpdateTime = o.lastUpdateTime || ''
      this.creator = o.creator || ''
      this.lastEditor = o.lastEditor || ''
    }
  }

  static fromAPI (o) {
    return new SpavaObj(o)
  }
}

export {
  SpavaObj
}
