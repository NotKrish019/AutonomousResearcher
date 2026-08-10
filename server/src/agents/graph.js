import { StateGraph, START, END } from '@langchain/langgraph';
import { ResearchStateAnnotation } from './state.js';
import { plannerNode } from './planner.js';
import { researcherNode } from './researcher.js';
import { evaluatorNode } from './evaluator.js';
import { writerNode } from './writer.js';

const shouldContinue = (state) => {
  if (state.status === 'writing') {
    return 'writer';
  }
  if (state.status === 'completed') {
    return END;
  }
  // If status is 'researching', loop back to researcher
  return 'researcher';
};

export const createResearchGraph = () => {
  const workflow = new StateGraph(ResearchStateAnnotation)
    .addNode('planner', plannerNode)
    .addNode('researcher', researcherNode)
    .addNode('evaluator', evaluatorNode)
    .addNode('writer', writerNode)
    .addEdge(START, 'planner')
    .addEdge('planner', 'researcher')
    .addEdge('researcher', 'evaluator')
    .addConditionalEdges('evaluator', shouldContinue, {
      researcher: 'researcher',
      writer: 'writer',
      [END]: END,
    })
    .addEdge('writer', END);

  return workflow.compile();
};
