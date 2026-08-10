import { useState, useRef, useCallback } from 'react';

export const useAgentStream = () => {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('deep'); // 'quick' | 'deep'
  const [isResearching, setIsResearching] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'planning' | 'researching' | 'evaluating' | 'writing' | 'completed' | 'error'
  
  const [subtopics, setSubtopics] = useState([]);
  const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(0);
  const [reflectionCount, setReflectionCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [finalReport, setFinalReport] = useState('');
  const [researchNotes, setResearchNotes] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);

  const eventSourceRef = useRef(null);

  const startResearch = useCallback((searchTopic, searchDepth = 'deep') => {
    if (!searchTopic || !searchTopic.trim()) return;

    // Reset previous state
    setIsResearching(true);
    setStatus('planning');
    setTopic(searchTopic);
    setDepth(searchDepth);
    setSubtopics([]);
    setCurrentSubtopicIndex(0);
    setReflectionCount(0);
    setLogs([]);
    setFinalReport('');
    setResearchNotes([]);
    setExecutionTime(null);

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const apiUrl = `http://localhost:5000/api/research/stream?topic=${encodeURIComponent(searchTopic.trim())}&depth=${searchDepth}`;
    const es = new EventSource(apiUrl);
    eventSourceRef.current = es;

    es.addEventListener('init', (e) => {
      const data = JSON.parse(e.data);
      setSessionId(data.sessionId);
    });

    es.addEventListener('agent_log', (e) => {
      const logData = JSON.parse(e.data);
      setLogs((prev) => [...prev, logData]);
    });

    es.addEventListener('state_update', (e) => {
      const data = JSON.parse(e.data);
      if (data.status) setStatus(data.status);
      if (data.subtopics && data.subtopics.length > 0) setSubtopics(data.subtopics);
      if (data.currentSubtopicIndex !== undefined) setCurrentSubtopicIndex(data.currentSubtopicIndex);
      if (data.reflectionCount !== undefined) setReflectionCount(data.reflectionCount);
    });

    es.addEventListener('completed', (e) => {
      const data = JSON.parse(e.data);
      setStatus('completed');
      setIsResearching(false);
      if (data.finalReport) setFinalReport(data.finalReport);
      if (data.researchNotes) setResearchNotes(data.researchNotes);
      if (data.subtopics) setSubtopics(data.subtopics);
      if (data.executionTimeMs) setExecutionTime((data.executionTimeMs / 1000).toFixed(1));

      es.close();
    });

    es.addEventListener('error', (e) => {
      console.error('SSE Error:', e);
      let errorMsg = 'An error occurred during autonomous research.';
      try {
        if (e.data) {
          const data = JSON.parse(e.data);
          if (data.message) errorMsg = data.message;
        }
      } catch (err) {}

      setStatus('error');
      setIsResearching(false);
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          agent: 'System Orchestrator',
          message: errorMsg,
          level: 'error',
        },
      ]);
      es.close();
    });
  }, []);

  const stopResearch = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsResearching(false);
    setStatus('idle');
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        agent: 'User Action',
        message: 'Research process manually terminated by user.',
        level: 'warn',
      },
    ]);
  }, []);

  const loadSavedReport = useCallback((report) => {
    if (!report) return;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsResearching(false);
    setStatus('completed');
    setTopic(report.topic || '');
    setDepth(report.depth || 'deep');
    setSubtopics(report.subtopics || []);
    setCurrentSubtopicIndex((report.subtopics || []).length);
    setReflectionCount(report.metadata?.reflectionCount || 0);
    setFinalReport(report.finalReport || '');
    setResearchNotes(report.researchNotes || []);
    setSessionId(report.sessionId);
    setExecutionTime(
      report.metadata?.executionTimeMs
        ? (report.metadata.executionTimeMs / 1000).toFixed(1)
        : null
    );
    setLogs([
      {
        timestamp: report.createdAt || new Date().toISOString(),
        agent: 'History Loader',
        message: `Loaded saved research session: "${report.topic}" (${report.sessionId})`,
        level: 'info',
      },
    ]);
  }, []);

  return {
    topic,
    depth,
    isResearching,
    status,
    subtopics,
    currentSubtopicIndex,
    reflectionCount,
    logs,
    finalReport,
    researchNotes,
    sessionId,
    executionTime,
    startResearch,
    stopResearch,
    loadSavedReport,
  };
};
