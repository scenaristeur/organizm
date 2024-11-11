import { Level } from "level";
import levelgraph from "levelgraph";

// https://github.com/levelgraph/levelgraph

export class LevelDb {
  constructor(options = { name: "yourdb" }) {
    this.db = levelgraph(new Level(options.name));
  }

  async put(triple) {
    await this.db.put(triple, function (err) {
      if (err) {
        console.log(err);
      }
      // console.log("putted")
      // do something after the triple is inserted
    });
  }

  async get(data) {
    let value = data.value;
    console.log("DELETE ? ", data.subcommand);
    console.log("value", value);
    let filter = {};
    value.map(function (f) {
      let [k, v] = f.split(":");
      switch (k) {
        case "s":
          filter.subject= v 
          break;
        case "p":
          filter.predicate= v 
          break;
        case "o":
          filter.object= v 
          break;
          case "l":
          filter.limit= Number(v)
          break; 
        case "of":
          filter.offset= Number(v)
          break; 
        case "r":
          filter.reverse= v
          break;

        default:
            console.log("unknown key")
          break; 
      }
    });

    console.log("filter", filter);
    let db = this.db
  this.db.get(filter, async function (err, list) {
      if (err) {
        console.log(err);
      }
      console.log("get", list);
   

if (data.subcommand == "delete") {

for (let i = 0; i < list.length; i++) {
  let triple = list[i];
  console.log("DELETE", triple);
  try{
    
  db.del(triple, function(err) {
    if (err) {
      console.log(err);
    }
     console.log("deleted ", triple)
    // do something after the triple is inserted
  });

}catch(err){
  console.log(err)
}


}
}
return list
    });
 
  }

  del(triple) {   
    db.del(triple, function(err) {
      if (err) {
        console.log(err);
      }
      // console.log("putted")
      // do something after the triple is inserted
    });

  }

  stream(filter, callback) {
    var stream = this.db.getStream(filter);
    stream.on("data", function (data) {
      callback(data);
    });
  }
}
