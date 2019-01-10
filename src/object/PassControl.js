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
    if (o instanceof Object) {
      if (o.owner instanceof Person) {
        this.owner = o.owner
      }
    }
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

  get type () {
    return this.owner && this.owner.authType
  }
}

export {Vehicle}
