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

  async _lsStorage(path = this.localPath) {
    // console.log("ls storage", path)
    const files = await fs.readdir(path);
    const data = {};
    for (const file of files) {
      const filePath = path + file;
      const stats = await fs.stat(filePath);
      // console.log("stats", stats);

      if (stats.isDirectory()) {
        // console.log("directory", filePath)
        data[file] = await this._lsStorage(filePath + "/");
      } else {
        // console.log("file", filePath)
        if (file == "data.json") {
          let content = JSON.parse(await fs.readFile(filePath, "utf8"));
          if (content.values != undefined && content.values.name != undefined) {
            data["name"] = content.values.name;
          }
        }
        let content = await fs.readFile(filePath, "utf8");

        data[file] = this._try_JSON(content);
      }
      data[file].mtime = stats.mtime;
    }

    // console.log(data);
    return data;
  }

  async formatResultObject(result) {
    let formated = [];
    for await (const entry of Object.entries(result)) {
      if (entry[0] != entry[1]["data.json"].id) {
        console.log(entry[0], entry[1].id, "are not the same ->Problem");
      }

      let line = entry[1]["data.json"].values;
      line.mtime =entry[1]["data.json"].mtime;
      line.id = entry[0];
      // console.log(entry[1]['data.json'].values)
      // line[entry[1].name] = entry[1]['data.json'].values.type+' / '+entry[1]['data.json'].values.description
      formated.push(line);
    }
    formated = formated.sort((a, b) => {
      return b.mtime - a.mtime;
    });
    return formated;
  }
  _try_JSON(data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }

  async _updateStorage(thing) {
    if (thing.id == undefined) thing.id = uuidv4();
    // console.log("storage", this.storage);
    const path = this.localPath + thing.id;
    await fs.mkdir(path, { recursive: true });
    console.log("# updating", path);
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
      if (options.config_url != undefined) {
        try {
          const response = await fetch(options.config_url);
          if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.statusText}`);
          }
          if (options.config_url.endsWith(".json")) {
            const config = await response.json();
            Object.assign(this, config);
          } else if (options.config_url.endsWith(".js")) {
            console.log("import", options.config_url);
            //   await import(options.config_url).then((SomeModule) => {
            //     var module = new SomeModule();
            //     // ...
            //     console.log("module", module);
            //     Object.assign(this, module);
            // })
          }
        } catch (error) {
          console.error("Error loading remote config:", error);
        }
      }
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
