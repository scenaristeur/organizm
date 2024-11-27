// https://github.com/langchain-ai/langgraphjs/blob/main/examples/multi_agent/hierarchical_agent_teams.ipynb
// https://www.youtube.com/watch?v=hvAPnpSfSGo
// little team https://github.com/langchain-ai/langgraphjs/blob/main/examples/multi_agent/agent_supervisor.ipynb
// custom https://langchain-ai.github.io/langgraph/concepts/multi_agent/#multi-agent-architectures
// https://langchain-ai.github.io/langgraph/concepts/multi_agent/#custom-multi-agent-workflow
// https://langchain-ai.github.io/langgraph/tutorials/#agent-architectures
// https://langchain-ai.github.io/langgraph/tutorials/#chatbots
import "dotenv/config";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { createRequire } from "module";
const require = createRequire(import.meta.url);


const { Input } = require("enquirer");



const tavilyTool = new TavilySearchResults();

const scrapeWebpage = tool(async (input) => {
    const loader = new CheerioWebBaseLoader(input.url);
    const docs = await loader.load();
    const formattedDocs = docs.map(
      (doc) =>
        `<Document name="${doc.metadata?.title}">\n${doc.pageContent}\n</Document>`,
    );
    return formattedDocs.join("\n\n");
  },
  {
    name: "scrape_webpage",
    description: "Scrape the contents of a webpage.",
    schema: z.object({
      url: z.string(),
    }),
  }
)


// require("esm-hook"); // Only for running this in TSLab in Jupyter. See: https://github.com/yunabe/tslab/issues/72
// ----------ATTENTION----------
// If attempting to run this notebook locally, you must follow these instructions
// to install the necessary system dependencies for the `canvas` package.
// https://www.npmjs.com/package/canvas#compiling
// -----------------------------
import { createCanvas } from "canvas";
import * as d3 from "d3";
import * as tslab from "tslab";
import * as fs from "fs/promises";
import * as path from "path";


const WORKING_DIRECTORY = "./temp";
fs.mkdir(WORKING_DIRECTORY, { recursive: true });

const createOutlineTool = tool(
  async ({ points, file_name }) => {
    const filePath = path.join(WORKING_DIRECTORY, file_name);
    const data = points
      .map((point, index) => `${index + 1}. ${point}\n`)
      .join("");
    await fs.writeFile(filePath, data);
    return `Outline saved to ${file_name}`;
  },
  {
    name: "create_outline",
    description: "Create and save an outline.",
    schema: z.object({
      points: z
        .array(z.string())
        .nonempty("List of main points or sections must not be empty."),
      file_name: z.string(),
    }),
  }
);

const readDocumentTool = tool(
  async ({ file_name, start, end }) => {
    const filePath = path.join(WORKING_DIRECTORY, file_name);
    const data = await fs.readFile(filePath, "utf-8");
    const lines = data.split("\n");
    return lines.slice(start ?? 0, end).join("\n");
  },
  {
    name: "read_document",
    description: "Read the specified document.",
    schema: z.object({
      file_name: z.string(),
      start: z.number().optional(),
      end: z.number().optional(),
    }),
  }
);

const writeDocumentTool = tool(
  async ({ content, file_name }) => {
    const filePath = path.join(WORKING_DIRECTORY, file_name);
    await fs.writeFile(filePath, content);
    return `Document saved to ${file_name}`;
  },
  {
    name: "write_document",
    description: "Create and save a text document.",
    schema: z.object({
      content: z.string(),
      file_name: z.string(),
    }),
  }
);

const editDocumentTool = tool(
  async ({ file_name, inserts }) => {
    const filePath = path.join(WORKING_DIRECTORY, file_name);
    const data = await fs.readFile(filePath, "utf-8");
    let lines = data.split("\n");

    const sortedInserts = Object.entries(inserts).sort(
      ([a], [b]) => parseInt(a) - parseInt(b),
    );

    for (const [line_number_str, text] of sortedInserts) {
      const line_number = parseInt(line_number_str);
      if (1 <= line_number && line_number <= lines.length + 1) {
        lines.splice(line_number - 1, 0, text);
      } else {
        return `Error: Line number ${line_number} is out of range.`;
      }
    }

    await fs.writeFile(filePath, lines.join("\n"));
    return `Document edited and saved to ${file_name}`;
  },
  {
    name: "edit_document",
    description: "Edit a document by inserting text at specific line numbers.",
    schema: z.object({
      file_name: z.string(),
      inserts: z.record(z.number(), z.string()),
    }),
  }
);

