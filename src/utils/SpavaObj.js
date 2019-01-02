class Group {
  constructor (o) {
    this.id = ''
    this.name = ''
    this.description = ''
    this.code = ''
    if (typeof o === 'string') {
      this.name = o
    }
    else if (o instanceof Object) {
      let {id, name, description, code} = o
      this.id = id || ''
      this.name = name || ''
      this.code = code || ''
      this.description = description || ''
    }
  }
}

class Org {
  constructor (o) {
    this.id = ''
    this.name = ''
    this.description = ''
    this.code = ''
    if (typeof o === 'string') {
      this.name = o
    }
    else if (o instanceof Object) {
      let {id, name, description, code} = o
      this.id = id || ''
      this.name = name || ''
      this.code = code || ''
      this.description = description || ''
    }
  }
}

class Person {
  static REGISTER = 0
  static VISITOR = 1
  static PASS_GROUP = 2
  static UNKNOWN = -1

  constructor (o) {
    // console.log('set Person', o)
    let {id, name, loginId, phone, email, org, group, type, idNumber, idType} = o
    this.id = id || ''
    this.name = name || ''
    this.loginId = loginId || ''
    this.phone = phone || ''
    this.email = email || ''
    this.type = type || Person.UNKNOWN
    this.idNumber = idNumber || ''
    this.idType = idType || ''
    this.org = new Org(org)
    this.group = new Group(group)
    // this.reservations = reservations || []
    // this.passLogs = passLogs || []
    // this.violations = violations || []
  }

  get isVisitor () {
    return this.type === Person.VISITOR
  }

  get isRegister () {
    return this.type === Person.REGISTER
  }

  get isPassGroup () {
    return this.type === Person.PASS_GROUP
  }

  get orgName () {
    return this.org.name
  }

  get groupName () {
    return this.group.name
  }
}

class User extends Person {
  constructor (props) {
    super(props)
    this.token = props.token || ''
    this.role = props.role
  }
}

class LError extends Error {
  constructor (msg, code) {
    super(msg)
    this.message = msg
    this.code = code
  }
}

export {
  Group,
  Org,
  Person,
  User,
  LError
}
