import { v4 as uuidv4 } from "uuid";
import modele from "./templates/organ_template.js";
import fs from "fs/promises";

const defaut = {
  "@type": "Organ",
  _boxes: { _inbox: { _paths: [] }, _outbox: { _paths: [] } },
  _lifecycle: [
    "_setup",
    "_before_create",
    "_create",
    // "_created",
    // "_before_mount",
    "_mount",
    // "_mounted",
    "_living",
    // "_before_unmount",
    "_unmount",
    // "_unmounted"
  ],
};

export class Organ {
  constructor(options = {}) {
    this.versions = { latest: "0.0.1" };
    this.status = "init";
    this.modules = [];
    this.localPath = process.env.HOME + "/.organizm/data/";
    this.memory = {
      data: {},
      update: this._updateMemory.bind(this),
      ls: this._lsMemory.bind(this),
    };
    this.storage = {
      ls: this._lsStorage.bind(this),
      update: this._updateStorage.bind(this),
    };

    // this._notifications = {
    //   _listeners: [],
    //   _publications: []
    // }
    // this._authorities = {
    //   _parents: [],
    //   _childrens: [],
    //   _influencers: [],
    //   _followers: []
    // }
    // this._tasks = {
    //   todos: [],
    //   doing: [],
    //   done: []
    // }
    // // usefuls props
    // this.configs = []
    // this.circles = []
    // this.roles = []
    // this.domaines = []
    // this.policies = []
    // this.partners = []
    // this.contracts = []
    // this.budgets = []
    // this.capabilities = []
    // this.redevabilities = []
    // this.competences = []
    // this.success = []
    // this.celebrations = []
    // this.skills = []
    // this.constraints = []
    // this.url = "http://url_describing_this_organ/code/or/doc"
    // this.functions = []
    // this.tools = []
    // this.apis = []
    // this.wallets = [{ cryptos: [] }]
    this.init(options);
  }
  async _updateMemory(thing) {
    if (thing.id == undefined) thing.id = uuidv4();
    console.log("memory", this.memory);
    this.memory.data[thing.id] = thing;
    return "updated", thing.id;
  }

  async _lsMemory(thing = null) {
    if (thing != null) {
      console.log("should filter memory.data with ", thing);
    } else {
      return this.memory.data;
    }
  }

  async _lsStorage(thing = null) {
    let path = this.localPath;
    if (thing != null) {
      console.log("should filter storage with ", thing);
    } else {
      const files = await fs.readdir(path);
      // const data = {}
      // for (const file of files) {
      //   const filePath = path + "/" + file
      //   const stats = await fs.stat(filePath)
      //   if (stats.isDirectory()) {
      //     data[file] = await this._lsStorage({ path: filePath })
      //   } else {
      //     data[file] = await fs.readFile(filePath, 'utf8')
      //   }
      // }

      return files;
    }
  }

  async _updateStorage(thing) {
    if (thing.id == undefined) thing.id = uuidv4();
    console.log("storage", this.storage);
    const path = this.localPath + thing.id;
    await fs.mkdir(path, { recursive: true });
    console.log("path", path);
    await fs.writeFile(path + "/data.json", JSON.stringify(thing));

    return "updated", thing.id;
  }

  switchStorage(mode) {
    if (mode == "memory") {
      console.log("switch to memory");
      this._ls = this.memory.ls;
      this._update = this.memory.update;
    } else {
      console.log("switch to storage");
      this._ls = this.storage.ls;
      this._update = this.storage.update;
    }
  }

  async init(options) {
    if (options["@id"]) {
      console.log("retrieve", options["@id"]);
    } else {
      Object.assign(this, modele);
      // update basic props
      this.id = uuidv4();
      this.type = "Organ";
      this.created = Date.now();
      // updating with options
      Object.assign(this, options);
    }
    console.log("init ", this.uuid);
    this._lifecycleBuilder();
    this._boxesBuilder();
    this.status = "ready";

    for (let a in this._lifecycle) {
      let action = this._lifecycle[a];

      if (typeof this[action] === "function") {
        console.log(action);
        this.status = await this[action]();
        console.log("NEW status", this.status);
      } else {
        console.log(action);
        this.status = this._not_implemented();
        console.log("Not changed status", this.status);
      }
    }
    this.switchStorage();
    // console.log("the memory", this.memory)
  }

  _not_implemented() {
    return this.status;
  }
  async _setup(args = {}) {
    console.log("_setup");
    return "setup ok";
  }
  _lifecycleBuilder() {
    console.log("lifecycle", this._lifecycle);
    if (this._lifecycle == undefined) this._lifecycle = defaut._lifecycle;
  }
  _boxesBuilder() {
    if (this._boxes == undefined) this._boxes = defaut._boxes;
  }

  async _echo() {
    console.log("end", this);
    return 0;
  }

  async _start(args = {}) {
    console.log(this.id, "start", args);
    //return ;
  }

  /**
   * Register a new type of module. This module can then be loaded via
   * Agent.extend() and Agent.loadModule().
   * @param {Function} constructor     A module constructor
   */
  async registerModule(constructor, options) {
    console.log("registerModule constructor", constructor, typeof constructor);
    // var type = constructor.type;
    // console.log("constructor type", type)
    if (typeof constructor !== "function") {
      throw new Error("Constructor function expected");
    }
    let module = new constructor(options, this);
    let type = module.type;
    if (!type) {
      throw new Error('Field "module.type" missing in transport constructor');
    }

    if (type in this.modules) {
      if (this.modules[type] !== constructor) {
        throw new Error('Module of type "' + type + '" already exists');
      }
    }

    this.modules[type] = module;
  }
}
