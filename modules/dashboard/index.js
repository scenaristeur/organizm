import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('@babel/register')({
    presets: [['@babel/preset-env'], ['@babel/preset-react']]
  });



export class Dashboard {
    constructor(options, parent) {  
      this.parent = parent
      this.type = "Dashboard" // use this to call organizm.modules.Example.test_function("test")
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
    start(opts = {}) {
      console.log("dashboard start", opts)
      let params = {name: "Bob"}
     let dashboardComponent = require('./react-blessed/dashboard.jsx')//(params)//(this.parent, opts)

    }
    
  }
  
  export let  dashboardOptions = {
    "name": "Name of the Dashboard Module",
    "params": {
      "un": "1",
      "deux": "2",
      "trois": "3"
    },
    "resources": {
      "content": "du contenu"
    }
  }