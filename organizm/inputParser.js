// https://github.com/scenaristeur/agent/blob/main/src/views/CommandInput.vue
// https://github.com/scenaristeur/agent/blob/main/src/neurone-factory/command.js
// https://github.com/scenaristeur/agent/blob/db71559451632aca27abbdcf876c175905d49b2b/src/store/modules/core.js#L131

import { InputHistory } from './index.js'


export class InputParser {
  constructor() {
    this.history = new InputHistory();
    this.input = {};
  }

  analyze(input) {
    // console.log(input);
    this.input = input;
    this.input.start = Date.now();
    this.input.content = this.input.content.trim();

    if (this.input.type == undefined) {
      this.input.type = [];
    }
    if (this.input.role == "user") {
      if (this.isValidUrl(this.input.content)) {
        this.input.type.push("url");
      }
      let filename = this.isFile(this.input.content);
      if (filename) {
        this.input.type.push("file");
        this.input.filename = this.input.content.split("/").pop();
      }
    }

    this.checkFirstChar(this.input);
    this.input.end = Date.now();
this.input.delay = this.input.end - this.input.start;
    // console.log(this.input);
    this.history.add(this.input)
    return this.input;
  }

  checkFirstChar(input) {
    let content = input.content;
    let firstChar = content.charAt(0);
    let arrayContent = []
    switch (firstChar) {
      case "/":
        arrayContent = content.split(" ").map((e) => e.trim())
        this.input.type = "command";
        this.input.command = arrayContent.shift().slice(1);
        this.input.value = arrayContent
        this.input.inputNew = "";
        break;
      case ".":
      case "-":
      case ".":
      case ";":
      case ",":
        //   case "down":
        //   case "up":
        this.input.type = "history command";
        console.log(
          "history commande see https://github.com/scenaristeur/agent/blob/db71559451632aca27abbdcf876c175905d49b2b/src/neurone-factory/command.js#L29C1-L29C23"
        );
        break;
      case "!":
        console.log("remove triple")
        let value = content.slice(1)
        let words = value.split(' ').map((e) => e.trim())
        this.input.type = "command";
        this.input.command = "delete";
        this.input.value = ["s:"+words[0]+", p:"+words[1]+", o:"+words[2]]
        this.input.inputNew = "";
        // arrayContent = content.split(" ").map((e) => e.trim())
        //let value = content 
        // [ 's:dav', 'p:a', 'o:boss' ]
//        let value = []
        // s:"+arrayContent[0]+", p:"+arrayContent[1]+", o:"+arrayContent[2]]
        // this.input.type = "command";
        // this.input.command = "delete";
        // this.input.subcommand = "delete"
        // this.input.value = value
        // this.input.inputNew = "";
      break;
      case "%":
        console.log("replace /update")
        arrayContent = content.split(" ").map((e) => e.trim())


        this.input.type = "command";
        this.input.command = "update";
        this.input.value = arrayContent
        this.input.inputNew = "";
      break;
      case "?":
        //   case "help":
        //   case "h":
        console.log("help");
        break;
      default:
        this.traiteTriplet();
        break;
    }

    return input;
  }

  traiteTriplet() {
    // console.log("traiteTriplet");
    let message = this.input.content;
    var result = {};
    var inputNew = "";
    let lastChar = message.slice(-1);
    let messageCut = message.slice(0, -1).split(" ");
    let isTriplet = true;
    //  console.log(messageCut);

    let detectLiteral = "";
    let messageCutTemp = [];
    messageCut.forEach(function (part) {
      part = part.trim();
      //  console.log(part);
      if (part.startsWith('"')) {
        detectLiteral = "debut";
        //  console.log(detectLiteral);
        messageCutTemp.push(part.substr(1));
      } else if (part.endsWith('"')) {
        detectLiteral = "fin";
        //console.log(detectLiteral);
        messageCutTemp.push(messageCutTemp.pop() + " " + part.slice(0, -1));
      } else if (detectLiteral == "debut") {
        //  console.log("recupere le dernier et lui ajoute part" )
        messageCutTemp.push(messageCutTemp.pop() + " " + part);
      } else {
        messageCutTemp.push(part);
      }
    });
    if (messageCutTemp.length > 0) {
      messageCut = messageCutTemp;
    }
    switch (lastChar) {
      case ".":
        inputNew = "";
        break;
      case ";":
        if (messageCut[0].indexOf(" ") > -1) {
          inputNew = '"' + messageCut[0] + '"' + " ";
        } else {
          inputNew = messageCut[0] + " ";
        }
        break;
      case ",":
        if (messageCut[0].indexOf(" ") > -1) {
          inputNew = '"' + messageCut[0] + '" ';
        } else {
          inputNew = messageCut[0] + " ";
        }
        if (messageCut[1].indexOf(" ") > -1) {
          inputNew += '"' + messageCut[1] + '" ';
        } else {
          inputNew += messageCut[1] + " ";
        }
        break;
      case "-":
        if (messageCut[2].indexOf(" ") > -1) {
          inputNew = '"' + messageCut[2] + '"' + " ";
        } else {
          inputNew = messageCut[2] + " ";
        }
        break;
      default:
        console.log("message to chat " + message);
        //this.sendMessage(message);
        //  this.agentInput.send('agentSocket', {type: "sendMessage", message:message});
        //  this.catchTriplet(message.slice(0,-1), this.network); // A REMPLACER PAR CATCHTRIPLETS V2
        inputNew = "";
        isTriplet = false;
    }
    if (isTriplet) {
      //  console.log("est Triplet",messageCut)
      result.type = "triplet";
      var tripletvalue = {};
      tripletvalue.subject = messageCut[0];
      tripletvalue.predicate = messageCut[1];
      tripletvalue.object = messageCut[2];
      result.value = tripletvalue;
      result.inputNew = inputNew;
    } else {
      //  console.log("n'est pas triplet")
      result.type = "message";
      result.value = message;
      result.inputNew = inputNew;
    }
    Object.assign(this.input, result);
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
  isFile(pathname) {
    try {
      return pathname.split("/").pop().indexOf(".") > -1;
    } catch (_) {
      return false;
    }
  }
}
