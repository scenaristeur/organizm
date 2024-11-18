import { v4 as uuidv4 } from 'uuid';
import modele from './templates/organ_template.js'

const defaut = {
  '@type': 'Organ',
  _boxes: { _inbox: { _paths: [] }, _outbox: { _paths: [] } },
  _lifecycle: ["_setup",
    "_before_create",
    "_create",
    "_created",
    "_before_mount",
    "_mount",
    "_mounted",
    "_living",
    "_before_unmount",
    "_unmount",
    "_unmounted"],
}



export class Organ {
  constructor(options = {}) {
    this.versions = { latest: "0.0.1" }
    this.status = "init"
    this._notifications = {
      _listeners: [],
      _publications: []
    }
    this._authorities = {
      _parents: [],
      _childrens: [],
      _influencers: [],
      _followers: []
    }
    this._tasks = {
      todos: [],
      doing: [],
      done: []
    }
    // usefuls props
    this.configs = []
    this.circles = []
    this.roles = []
    this.domaines = []
    this.policies = []
    this.partners = []
    this.contracts = []
    this.budgets = []
    this.capabilities = []
    this.redevabilities = []
    this.competences = []
    this.success = []
    this.celebrations = []
    this.skills = []
    this.constraints = []
    this.url = "http://url_describing_this_organ/code/or/doc"
    this.functions = []
    this.tools = []
    this.apis = []
    this.wallets = [{ cryptos: [] }]
    this.init(options)
  }

  async init(options) {
    if (options['@id']) {
      console.log("retrieve", options['@id'])
    } else {
      Object.assign(this, modele);
      // update basic props
      this.id = uuidv4()
      this.type = "Organ"
      this.created = Date.now()
      // updating with options
      Object.assign(this, options);
    }
    console.log("init ", this.uuid)
    this._lifecycleBuilder()
    this._boxesBuilder()
    this.status = "ready"

    for (let a in this._lifecycle) {
      let action = this._lifecycle[a]

      if (typeof this[action] === 'function') {
        console.log(action)
        this.status = await this[action]()
        console.log("NEW status", this.status)
      } else {
        console.log(action)
        this.status = this._not_implemented()
        console.log("Not changed status", this.status)
      }
    }
  }

  _not_implemented() {
    return this.status
  }
  async _setup(args = {}) {
    console.log("_setup")
    return "setup ok"
  }
  _lifecycleBuilder() {
    console.log("lifecycle", this._lifecycle)
    if (this._lifecycle == undefined) this._lifecycle = defaut._lifecycle
  }
  _boxesBuilder() {
    if (this._boxes == undefined) this._boxes = defaut._boxes
  }


  async _echo() {
    console.log("end", this)
    return 0
  }

  async _start(args = {}) {
    console.log(this.id, "start", args)
    //return ;
  }
}