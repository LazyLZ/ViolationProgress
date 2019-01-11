import {SpavaObj} from './SpavaObj'
import {Person} from './UserAdmin'

class Vehicle extends SpavaObj {
  plate = ''
  plateType = null
  owner = null

  constructor (o) {
    if (o instanceof Vehicle) return o
    super(o)
    if (typeof o === 'string') {
      this.plate = o
    }
    o = o instanceof Object ? o : {}
    this.plate = o.plate || ''
    this.owner = new Person(o.owner)
  }

  get name () {
    return this.owner && this.owner.name
  }

  get phone () {
    return this.owner && this.owner.phone
  }

  get orgName () {
    return this.owner && this.owner.orgGroupName
  }

  get typeName () {
    return this.owner && this.owner.typeName
  }
  get email () {
    return this.owner && this.owner.email
  }

  static fromAPI (o) {
    return new Vehicle(o)
  }
}

export {Vehicle}
