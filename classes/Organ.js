import { v4 as uuidv4 } from 'uuid';

const defaut = {
  boxes: { _inbox: { _paths: [] }, _outbox: { _paths: [] } },
  lifecycle: ["setup",
    "before_create",
    "create",
    "created",
    "before_mount",
    "mount",
    "mounted",
    "living",
    "before_unmount",
    "unmount",
    "unmounted"]
}



export class Organ {
  constructor(options) {
    Object.assign(this, options)
    this._uuid = options.uuid || uuidv4()

this.versions={latest: "0.0.1"}
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
    // usefuls props
    this.configs=[]
    this.circles=[]
    this.roles=[]
    this.domaines=[]
    this.policies=[]
    this.partners=[]
    this.contracts=[]
    this.budgets=[]
    this.capabilities=[]
    this.redevabilities=[]
    this.competences=[]
    this.skills=[]
    this.constraints=[]
    this.url="http://url_describing_this_organ/code/or/doc"
    this.functions=[]
    this.tools=[]
    this.apis=[]
    this.wallets=[{cryptos:[]}]
    // init
    this.init()
  }

  async init() {
    console.log("init ", this._uuid)
    this._lifecycleBuilder()
    this._boxesBuilder()
    this.status = "ready"
  }

  _lifecycleBuilder() {
    if (this._lifecycle == undefined) this._lifecycle = defaut.lifecycle
  }
  _boxesBuilder() {
    if (this._boxes == undefined) this._boxes = defaut.boxes
  }


  async echo() {
    console.log(this)
    return 0
  }

  async start(args) {

    //return ;
  }
}