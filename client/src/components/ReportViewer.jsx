import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, List, ExternalLink, Sparkles, FileCheck } from 'lucide-react';

export const ReportViewer = ({ markdown, topic, executionTime, isWriting }) => {
  // Auto-generate Table of Contents from markdown headers
  const toc = useMemo(() => {
    if (!markdown) return [];
    const lines = markdown.split('\n');
    const headers = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length; // 2 for ##, 3 for ###
        const title = match[2].trim().replace(/\[(.*?)\]\(.*?\)/g, '$1'); // strip markdown links
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headers.push({ level, title, id });
      }
    });

    return headers;
  }, [markdown]);

  if (isWriting && !markdown) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center"></div>
          <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-200">Writer Agent Synthesizing Report...</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Compiling research notes across subtopics into a publication-grade Markdown artifact.
          </p>
        </div>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-3">
        <BookOpen className="w-12 h-12 text-slate-700 stroke-[1.5]" />
        <h3 className="text-sm font-medium text-slate-400">No Research Report Generated Yet</h3>
        <p className="text-xs text-slate-600 max-w-md">
          Enter a topic on the left dashboard panel and click "Deploy Autonomous Agent" to run the research pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d111a]/60 backdrop-blur-md rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Report Header Stats Bar */}
      <div className="bg-[#090d16] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Autonomous Report Complete
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5 line-clamp-1">{topic}</h2>
        </div>

        {executionTime && (
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-mono">Execution Time</span>
            <span className="text-sm font-semibold font-mono text-cyan-400">{executionTime}s</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {toc.length > 0 && (
          <aside className="w-64 border-r border-slate-800/80 bg-[#07090e]/60 p-4 overflow-y-auto hidden lg:block text-xs shrink-0">
            <div className="flex items-center space-x-2 font-semibold text-slate-300 uppercase text-[11px] mb-3 tracking-wider">
              <List className="w-3.5 h-3.5 text-indigo-400" />
              <span>Table of Contents</span>
            </div>
            <nav className="space-y-1.5 font-sans">
              {toc.map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.id}`}
                  className={`block truncate transition-colors py-1 px-2 rounded hover:bg-slate-800/60 ${
                    item.level === 2
                      ? 'text-slate-300 font-medium hover:text-white'
                      : 'text-slate-400 pl-4 hover:text-slate-200'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Rendered Markdown Area */}
        <main className="flex-1 p-6 overflow-y-auto font-sans prose prose-invert max-w-none prose-indigo text-slate-300 leading-relaxed text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-3 mb-6 font-sans">
                  {children}
                </h1>
              ),
              h2: ({ children }) => {
                const titleStr = String(children);
                const id = titleStr.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return (
                  <h2 id={id} className="text-lg font-bold text-indigo-300 mt-8 mb-4 border-b border-slate-800/60 pb-2 scroll-mt-6">
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const titleStr = String(children);
                const id = titleStr.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return (
                  <h3 id={id} className="text-base font-semibold text-slate-100 mt-6 mb-3 scroll-mt-6">
                    {children}
                  </h3>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-indigo-500 bg-indigo-950/20 px-4 py-2 my-4 rounded-r-lg text-slate-300 italic">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition font-medium"
                >
                  <span>{children}</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">
                    {children}
                  </code>
                ) : (
                  <pre className="bg-[#05070b] border border-slate-800/80 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4 text-slate-200">
                    <code>{children}</code>
                  </pre>
                ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-slate-900 border-b border-slate-800 p-2.5 font-semibold text-indigo-300">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border-b border-slate-800/50 p-2.5 text-slate-300">
                  {children}
                </td>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </main>
      </div>
    </div>
  );
};
