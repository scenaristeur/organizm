// const { Session } = require("@inrupt/solid-client-authn-node");
import { 
    // getSessionFromStorage,
    // getSessionIdFromStorageAll,
    Session, 

    // handleIncomingRedirect
  } from "@inrupt/solid-client-authn-node";

  import { getSolidDataset,
     saveSolidDatasetAt,
       getThing,
    getStringNoLocale,
    getThingAll,
    getUrlAll, 
    addUrl,
    addStringNoLocale,
    buildThing,
    createSolidDataset,
    createThing,
    setThing,
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, FOAF, RDF } from "@inrupt/vocab-common-rdf";
// import { SOLID } from "@inrupt/vocab-solid";

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

    async ls(){
        // https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/
        // let headers = {
        //     Accept: 'application/json',
        //   }
        //   const responseRead = await this.client(
        //     "http://localhost:3000/david/truc/file.json",
        //     // this.paths[0],
        //   //  headers,
        //   )
        //   console.log('responseRead', await responseRead)
        //   let resp = await responseRead.text()
        // let resp = await this.session.fetch("http://localhost:3000/david/truc/file.json")
        //  return resp.text()
        const myDataset = await getSolidDataset(
            this.paths[0], 
            { fetch: this.session.fetch }  // fetch function from authenticated session
          );

          console.log('myDataset', myDataset)

          let things = await getThingAll(myDataset);
          console.log('things', things)
          console.log(JSON.stringify(things, null, 2))
    }


async createThing(){
    // https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/#create-a-new-thing
// Create a new SolidDataset for Writing 101
let courseSolidDataset = createSolidDataset();
// Create a new Thing for "book1"; Thing's URL will include the hash #book1.
// Use Fluent API to add properties to the new Thing, and 
// build a new Thing with the properties.
// Note: solid-client functions do not modify objects passed in as arguments. 
// Instead the functions return new objects with the modifications.
const newBookThing1 = buildThing(createThing({ name: "book1" }))
  .addStringNoLocale(SCHEMA_INRUPT.name, "ABC123 of Example Literature")
  .addUrl(RDF.type, "https://schema.org/Book")
  .build();           

// Create a new Thing for "book2"; Thing's URL will include the hash #book2.
// Use various add functions to add properties to the Thing
// Note: solid-client functions do not modify objects passed in as arguments. 
// Instead the functions return new objects with the modifications.
let newBookThing2 = createThing({ name: "book2" });
newBookThing2 = addStringNoLocale(newBookThing2, SCHEMA_INRUPT.name, "ZYX987 of Example Poetry");
newBookThing2 = addUrl(newBookThing2, RDF.type, "https://schema.org/Book");

// Update SolidDataset with the book1 and book2 Things.
// Note: solid-client functions do not modify objects passed in as arguments. 
// Instead the functions return new objects with the modifications.
courseSolidDataset = setThing(courseSolidDataset, newBookThing1);
courseSolidDataset = setThing(courseSolidDataset, newBookThing2);

  // Save the SolidDataset at the specified URL.
  // The function returns a SolidDataset that reflects your sent data
  const savedSolidDataset = await saveSolidDatasetAt(
    this.paths[0] + "/courses/Writing101",
    courseSolidDataset,
    { fetch: this.session.fetch }             // fetch from authenticated Session
  );
  return savedSolidDataset

}
}