import { readdir, readFile /*, writeFile, readFile*/ } from "fs/promises";

const doc = `\n###TYPES MANAGER###
-/tmls : list types
-/n [type]: create a new object of type [type]
example /n Personne
\n`;

const OrganType = {
  id: "string",
  name: "string",
  inputs: "array",
  outputs: "array",
  type: "string",
};
const PersonneType = {
  name: "string",
  type: "string",
  birthDate: "Date",
};








const types = {
  Organ: OrganType,
  Personne: PersonneType,
};

export class TypesManager {
  constructor() {
    console.log(doc);
    this.types = types;
  }

  ls() {
    console.log(Object.keys(this.types));
    //return Object.keys(this.types)
  }
  new(params) {
    console.log(params);
    console.log(this.types[params]);
  }
  // constructor(
  //   options = {
  //     update: "auto",
  //   }
  // ) {
  //   this.options = options;
  //   if (this.options.update && this.options.update == "auto") {
  //     this.update();
  //   }
  //   console.log(doc)
  // }

  // async update() {
  //   console.log("typesManager", this.options);
  //   this.imports = await this.getLocalClasses();
  //   console.log("imports", this.imports);
  // }

  // async getLocalClasses() {
  //   this.classes = await readdir("./classes/", { withFileTypes: true })
  //   return  await this.classes.map(async (dirent) => {
  //   console.log("import", dirent.name)
  //   // return await readFile("./classes/" + dirent.name)
  //   return readFile("./classes/" + dirent.name, (err, data) => {
  //     if (err) throw err;
  //     console.log(data);
  //     return data
  //   });

  //     // dirent.name
  //   })
  //     // .filter((dirent) => dirent.isDirectory())
  //     // .map((dirent) => dirent.name);

  //   // console.log("classes", classes);

  //   // const getDirectories = async (source) =>
  //   //   (await readdir(source, { withFileTypes: true }))
  //   //     .filter((dirent) => dirent.isDirectory())
  //   //     .map((dirent) => dirent.name);

  //   // console.log(
  //   //   "\nDB list of" + config.DBS_FOLDER,
  //   //   " : ",
  //   //   await getDirectories(config.DBS_FOLDER)
  //   // );
  // }
  // ls(){
  //   console.log("imports", this.imports)
  // }

  // add(input) {
  //   this.history.push(input);
  // }

  // get() {
  //   console.log("get");
  //   return this.history;
  // }
}
