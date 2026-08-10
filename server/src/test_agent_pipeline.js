import dotenv from 'dotenv';
import { createResearchGraph } from './agents/graph.js';

dotenv.config();

async function runPipelineVerification() {
  console.log('===========================================================');
  console.log(' 🧪 Starting End-to-End Multi-Agent Integration Test Run');
  console.log('===========================================================');

  const testTopic = 'Quantum Computing in Financial Risk Modeling';
  const initialState = {
    topic: testTopic,
    depth: 'quick',
    subtopics: [],
    currentSubtopicIndex: 0,
    researchNotes: [],
    reflectionCount: 0,
    finalReport: '',
    status: 'planning',
    logs: [],
  };

  try {
    const graph = createResearchGraph();
    const startTime = Date.now();

    console.log(`[Test] Launching LangGraph pipeline for topic: "${testTopic}"`);
    const stream = await graph.stream(initialState, { streamMode: 'updates' });

    let finalState = { ...initialState };

    for await (const update of stream) {
      const nodeName = Object.keys(update)[0];
      const nodeOutput = update[nodeName];

      console.log(`\n[Node Executed]: <${nodeName.toUpperCase()}>`);
      if (nodeOutput.logs) {
        nodeOutput.logs.forEach((l) => console.log(`  └─ [${l.agent}] (${l.level}): ${l.message}`));
      }

      if (nodeOutput.subtopics) finalState.subtopics = nodeOutput.subtopics;
      if (nodeOutput.finalReport) finalState.finalReport = nodeOutput.finalReport;
      if (nodeOutput.researchNotes)
        finalState.researchNotes = [...finalState.researchNotes, ...nodeOutput.researchNotes];
      if (nodeOutput.status) finalState.status = nodeOutput.status;
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n===========================================================');
    console.log(' 🎉 Pipeline Execution Verification Completed Successfully!');
    console.log(` ⏱️ Total Duration: ${durationSec} seconds`);
    console.log(` 📋 Planned Subtopics (${finalState.subtopics.length}):`, finalState.subtopics);
    console.log(` 📚 Total Research Notes Captured: ${finalState.researchNotes.length}`);
    console.log(` 📝 Report Character Count: ${finalState.finalReport.length}`);
    console.log('===========================================================');

    if (finalState.finalReport.length > 200) {
      console.log('\n--- REPORT PREVIEW (FIRST 400 CHARACTERS) ---');
      console.log(finalState.finalReport.substring(0, 400) + '...\n');
      process.exit(0);
    } else {
      console.error('❌ Error: Report content was shorter than expected.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Pipeline Test Failed with error:', error);
    process.exit(1);
  }
}

runPipelineVerification();
