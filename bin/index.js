#!/usr/bin/env node
const debug = false

import {Organ} from '../classes/Organ.js'

const before_create_test= function(){
  console.log("this is before create function")
  return 'ready'
}


let organizm_options = {
"_before_create": before_create_test 
}


let organizm = new Organ(organizm_options)
organizm._echo()
organizm._start()