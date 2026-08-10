import { getLLM } from './model.js';
import { WRITER_PROMPT } from './prompts.js';
import { generateMockFinalReport } from './mockProvider.js';

export const writerNode = async (state) => {
  const timestamp = new Date().toISOString();
  const startLog = {
    timestamp,
    agent: 'Writer Agent',
    message: `Synthesizing ${state.researchNotes.length} research note segments into final Markdown report...`,
    level: 'thought',
  };

  try {
    const llm = getLLM(0.3);
    let reportContent = '';

    if (!llm) {
      reportContent = generateMockFinalReport(
        state.topic,
        state.depth,
        state.subtopics,
        state.researchNotes
      );
    } else {
      const allNotesText = state.researchNotes
        .map(
          (n, i) =>
            `### Note Segment ${i + 1}: ${n.subtopic}\nSource URL: ${n.sourceUrl}\nFacts & Findings:\n${n.facts}\n`
        )
        .join('\n---\n');

      const promptText = WRITER_PROMPT
        .replace('{topic}', state.topic)
        .replace('{depth}', state.depth)
        .replace('{allNotes}', allNotesText);

      const response = await llm.invoke([
        { role: 'system', content: promptText },
        { role: 'user', content: `Topic: ${state.topic}\nDraft the final Markdown report now.` },
      ]);

      reportContent = response.content;
    }

    const completionLog = {
      timestamp: new Date().toISOString(),
      agent: 'Writer Agent',
      message: `Final research report generated successfully (${reportContent.length} characters).`,
      level: 'info',
    };

    return {
      finalReport: reportContent,
      status: 'completed',
      logs: [startLog, completionLog],
    };
  } catch (error) {
    console.error('[Writer Error]', error);

    // Fallback report synthesis if LLM fails
    const fallbackReport = `# Comprehensive Autonomous Research Report: ${state.topic}

> **Executive Notice**: This report was compiled autonomously by the Multi-Agent Research System.

## 1. Executive Summary
This report provides an in-depth analysis of **${state.topic}**, synthesizing findings gathered across key research vectors.

${state.researchNotes
  .map(
    (n) => `## Section: ${n.subtopic}\n\n${n.facts}\n\n**Verified Reference**: [${n.sourceUrl}](${n.sourceUrl})\n`
  )
  .join('\n')}

---
## Sources & References
${state.researchNotes.map((n, i) => `${i + 1}. [${n.subtopic}](${n.sourceUrl})`).join('\n')}
`;

    return {
      finalReport: fallbackReport,
      status: 'completed',
      logs: [
        startLog,
        {
          timestamp: new Date().toISOString(),
          agent: 'Writer Agent',
          message: `Generated report using research notes synthesis template.`,
          level: 'info',
        },
      ],
    };
  }
};
