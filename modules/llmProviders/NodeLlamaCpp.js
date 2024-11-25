// import { fileURLToPath } from "url";
// import path from "path";
// import { getLlama, LlamaChatSession } from "node-llama-cpp";

// // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const llama = await getLlama({
//     gpu: false
// });

export class NodeLlamaCpp {
  constructor(options, parent) {
    this.parent = parent;
    this.type = "NodeLlamaCpp"; // use this to call organizm.modules.Example.test_function("test")
    this.name = options.name;
    this.params = options.params;
    this.resources = options.resources;
    this.init();
  }
  async init() {
    console.log("init")
    const llama = await getLlama({
    gpu: false
});

let modelPath = process.env.HOME + "/.organizm/models/Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf"
      console.log("modelPath", modelPath)
    this.model = await llama.loadModel({
      modelPath:modelPath
    });

//     const context = await this.model.createContext();
//     const session = new LlamaChatSession({
//       contextSequence: context.getSequence(),
//     });

//     const q1 = "Hi there, how are you?";
//     console.log("User: " + q1);

//     const a1 = await session.prompt(q1);
//     console.log("AI: " + a1);

//     const q2 = "Summarize what you said";
//     console.log("User: " + q2);

//     const a2 = await session.prompt(q2);
//     console.log("AI: " + a2);
  }
  test_function(data) {
    console.log("test function ", data);
  }
  test_function2(data) {
    console.log("test function 2", data + this.resources.content);
  }
  test_parent_id() {
    console.log(
      "!!!!! module access his parent id of a registered module",
      this.parent.id
    );
  }
}

export let nodeLlamaCppOptions = {
  name: "Name of the NodeLlamaCpp Module",
  params: {
    un: "1",
    deux: "2",
    trois: "3",
  },
  resources: {
    content: "du contenu",
  },
};
