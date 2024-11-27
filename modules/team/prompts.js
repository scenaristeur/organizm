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

const { Form, Select, Input, Snippet, MultiSelect } = require("enquirer");
const semver = require("semver");

async function loop_root(opts) {
  let action = null;

  while (action != "exit") {
    let promptAction = new Select({
      name: "Action",
      message: "Select an Action",
      choices: [
        { message: "list Agents", name: "listA" },
        { message: "new Agent", name: "newA" },
        { message: "edit an Agent", name: "editA" },
        { message: "delete an Agent", name: "deleteA" },
        { role: "separator" },
        { message: "list Teams", name: "listT" },
        { message: "run a Team", name: "runT" },
        { message: "new Team", name: "newT" },
        { message: "edit a Team", name: "editT" },
        { message: "delete a Team", name: "deleteT" },
        { role: "separator" },
        { message: "Team of teams", name: "ToT" },
        { role: "separator" },
        // { message: "run a Team", name: "run" },

        { message: "exit", name: "exit" },
      ],
    });

    //   let prompt = mode == "free" ? promptfree().run() : promptcmd();
    action = await promptAction.run();
    console.log("action", action);

    switch (action) {
      case "newT":
        let config = {
          id: uuidv4(),
          name: null,
          framework: null,
        };
        let promptFramework = new Select({
          name: "Framework",
          message: "Select an Agent Framework",
          choices: [
            { message: "Node Llama Cpp", name: "node-llama-cpp" },
            { message: "CrewAi", name: "crewai" },
            { message: "Autogen", name: "autogen" },
            { message: "LangGraph", name: "langgraph" },
            { message: "Letta (MemGPT)", name: "letta" },
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
        clear_screen();
        console.log("updated", updated);
        await opts.team.get_teams();
        break;
      case "listT":
        await opts.team.get_teams();
        break;
      case "editT":
      case "runT":
      case "deleteT":
      case "ToT":
        let teams = await opts.team.teams;
        // console.log("teams", teams)
        let promptTeamSelect = new Select({
          name: "Team",
          message: "Select a Team",
          choices: teams.map((team) => team.name),
        });
        let teamName = await promptTeamSelect.run();
        let team = teams.find((team) => team.name == teamName);
        if (team.agents == undefined) {
          team.agents = [];
        }
        // console.log("team", team);
        switch (action) {
          case "runT":
            console.log("run", team);
            let result = await opts.team.parent.modules.LangGraphLlm.run(team);
            console.log("result", result);
            break;
          case "editT":
            console.log("edit", team);

            const promptAgentSelect = new MultiSelect({
              name: "Agents",
              message: "Select Agents to add to your team with spacebar",
              //   limit: 7,

              initial: team.agents.map((agent) => {
                return agent.id;
              }),
              choices: opts.team.agents.map((agent) => {
                return { message: agent.name, name: agent.id };
              }),
            });

            let answer = await promptAgentSelect.run();
            console.log("Answer:", answer);
            // update team
            team.agents = answer.map((id) => {
              return { id: id };
            });
            console.log("team", team);
            let updated = await opts.team.parent._updateStorage(team, "teams");
            clear_screen();
            console.log("updated", updated);
            await opts.team.get_teams();

            // update agents
            opts.team.agents.forEach(async (agent) => {
              console.log("agent", agent, agent.id);
              let shouldUpdate = false;
              if (agent.teams == undefined) {
                agent.teams = [];
              }

              let agentHasTeam = agent.teams.find((t) => t.id == team.id);

              if (answer.includes(agent.id)) {
                if (agentHasTeam == undefined) {
                  agent.teams.push({ id: team.id });
                  shouldUpdate = true;
                }
              } else {
                if (agentHasTeam != undefined) {
                  agent.teams.splice(agent.teams.indexOf(team.id), 1);
                  shouldUpdate = true;
                }
              }
              if (shouldUpdate) {
                let updated = await opts.team.parent._updateStorage(
                  agent,
                  "agents"
                );
                console.log("updated", updated);
              }
            });
            clear_screen();
            await opts.team.get_agents();
            break;
          case "deleteT":
            console.log("ARE YOU SURE ?");
            console.log("delete", team);
            break;
          case "ToT":
            console.log("team of team")


            const promptTeamOfTeam = new MultiSelect({
              name: "Teams",
              message: "Select Teams to add to your team with spacebar",
              //   limit: 7,

              initial: team.agents.map((agent) => {
                return agent.id;
              }),
              choices: opts.team.teams.map((team) => {
                return { message: team.name, name: team.id };
              }),
            });

            let answerToT = await promptTeamOfTeam.run();
            console.log("Answer:", answerToT);
            // update team
            team.agents = answer.map((id) => {
              return { id: id };
            });
            console.log("team", team);
            // let updated = await opts.team.parent._updateStorage(team, "teams");
            // clear_screen();
            // console.log("updated", updated);
            // await opts.team.get_teams();

            // // update agents
            // opts.team.agents.forEach(async (agent) => {
            //   console.log("agent", agent, agent.id);
            //   let shouldUpdate = false;
            //   if (agent.teams == undefined) {
            //     agent.teams = [];
            //   }

            //   let agentHasTeam = agent.teams.find((t) => t.id == team.id);

            //   if (answer.includes(agent.id)) {
            //     if (agentHasTeam == undefined) {
            //       agent.teams.push({ id: team.id });
            //       shouldUpdate = true;
            //     }
            //   } else {
            //     if (agentHasTeam != undefined) {
            //       agent.teams.splice(agent.teams.indexOf(team.id), 1);
            //       shouldUpdate = true;
            //     }
            //   }
            //   if (shouldUpdate) {
            //     let updated = await opts.team.parent._updateStorage(
            //       agent,
            //       "agents"
            //     );
            //     console.log("updated", updated);
            //   }
            // });
            // clear_screen();




            break;
        }
        break;

      case "newA":
        // "homepage": "https://github.com/\${username}/\${name}",
        // "author": "\${author_name} (https://github.com/\${username})",
        // "repository": "\${username}/\${name}",
        // "license": "\${license:ISC}"
        const promptEditAgent = new Snippet({
          name: "username",
          message: "Fill out the fields in package.json",
          required: true,
          fields: [
            {
              name: "author_name",
              message: "Author Name",
            },
            {
              name: "version",
              initial: "0.0.1",
              validate(value, state, item, index) {
                if (item && item.name === "version" && !semver.valid(value)) {
                  return promptEditAgent.styles.danger(
                    "version should be a valid semver value"
                  );
                }
                return true;
              },
            },
          ],
          template: `
        name": "\${name}",
        "prompt": "\${prompt}",
        "version": "\${version}"`,
        });

        let agent = await promptEditAgent.run();
        agent = agent.values;
        agent.id = uuidv4();
        console.log("agent", agent);
        let updatedAgent = await opts.team.parent._updateStorage(
          agent,
          "agents"
        );
        console.log("updated", updatedAgent);
        await opts.team.get_agents();
        break;

      case "listA":
        await opts.team.get_agents();
        let agents = opts.team.agents;
        // console.table(agents);
        break;



      default:
        console.log(" not implemented, unknown action");
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
