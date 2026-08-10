import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
import { TerminalConsole } from './components/TerminalConsole';
import { ReportViewer } from './components/ReportViewer';
import { SourcesSidebar } from './components/SourcesSidebar';
import { ExportToolbar } from './components/ExportToolbar';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { useAgentStream } from './hooks/useAgentStream';
import { Rocket, Sparkles, Zap, Layers, Square, Search } from 'lucide-react';

export default function App() {
  const [inputTopic, setInputTopic] = useState('');
  const [selectedDepth, setSelectedDepth] = useState('deep');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    topic,
    isResearching,
    status,
    subtopics,
    currentSubtopicIndex,
    reflectionCount,
    logs,
    finalReport,
    researchNotes,
    executionTime,
    startResearch,
    stopResearch,
    loadSavedReport,
  } = useAgentStream();

  const handleLaunch = (e) => {
    e?.preventDefault();
    if (!inputTopic.trim()) return;
    startResearch(inputTopic.trim(), selectedDepth);
  };

  const sampleTopics = [
    'Quantum AI Algorithms & Quantum Supremacy',
    'CRISPR CAS-9 Next-Gen Gene Therapeutics',
    'Solid-State Battery Energy Density Benchmarks',
    'Autonomous Multi-Agent LLM Orchestration',
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        isResearching={isResearching}
        status={status}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Split-Screen Workspace Container */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
        {/* LEFT PANEL — Controls & Live Agent Trace Console (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col space-y-4">
          {/* Autonomous Agent Control Box */}
          <div className="bg-[#0d111a]/90 border border-slate-800/90 rounded-xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="font-semibold text-sm text-white uppercase tracking-wider">
                  Deploy Autonomous Agent
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Fire & Forget Pipeline</span>
            </div>

            <form onSubmit={handleLaunch} className="space-y-4">
              {/* Topic Input Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Research Topic or Target Query
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputTopic}
                    onChange={(e) => setInputTopic(e.target.value)}
                    placeholder="e.g., Autonomous Multi-Agent LLM Architectures..."
                    disabled={isResearching}
                    className="w-full bg-[#07090e] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition disabled:opacity-60 font-sans"
                  />
                </div>
              </div>

              {/* Sample Topic Chips */}
              <div className="flex flex-wrap gap-1.5">
                {sampleTopics.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputTopic(t)}
                    disabled={isResearching}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-800 transition truncate max-w-[200px]"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Research Depth Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Research Execution Depth
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDepth('quick')}
                    disabled={isResearching}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-lg border text-xs font-medium transition ${
                      selectedDepth === 'quick'
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                        : 'bg-[#07090e] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Summary (3 Subtopics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDepth('deep')}
                    disabled={isResearching}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-lg border text-xs font-medium transition ${
                      selectedDepth === 'deep'
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                        : 'bg-[#07090e] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Deep Dive (6 Subtopics + Reflection)</span>
                  </button>
                </div>
              </div>

              {/* Action Launch Button */}
              {isResearching ? (
                <button
                  type="button"
                  onClick={stopResearch}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-lg transition shadow-lg shadow-rose-900/30"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Terminate Agent Pipeline</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputTopic.trim()}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm rounded-lg transition shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Deploy Autonomous Agent</span>
                </button>
              )}
            </form>
          </div>

          {/* Step Progress Bar */}
          <StepProgress
            status={status}
            currentSubtopicIndex={currentSubtopicIndex}
            totalSubtopics={subtopics.length}
            reflectionCount={reflectionCount}
          />

          {/* Real-Time Terminal Trace Console */}
          <TerminalConsole logs={logs} isResearching={isResearching} />
        </section>

        {/* RIGHT PANEL — Final Artifact Viewer & Sources Sidebar (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-4 min-h-[700px]">
          <ExportToolbar
            markdown={finalReport}
            topic={topic || inputTopic}
            notes={researchNotes}
            subtopics={subtopics}
            onReset={() => setInputTopic('')}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">
            {/* Main Markdown Report Viewer (2 Cols on XL) */}
            <div className="xl:col-span-2 flex flex-col h-full">
              <ReportViewer
                markdown={finalReport}
                topic={topic || inputTopic}
                executionTime={executionTime}
                isWriting={status === 'writing'}
              />
            </div>

            {/* Sources & Citations Sidebar (1 Col on XL) */}
            <div className="xl:col-span-1 flex flex-col h-full">
              <SourcesSidebar notes={researchNotes} />
            </div>
          </div>
        </section>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadReport={(report) => {
          loadSavedReport(report);
          if (report.topic) setInputTopic(report.topic);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
