import prompts from './prompts.js'



export class Team {
    constructor(options, parent) {  
      this.parent = parent
      this.type = "Team" // use this to call organizm.modules.Example.test_function("test")
      this.name = options.name;
      this.params = options.params
      this.resources = options.resources
     this.get_teams()
    }

    async get_teams(){
      let teams = Object.values(await this.parent._lsStorage(this.parent.localPath+'/teams/')).map((team) => team['data.json'])
      console.log("")
      console.table(teams)
      this.teams = teams
    }

    async start(opts = {}){
        opts.team = this
       await  this.get_teams()
    let config = await prompts(opts)
    console.log("conf",config)
    //console.log("team", this)
      }
    // }
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
  
  export let  teamOptions = {
    "name": "Name of the Team Module",
    "params": {
      "un": "1",
      "deux": "2",
      "trois": "3"
    },
    "resources": {
      "content": "du contenu"
    }
  }