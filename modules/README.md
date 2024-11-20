- example.js is a minimal example module
- commander.js is YOSAY/ENquirer command line ui to get infos gfrom user input

# Transport modules
- largely inspired from https://eve.almende.com/implementations/javascript/gettingstarted.html

## rpc-websockets
- rpc-websockets.js https://www.npmjs.com/package/rpc-websockets port orz : 151826 (o=15...)

- one server and many clients
```
# run one server (is also client)
orz rpc=serveur
# clients
orz
```


- json-rpc-2.0.js https://www.npmjs.com/package/json-rpc-2.0


## YJS 
- https://www.npmjs.com/package/y-websocket

### server
```
HOST=0.0.0.0 PORT=1234 npx y-websocket
```
or install globally
```
npm install -g y-websocket
HOST=0.0.0.0 PORT=1234 y-websocket
```