const chartTool = tool(
  async ({ data }) => {
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorPalette = [
      "#e6194B",
      "#3cb44b",
      "#ffe119",
      "#4363d8",
      "#f58231",
      "#911eb4",
      "#42d4f4",
      "#f032e6",
      "#bfef45",
      "#fabebe",
    ];

    data.forEach((d, idx) => {
      ctx.fillStyle = colorPalette[idx % colorPalette.length];
      ctx.fillRect(
        x(d.label) ?? 0,
        y(d.value),
        x.bandwidth(),
        height - margin.bottom - y(d.value),
      );
    });

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    x.domain().forEach((d) => {
      const xCoord = (x(d) ?? 0) + x.bandwidth() / 2;
      ctx.fillText(d, xCoord, height - margin.bottom + 6);
    });

    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const ticks = y.ticks();
    ticks.forEach((d) => {
      const yCoord = y(d);
      ctx.moveTo(margin.left, yCoord);
      ctx.lineTo(margin.left - 6, yCoord);
      ctx.stroke();
      ctx.fillText(d.toString(), margin.left - 8, yCoord);
    });

    // tslab.display.png(canvas.toBuffer());
    let img = canvas.toDataURL("image/png");
    var data = img.replace(/^data:image\/\w+;base64,/, "");
var buf = Buffer.from(data, 'base64');
fs.writeFile('./temp/image.png', buf, /* callback will go here */);

    return "Chart has been generated and displayed to the user!";
  },
  {
    name: "generate_bar_chart",
    description:
      "Generates a bar chart from an array of data points using D3.js and displays it for the user.",
    schema: z.object({
      data: z
        .object({
          label: z.string(),
          value: z.number(),
        })
        .array(),
    }),
  }
);

// UTILITIES
// import { z } from "zod";
import { HumanMessage, BaseMessage, SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { JsonOutputToolsParser } from "langchain/output_parsers";
// import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { Runnable } from "@langchain/core/runnables";
// import { StructuredToolInterface } from "@langchain/core/tools";

const agentMessageModifier = (
  systemPrompt,
  tools,
  teamMembers,  
) => {
  const toolNames = tools.map((t) => t.name).join(", ");
  const systemMsgStart = new SystemMessage(systemPrompt +
    "\nWork autonomously according to your specialty, using the tools available to you." +
    " Do not ask for clarification." +
    " Your other team members (and other teams) will collaborate with you with their own specialties." +
    ` You are chosen for a reason! You are one of the following team members: ${teamMembers.join(", ")}.
      Supervisor instructions: ${systemPrompt}\n` +
      `Remember, you individually can only use these tools: ${toolNames}` +
      "\n\nEnd if you have already completed the requested task. Communicate the work completed.");

  return (messages) => 
    [systemMsgStart, ...messages/*, systemMsgEnd*/];
}

async function runAgentNode(params) {
  const { state, agent, name } = params;
  // console.log("runAgentNode", state, agent, name)
  const result = await agent.invoke({
    messages: state.messages,
  });
  const lastMessage = result.messages[result.messages.length - 1];
  return {
    messages: [new HumanMessage({ content: lastMessage.content, name })],
  };
}

async function createTeamSupervisor(
  llm,
  systemPrompt,
  members
) {
  const options = ["FINISH", ...members];
  const routeTool = {
    name: "route",
    description: "Select the next role.",
    schema: z.object({
      reasoning: z.string(),
      next: z.enum(["FINISH", ...members]),
      instructions: z.string().describe("The specific instructions of the sub-task the next role should accomplish."),
    })
  }
  let prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("messages"),
    [
      "user",
      "Given the conversation above, who should act next? Or should we FINISH? Select one of: {options}",
    ],
  ]);
  prompt = await prompt.partial({
    options: options.join(", "),
    team_members: members.join(", "),
  });

  const supervisor = prompt
    .pipe(
      llm.bindTools([routeTool], {
        tool_choice: "route",
      }),
    )
    .pipe(new JsonOutputToolsParser())
    // select the first one
    .pipe((x) => ({
      next: x[0].args.next,
      instructions: x[0].args.instructions,
    }));

  return supervisor;
}


