export class TraiteTriplet {
    constructor(options, parent) {  
      this.parent = parent
      this.type = "TraiteTriplet" // use this to call organizm.modules.Example.test_function("test")
      this.name = options.name;
      this.params = options.params
      this.resources = options.resources
    }
    async process(inputObject) {
      console.log("process function ", inputObject)
      let list = await  this.parent._ls()
      console.log("list", list)
      return 'okdav  ad'
    }
    // test_function(data){
    //   console.log("test function ", data)
    // }
    // test_function2(data){
    //   console.log("test function 2", data + this.resources.content)
    // }
    // test_parent_id(){
    //   console.log("!!!!! module access his parent id of a registered module", this.parent.id)
    // }
    
  }
  
  export let  traiteTripletOptions = {
    "name": "Name of the TraiteTriplet Module",
    "params": {
      "un": "1",
      "deux": "2",
      "trois": "3"
    },
    "resources": {
      "content": "du contenu"
    }
  }