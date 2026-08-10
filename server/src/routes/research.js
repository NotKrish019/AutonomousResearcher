import express from 'express';
import { createResearchGraph } from '../agents/graph.js';
import { Session } from '../models/Session.js';
import { AgentLog } from '../models/AgentLog.js';
import { ResearchReport } from '../models/ResearchReport.js';

const router = express.Router();

// Active in-memory session cache for non-blocking stream fallback
export const activeSessions = new Map();

router.get('/stream', async (req, res) => {
  const { topic, depth = 'deep', sessionId: reqSessionId } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'Topic parameter is required.' });
  }

  const sessionId = reqSessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const sendEvent = (eventType, data) => {
    res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Initial stream handshake
  sendEvent('init', {
    sessionId,
    topic,
    depth,
    timestamp: new Date().toISOString(),
  });

  // Save session record if MongoDB available
  try {
    await Session.create({ sessionId, topic, depth, status: 'planning' });
  } catch (e) {
    // Graceful MongoDB fallback
  }

  const initialState = {
    topic: String(topic),
    depth: depth === 'quick' ? 'quick' : 'deep',
    subtopics: [],
    currentSubtopicIndex: 0,
    researchNotes: [],
    reflectionCount: 0,
    finalReport: '',
    status: 'planning',
    logs: [
      {
        timestamp: new Date().toISOString(),
        agent: 'System Orchestrator',
        message: `Initialized autonomous research pipeline for topic: "${topic}" (${depth} mode)`,
        level: 'info',
      },
    ],
  };

  activeSessions.set(sessionId, initialState);

  try {
    const graph = createResearchGraph();
    const startTime = Date.now();

    // Stream graph execution
    const stream = await graph.stream(initialState, {
      streamMode: 'updates',
    });

    let currentState = { ...initialState };

    for await (const update of stream) {
      const nodeName = Object.keys(update)[0];
      const nodeOutput = update[nodeName];

      // Merge updated fields
      if (nodeOutput) {
        if (nodeOutput.subtopics) currentState.subtopics = nodeOutput.subtopics;
        if (nodeOutput.currentSubtopicIndex !== undefined)
          currentState.currentSubtopicIndex = nodeOutput.currentSubtopicIndex;
        if (nodeOutput.researchNotes)
          currentState.researchNotes = [...currentState.researchNotes, ...nodeOutput.researchNotes];
        if (nodeOutput.reflectionCount !== undefined)
          currentState.reflectionCount = nodeOutput.reflectionCount;
        if (nodeOutput.finalReport) currentState.finalReport = nodeOutput.finalReport;
        if (nodeOutput.status) currentState.status = nodeOutput.status;

        // Broadcast logs
        if (nodeOutput.logs && Array.isArray(nodeOutput.logs)) {
          for (const logItem of nodeOutput.logs) {
            currentState.logs.push(logItem);
            sendEvent('agent_log', { sessionId, ...logItem });

            // Save log to DB
            try {
              await AgentLog.create({ sessionId, ...logItem });
            } catch (e) {}
          }
        }
      }

      // Broadcast progress update
      sendEvent('state_update', {
        sessionId,
        node: nodeName,
        status: currentState.status,
        subtopics: currentState.subtopics,
        currentSubtopicIndex: currentState.currentSubtopicIndex,
        notesCount: currentState.researchNotes.length,
        reflectionCount: currentState.reflectionCount,
      });
    }

    const executionTimeMs = Date.now() - startTime;

    // Send final report completion event
    sendEvent('completed', {
      sessionId,
      topic: currentState.topic,
      depth: currentState.depth,
      subtopics: currentState.subtopics,
      researchNotes: currentState.researchNotes,
      finalReport: currentState.finalReport,
      executionTimeMs,
      timestamp: new Date().toISOString(),
    });

    // Save final report to MongoDB
    try {
      await ResearchReport.create({
        sessionId,
        topic: currentState.topic,
        depth: currentState.depth,
        subtopics: currentState.subtopics,
        researchNotes: currentState.researchNotes,
        finalReport: currentState.finalReport,
        sources: currentState.researchNotes.map((n) => ({
          title: n.title || n.subtopic,
          url: n.sourceUrl,
          snippet: n.facts?.substring(0, 200),
        })),
        metadata: {
          reflectionCount: currentState.reflectionCount,
          executionTimeMs,
          completedAt: new Date(),
        },
      });

      await Session.updateOne({ sessionId }, { status: 'completed', updatedAt: new Date() });
    } catch (e) {}

  } catch (error) {
    console.error('[SSE Stream Error]', error);
    sendEvent('error', {
      sessionId,
      message: error.message || 'An error occurred during agent execution.',
    });
  } finally {
    res.end();
  }
});

export default router;