// RESEARCH TEAM

// import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const ResearchTeamState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
  }),
  team_members: Annotation({
    reducer: (x, y) => x.concat(y),
  }),
  next: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "supervisor",
  }),
  instructions: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "Solve the human's question.",
  }),
})

const llm = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
  temperature: 0,
}) //new ChatOpenAI({ modelName: "gpt-4o" });

const searchNode = (state) => {
  const messageModifier = agentMessageModifier(
    "You are a research assistant who can search for up-to-date info using the tavily search engine.",
    [tavilyTool],
    state.team_members ?? ["Search"],
  )
  const searchAgent = createReactAgent({
    llm,
    tools: [tavilyTool],
    messageModifier,
  })
  return runAgentNode({ state, agent: searchAgent, name: "Search" });
};

const researchNode = (state) => {
  const messageModifier = agentMessageModifier(
    "You are a research assistant who can scrape specified urls for more detailed information using the scrapeWebpage function.",
    [scrapeWebpage],
    state.team_members ?? ["WebScraper"],
  )
  const researchAgent = createReactAgent({
    llm,
    tools: [scrapeWebpage],
    messageModifier,
  })
  return runAgentNode({ state, agent: researchAgent, name: "WebScraper" });
}

const supervisorAgent = await createTeamSupervisor(
  llm,
  "You are a supervisor tasked with managing a conversation between the" +
    " following workers:  {team_members}. Given the following user request," +
    " respond with the worker to act next. Each worker will perform a" +
    " task and respond with their results and status. When finished," +
    " respond with FINISH.\n\n" +
    " Select strategically to minimize the number of steps taken.",
  ["Search", "WebScraper"],
);

import { END, START, StateGraph } from "@langchain/langgraph";

const researchGraph = new StateGraph(ResearchTeamState)
  .addNode("Search", searchNode)
  .addNode("supervisor", supervisorAgent)
  .addNode("WebScraper", researchNode)
  // Define the control flow
  .addEdge("Search", "supervisor")
  .addEdge("WebScraper", "supervisor")
  .addConditionalEdges("supervisor", (x) => x.next, {
    Search: "Search",
    WebScraper: "WebScraper",
    FINISH: END,
  })
  .addEdge(START, "supervisor");

const researchChain = researchGraph.compile();

// Document writing team 

import { RunnableLambda } from "@langchain/core/runnables";

const prelude = new RunnableLambda({
  func: async (state) => {
    let writtenFiles= [];
    if (
      !(await fs
        .stat(WORKING_DIRECTORY)
        .then(() => true)
        .catch(() => false))
    ) {
      await fs.mkdir(WORKING_DIRECTORY, { recursive: true });
    }
    try {
      const files = await fs.readdir(WORKING_DIRECTORY);
      for (const file of files) {
        writtenFiles.push(file);
      }
    } catch (error) {
      console.error(error);
    }
    const filesList = writtenFiles.length > 0
      ? "\nBelow are files your team has written to the directory:\n" +
        writtenFiles.map((f) => ` - ${f}`).join("\n")
      : "No files written.";
    return { ...state, current_files: filesList };
  },
});

// This defines the agent state for the document writing team
const DocWritingState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
  }),
  team_members: Annotation({
    reducer: (x, y) => x.concat(y),
  }),
  next: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "supervisor",
  }),
  current_files: Annotation({
    reducer: (x, y) => (y ? `${x}\n${y}` : x),
    default: () => "No files written.",
  }),
  instructions: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "Solve the human's question.",
  }),
})


const docWritingLlm = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
  temperature: 0,
})
//new ChatOpenAI({ modelName: "gpt-4o" });

