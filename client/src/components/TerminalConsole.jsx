import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Copy, Check, Filter, Trash2, ArrowDown } from 'lucide-react';

export const TerminalConsole = ({ logs = [], isResearching, onClear }) => {
  const logsEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp?.substring(11, 19) || ''}] [${l.agent}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter((l) => {
    if (filterLevel === 'all') return true;
    if (filterLevel === 'thought') return l.level === 'thought';
    if (filterLevel === 'warn') return l.level === 'warn';
    if (filterLevel === 'error') return l.level === 'error';
    return true;
  });

  const getAgentColor = (agent) => {
    if (agent?.includes('Planner')) return 'text-indigo-400 font-semibold';
    if (agent?.includes('Researcher')) return 'text-cyan-400 font-semibold';
    if (agent?.includes('Evaluator')) return 'text-amber-400 font-semibold';
    if (agent?.includes('Writer')) return 'text-emerald-400 font-semibold';
    return 'text-slate-400';
  };

  return (
    <div className="bg-[#07090e] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Terminal Top Bar */}
      <div className="bg-[#0d111a] border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="font-mono text-xs font-semibold text-slate-300">
            agent_trace.log
          </span>
          {isResearching && (
            <span className="flex items-center space-x-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>STREAMING SSE</span>
            </span>
          )}
        </div>

        {/* Console Controls */}
        <div className="flex items-center space-x-2">
          {/* Level Filter */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px]">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-transparent text-slate-300 font-mono outline-none cursor-pointer"
            >
              <option value="all">All Logs</option>
              <option value="thought">Thoughts Only</option>
              <option value="warn">Warnings</option>
              <option value="error">Errors</option>
            </select>
          </div>

          <button
            onClick={handleCopyLogs}
            title="Copy Logs"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Log Output Body */}
      <div className="p-4 font-mono text-xs overflow-y-auto flex-1 space-y-2 bg-[#05070b]">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-12">
            <Terminal className="w-8 h-8 text-slate-700 stroke-[1.5]" />
            <p className="text-xs">No active agent trace logs. Launch an autonomous research session.</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const timeStr = log.timestamp
              ? new Date(log.timestamp).toLocaleTimeString([], { hour12: false })
              : '00:00:00';

            let msgStyle = 'text-slate-200';
            if (log.level === 'thought') msgStyle = 'text-cyan-300 italic opacity-90';
            if (log.level === 'warn') msgStyle = 'text-amber-300';
            if (log.level === 'error') msgStyle = 'text-rose-400 font-bold';

            return (
              <div
                key={index}
                className="flex items-start space-x-2 hover:bg-slate-900/40 p-1 rounded transition-colors group"
              >
                <span className="text-slate-600 select-none text-[11px] shrink-0 pt-0.5">
                  [{timeStr}]
                </span>
                <span className={`shrink-0 ${getAgentColor(log.agent)}`}>
                  [{log.agent}]
                </span>
                <span className={`flex-1 break-words leading-relaxed ${msgStyle}`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Console Footer */}
      <div className="bg-[#090d16] border-t border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Total Events: {logs.length}</span>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`flex items-center space-x-1 hover:text-white transition ${
            autoScroll ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <ArrowDown className="w-3 h-3" />
          <span>{autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}</span>
        </button>
      </div>
    </div>
  );
};
