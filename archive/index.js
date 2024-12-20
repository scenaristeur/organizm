// https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises

// import inquirer from 'inquirer'
import "dotenv/config";
// import { input } from "@inquirer/prompts";
import { readdir, writeFile, readFile } from "fs/promises";
import inquirer from "inquirer";
import inquirerCommandPrompt from "inquirer-command-prompt";
import {
  InputParser,
  LevelDb,
  Solid, // bug https://github.com/inrupt/solid-client-authn-js/issues/3773
  // SolidInrupt,
  //  SolidLdKit
  TypesManager,
} from "./organizm/index.js";

// let Solid = SolidInrupt;

inquirer.registerPrompt("command", inquirerCommandPrompt);

let HOME =
  process.env.HOME ||
  process.env.HOMEPATH ||
  process.env.USERPROFILE ||
  process.env.VITE_DBS_FOLDER;

let config = {
  USE_SOLID: process.env.USE_SOLID,
  SOLID_BASE_URL: process.env.VITE_SOLID_BASE_URL,
  SOLID_POD: process.env.VITE_SOLID_POD,
  SOLID_WEBID: process.env.VITE_SOLID_WEBID,
  SOLID_TOKEN_IDENTIFIER: process.env.VITE_SOLID_TOKEN_IDENTIFIER,
  SOLID_TOKEN_SECRET: process.env.VITE_SOLID_TOKEN_SECRET,
  DBS_FOLDER: HOME + "/.organizm/dbs/", // MUST END WITH "/"
  DEFAULT_DB_NAME: "/organizm.default.db",
  REMOTE_DBS_FILE: "remoteDBS.json",
};

console.log(config);

let tm = new TypesManager({ update: "auto" });

let solid = null;
if (config.USE_SOLID && config.SOLID_BASE_URL != undefined) {
  new Solid({
    SOLID_BASE_URL: config.SOLID_BASE_URL,
    clientApplicationName: "organizm",
    pod: config.SOLID_POD,
    webId: config.SOLID_WEBID,
    token_identifier: config.SOLID_TOKEN_IDENTIFIER,
    token_secret: config.SOLID_TOKEN_SECRET,
  });
}

let getRemoteDBS = async () => {
  try {
    let remoteDBS = await readFile(config.DBS_FOLDER + config.REMOTE_DBS_FILE);
    remoteDBS = JSON.parse(remoteDBS);
    return remoteDBS;
  } catch (_) {
    console.log("can not open remoteDBS.json");
  }
};
let remoteDBS = await getRemoteDBS();
console.log(remoteDBS);

let dbName = config.DEFAULT_DB_NAME;
let db = new LevelDb({ name: config.DBS_FOLDER + dbName });

let remoteDB = "";

let last_get = [];

// db.stream({ predicate: "b" }, (data) => {
//   console.log("from stream", data);
// })

let ip = new InputParser();

// Clear the screen
process.stdout.write("\u001b[2J\u001b[0;0H");

// https://github.com/SBoudrias/Inquirer.js#canceling-prompt
const controller = new AbortController();

// Exit the inquirer prompt
function exit() {
  controller.abort();
}

// close inquirer input if user press "escape" key
process.stdin.on("keypress", (_, key) => {
  if (key.name === "escape") {
    exit();
  }

  // else {
  //   console.log(key.name);
  // }
});

console.log("Tape 'exit' pour quitter, TAB pour suggestions");

let inputNew = "";
// const user_input = () => {
//   return input(
//     { message: "User : " /*, default: inputNew*/ },
//     { signal: controller.signal }
//   );
// };

