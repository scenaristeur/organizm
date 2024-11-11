// https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises

// import inquirer from 'inquirer'
import "dotenv/config";
import { input } from "@inquirer/prompts";
import { InputParser } from "./organizm/index.js";
import { LevelDb } from "./organizm/levelDb.js";

let db = new LevelDb();
db.stream({ predicate: "b" }, (data) => {
  console.log("from stream", data);
})

let config = {
  SOLID_BASE_URL: process.env.VITE_SOLID_BASE_URL,
  SOLID_POD: process.env.VITE_SOLID_POD,
  SOLID_WEBID: process.env.VITE_SOLID_WEBID,
  SOLID_TOKEN_IDENTIFIER: process.env.VITE_SOLID_TOKEN_IDENTIFIER,
  SOLID_TOKEN_SECRET: process.env.VITE_SOLID_TOKEN_SECRET,
};

// console.log(config)
let ip = new InputParser();

console.log(ip);

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
});

console.log("Tape exit pour quitter");

let inputNew = "";
const user_input = () => {
  return input(
    { message: "User : " /*, default: inputNew*/ },
    { signal: controller.signal }
  );
};

// infinite run https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises
const main = async () => {
  let loop = true;
  while (loop) {
    // await showMenu()
    await user_input().then(async (answer) => {
      console.log(answer);
      if (answer == "exit") {
        console.log("save & exit");
        loop = false;
        process.exit(0);
      } else {
        let input = { role: "user", content: answer };

        let analyzed = ip.analyze(input);
        inputNew = analyzed.inputNew;
        console.log("analyzed", analyzed);
        if (analyzed.type == "triplet") {
          console.log("triplet");
await db.put(analyzed.value)
        }else if (analyzed.type == "command" && (analyzed.command == "get" || analyzed.command == "g")) {
          await db.get(analyzed)
        }
        // console.log(ip.history)
        console.log("continue");
      }
    });
  }
};

main();
