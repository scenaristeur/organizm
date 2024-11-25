// https://www.npmjs.com/package/y-websocket
import * as Y from "yjs";
import * as W from "y-websocket";
import * as awarenessProtocol from 'y-protocols/awareness.js'
import WebSocket from "ws";

import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const config = {
  dictionaries: [adjectives, colors, animals]
}

const characterName = uniqueNamesGenerator(config); // red_big_donkey


const ydoc = new Y.Doc()

const wsProvider = new W.WebsocketProvider(
  // "wss://ylm-websocket.glitch.me",
  "ws://0.0.0.0:1234",
  'my-roomname',
  ydoc,
  {
    WebSocketPolyfill: WebSocket,
    awareness: new awarenessProtocol.Awareness(ydoc)
  },

);
wsProvider.on('status', event => {
  console.log(event.status)
})

// All of our network providers implement the awareness crdt
const awareness = wsProvider.awareness

// You can observe when a user updates their awareness information
awareness.on('change', changes => {
  // Whenever somebody updates their awareness information,
  // we log all awareness information from all users.
  console.log(Array.from(awareness.getStates().values()))
})

// You can think of your own awareness information as a key-value store.
// We update our "user" field to propagate relevant user information.
awareness.setLocalStateField('user', {
  // Define a print name that should be displayed
  name: characterName,
  // Define a color that should be associated to the user:
  color: '#ffb61e' // should be a hex color
})

// UPDATES 

const ymap = ydoc.getMap('my map type')
ymap.observe(ymapEvent => {
  console.log("\n")
  ymapEvent.target === ymap // => true

  // Find out what changed: 
  // Option 1: A set of keys that changed
  ymapEvent.keysChanged // => Set<strings>
  // Option 2: Compute the differences
  ymapEvent.changes.keys // => Map<string, { action: 'add'|'update'|'delete', oldValue: any}>

  // sample code.
  ymapEvent.changes.keys.forEach((change, key) => {
    let value = ymap.get(key)
    console.log("--->", typeof ymap.get(key))
    if (typeof ymap.get(key) == 'object') {
     value = JSON.stringify(ymap.get(key), null, undefined)
    }
    let oldvalue = change.oldValue
    console.log("--->", typeof oldvalue)
    if (typeof oldvalue == 'object') {
     value = JSON.stringify(oldvalue, null, undefined)
    }

    if (change.action === 'add') {
      console.log(`Property "${key}" was added. Initial value: "${value}".`)
    } else if (change.action === 'update') {
      console.log(`Property "${key}" was updated. New value: "${value}". Previous value: "${change.oldValue}".`)
    } else if (change.action === 'delete') {
      console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
    }
  })
})

// https://docs.yjs.dev/getting-started/working-with-shared-types
const messages = ydoc.getArray('messages')

messages.observe(event => {
  // Log a delta every time the type changes
  // Learn more about the delta format here: https://quilljs.com/docs/delta/
  console.log('delta:', event.changes.delta)
  let conversation = messages.toArray()
  console.log("conversation", conversation)
})



const make_update = function () {
  console.log("update")
  // Method 1: Define a top-level type

  // Method 2: Define Y.Map that can be included into the Yjs document
  const ymapNested = new Y.Map()

  // Nested types can be included as content into any other shared type
  ymap.set('my nested map', ymapNested)
  ymapNested.set('last speaker', characterName)

  // Common methods
  ymap.set('prop-name', 'value') // value can be anything json-encodable
  ymap.set('date', Date.now()) // value can be anything json-encodable
  ymap.get('prop-name') // => 'value'
  ymap.delete('prop-name')

  messages.insert(0,[{'role': 'orz', 'name': characterName, /*'senderId',*/ 'content' : 'il est '+new Date().toLocaleTimeString()+' et tout va bien...'}])
}

var t = setInterval(make_update, 5000);

// clearInterval(t);