// const log = null

// var WebSocketServer = require('rpc-websockets').Server
import * as rpc_ws from 'rpc-websockets'

export class RpcWebsocket {
  constructor(options, parent) {
    this.parent = parent
    this.type = "RpcWebsocket" // use this to call organizm.modules.Example.test_function("test")
    this.name = options.name;
    this.params = options.params
    this.host = options.host | 'localhost'
    this.port = options.port | 51826
    this.isServer = options.isServer | false
    this.resources = options.resources
    //  log = this.log
  }
  log(data) {
    console.log("###", this.name, data)
  }
  test_function(data) {
    console.log("test function ", data)
  }
  test_function2(data) {
    console.log("###", this.name, "test function 2", data + this.resources.content)
  }
  test_parent_id() {
    console.log("!!!!! module access his parent id of a registered module", this.parent.id)
  }
  start() {
    this.log("test if server")
    if (this.isServer == true) {
      this.start_server()
    } else {
      this.log("is not server")
    }
    this.start_client()
  }
  start_server() {
    this.log("I SAY isServer", this.isServer)
    let port = this.port
    let host = this.host
    if (this.server == undefined) {
      this.log("start server")
      this.server = new rpc_ws.Server({
        port: port,
        host: host
      })
      this.log(this.server)
    }

    // register an RPC method
    this.server.register('sum', function (params) {
      return params[0] + params[1]
    })

    // ...and maybe a protected one also
    this.server.register('account', function () {
      return ['confi1', 'confi2']
    }).protected()

    // create an event
    this.server.event('feedUpdated')

    // get events
    console.log(this.server.eventList())

    // emit an event to subscribers
    this.server.emit('feedUpdated')



  }
  start_client() {
    this.log("start client")
    let module = this
    // instantiate Client and connect to an RPC server
    var ws = new rpc_ws.WebSocket('ws://' + this.host + ':' + this.port)

    ws.on('open', function () {

      console.log("~~~~~~~~~~~~", module.name, "ws OPENED", ws)
      // call an RPC method with parameters
      // ws.call('sum', [5, 3]).then(function(result) {
      //   require('assert').equal(result, 8)
      // })

      // send a notification to an RPC server
      // ws.notify('openedNewsModule')

      // // subscribe to receive an event
      // ws.subscribe('feedUpdated')

      // ws.on('feedUpdated', function() {
      //   updateLogic()
      // })

      // // unsubscribe from an event
      // ws.unsubscribe('feedUpdated')

      // // login your client to be able to use protected methods
      // ws.login({'username': 'confi1', 'password':'foobar'}).then(function() {
      //   ws.call('account').then(function(result) {
      //     require('assert').equal(result, ['confi1', 'confi2'])
      //   })
      // }).catch(function(error) {
      //   console.log('auth failed')
      // })

      // close a websocket connection
      // ws.close()
    })

  }
  stop() {
    this.log("stop")
  }
  stop_serveur() {
    this.log("stop server")
    this.server.close()
  }
  stop_client() {
    this.log("stop client")
  }


}

export let rpcWebsocketOptions = {
  "name": "RpcWebsocketModule",
  "doc": "based on https://www.npmjs.com/package/rpc-websockets",
  "host": "localhost",
  "port": 51826,
  "isServer": true,
  "params": {
    "un": "1",
    "deux": "2",
    "trois": "3"
  },
  "resources": {
    "content": "du contenu"
  }
}