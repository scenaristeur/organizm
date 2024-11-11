
// import { 
//     // getSessionFromStorage,
//     // getSessionIdFromStorageAll,
//     Session, 

//     // handleIncomingRedirect
//   } from "@inrupt/solid-client-authn-node";

import {
    createDpopHeader,
    generateDpopKeyPair,
    buildAuthenticatedFetch,
  } from '@inrupt/solid-client-authn-core'

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
        const id = this.options.token_identifier
        const secret = this.options.token_secret
        this.paths[0] = this.options.pod
        this.webId = this.options.webId
  
        // A key pair is needed for encryption.
        // This function from `solid-client-authn` generates such a pair for you.
        const dpopKey = await generateDpopKeyPair()
  
        // These are the ID and secret generated in the previous step.
        // Both the ID and the secret need to be form-encoded.
        const authString = `${encodeURIComponent(id)}:${encodeURIComponent(secret)}`
        // This URL can be found by looking at the "token_endpoint" field at
        // http://localhost:3000/.well-known/openid-configuration
        // if your server is hosted at http://localhost:3000/.
        const tokenUrl = this.options.SOLID_BASE_URL + '/.oidc/token'

        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            // The header needs to be in base64 encoding.
            // https://stackoverflow.com/questions/43842793/basic-authentication-with-fetch
            authorization: `Basic ${btoa(authString)}`,
            'content-type': 'application/x-www-form-urlencoded',
            dpop: await createDpopHeader(tokenUrl, 'POST', dpopKey),
          },
          body: 'grant_type=client_credentials&scope=webid',
        })
  
        // This is the Access token that will be used to do an authenticated request to the server.
        // The JSON also contains an "expires_in" field in seconds,
        // which you can use to know when you need request a new Access token.
        const { access_token: accessToken } = await response.json()
        // console.log('accessToken', accessToken)
  
        // The DPoP key needs to be the same key as the one used in the previous step.
        // The Access token is the one generated in the previous step.
        const authFetch = await buildAuthenticatedFetch(accessToken, { dpopKey })
        // authFetch can now be used as a standard fetch function that will authenticate as your WebID.
        // This request will do a simple GET for example.


      this.client = authFetch
    }

    async ls() {
        let headers = {
            Accept: 'application/json',
          }
          const responseRead = await this.client(
            "http://localhost:3000/david/truc/file.json",
            // this.paths[0],
          //  headers,
          )
          console.log('responseRead', await responseRead)
    let resp = await responseRead.text()
         return resp
    }

    async test(){
        // const response3 = await this.client('http://localhost:3000/private')
  
        // console.log('response3', response3)
      let responsePUT = await this.client(
        'http://localhost:3000/david/truc/file.json',
        {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          // The name field will be used when generating the ID of your token.
          // The WebID field determines which WebID you will identify as when using the token.
          // Only WebIDs linked to your account can be used.
          body: JSON.stringify({
            name: 'mon fichier',
            webId: 'http://localhost:3000/david/profile/card#me',
            type: 'aztek',
          }),
        },
      )

      console.log('responsePUT', responsePUT.status)

      let headers = {
        Accept: 'application/json',
      }
      const responseRead = await this.client(
        'http://localhost:3000/david/truc/file.json',
        headers,
      )

      console.log('responseRead', await responseRead.json())
    }


























    async client1(options ) {
        console.log("options", options)
        // https://github.com/inrupt/solid-client-authn-js/blob/main/packages/node/examples/demoClientApp/src/index.js
        // https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-nodejs-web-server/
        // return new SolidClient(options)
        console.log("init client", options)
        // let session = await getSessionFromStorage();
        // console.log("session", session)
        let loginStatus = this.session && this.session.info.isLoggedIn
        ? `Logged in as [${this.session.info.webId}]`
        : `Not logged in`;
console.log("loginStatus", loginStatus)

try {
    let oidcIssuer  = this.options.oidcIssuer
    let clientApplicationName = this.options.clientApplicationName
    await this.session.login({
      redirectUrl: "http://localhost:3001/redirect",
      oidcIssuer,
      clientName: clientApplicationName,
      handleRedirect: (data) => {
        console.log("redirect", data);
        // res.writeHead(302, {
        //   location: data,
        // });
        // res.end();
      },
    });

    loginStatus = `Login called, expecting redirect function to redirect the user's browser now...`;
    console.info(loginStatus);
  } catch (error) {
    loginStatus = `Login attempt failed: [${error}]`;
    console.error(loginStatus);
    // sendHtmlResponse(res);
  }

        // const session = new Session(
        //     {
        //       clientAuthentication: getClientAuthenticationWithDependencies({})
        //     },
        //     "mySession"
        //   );

        // if (!session) {
        //   // 1. Create a new Session
        //   await login({
        //     oidcIssuer: 'http://localhost:3000',
        //     redirectUrl: new URL('/', window.location.href).toString(),
        //     clientName: 'Smag Studio',
        //   })


        // }


        // let handle_redirect = await handleIncomingRedirect()
        // console.log("redirect", handle_redirect)
          // 1. Create a new Session
//   const session = new Session({ keepAlive: false }); // Turn off periodic refresh of the Session in background
// //   req.session.sessionId = session.info.sessionId;
//   const redirectToSolidIdentityProvider = (url) => {
//     // Since we use Express in this example, we can call `res.redirect` to send the user to the
//     // given URL, but the specific method of redirection depend on your app's particular setup.
//     // For example, if you are writing a command line app, this might simply display a prompt for
//     // the user to visit the given URL in their browser.
//     // res.redirect(url);
//     console.log("url", url)
//   };
//   // 2. Start the login process; redirect handler will handle sending the user to their
//   //    Solid Identity Provider.
//   await session.login({
//     // After login, the Solid Identity Provider will send the user back to the following
//     // URL, with the data necessary to complete the authentication process
//     // appended as query parameters:
//    // redirectUrl: `http://localhost:${port}/login/callback`,
//     // Set to the user's Solid Identity Provider; e.g., "https://login.inrupt.com" 
//     oidcIssuer: "https://login.inrupt.com",
//     // Pick an application name that will be shown when asked 
//     // to approve the application's access to the requested data.
//     clientName: "Demo app",
//     //handleRedirect: redirectToSolidIdentityProvider,
//   });
    }
  
    async put(triple) {
console.log(this.client)
    }



}