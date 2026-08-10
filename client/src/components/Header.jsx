import React from 'react';
import { Bot, Cpu, Activity, History, Settings } from 'lucide-react';

export const Header = ({ isResearching, status, onOpenHistory, onOpenSettings }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0d111a] rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          {isResearching && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg tracking-tight text-white font-sans">
              Autonomous Agent Researcher
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              LangGraph.js Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span>Multi-Agent Swarm</span>
            <span className="text-slate-600">•</span>
            <span>Tavily Deep Search</span>
            <span className="text-slate-600">•</span>
            <span>SSE Event Pipeline</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
          <Activity className={`w-3.5 h-3.5 ${isResearching ? 'text-cyan-400 animate-pulse' : 'text-emerald-400'}`} />
          <span className="text-slate-300 capitalize">{status === 'idle' ? 'Ready for Deployment' : status}</span>
        </div>

        {/* History Button */}
        <button
          onClick={onOpenHistory}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
          title="Open Saved Research History"
        >
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Saved History</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
          title="Open Pipeline Settings"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
};
