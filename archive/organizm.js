import {Organ} from '../classes/Organ.js'

let options1 = {
  'nom': 'organ1',
  'truc': 'machin',
  'bidule': 'spog',
  _boxes: { _inbox: { _paths: [] }, _outbox: { _paths: [] } },
  _lifecycle: [
    "setup",
    {"before_create" : {"url" : "http://can_take_an_url"}},
    "create",
    {"created": {"steps": ["can", "be", "an", "array"]}},
   // "before_mount", //comment if you don't want a step to be executed
    "mount", 
    "mounted",
    {"living": "path/with/uuid/25fc6srf1669f5szer687sd5786sd"},
    "before_unmount",
    {"unmount" : {"just": "what", "an": "who", "object": "how", "uuid": "256deoi658", "or_array": ["one", "two", "uuid"]}},
    "unmounted"
  ]
}
let options2 = {
  'nom': 'Sophie Dufilo',
  "description": "Responsable des idées farfelues et saugrenues",
  "role": ['Ministre des Idées Saugrenues'],
  'type': 'crewai_agent',
  'bidule': 'spog',
}

// ORGAN properties can come from (in order) 
// - templates like ./classes/templates/organ_templates.js
// - default of ./classes/Organ.js
// - user defined options like options1 & options2

let organ1 = new Organ(options1)
let organ2 = new Organ(options2)
organ1.echo()
organ2.echo()