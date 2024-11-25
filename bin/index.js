#!/usr/bin/env node
const debug = false


import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
console.log(argv);

import { Organ } from '../classes/Organ.js'
import { Commander, commanderOptions } from '../modules/commander.js'
import { Example, exampleOptions } from '../modules/example.js'
import { Dashboard, dashboardOptions } from '../modules/dashboard/index.js'
import { InputParser, inputParserOptions } from '../modules/inputParser/inputParser.js';
import { TraiteTriplet, traiteTripletOptions } from '../modules/traiteTriplet/traiteTriplet.js'
// import { YjsClient, yjsClientOptions } from '../modules/yjs/YjsClient.js'
import {Team, teamOptions} from '../modules/team/Team.js'
// import { NodeLlamaCpp, nodeLlamaCppOptions } from '../modules/llmProviders/NodeLlamaCpp.js'

// import {RpcWebsocket, rpcWebsocketOptions} from '../modules/rpc-websocket.js'
// import {loop_living_commander} from '../tools/loop_living_commander.js'

const before_create_test = function () {
  console.log("this is before create function")
  return 'ready'
}

let organizm_options = {
  "_before_create": before_create_test,
  //"_living": loop_living_commander,
  "type": "Organizm"
}


// let organizm_remote_options = {
// "config_url" : "https://raw.githubusercontent.com/scenaristeur/organizm/refs/heads/main/remote/config_for_remote_Organizm.js",
// "another option for remote" : "machin"
// }


// let organizmFromRemote = new Organ(organizm_remote_options)
// organizmFromRemote._echo()



let organizm = new Organ(organizm_options)

organizm._start()
organizm.registerModule(Example, exampleOptions)
organizm.registerModule(Commander, commanderOptions)
organizm.registerModule(Dashboard, dashboardOptions)
organizm.registerModule(InputParser, inputParserOptions)
organizm.registerModule(TraiteTriplet, traiteTripletOptions)
organizm.registerModule(Team, teamOptions)
// organizm.registerModule(NodeLlamaCpp, nodeLlamaCppOptions)
// organizm.registerModule(YjsClient, yjsClientOptions)

organizm.modules.Example.test_function("test")
organizm.modules.Example.test_function2("test")
organizm.modules.Example.test_parent_id()

// RPC websocket
// if (argv.rpc = "server"){
//   console.log("rpc param is server")
//   rpcWebsocketOptions.isServer=true
// }
// organizm.registerModule(RpcWebsocket, rpcWebsocketOptions)
// // organizm.modules.RpcWebsocket.test_function2("test")
// organizm.modules.RpcWebsocket.start()

if (argv._.includes("debug")) {
  organizm._echo()
}


// Start the commander

// organizm.modules.Commander.start()
// organizm.modules.Dashboard.start()

if (argv.d == true) {
  organizm.modules.Dashboard.start()
} else {
  console.error("Run `orz -c` (for cli) or `orz -d` (for dashboard)")
  // organizm.modules.Commander.start()
  organizm.modules.Team.start()
}

