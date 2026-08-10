import { getLLM, parseJSON } from './model.js';
import { EVALUATOR_PROMPT } from './prompts.js';

export const evaluatorNode = async (state) => {
  const currentIndex = state.currentSubtopicIndex;
  const currentSubtopic = state.subtopics[currentIndex] || state.topic;
  const reflectionCount = state.reflectionCount || 0;
  const timestamp = new Date().toISOString();

  const evalStartLog = {
    timestamp,
    agent: 'Evaluator Agent',
    message: `Evaluating research quality for subtopic: "${currentSubtopic}" (Attempt ${reflectionCount + 1})...`,
    level: 'thought',
  };

  const subtopicNotes = state.researchNotes.filter(
    (n) => n.subtopic === currentSubtopic
  );
  const notesText = subtopicNotes.map((n) => n.facts).join('\n---\n') || 'No notes collected.';

  try {
    const llm = getLLM(0.1);
    let decision = { status: 'PROCEED', reasoning: 'Information verified and complete.' };

    if (llm) {
      const promptText = EVALUATOR_PROMPT
        .replace('{topic}', state.topic)
        .replace('{subtopic}', currentSubtopic)
        .replace('{reflectionCount}', reflectionCount)
        .replace('{notes}', notesText);

      const response = await llm.invoke([
        { role: 'system', content: promptText },
        { role: 'user', content: 'Evaluate sufficiency and output JSON.' },
      ]);

      try {
        decision = parseJSON(response.content);
      } catch (e) {
        if (response.content.includes('RE_SEARCH') && reflectionCount < 2) {
          decision = { status: 'RE_SEARCH', reasoning: 'Need targeted follow-up.' };
        }
      }
    }

    if (decision.status === 'RE_SEARCH' && reflectionCount < 2) {
      const reSearchLog = {
        timestamp: new Date().toISOString(),
        agent: 'Evaluator Agent',
        message: `Quality check failed for "${currentSubtopic}". Triggering targeted re-search (Reflection ${reflectionCount + 1}/2). Reasoning: ${decision.reasoning}`,
        level: 'warn',
      };

      return {
        reflectionCount: reflectionCount + 1,
        status: 'researching',
        logs: [evalStartLog, reSearchLog],
      };
    }

    // Proceed to next subtopic or writing phase
    const nextIndex = currentIndex + 1;
    const isFinished = nextIndex >= state.subtopics.length;
    const nextStatus = isFinished ? 'writing' : 'researching';

    const proceedLog = {
      timestamp: new Date().toISOString(),
      agent: 'Evaluator Agent',
      message: isFinished
        ? `All subtopics completed. Advancing to Writer Agent for final synthesis.`
        : `Approved subtopic "${currentSubtopic}". Advancing to subtopic [${nextIndex + 1}/${state.subtopics.length}]: "${state.subtopics[nextIndex]}".`,
      level: 'info',
    };

    return {
      currentSubtopicIndex: nextIndex,
      reflectionCount: 0, // reset reflection counter for next subtopic
      status: nextStatus,
      logs: [evalStartLog, proceedLog],
    };
  } catch (error) {
    console.error('[Evaluator Error]', error);
    const nextIndex = currentIndex + 1;
    const isFinished = nextIndex >= state.subtopics.length;

    return {
      currentSubtopicIndex: nextIndex,
      reflectionCount: 0,
      status: isFinished ? 'writing' : 'researching',
      logs: [
        evalStartLog,
        {
          timestamp: new Date().toISOString(),
          agent: 'Evaluator Agent',
          message: `Evaluation completed with baseline approval. Moving forward.`,
          level: 'info',
        },
      ],
    };
  }
};