const docWritingNode = (state) => {
  const messageModifier = agentMessageModifier(
    `You are an expert writing a research document.\nBelow are files currently in your directory:\n${state.current_files}`,
    [writeDocumentTool, editDocumentTool, readDocumentTool],
    state.team_members ?? [],
  )
  const docWriterAgent = createReactAgent({
    llm: docWritingLlm,
    tools: [writeDocumentTool, editDocumentTool, readDocumentTool],
    messageModifier,
  })
  const contextAwareDocWriterAgent = prelude.pipe(docWriterAgent);
  return runAgentNode({ state, agent: contextAwareDocWriterAgent, name: "DocWriter" });
}

const noteTakingNode = (state) => {
  const messageModifier = agentMessageModifier(
    "You are an expert senior researcher tasked with writing a paper outline and" +
    ` taking notes to craft a perfect paper. ${state.current_files}`,
    [createOutlineTool, readDocumentTool],
    state.team_members ?? [],
  )
  const noteTakingAgent = createReactAgent({
    llm: docWritingLlm,
    tools: [createOutlineTool, readDocumentTool],
    messageModifier,
  })
  const contextAwareNoteTakingAgent = prelude.pipe(noteTakingAgent);
  return runAgentNode({ state, agent: contextAwareNoteTakingAgent, name: "NoteTaker" });
}

const chartGeneratingNode = async (
  state) => {
  const messageModifier = agentMessageModifier(
    "You are a data viz expert tasked with generating charts for a research project." +
    `${state.current_files}`,
    [readDocumentTool, chartTool],
    state.team_members ?? [],
  )
  const chartGeneratingAgent = createReactAgent({
    llm: docWritingLlm,
    tools: [readDocumentTool, chartTool],
    messageModifier,
  })
  const contextAwareChartGeneratingAgent = prelude.pipe(chartGeneratingAgent);
  return runAgentNode({ state, agent: contextAwareChartGeneratingAgent, name: "ChartGenerator" });
}

const docTeamMembers = ["DocWriter", "NoteTaker", "ChartGenerator"];
const docWritingSupervisor = await createTeamSupervisor(
  docWritingLlm,
  "You are a supervisor tasked with managing a conversation between the" +
    " following workers:  {team_members}. Given the following user request," +
    " respond with the worker to act next. Each worker will perform a" +
    " task and respond with their results and status. When finished," +
    " respond with FINISH.\n\n" +
    " Select strategically to minimize the number of steps taken.",
  docTeamMembers,
);

// Create the graph here:
const authoringGraph = new StateGraph(DocWritingState)
  .addNode("DocWriter", docWritingNode)
  .addNode("NoteTaker", noteTakingNode)
  .addNode("ChartGenerator", chartGeneratingNode)
  .addNode("supervisor", docWritingSupervisor)
  // Add the edges that always occur
  .addEdge("DocWriter", "supervisor")
  .addEdge("NoteTaker", "supervisor")
  .addEdge("ChartGenerator", "supervisor")
  // Add the edges where routing applies
  .addConditionalEdges("supervisor", (x) => x.next, {
    DocWriter: "DocWriter",
    NoteTaker: "NoteTaker",
    ChartGenerator: "ChartGenerator",
    FINISH: END,
  })
  .addEdge(START, "supervisor");

const enterAuthoringChain = RunnableLambda.from(
  ({ messages }) => {
    return {
      messages: messages,
      team_members: ["Doc Writer", "Note Taker", "Chart Generator"],
    };
  },
);
const authoringChain = enterAuthoringChain.pipe(authoringGraph.compile());

// ADD LAYERS
// Define the top-level State interface
const State = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
  }),
  next: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "ResearchTeam",
  }),
  instructions: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "Resolve the user's request.",
  }),
});

const supervisorNode = await createTeamSupervisor(
  llm,
  "You are a supervisor tasked with managing a conversation between the" +
    " following teams: {team_members}. Given the following user request," +
    " respond with the worker to act next. Each worker will perform a" +
    " task and respond with their results and status. When finished," +
    " respond with FINISH.\n\n" +
    " Select strategically to minimize the number of steps taken.",
  ["ResearchTeam", "PaperWritingTeam"],
);

