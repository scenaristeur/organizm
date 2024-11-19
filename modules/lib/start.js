// const prompt = require('enquirer');
// const colors = require('colors');
// const pad = require('pad');
// const data = require('../lib/data');
// const open = require('open');

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { v4 as uuidv4 } from 'uuid';
const { Input, Confirm , Snippet, autocomplete } = require('enquirer');
import yosay from 'yosay';
const semver = require('semver');
// import openEditor from 'open-editor';
import open from 'open';
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
let host = "http://localhost:3000"

const whatPrompt = new Input({
  name: 'what',
  message: 'What do ou want to find?'
});

const prompt = () => autocomplete({
  header: yosay('What can I do for you？\n\
  try: \n\
  - "test" \n\
  - then "find" + henry'),
  message: '=>',
  hint: 'try "test" to initialize the base, then "ls" or "find + lulu"',
  choices: ['new',  'ls', 'find', 'test', 'touch instead of new ?', 'browser','editor','free (mode)', 'neurone (mode)', 'brain (mode)', 'world (mode)', '? help', 'quit' ]
  //choices: ['test', 'neurone', 'brain', 'world', 'other', 'create', 'read', 'update', 'delete', 'quit']
});

const typePrompt = () => autocomplete({
  header: yosay('What do you want to create'),
  message: '=>',
  hint: 'neurone, brain, world',
  choices: ['neurone', 'brain', 'world', 'other', 'back']
  //choices: ['test', 'neurone', 'brain', 'world', 'other', 'create', 'read', 'update', 'delete', 'quit']
});

// const prompt2 = () => autocomplete({
//   name: 'Options',
//   message: '=>',
//   choices: ['BACK']
// });

let editionPrompt = new Snippet({
  name: 'config_file',
  message : "edit",
  required: true,
  fields: [
    {name: 'name', message: 'Neurone name'},
    //{name: 'db_name', message: 'Database Name', initial: 'Universe'},
    //{name: 'db_path', message: 'Database Path', initial: process.env.HOME+"/.os/UniverseDb"},
    {
      name: 'description',
      initial: 'A new Neurone',
      message: "Description"
    },
    {
      name: 'version',
      initial: '0.0.1',
      validate(value, state, item, index) {
        if (item && item.name === 'version' && !semver.valid(value)) {
          return typePrompt.styles.danger('version should be a valid semver value');
        }
        return true;
      }
    },
    {
      name: 'creator',
      initial: process.env.USER
    },
    {
      name: '@id',
      message: "Auto generated",
      required: false,
      initial: "http://local/base/"+uuidv4()
    }
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
  - Type: \${type}`
});



async function loop_root(opts) {
  let answer = await prompt()
  if (answer != 'quit') {
    switch (answer) {
      case "test":
      console.log("test")
     // await opts.commander.core.bases.levelgraphJsonld.test()

     console.log('test')
      // await opts.commander.core.bases.communitySolidServer.test()
      loop_root(opts);
      // console.log(opts.commander.core.bases.levelgraphJsonld)
      break;
      case "new":
      console.log("new")
      let type = await typePrompt()
      if (type == "back"){
        loop_root(opts)
      }else{
        editionPrompt.fields.push({ name: 'type', initial: type})
        let neurone = await editionPrompt.run()
        console.log("Neurone", neurone)

        //await opts.commander.core.bases.communitySolidServer.create(neurone.values)
        loop_root(opts)
      }
      break;
      case "ls":
      console.log("ls")
console.log("ls")
//      await opts.commander.core.bases.communitySolidServer.onCommand({command:'ls'})
      break;
      case "find":
      console.log("find")
      let what = await whatPrompt.run()
      console.log(what)
      // await opts.commander.core.bases.communitySolidServer.find({what: what})
      break;
      case "editor":
      console.log("editor")
      // await open('https://sindresorhus.com');
      // Open an app
      // console.log(JSON.stringify(openEditor, null, 2))

      // await open.openApp('atom',{arguments: ['README.md:8:5']});
      await open.openApp('code',{arguments: ['README.md:8:5']});
      // openEditor([
      //   {
      //     file: 'readme.md',
      //     line: 10,
      //     column: 2,
      //   }
      // ]);
      break;
      case "browser":
      console.log("browser")
      await open('https://scenaristeur.github.io/ipgs');
      break;
      default:
      console.log("unknown answer", answer)

    }
    loop_root(opts);
    // prompt2().then(name => {
    //   console.log('creating a '+type+' with name',name)
    //   // if (answer1 === 'BACK') {
    //   // TODO can not work?
    //   loop_root();
    //   // }
    // }).catch(console.error);
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
};
