import React from 'react';
import { ExternalLink, Link2, Globe, Shield } from 'lucide-react';

export const SourcesSidebar = ({ notes = [] }) => {
  // Consolidate unique sources from research notes
  const uniqueSources = React.useMemo(() => {
    const map = new Map();
    notes.forEach((note) => {
      if (note.sourceUrl && !map.has(note.sourceUrl)) {
        let domain = 'web-source';
        try {
          domain = new URL(note.sourceUrl).hostname.replace('www.', '');
        } catch (e) {}

        map.set(note.sourceUrl, {
          url: note.sourceUrl,
          title: note.title || note.subtopic || domain,
          subtopic: note.subtopic,
          domain,
        });
      }
    });
    return Array.from(map.values());
  }, [notes]);

  return (
    <div className="bg-[#0d111a]/80 border border-slate-800/80 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-3">
        <Link2 className="w-4 h-4 text-cyan-400" />
        <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
          Sources & Citations ({uniqueSources.length})
        </h3>
      </div>

      {uniqueSources.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600 space-y-2">
          <Globe className="w-8 h-8 text-slate-700 stroke-[1.5]" />
          <p className="text-xs">No web citations captured yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          {uniqueSources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-[#07090e] border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/60 transition group"
            >
              <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono mb-1">
                <span className="truncate flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-cyan-500" />
                  <span>{src.domain}</span>
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition shrink-0" />
              </div>
              <h4 className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                {src.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 truncate">
                Subtopic: {src.subtopic}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