const getMessages = RunnableLambda.from((state) => {
  return { messages: state.messages };
});

const joinGraph = RunnableLambda.from((response) => {
  return {
    messages: [response.messages[response.messages.length - 1]],
  };
});

const superGraph = new StateGraph(State)
  .addNode("ResearchTeam", async (input) => {
    // console.log("ResearchTeam", input)
    const getMessagesResult = await getMessages.invoke(input);
    // console.log("getMessagesResult", getMessagesResult)
    const researchChainResult = await researchChain.invoke({
      messages: getMessagesResult.messages,
    });
    // console.log("researchChainResult", researchChainResult)
    const joinGraphResult = await joinGraph.invoke({
      messages: researchChainResult.messages,
    });
  })
  .addNode("PaperWritingTeam", getMessages.pipe(authoringChain).pipe(joinGraph))
  .addNode("supervisor", supervisorNode)
  .addEdge("ResearchTeam", "supervisor")
  .addEdge("PaperWritingTeam", "supervisor")
  .addConditionalEdges("supervisor", (x) => x.next, {
    PaperWritingTeam: "PaperWritingTeam",
    ResearchTeam: "ResearchTeam",
    FINISH: END,
  })
  .addEdge(START, "supervisor");

const compiledSuperGraph = superGraph.compile();

export class LangGraphLlm {
  constructor(options, parent) {
    this.parent = parent;
    this.type = "LangGraphLlm"; // use this to call organizm.modules.Example.test_function("test")
    this.name = options.name;
    this.params = options.params;
    this.resources = options.resources;
    // console.log("env", process.env) 
    // TAVILY_API_KEY: // ANTHROPIC_API_KEY:
    //this.init();
  }

