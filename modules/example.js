export class Example {
  constructor(options, parent) {  
    this.parent = parent
    this.type = "Example" // use this to call organizm.modules.Example.test_function("test")
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

export let  exampleOptions = {
  "name": "Name of the Example Module",
  "params": {
    "un": "1",
    "deux": "2",
    "trois": "3"
  },
  "resources": {
    "content": "du contenu"
  }
}