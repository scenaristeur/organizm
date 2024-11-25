import { fileURLToPath } from "url";
import path from "path";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let modelPath = process.env.HOME + "/.organizm/models/Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf"

console.log("modelPath", modelPath)
const llama = await getLlama({gpu: false});
const model = await llama.loadModel({
    modelPath: modelPath
//   modelPath: path.join(
//     __dirname,
//     "models",
//     "Meta-Llama-3-8B-Instruct.Q4_K_M.gguf"
//   ),
});
const context = await model.createContext();
const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
});

const q1 = "Hi there, how are you?";
console.log("User: " + q1);

const a1 = await session.prompt(q1);
console.log("AI: " + a1);

const q2 = "Summarize what you said";
console.log("User: " + q2);

const a2 = await session.prompt(q2);
console.log("AI: " + a2);
