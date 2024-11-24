export class TraiteTriplet {
  constructor(options, parent) {
    this.parent = parent;
    this.type = "TraiteTriplet"; // use this to call organizm.modules.Example.test_function("test")
    this.name = options.name;
    this.params = options.params;
    this.resources = options.resources;
  }
  async process(inputObject) {
    let subject = {};
    console.log("process function ", inputObject);
    let list_ls = await this.parent._ls();
    let list = Object.values(list_ls);
    console.log("list", list);
    let typeOfObject = "node";
    if (inputObject.value.predicate.startsWith(".")) {
      typeOfObject = "text";
    }

    console.log("typeOfObject", typeOfObject);
    console.log(list);
    let subjectExists = list.find(
      (element) => element.name == inputObject.value.subject
    );
    console.log("subjectExists", subjectExists);
    let subjectId = null;
    if (subjectExists == undefined) {
       subject ={
        name: inputObject.value.subject,
        type: "node",
      };
      subjectId = await this.parent._updateStorage(subject);
    } else {
      subjectId = subjectExists["data.json"].id;
      subject= subjectExists
    }

    if (typeOfObject == "node") {
      let objectExists = list.find(
        (element) => element.name == inputObject.value.object
      );
      let objectId = null;
      console.log("objectExists", objectExists);
      if (objectExists == undefined) {
        let object =  {}
        object={
          name: inputObject.value.object,
          type: "node",
          reverse: [
            {
              predicate: inputObject.value.predicate,
              subject: subjectId,
            },
          ],
        };

        objectId = await this.parent._updateStorage(object);
        console.log("created object objectId", objectId);
      } else {
        objectId = objectExists["data.json"].id;
      }


      console.log("doit ajoute", subjectId, inputObject.value.predicate, objectId);

    } else {
      console.log("doit ajoute la propriété à ", subjectId);
      if (typeOfObject == "node"){
        subject[inputObject.value.predicate] = objectId;
      }else{
        let prop = inputObject.value.predicate.substring(1)
        subject[prop] = inputObject.value.object;
      }
      console.log("subject", subject)
      let updated = await this.parent._updateStorage(subject);
      console.log("updated in traiteTriplet", updated);
      

    }

    return "okdav  ad";
  }
  // test_function(data){
  //   console.log("test function ", data)
  // }
  // test_function2(data){
  //   console.log("test function 2", data + this.resources.content)
  // }
  // test_parent_id(){
  //   console.log("!!!!! module access his parent id of a registered module", this.parent.id)
  // }
}

export let traiteTripletOptions = {
  name: "Name of the TraiteTriplet Module",
  params: {
    un: "1",
    deux: "2",
    trois: "3",
  },
  resources: {
    content: "du contenu",
  },
};