  async run(team){
    console.log("team", team)
// console.log( "this.parent", this.parent)
// console.log(this.parent.organs)
if (team.agents!= undefined && team.agents.length>0){
  

let ids = team.agents.map((agent) => agent.id)
console.log(ids)
// console.log(this.parent.organs)
let agents = Object.values(this.parent.organs).filter(org => {
  let data = org['data.json']
  console.log(data)
  
  if(ids.includes(data.id)){return true}

})
console.log("agents", agents)

let langAgents= agents.map((agent) => {
  let prompt = agent['data.json'].prompt
  return {name: agent['data.json'].name, agent: createReactAgent({ llm: llm,  tools: [], messageModifier: prompt })}
})

// console.log("langAgents", langAgents)





const prompt = new Input({
  message: 'Quelle est ta question ?',
  // initial: 'jonschlinkert'
});

let answer = await prompt.run()




let conditions = {
  // PaperWritingTeam: "PaperWritingTeam",
  // ResearchTeam: "ResearchTeam",
  FINISH: END,
}
let myGraph = new StateGraph(State)

let members = langAgents.map((agent) => agent.name)
console.log("members", members)

// let supervisorPrompt =   `You are a supervisor tasked with managing a conversation between the 
// following teams: {team_members}. Given the following user request,
// respond with the worker to act next. Each worker will perform a 
// task and respond with their results and status. When finished,
// respond with FINISH.

// Select strategically to minimize the number of steps taken.
// ${members.join(", ")}`

// console.log("supervisorPrompt", supervisorPrompt)

for (let i = 0; i < langAgents.length; i++) {
  let agent = langAgents[i]
  let agentName = agent.name
  console.log("agentName", agentName)
  myGraph.addNode(agentName, agent.agent)
conditions[agentName] = agentName
myGraph.addEdge(agentName, "supervisor")
}

const supNode = await createTeamSupervisor(
  llm,
  "You are a supervisor tasked with managing a conversation between the" +
    " following workers:  {team_members}. Given the following user request," +
    " respond with the worker to act next. Each worker will perform a" +
    " task and respond with their results and status. When finished," +
    " respond with FINISH.\n\n" +
    " Select strategically to minimize the number of steps taken.",
  members,
);


 

myGraph.addConditionalEdges("supervisor", (x) => x.next, conditions)
  .addEdge(START, "supervisor")
  .addNode("supervisor", supNode)

const compiledmyGraph = myGraph.compile();
  // .then(answer => console.log('Answer:', answer))
  // .catch(console.log);


  let resultStream = compiledmyGraph.stream(
    {
      messages: [
        new HumanMessage(
          answer,
        ),
      ],
    },
    { recursionLimit: 10 },
  );
  
  for await (const step of await resultStream) {
    if (!step.__end__) {
      console.log(step);
      console.log("---");
    }
  }
  

  }else{
    console.log("no agents in this team, use 'edit Team' to add them")
  }





  }

async runOk(){
  // Example invocation
let result = await writeDocumentTool.invoke({
  content: "Hello from LangGraph!",
  file_name: "hello.txt",
});

console.log("\n#########\n THE RESULT", result)

let content = await readDocumentTool.invoke({ file_name: "hello.txt" });

console.log("\n#########\n THE CONTENT", content)


let resultStream = compiledSuperGraph.stream(
  {
    messages: [
      new HumanMessage(
        "Look up a current event, write a poem about it, then plot a bar chart of the distribution of words therein.",
      ),
    ],
  },
  { recursionLimit: 150 },
);

for await (const step of await resultStream) {
  if (!step.__end__) {
    console.log(step);
    console.log("---");
  }
}


// await chartTool.invoke({
//   data: [
//     { label: "People who like graphs", value: 5000 },
//     {
//       label: "People who like LangGraph",
//       value: 10000,
//     },
//   ],
// });


// const streamResults = researchChain.stream(
//   {
//     messages: [new HumanMessage("What's the price of a big mac in Argentina?")],
//   },
//   { recursionLimit: 100 },
// );
// for await (const output of await streamResults) {
//   if (!output?.__end__) {
//     console.log(output);
//     console.log("----");
//   }
// }

// let resultStream = authoringChain.stream(
//   {
//     messages: [
//       new HumanMessage(
//         "Write a limerick and make a bar chart of the characters used.",
//       ),
//     ],
//   },
//   { recursionLimit: 100 },
// );

// for await (const step of await resultStream) {
//   if (!step?.__end__) {
//     console.log(step);
//     console.log("---");
//   }
// }

}



  async run1(team) {
    console.log("run", team);

// Define the graph state
// See here for more info: https://langchain-ai.github.io/langgraphjs/how-tos/define-state/
const StateAnnotation = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
  }),
})

// Define the tools for the agent to use
const weatherTool = tool(async ({ query }) => {
  // This is a placeholder for the actual implementation
  if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
    return "It's 60 degrees and foggy."
  }
  return "It's 90 degrees and sunny."
}, {
  name: "weather",
  description:
    "Call to get the current weather for a location.",
  schema: z.object({
    query: z.string().describe("The query to use in your search."),
  }),
});

const tools = [weatherTool];
const toolNode = new ToolNode(tools);

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20241022",
  temperature: 0,
}).bindTools(tools);

// Define the function that determines whether to continue or not
// We can extract the state typing via `StateAnnotation.State`
function shouldContinue(state) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] ;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return "__end__";
}

// Define the function that calls the model
async function callModel(state) {
  const messages = state.messages;
  // console.log ("messages l761", messages)
  const response = await model.invoke(messages);

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

// Initialize memory to persist state between graph runs
const checkpointer = new MemorySaver();

// Finally, we compile it!
// This compiles it into a LangChain Runnable.
// Note that we're (optionally) passing the memory when compiling the graph
const app = workflow.compile({ checkpointer });

// Use the Runnable
const finalState = await app.invoke(
  { messages: [new HumanMessage("what is the weather in sf")] },
  { configurable: { thread_id: "42" } }
);

console.log(finalState.messages[finalState.messages.length - 1].content);

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

export let langGraphLlmOptions = {
  name: "Name of the LangGraphLlm Module",
  params: {
    un: "1",
    deux: "2",
    trois: "3",
  },
  resources: {
    content: "du contenu",
  },
};
