import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { v4 as uuidv4 } from "uuid";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
// import {Prompts} from './prompts.js'

const uniqueNamesConfig = {
  dictionaries: [adjectives, colors, animals],
};


const { Form, Select, Input } = require("enquirer");


async function loop_root(opts) {
  let action = null;
  let config = {
    id: uuidv4(),
    name: null,
    framework: null,
  };

  while (action != "exit") {

    let promptAction = new Select({
        name: "Action",
        message: "Select an Action",
        choices: [
        { message: "run a Team", name: "run" },
          { message: "new Team", name: "new" },
          { message: "edit a Team", name: "edit" },
          { message: "delete a Team", name: "delete" },
          { message: "list Teams", name: "list" },
          { message: "exit", name: "exit" },
        ],
      });
  
      //   let prompt = mode == "free" ? promptfree().run() : promptcmd();
      let action = await promptAction.run();
console.log("action", action)

switch (action) {
    case "new":
            let promptFramework = new Select({
      name: "Framework",
      message: "Select an Agent Framework",
      choices: [
        { name: "CrewAi", value: "crewai" },
        { name: "Autogen", value: "autogen" },
        { name: "LangGraph", value: "langgraph" },
      ],
    });

    //   let prompt = mode == "free" ? promptfree().run() : promptcmd();
    config.framework = await promptFramework.run();
    let promptTeamName = new Input({
      message: "A cool name for your team?",
      initial: uniqueNamesGenerator(uniqueNamesConfig),
    });
    config.name = await promptTeamName.run();
let updated = await opts.team.parent._updateStorage(config, "teams");
clear_screen()
console.log("updated", updated)    
await opts.team.get_teams()
        break;
case    "list":
    await opts.team.get_teams()

break;
    default:
        console.log(" not implemented, unknown action")
        break;
}


//   answer = answer.trim();

    // return config;
  }
}

function clear_screen() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
  }
  

export default async function prompts(opts) {
  // let answer = await prompt.run()
  // console.log('Answer:', answer)
  //
  // if (answer != "exit"){
  //   start()
  // }
  loop_root(opts);
}
