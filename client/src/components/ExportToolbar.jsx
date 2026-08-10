import React, { useState } from 'react';
import { Copy, Download, Printer, Check, RefreshCw, Code, FileCode } from 'lucide-react';

export const ExportToolbar = ({ markdown, topic, onReset, notes = [], subtopics = [] }) => {
  const [copied, setCopied] = useState(false);

  const safeTopicName = topic ? topic.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_') : 'research_report';

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMD = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${safeTopicName}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    if (!markdown) return;
    const payload = {
      topic,
      generatedAt: new Date().toISOString(),
      subtopics,
      researchNotes: notes,
      finalReport: markdown,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${safeTopicName}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHTML = () => {
    if (!markdown) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${topic || 'Research Report'}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #1e293b; background: #f8fafc; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    h2 { color: #1e1b4b; margin-top: 30px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 16px; color: #475569; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f1f5f9; }
    a { color: #4f46e5; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <pre style="white-space: pre-wrap; font-family: inherit;">${markdown}</pre>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${safeTopicName}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d111a] border border-slate-800 rounded-xl px-4 py-2.5 mb-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Research</span>
        </button>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={handleCopy}
          disabled={!markdown}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:bg-indigo-900/60 disabled:opacity-40 text-xs font-medium transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={handleDownloadMD}
          disabled={!markdown}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/60 disabled:opacity-40 text-xs font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>.MD</span>
        </button>

        <button
          onClick={handleDownloadJSON}
          disabled={!markdown}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 text-xs font-medium transition"
        >
          <Code className="w-3.5 h-3.5 text-amber-400" />
          <span>JSON</span>
        </button>

        <button
          onClick={handleDownloadHTML}
          disabled={!markdown}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 text-xs font-medium transition"
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
          <span>HTML</span>
        </button>

        <button
          onClick={handlePrint}
          disabled={!markdown}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 text-xs font-medium transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </button>
      </div>
    </div>
  );
};
