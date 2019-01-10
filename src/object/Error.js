class LError extends Error {
  constructor (msg, code) {
    super(msg)
    this.message = msg
    this.code = code
  }
}

export {
  LError,
}
