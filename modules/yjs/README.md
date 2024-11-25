## YJS 
- https://www.npmjs.com/package/y-websocket

### server

```
# without persistance
HOST=0.0.0.0 PORT=1234 npx y-websocket
# with persistance
HOST=0.0.0.0 YPERSISTENCE=$HOME/.organizm/yjsDB PORT=1234 npx y-websocket
```

or install globally

```
npm install -g y-websocket
HOST=0.0.0.0 PORT=1234 y-websocket
# with persistance
HOST=0.0.0.0 YPERSISTENCE=$HOME/.organizm/yjsDB PORT=1234 y-websocket
```

### client 


```
cd yjs
node test.js
```