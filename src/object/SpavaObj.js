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

class LImage {
  loading = false
  process = false
  src = null
  url = ''
  error = false
  errorMessage = ''

  constructor (o) {
    this.loading = o.loading || false
    this.process = o.process || false
    this.src = o.src || null
    this.url = o.url || ''
    this.error = o.error || false
    this.errorMessage = o.errorMessage || ''
  }
}

export {
  SpavaObj,
  LImage,
}
