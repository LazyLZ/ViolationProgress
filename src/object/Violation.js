import {SpavaObj} from './SpavaObj'
import {Vehicle} from './PassControl'

class Result extends SpavaObj {
  comment
  type
  area

  constructor (o = {}) {
    if (o instanceof Result) return o
    super(o)
    this.comment = o.comment || ''
    this.type = new ViolationRule(o.type)
    this.area = o.area || ''
  }

  static fromAPI (o) {
    return new Result(o)
  }
}

class ViolationRule extends SpavaObj {
  name
  code
  severity

  constructor (o = {}) {
    super(o)
    o = o instanceof Object ? o : {}
    this.name = o.name || ''
    this.code = o.code || ''
    this.severity = o.severity || 0
  }

  static fromAPI (o) {
    o.severity = Number(o.serious) || 0
    // console.log('set seve', o.severity)
    return new ViolationRule(o)
  }
}

class Evidence extends SpavaObj {
  static VIOCE = 0
  static IMAGE = 1

  name = ''
  type = ''
  data = null

  constructor (o, type) {
    super(o)
    if (o instanceof Object) {
      this.type = type || o.type
      this.name = o.name || ''
      this.data = o.data || null
    }
  }

  static fromAPI (o, type) {
    return new Evidence(o, type)
  }
}

class ViolationEvent extends SpavaObj {
  static NOT_SUBMIT = -2
  static HAS_SUBMITED = 0
  static NEED_PRELIMINARY_CONFIRM = 0
  static HAS_PRELIMINARY_CONFIRMED = 1
  static NEED_FINAL_CONFIRM = 1
  static HAS_FINAL_CONFIRMED = 2
  static HAS_REVOKED = -1

  status = ViolationEvent.NOT_SUBMIT
  vehicle
  area
  type
  description = ''
  evidenceList = []
  trafficResult
  alarmResult
  adminResult

  constructor (o) {
    if (o instanceof ViolationEvent) return o
    super(o)
    // if (o instanceof Object) {
    if (!(o instanceof Object)) {
      o = {}
    }
    this.vehicle = new Vehicle(o.vehicle)
    this.status = o.status
    this.area = o.area || ''
    this.description = o.description || ''
    this.type = new ViolationRule(o.type)
    this.evidenceList = o.evidenceList instanceof Array
      ? o.evidenceList.map(e => new Evidence(e))
      : []
    this.trafficResult = new Result(o.trafficResult)
    this.alarmResult = new Result(o.alarmResult)
    this.adminResult = new Result(o.adminResult)
    // }
  }

  static fromAPI (o) {
    // let v = new ViolationEvent()
    // v.vehicle = Vehicle.fromAPI(o)
    // v.status = o.status
    return new ViolationEvent(o)
  }

  get typeName () {
    return this.type && this.type.name
  }

  get phone () {
    return this.vehicle.owner.phone
  }

  get plate () {
    return this.vehicle && this.vehicle.plate
  }

  set plate (v) {
    this.vehicle.plate = v
  }

  resetVehicle (o) {
    this.vehicle = new Vehicle(o)
  }
}

export {
  ViolationEvent,
  ViolationRule,
  Result,
  Evidence
}
