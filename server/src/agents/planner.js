import { getLLM, parseJSON } from './model.js';
import { PLANNER_PROMPT } from './prompts.js';
import { generateMockSubtopics } from './mockProvider.js';

export const plannerNode = async (state) => {
  const timestamp = new Date().toISOString();
  const logMessage = `Analyzing research topic "${state.topic}" (${state.depth} dive)...`;

  try {
    const llm = getLLM(0.2);

    let subtopics = [];
    if (!llm) {
      subtopics = generateMockSubtopics(state.topic, state.depth);
    } else {
      const response = await llm.invoke([
        { role: 'system', content: PLANNER_PROMPT },
        { role: 'user', content: `Topic: ${state.topic}\nDepth: ${state.depth}` },
      ]);

      const parsed = parseJSON(response.content);
      subtopics = parsed.subtopics || generateMockSubtopics(state.topic, state.depth);
    }

    const plannedLog = {
      timestamp: new Date().toISOString(),
      agent: 'Planner Agent',
      message: `Decomposed topic into ${subtopics.length} structured subtopics.`,
      level: 'info',
    };

    return {
      subtopics,
      currentSubtopicIndex: 0,
      status: 'researching',
      logs: [
        { timestamp, agent: 'Planner Agent', message: logMessage, level: 'thought' },
        plannedLog,
      ],
    };
  } catch (error) {
    console.error('[Planner Error]', error);
    // Fallback subtopics if LLM call fails
    const defaultSubtopics = [
      `${state.topic}: Foundational Concepts`,
      `${state.topic}: Architectural Analysis`,
      `${state.topic}: Applications & Industry Trends`,
      `${state.topic}: Strategic Outlook`,
    ];

    return {
      subtopics: defaultSubtopics,
      currentSubtopicIndex: 0,
      status: 'researching',
      logs: [
        { timestamp, agent: 'Planner Agent', message: logMessage, level: 'thought' },
        {
          timestamp: new Date().toISOString(),
          agent: 'Planner Agent',
          message: `Generated subtopics via default baseline planner.`,
          level: 'warn',
        },
      ],
    };
  }
};
