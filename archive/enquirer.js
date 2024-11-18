import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// const yosay = require('yosay');
const semver = require('semver');

const { Input, Confirm , Snippet, autocomplete } = require('enquirer');
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

let SOLID_BASE_URL = "http://localhost:3000/"
let debug = true
let author_name = "fada"
let username = "scenaristeur"

const prompt = new Snippet({
  name: 'username',
  message: `Create a new thing.
The type can be nested like Agent/Human`,
  required: true,
  fields: [
    {
      name: 'author_name',
      message: 'Author Name',
      initial: author_name
    },
    {
      name: 'version',
      initial: '0.0.1',
      validate(value, state, item, index) {
        if (item && item.name === 'version' && !semver.valid(value)) {
          return prompt.styles.danger('version should be a valid semver value');
        }
        return true;
      }
    }
  ],
  template: `{
  "@type": "\${type}",
  "name": "\${name}",
  "@id": "${SOLID_BASE_URL}data/\${type}/\${name}",
  "description": "\${description}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "\${username}/\${name}",
  "license": "\${license:ISC}"
}
`

// type: "Organ",
// inpbox: ["solid", "ipfs"],
// outbox: ["solid", "ipfs"],
// inputs: [],
// outputs: [],
// listeners: [],
// emitters: []
// core_functions: "\${core_functions}"
});

async function put(data, cb) {
    // if (debug) console.log("on put jsonld", data)
// console.log("url", url)
    //   curl -X PUT -H "Content-Type: text/turtle" \
    //   -d "<ex:s> <ex:p> <ex:o>." \
    //   http://localhost:3000/myfile.ttl
    // axios.get('/user?ID=12345')
    // .then(function (response) {
    //   // handle success
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   // handle error
    //   console.log(error);
    // })
    // .finally(function () {
    //   // always executed
    // });
   return await axios({
        method: 'put',
        url: data["@id"],
        data: data
    })
        .then(function (response) {
            // handle success
           // console.log(response);
           let resp = {
            statusText: response.statusText,
            status: response.status,
            location: response.headers.location}
            cb(resp)
            return resp
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return error
        })
        .finally(function () {
            console.log("done")
            // always executed
        });

}

const mycallback = async(data) => {
  console.log("callback", data)
  return "return of the callback"
}


prompt.run()
  .then(async answer => {
    // console.log('Answer:', answer)

    console.log('Answer result:', answer.result)
    let res_string = answer.result
console.log("res_string", res_string)
    let result = JSON.parse(res_string)
console.log(result)
   let res = await put( result, mycallback)
   console.log("RES",res)
  })
  .catch(console.error);