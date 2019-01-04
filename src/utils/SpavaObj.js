class SpavaObj {
  constructor (id, creationTime, lastUpdate) {
    if (id instanceof Object) {
      let o = id
      this.id = o.id || ''
      this.creationTime = o.creationTime || ''
      this.lastUpdateTime = o.lastUpdateTime || ''
    }
    else if (arguments.length > 1) {
      this.id = id || ''
      this.creationTime = creationTime || ''
      this.lastUpdateTime = lastUpdate || ''
    }
    else {
      this.id = ''
      this.creationTime = ''
      this.lastUpdateTime = ''
    }
  }
}

class Group extends SpavaObj {
  constructor (o) {
    super(o)
    this.name = ''
    this.description = ''
    this.code = ''
    if (typeof o === 'string') {
      this.name = o
    }
    else if (o instanceof Object) {
      let {name, description, code} = o
      this.name = name || ''
      this.code = code || ''
      this.description = description || ''
    }
  }
}

class Org extends SpavaObj {
  constructor (o) {
    super(o)
    this.name = ''
    this.description = ''
    this.code = ''
    if (typeof o === 'string') {
      this.name = o
    }
    else if (o instanceof Object) {
      let {name, description, code} = o
      this.name = name || ''
      this.code = code || ''
      this.description = description || ''
    }
  }
}

class Person extends SpavaObj {
  static REGISTER = 0
  static VISITOR = 1
  static PASS_GROUP = 2
  static UNKNOWN = -1

  constructor (o = {}) {
    super(o)
    // console.log('set Person', o)
    let {name, loginId, phone, email, org, group, type,typeName, idNumber, idType} = o
    this.name = name || ''
    this.loginId = loginId || ''
    this.phone = phone || ''
    this.email = email || ''
    this.type = type || Person.UNKNOWN
    this.typeName = typeName || ''
    this.idNumber = idNumber || ''
    this.idType = idType || ''
    this.org = new Org(org)
    this.group = new Group(group)
    // this.reservations = reservations || []
    // this.passLogs = passLogs || []
    // this.violations = violations || []
  }

  static fromPlugin (o) {
    o.phone = o.mobilePhone
    o.typeName = o.authType
    let p = new Person(o)
    let groups = o.userGroups
    if (groups instanceof Array && groups.length > 0) {
      p.group = new Group(groups[0])
      let orgs = groups[0].institution
      if (orgs instanceof Array && orgs.length > 0) {
        p.org = new Org(orgs[0])
      }
    }
    return p
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
