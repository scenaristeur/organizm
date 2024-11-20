#!/usr/bin/env node
const debug = false


import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
console.log(argv);

import {Organ} from '../classes/Organ.js'
import {Commander, commanderOptions } from '../modules/commander.js'
import {Example, exampleOptions} from '../modules/example.js'
import {RpcWebsocket, rpcWebsocketOptions} from '../modules/rpc-websocket.js'
// import {loop_living_commander} from '../tools/loop_living_commander.js'

const before_create_test= function(){
  console.log("this is before create function")
  return 'ready'
}

let organizm_options = {
"_before_create": before_create_test ,
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

organizm.modules.Example.test_function("test")
organizm.modules.Example.test_function2("test")
organizm.modules.Example.test_parent_id()

// RPC websocket
if (argv.rpc = "server"){
  console.log("rpc param is server")
  rpcWebsocketOptions.isServer=true
}
organizm.registerModule(RpcWebsocket, rpcWebsocketOptions)
// organizm.modules.RpcWebsocket.test_function2("test")
organizm.modules.RpcWebsocket.start()
organizm._echo()

// Start the commander
// organizm.modules.Commander.start()
