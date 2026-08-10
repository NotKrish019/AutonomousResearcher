import React, { useState } from 'react';
import { X, Settings, Cpu, ShieldCheck, Key, RefreshCw, Save } from 'lucide-react';

export function SettingsModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('gemini');
  const [reflectionLimit, setReflectionLimit] = useState('2');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('ar_provider', provider);
    localStorage.setItem('ar_reflectionLimit', reflectionLimit);
    if (geminiKey) localStorage.setItem('ar_geminiKey', geminiKey);
    if (openaiKey) localStorage.setItem('ar_openaiKey', openaiKey);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0d111a] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#07090e]/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Pipeline & Engine Settings</h2>
              <p className="text-xs text-slate-400">Configure LLM providers and execution behavior</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* LLM Model Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Primary LLM Orchestrator</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-xl border flex flex-col items-start space-y-1 transition text-left ${
                  provider === 'gemini'
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200'
                    : 'bg-[#07090e] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-semibold text-white">Google Gemini</span>
                <span className="text-[10px] text-slate-400">Fast & Native Multimodal</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-3 rounded-xl border flex flex-col items-start space-y-1 transition text-left ${
                  provider === 'openai'
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200'
                    : 'bg-[#07090e] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-semibold text-white">OpenAI GPT-4o</span>
                <span className="text-[10px] text-slate-400">High Precision Analysis</span>
              </button>
            </div>
          </div>

          {/* Reflection Retries Limit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Max Evaluator Reflection Iterations</span>
            </label>
            <select
              value={reflectionLimit}
              onChange={(e) => setReflectionLimit(e.target.value)}
              className="w-full bg-[#07090e] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="0">0 Iterations (Direct Pass-Through)</option>
              <option value="1">1 Reflection Attempt</option>
              <option value="2">2 Reflection Attempts (Default Standard)</option>
              <option value="3">3 Reflection Attempts (Strict Academic)</option>
            </select>
          </div>

          {/* Optional Runtime API Keys */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Optional Key Overrides (Session Only)</span>
            </label>

            <div>
              <span className="block text-[11px] text-slate-400 mb-1">Gemini API Key</span>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#07090e] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 outline-none font-mono"
              />
            </div>

            <div>
              <span className="block text-[11px] text-slate-400 mb-1">OpenAI API Key</span>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-[#07090e] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Settings Saved!</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Changes apply to new research runs.</span>
            )}
            <button
              type="submit"
              className="flex items-center space-x-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
