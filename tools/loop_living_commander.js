import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { v4 as uuidv4 } from 'uuid';
import yosay from 'yosay';
import open from 'open';

const { Input, Confirm , Snippet, autocomplete } = require('enquirer');
// const yosay = require('yosay');
const semver = require('semver');

// import openEditor from 'open-editor';
// import open from 'open'

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
  choices: ['new', 'ls', 'cd [path]', '? help', 'quit']
//   choices: ['new',  'ls', 'find', 'test', 'touch instead of new ?', 'browser','editor','free (mode)', 'neurone (mode)', 'brain (mode)', 'world (mode)', '? help', 'quit' ]
  //choices: ['test', 'neurone', 'brain', 'world', 'other', 'create', 'read', 'update', 'delete', 'quit']
});

const typePrompt = () => autocomplete({
  header: yosay('What do you want to create'),
  message: '=>',
  hint: 'neurone, brain, world',
  choices: ['organ', 'neurone', 'brain', 'world', 'other', 'back']
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
    {name: 'name', message: 'Organ name'},
    //{name: 'db_name', message: 'Database Name', initial: 'Universe'},
    //{name: 'db_path', message: 'Database Path', initial: process.env.HOME+"/.os/UniverseDb"},
    {
      name: 'description',
      initial: 'A new Organ',
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
      initial: "http://localhost:3000/data/"+process.env.USER+"/organ/"+uuidv4()
    }
    // {
    //   name: 'base_opts',
    //   initial: "{ base: 'http://local/base' }",
    //   message: "base options like { base: 'http://local/base' }"
    // }
  ],
  template: `{
    "@context": {
      "@vocab": "http://xmlns.com/foaf/0.1/",
      "homepage": { "@type": "@id" },
      "knows": { "@type": "@id" },
      "based_near": { "@type": "@id" }
    },
    "@id": "\${@id}",
  - Name: \${name}
  - Description: \${description}
  - Type: \${type},
    "version": "\${version}",
    "creator": "\${creator}"
  }  `,
  template2: `
  - Name: \${name}
  - Description: \${description}
  - Type: \${type}`
});



export async function loop_living_commander(opts) {
    let loop_living_commander = this
    let answer = await prompt()
    if (answer != 'quit') {
        process.stdin.on("keypress", (_, key) => {
            if (key.name === "escape") {
            //   exit();
            
            loop_living_commander(opts).bind(this) 
            }
          
            // else {
            //   console.log(key.name);
            // }
          });
      switch (answer) {
        case "test":
        console.log("test")
       // await opts.commander.core.bases.levelgraphJsonld.test()
       console.log("doing test")
        //await opts.commander.core.bases.communitySolidServer.test()
        loop_living_commander(opts);
        // console.log(opts.commander.core.bases.levelgraphJsonld)
        break;
        case "new":
        console.log("new")
        let type = await typePrompt()
        if (type == "back"){
            loop_living_commander(opts)
        }else{
          editionPrompt.fields.push({ name: 'type', initial: type})
          let neurone = await editionPrompt.run()
          console.log("Neurone", neurone)
          console.log("doing create")

        //   await opts.commander.core.bases.communitySolidServer.create(neurone.values)
        }
        break;
        case "ls":
        console.log("ls")
        console.log("doing ls")

        // await opts.commander.core.bases.communitySolidServer.onCommand({command:'ls'})
        break;
        case "find":
        console.log("find")
        let what = await whatPrompt.run()
        console.log(what)
        console.log("doing find")

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
      loop_living_commander(opts);
}
}