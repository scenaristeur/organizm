// const prompt = require('enquirer');
// const colors = require('colors');
// const pad = require('pad');
// const data = require('../lib/data');
// const open = require('open');

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { v4 as uuidv4 } from "uuid";
const { Input, Confirm, Snippet, autocomplete } = require("enquirer");
import yosay from "yosay";
const semver = require("semver");
// import openEditor from 'open-editor';
import open from "open";
// const { Snippet } = require('enquirer');

// import { Core } from '../../../core/index.js';
// import { LevelgraphJsonld } from '../../../core/levelgraph-jsonld/index.js';
// let levelgraphJsonld = new LevelgraphJsonld({name: "base de test", active: true})
//
// let core = new Core({bases: {levelgraphJsonld : levelgraphJsonld}})

// const prompt = new Confirm({
//   name: 'question',
//   message: 'Did you like enquirer?'
// });

// const prompt2 = () => input({
//   name: 'name',
//   message: 'Give it a name: '
// });
//
// let answer
let host = "http://localhost:3000";

let mode = "free";

const whatPrompt = new Input({
  name: "what",
  message: "What do ou want to find?",
});

const promptcmd = () =>
  autocomplete({
    header: yosay(
      'What can I do for you？\n\
  try: \n\
  - "test" \n\
  - then "find" + henry'
    ),
    message: "=>",
    hint: ' use "free" to switch to free mode, try "test" to initialize the base, then "ls" or "find + lulu"',
    choices: [
      "new",
      "ls",
      "dashboard",
      "cd [path]",
      "free",
      "memory",
      "storage",
      "find",
      "test",
      "browser",
      "editor",
      /* 'neurone (mode)', 'brain (mode)', 'world (mode)',*/ "? help",
      "exit",
    ],
    //choices: ['test', 'neurone', 'brain', 'world', 'other', 'create', 'read', 'update', 'delete', 'exit']
  });

const promptfree = () =>
  new Input({
    header: yosay(`- cmd/free to change mode \n- exit to exit`),
    message: "=>",
    hint: 'use cmd to switch to cmd mode "',
    // choices: ['new',  'ls', 'find', 'test', 'touch instead of new ?', 'browser','editor','free (mode)', 'neurone (mode)', 'brain (mode)', 'world (mode)', '? help', 'exit' ]
    //choices: ['test', 'neurone', 'brain', 'world', 'other', 'create', 'read', 'update', 'delete', 'exit']
  });

const typePrompt = () =>
  autocomplete({
    header: yosay("What do you want to create"),
    message: "=>",
    hint: "neurone, brain, world",
    choices: ["neurone", "brain", "world", "other", "back"],
    //choices: ['test', 'neurone', 'brain', 'world', 'other', 'create', 'read', 'update', 'delete', 'exit']
  });

// const prompt2 = () => autocomplete({
//   name: 'Options',
//   message: '=>',
//   choices: ['BACK']
// });

let editionPromptConfig = {
  name: "config_file",
  message: "new",
  required: true,
  fields: [
    { name: "name", message: "Neurone name" },
    //{name: 'db_name', message: 'Database Name', initial: 'Universe'},
    //{name: 'db_path', message: 'Database Path', initial: process.env.HOME+"/.os/UniverseDb"},
    {
      name: "description",
      initial: "A new Neurone",
      message: "Description",
    },
    {
      name: "version",
      initial: "0.0.1",
      validate(value, state, item, index) {
        if (item && item.name === "version" && !semver.valid(value)) {
          return typePrompt.styles.danger(
            "version should be a valid semver value"
          );
        }
        return true;
      },
    },
    {
      name: "creator",
      initial: process.env.USER,
    },
    {
      name: "@id",
      message: "Auto generated",
      required: false,
      initial: "http://local/base/" + uuidv4(),
    },
    // {
    //   name: 'base_opts',
    //   initial: "{ base: 'http://local/base' }",
    //   message: "base options like { base: 'http://local/base' }"
    // }
  ],
  template1: `{
    "@context": {
      "@vocab": "http://xmlns.com/foaf/0.1/",
      "homepage": { "@type": "@id" },
      "knows": { "@type": "@id" },
      "based_near": { "@type": "@id" }
    },
    "@id": "\${@id}",
    "name": "\${name}",
    "type": "\${type}",
    "description": "\${description}",
    "version": "\${version}",
    "creator": "\${creator}"
  }
  `,
  template: `
  - Name: \${name}
  - Description: \${description}
  - Type: \${type}`,
};

async function loop_root(opts) {
  let answer = null;

  while (answer != "exit") {
    let prompt = mode == "free" ? promptfree().run() : promptcmd();
    answer = await prompt;
    answer = answer.trim();
    console.log("answer", answer);
    switch (answer) {
      case "cmd":
        mode = "cmd";
        //loop_root(opts)
        break;
      case "free":
        mode = "free";
        //loop_root(opts)
        break;
      case "memory":
        opts.commander.parent.switchStorage("memory");
        break;
      case "storage":
        opts.commander.parent.switchStorage("storage");
        break;
      case "dashboard":
        console.log("dashboard");
        opts.commander.parent.modules.Dashboard.start();
        break;
      case "cd":
        console.log("cd");
        break;
      case "test":
        console.log("test");
        // await opts.commander.core.bases.levelgraphJsonld.test()

        console.log("test");
        // await opts.commander.core.bases.communitySolidServer.test()
        //loop_root(opts);
        // console.log(opts.commander.core.bases.levelgraphJsonld)
        break;
      case "new":
        console.log("new");
        let type = await typePrompt();
        if (type == "back") {
          console.log("back");
          //loop_root(opts)
        } else {
          console.log("type", type);
          let editionPrompt = new Snippet(editionPromptConfig);
          // remove the type de  editionPrompt.fields
          editionPromptConfig.fields = editionPromptConfig.fields.filter(
            (f) => f.name != "type"
          );
          editionPrompt.fields.push({ name: "type", initial: type });
          console.log("editionPrompt", editionPrompt);
          let neurone = await editionPrompt.run();
          console.log("Neurone", neurone);
          let result = await opts.commander.parent._update(neurone);
          console.log("result", result);
          //await opts.commander.core.bases.communitySolidServer.create(neurone.values)
          //loop_root(opts)
        }
        break;
      case "ls":
        console.log("ls");
        let result = await opts.commander.parent._ls();
        console.log("result", result);
        //      await opts.commander.core.bases.communitySolidServer.onCommand({command:'ls'})
        break;
      case "find":
        console.log("find");
        let what = await whatPrompt.run();
        console.log(what);
        // await opts.commander.core.bases.communitySolidServer.find({what: what})
        break;
      case "editor":
        console.log("editor");
        // await open('https://sindresorhus.com');
        // Open an app
        // console.log(JSON.stringify(openEditor, null, 2))

        // await open.openApp('atom',{arguments: ['README.md:8:5']});
        await open.openApp("code", { arguments: ["README.md:8:5"] });
        // openEditor([
        //   {
        //     file: 'readme.md',
        //     line: 10,
        //     column: 2,
        //   }
        // ]);
        break;
      case "browser":
        console.log("browser");
        await open("https://scenaristeur.github.io/ipgs");
        break;
      default:
        console.log("unknown answer", answer);
    }
  }
}

export default async function start(opts) {
  // let answer = await prompt.run()
  // console.log('Answer:', answer)
  //
  // if (answer != "exit"){
  //   start()
  // }
  loop_root(opts);
}
