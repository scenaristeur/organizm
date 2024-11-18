#!/usr/bin/env node
const debug = false

import {Organ} from '../classes/Organ.js'
import {loop_living_commander} from '../tools/loop_living_commander.js'

const before_create_test= function(){
  console.log("this is before create function")
  return 'ready'
}


class Commander {
  constructor(options, parent) {  
    this.parent = parent
    this.type = "Commander"
    this.name = options.name;
    this.params = options.params
    this.resources = options.resources
  }
  test_function(data){
    console.log("test function ", data)
  }
  test_function2(data){
    console.log("test function 2", data + this.resources.content)
  }
  test_parent_id(){
    console.log("!!!!! module access his parent id of a registered module", this.parent.id)
  }


  
}

let moduleOptions = {
  "name": "MachinTrucCommander",
  "params": {
    "un": "1",
    "deux": "2",
    "trois": "3"
  },
  "resources": {
    "content": "du contenu"
  }
}


let organizm_options = {
"_before_create": before_create_test ,
//"_living": loop_living_commander,
  "type": "Commander"
}


let organizm = new Organ(organizm_options)

organizm._start()
organizm.registerModule(Commander, moduleOptions)
organizm._echo()

organizm.modules.Commander.test_function("test")
organizm.modules.Commander.test_function2("test")
organizm.modules.Commander.test_parent_id()

