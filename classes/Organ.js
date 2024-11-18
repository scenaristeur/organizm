import { v4 as uuidv4 } from 'uuid';
import modele from './templates/organ_template.js'

const defaut = {
  '@type': 'Organ',
  _boxes: { _inbox: { _paths: [] }, _outbox: { _paths: [] } },
  _lifecycle: ["setup",
    "before_create",
    "create",
    "created",
    "before_mount",
    "mount",
    "mounted",
    "living",
    "before_unmount",
    "unmount",
    "unmounted"],
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
  }

  _lifecycleBuilder() {
    console.log("lifecycle", this._lifecycle)
    if (this._lifecycle == undefined) this._lifecycle = defaut._lifecycle
  }
  _boxesBuilder() {
    if (this._boxes == undefined) this._boxes = defaut._boxes
  }


  async echo() {
    console.log("end", this)
    return 0
  }

  async start(args) {

    //return ;
  }
}