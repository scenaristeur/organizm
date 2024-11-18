import {
  //getThingName,
  // getThingAll,
  getUrlAll,
  // addUrl,
  // addStringNoLocale,
  // buildThing,
  // createSolidDataset,
  // createThing,
  // setThing
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, FOAF, RDF } from "@inrupt/vocab-common-rdf";

import chalk from "chalk";
const log = console.log;

let containersTypes = [
  "http://www.w3.org/ns/ldp#Container",
  "http://www.w3.org/ns/ldp#BasicContainer",
];

export function displayThings(things) {
  for (let i = 0; i < things.length; i++) {
    const thing = things[i];
    const types = getUrlAll(thing, RDF.type);

    // https://www.geeksforgeeks.org/how-to-find-if-two-arrays-contain-any-common-item-in-javascript/#method-4-using-javascript-arraysome-method
    let is_container = types.some((item) => containersTypes.includes(item));
    if (is_container) {
      // console.log(types);
      log(chalk.yellow(thing.url));
    } else {
      // console.log(types);
      log(chalk.cyanBright(thing.url));
    }
  }
}

export function displayPaths(paths) {
    log(chalk.green("Paths:"));
    for (let i = 0; i < paths.length; i++) {
        log(chalk.green(paths[i]));
    }
}
