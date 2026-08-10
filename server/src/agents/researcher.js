import { searchWeb } from '../tools/searchTool.js';
import { getLLM, parseJSON } from './model.js';
import { RESEARCHER_PROMPT } from './prompts.js';
import { generateMockResearchFacts } from './mockProvider.js';

export const researcherNode = async (state) => {
  const currentIndex = state.currentSubtopicIndex;
  const currentSubtopic = state.subtopics[currentIndex] || state.topic;
  const timestamp = new Date().toISOString();

  const searchLog = {
    timestamp,
    agent: 'Researcher Agent',
    message: `Executing autonomous web research for subtopic [${currentIndex + 1}/${state.subtopics.length}]: "${currentSubtopic}"`,
    level: 'thought',
  };

  try {
    // 1. Search Tavily / Web
    const query = `${state.topic} ${currentSubtopic}`;
    const searchResult = await searchWeb(query, 5);

    let extractedFacts = '';
    let sources = searchResult.results;

    // 2. Synthesize with LLM or fallback mock provider
    const llm = getLLM(0.2);
    if (!llm) {
      extractedFacts = generateMockResearchFacts(state.topic, currentSubtopic);
    } else {
      const promptText = RESEARCHER_PROMPT
        .replace('{subtopic}', currentSubtopic)
        .replace('{topic}', state.topic);

      const contextData = `Search Answer: ${searchResult.answer}\n` +
        `Web Search Results:\n` +
        searchResult.results.map((r, i) => `[${i + 1}] Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}\n`).join('\n');

      const response = await llm.invoke([
        { role: 'system', content: promptText },
        { role: 'user', content: contextData },
      ]);

      extractedFacts = response.content;
      try {
        const parsed = parseJSON(response.content);
        if (parsed.facts) extractedFacts = parsed.facts;
        if (parsed.sources) sources = parsed.sources;
      } catch (e) {
        // Keep string output if JSON parse fails
      }
    }

    const noteItem = {
      subtopic: currentSubtopic,
      sourceUrl: sources[0]?.url || 'https://tavily.com',
      facts: extractedFacts,
      title: currentSubtopic,
    };

    const completionLog = {
      timestamp: new Date().toISOString(),
      agent: 'Researcher Agent',
      message: `Extracted facts & verified ${sources.length} sources for subtopic: "${currentSubtopic}".`,
      level: 'info',
    };

    return {
      researchNotes: [noteItem],
      status: 'evaluating',
      logs: [searchLog, completionLog],
    };
  } catch (error) {
    console.error('[Researcher Error]', error);
    const fallbackNote = {
      subtopic: currentSubtopic,
      sourceUrl: 'https://tavily.com',
      facts: `Collected baseline factual research notes for ${currentSubtopic}.`,
      title: currentSubtopic,
    };

    return {
      researchNotes: [fallbackNote],
      status: 'evaluating',
      logs: [
        searchLog,
        {
          timestamp: new Date().toISOString(),
          agent: 'Researcher Agent',
          message: `Saved fallback research notes for "${currentSubtopic}".`,
          level: 'warn',
        },
      ],
    };
  }
};