const availableCommands = [
  {
    filter: function (str) {
      return str.replace(/ \[.*$/, "");
    },
  },
  "/dbs",
  "/db [localdb]",
  "/db [remotedb] [name]",
  "/get",
  "/g",
  "/get s:[subject] p:[predicate] o:[object] l:[limit] of:[offset] r:[reverse]",
  //  'foo ba mike',
  //   'foo bb buck',
  //    'foo bb jick',
  //    'boo',
  //    'fuu',
  //    'quit',
  //     'show john [first option]',
  //      'show mike [second option]',
  //      "isb -b --aab-long -a optA",
  //       "isb -b --aab-long -a optB",
  //       "isb -b --aab-long -a optC"
];

// infinite run https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises
const main = async () => {
  let loop = true;
  while (loop) {
    // await showMenu()
    // await user_input()

    await inquirer
      .prompt([
        {
          type: "command",
          name: "cmd",
          autoCompletion: availableCommands,
          message: ">",
          context: 0,
          validate: (val) => {
            return val ? true : "Press TAB for suggestions";
          },
          short: true,

          signal: controller.signal,
        },
      ])
      // .then(answers => {
      //   return Promise.resolve(answers.cmd)
      // }).catch(err => {
      //   console.error(err.stack)
      // })
      .then(async (answer) => {
        console.log(answer);
        answer = answer.cmd;
        if (answer == "exit") {
          console.log("save & exit");
          loop = false;
          process.exit(0);
        } else {
          let input = { role: "user", content: answer };
          let analyzed = ip.analyze(input);
          inputNew = analyzed.inputNew;
          console.log("analyzed", analyzed);

          switch (analyzed.type) {
            case "command":
              console.log("command");
              switch (analyzed.command) {
                // LEVELGRAPH
                case "get":
                case "g":
                  // console.log("get");
                  // how to get the await/aync ?
                  last_get = await db.get(analyzed);
                  //  console.log("last get", last_get)
                  break;
                case "delete":
                  analyzed.subcommand = "delete";
                  last_get = await db.get(analyzed);
                  break;
                case "db":
                  console.log("db", analyzed);
                  if (remoteDBS.hasOwnProperty(analyzed.value[0])) {
                    try {
                      remoteDB = remoteDBS[analyzed.value[0]];
                      console.log("Connect to remote ", remoteDB);
                      solid = new Solid({
                        SOLID_BASE_URL: config.SOLID_BASE_URL,
                        clientApplicationName: "organizm",
                        pod: config.SOLID_POD,
                        webId: config.SOLID_WEBID,
                        token_identifier: config.SOLID_TOKEN_IDENTIFIER,
                        token_secret: config.SOLID_TOKEN_SECRET,
                      });
                    } catch (error) {
                      console.log("error", error);
                    }
                  } else if (
                    analyzed.value[0] &&
                    analyzed.value[0].startsWith("http")
                  ) {
                    remoteDBS[analyzed.value[1]] = {
                      name: analyzed.value[1],
                      url: analyzed.value[0],
                    };
                    await writeFile(
                      config.DBS_FOLDER + config.REMOTE_DBS_FILE,
                      JSON.stringify(remoteDBS)
                    );
                  } else {
                    dbName =
                      (analyzed.value.length > 0 && analyzed.value[0]) ||
                      config.DEFAULT_DB_NAME;
                    db = new LevelDb({ name: config.DBS_FOLDER + dbName });
                  }
                  break;
                case "dbls":
                case "dbs":
                  const getDirectories = async (source) =>
                    (await readdir(source, { withFileTypes: true }))
                      .filter((dirent) => dirent.isDirectory())
                      .map((dirent) => dirent.name);

                  console.log(
                    "\nDB list of" + config.DBS_FOLDER,
                    " : ",
                    await getDirectories(config.DBS_FOLDER)
                  );
                  console.log("->current DB : ", dbName);
                  console.log("\nremoteDBS :", remoteDBS);
                  console.log("->remote DB : ", remoteDB);

                  break;
                //SOLID
                case "t":
                  console.log("Solid test");
                  await solid.test();
                  break;
                case "ls":
                  console.log("Solid client");
                  const ls = await solid.ls();
                  console.log(ls);
                  // console.log(JSON.stringify(ls, null, 2));
                  break;
                case "put":
                  console.log("Solid put");
                  let saved = await solid.createThing(analyzed.value);
                  break;
                // TYPES MANAGER
                case "tmls":
                  tm.ls();
                  break;
                case "n":
                  tm.new(analyzed.value);
                  break;
                //
                default:
                  console.log("default");
                  break;
              }
              break;
            case "triplet":
              console.log("triplet");
              await db.put(analyzed.value);
              break;
            default:
              console.log("default");
              break;
          }
          // console.log(ip.history)
        }
      })
      .catch((err) => {
        console.error(err.stack);
      });
    console.log("continue");
  }
};

main();
