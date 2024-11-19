#!/usr/bin/env node
const debug = false

import {Organ} from '../classes/Organ.js'
import {Commander, commanderOptions } from '../modules/commander.js'
import {Example, exampleOptions} from '../modules/example.js'
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

let organizm = new Organ(organizm_options)

organizm._start()
organizm.registerModule(Example, exampleOptions)
organizm.registerModule(Commander, commanderOptions)
organizm._echo()

organizm.modules.Example.test_function("test")
organizm.modules.Example.test_function2("test")
organizm.modules.Example.test_parent_id()

organizm.modules.Commander.start()
