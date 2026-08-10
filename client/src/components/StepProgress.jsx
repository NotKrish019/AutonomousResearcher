import React from 'react';
import { Compass, Search, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const StepProgress = ({ status, currentSubtopicIndex, totalSubtopics, reflectionCount }) => {
  const steps = [
    { id: 'planning', label: 'Planner Agent', icon: Compass },
    { id: 'researching', label: 'Researcher Agent', icon: Search },
    { id: 'evaluating', label: 'Evaluator Manager', icon: ShieldCheck },
    { id: 'writing', label: 'Writer Agent', icon: FileText },
  ];

  const getStepStatus = (stepId) => {
    if (status === 'completed') return 'completed';
    if (status === 'error') return 'error';
    if (status === stepId) return 'active';

    const order = ['planning', 'researching', 'evaluating', 'writing', 'completed'];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(stepId);

    if (currentIndex > stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="bg-[#0d111a]/80 border border-slate-800/80 rounded-xl p-4 mb-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Agent Execution Pipeline
          </span>
          {totalSubtopics > 0 && status !== 'completed' && status !== 'idle' && (
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded">
              Subtopic {Math.min(currentSubtopicIndex + 1, totalSubtopics)} of {totalSubtopics}
            </span>
          )}
        </div>

        {reflectionCount > 0 && (
          <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded animate-pulse">
            Reflection Re-search #{reflectionCount}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 relative">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.id);
          const Icon = step.icon;

          let badgeStyle = 'bg-slate-900/60 border-slate-800 text-slate-500';
          let iconStyle = 'text-slate-500';

          if (stepStatus === 'completed') {
            badgeStyle = 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300';
            iconStyle = 'text-emerald-400';
          } else if (stepStatus === 'active') {
            badgeStyle = 'bg-indigo-950/80 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/20';
            iconStyle = 'text-indigo-400 animate-pulse';
          }

          return (
            <div
              key={step.id}
              className={`border rounded-lg p-2.5 flex flex-col items-center justify-center text-center transition-all duration-300 ${badgeStyle}`}
            >
              <div className="flex items-center justify-center mb-1.5">
                {stepStatus === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className={`w-4 h-4 ${iconStyle}`} />
                )}
              </div>
              <span className="text-[11px] font-medium leading-tight truncate w-full">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
