import {SpavaObj} from './SpavaObj'

class Institution extends SpavaObj {
  name = ''
  description = ''
  code = ''

  constructor (o) {
    super(o)
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

  static fromAPI (o) {
    return new Institution(o)
  }
}

class GroupType extends SpavaObj {
  name = ''
  description = ''

  constructor (o) {
    super(o)
    if (typeof o === 'string') {
      this.name = o
    }
    else if (o instanceof Object) {
      let {name, description} = o
      this.name = name || ''
      this.description = description || ''
    }
  }

  static fromAPI (o) {
    return new GroupType(o)
  }
}

class Group extends SpavaObj {
  constructor (o) {
    if (o instanceof Group) return o
    super(o)
    this.name = ''
    this.description = ''
    this.code = ''
    this.typeList = []
    this.institution = null
    if (typeof o === 'string') {
      this.name = o
    }
    else if (o instanceof Object) {
      let {name, description, code, typeList = []} = o
      this.name = name || ''
      this.code = code || ''
      this.description = description || ''
      this.typeList = typeList.filter(t => t instanceof GroupType)
      this.institution = new Institution(o.institution)
    }
  }

  isTypeOf (name) {
    return !!this.typeList.find(t => t.name === name)
  }

  get insName () {
    return this.institution && this.institution.name
  }

  get insId () {
    return this.institution && this.institution.id
  }

  get type () {
    return this.typeList.map(t => t.description).join(', ')
  }

  getIns () {
    return this.institution
  }

  static fromAPI (o = {}) {
    let g = new Group(o)
    if (o.groupTypes instanceof Array) {
      g.typeList = o.groupTypes.map(t => GroupType.fromAPI(t))
    }
    return g
  }
}

class Permission extends SpavaObj {
  name = ''
  description = ''
  shiroStr = ''

  constructor (o) {
    if (o instanceof Permission) return o
    super(o)
    this.name = o.name || ''
    this.description = o.description || ''
    this.shiroStr = o.shiroStr || ''
  }

  static fromAPI (o) {
    return new Permission(o)
  }
}

class Role extends SpavaObj {
  static TRAFFIC_ADMIN = 'spava:violation:center'
  static ALARM_ADMIN = 'spava:violation:admin'
  static VIOLATION_ADMIN = 'spava:violation:traffic'

  name = ''
  shiroStr = ''
  description = ''
  permissionList = []

  constructor (o) {
    if (o instanceof Role) return o
    super(o)
    this.name = o.name || ''
    this.description = o.description || ''
    this.shiroStr = o.shiroStr || ''
  }

  static fromAPI (o) {
    let r = new Role(o)
    if (o.permissions instanceof Array) {
      r.permissionList = o.permissions.map(p => Permission.fromAPI(p))
    }
  }

  is (r) {
    if (typeof r === 'string') {
      return this.shiroStr === r
    }
  }
}

class Person extends SpavaObj {
  static REGISTER = 0
  static VISITOR = 1
  static PASS_GROUP = 2
  static UNKNOWN = -1

  constructor (o = {}) {
    if (o instanceof Person) return o
    super(o)
    // console.log('set Person', o)
    let {name, loginId, phone, email, institution, roleList, groupList, type, typeName, idNumber, idType} = o
    this.name = name || ''
    this.loginId = loginId || ''
    this.phone = phone || ''
    this.email = email || ''
    this.type = type || Person.UNKNOWN
    this.typeName = typeName || ''
    this.idNumber = idNumber || ''
    this.idType = idType || ''
    this.institution = null
    this.groupList = []
    this.roleList = []
    if (groupList instanceof Array) {
      this.groupList.push(...groupList.filter(g => g instanceof Group))
    }

    if (roleList instanceof Array) {
      this.roleList.push(...roleList.filter(r => r instanceof Role))
    }

    if (institution instanceof Institution) {
      this.institution = new Institution(institution)
    }

    // this.reservations = reservations || []
    // this.passLogs = passLogs || []
    // this.violations = violations || []
  }

  static fromAPI (o) {
    o.phone = o.mobilePhone
    o.typeName = o.authType
    let p = new Person(o)
    let groups = o.userGroups || []
    p.addGroup(...groups.map(g => Group.fromAPI(g)))
    if (p.groupList.length > 0) {
      o.institution = p.groupList[0].getIns()
    }
    if (o.roleList instanceof Array) {
      p.addRole(...o.roleList.map(r => Role.fromAPI(r)))
    }
    return p
  }

  // get isVisitor () {
  //   return this.type === Person.VISITOR
  // }
  //
  // get isRegister () {
  //   return this.type === Person.REGISTER
  // }
  //
  // get isPassGroup () {
  //   return this.type === Person.PASS_GROUP
  // }

  get insName () {
    return this.institution && this.institution.name
  }

  get insId () {
    return this.institution && this.institution.id
  }

  getIns () {
    return this.institution
  }

  get orgGroupName () {
    let t = this.groupList.find(g => g.isTypeOf('org'))
    return t ? t.name : ''
  }

  isRoleOf (s) {
    if (typeof s === 'string') {
      return this.roleList.some(r => r.is(s))
    }
    if (s instanceof Array) {
      return s.map(roleStr => this.roleList.some(role => role.is(roleStr)))
    }
  }

  addGroup (...args) {
    let set = {}
    this.groupList.forEach(g => {
      set[g.id] = g
    })
    args.filter(a => a instanceof Group).forEach(g => {
      set[g.id] = g
    })
    let list = []
    for (let key of Object.keys(set)) {
      list.push(set[key])
    }
    this.groupList = list
  }

  addRole (...args) {
    let set = {}
    this.roleList.forEach(g => {
      set[g.id] = g
    })
    args.filter(a => a instanceof Role).forEach(g => {
      set[g.id] = g
    })
    let list = []
    for (let key of Object.keys(set)) {
      list.push(set[key])
    }
    this.roleList = list
  }
}

export {
  Group,
  Institution,
  Person,
  GroupType,
  Permission,
  Role,
}
