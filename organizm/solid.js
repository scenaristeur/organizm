// const { Session } = require("@inrupt/solid-client-authn-node");
import { 
    // getSessionFromStorage,
    // getSessionIdFromStorageAll,
    Session, 

    // handleIncomingRedirect
  } from "@inrupt/solid-client-authn-node";

export class Solid {
    constructor(options ) {
        this.options = options
        this.paths = []
        this.webId = null
        this.init()
    }

    async init(){
       await this.connect()
    }

    async connect( ) {
        // https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-nodejs-script/
        let session =this.session = new Session();
        const myClientId = this.options.token_identifier
        const myClientSecret = this.options.token_secret
        const myIdentityProvider = this.options.SOLID_BASE_URL
        this.paths[0] = this.options.pod
        this.webId = this.options.webId
        session.login({
          // 2. Use the authenticated credentials to log in the session.
          clientId: myClientId,
          clientSecret: myClientSecret,
          oidcIssuer: myIdentityProvider
        }).then(() => {
          if (session.info.isLoggedIn) {
            // 3. Your session should now be logged in, and able to make authenticated requests.
            session
              // You can change the fetched URL to a private resource, such as your Pod root.
              .fetch(session.info.webId)
              .then((response) => {
                return response.text();
              })
              .then(console.log);
          }
        });
    }
}