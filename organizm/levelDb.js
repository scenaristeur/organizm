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
          filter.limit= v
          break; 
        case "o":
          filter.offset= v
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

    await this.db.get(filter, function (err, list) {
      if (err) {
        console.log(err);
      }
      console.log("get", list);
      return list;
    });
  }

  stream(filter, callback) {
    var stream = this.db.getStream(filter);
    stream.on("data", function (data) {
      callback(data);
    });
  }
}
