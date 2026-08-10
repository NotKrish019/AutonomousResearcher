import React, { useState, useEffect } from 'react';
import { X, Search, FileText, Trash2, Calendar, ExternalLink, RefreshCw, Layers } from 'lucide-react';

export function HistoryModal({ isOpen, onClose, onLoadReport }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingReportId, setLoadingReportId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen]);

  const handleSelectReport = async (sessionId) => {
    setLoadingReportId(sessionId);
    try {
      const res = await fetch(`/api/reports/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setSelectedReport(data.report);
        }
      }
    } catch (e) {
      console.error('Error fetching report details:', e);
    } finally {
      setLoadingReportId(null);
    }
  };

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this report from history?')) return;

    try {
      const res = await fetch(`/api/reports/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.sessionId !== sessionId));
        if (selectedReport?.sessionId === sessionId) {
          setSelectedReport(null);
        }
      }
    } catch (e) {
      console.error('Failed to delete report:', e);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sessionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0d111a] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#07090e]/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Saved Research History</h2>
              <p className="text-xs text-slate-400">Browse and reload past multi-agent research reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-800/60 flex items-center space-x-3 bg-[#0a0d14]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by topic..."
              className="w-full bg-[#07090e] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={fetchReports}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Refresh history list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Modal Content - Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[400px]">
          {/* Left Column: Reports List */}
          <div className="md:col-span-5 border-r border-slate-800/80 overflow-y-auto p-3 space-y-2 bg-[#07090e]/40">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-slate-500 text-xs">
                Loading history...
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 p-4">
                <FileText className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs font-medium">No saved reports found.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Run a research session to save reports to history.
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.sessionId}
                  onClick={() => handleSelectReport(report.sessionId)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition relative group ${
                    selectedReport?.sessionId === report.sessionId
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg'
                      : 'bg-[#0d111a]/80 border-slate-800/80 hover:border-slate-700 hover:bg-[#111726]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 pr-6">
                      {report.topic}
                    </h4>
                    <button
                      onClick={(e) => handleDelete(e, report.sessionId)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center space-x-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      <span>{report.depth || 'deep'}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Report Preview Details */}
          <div className="md:col-span-7 p-5 overflow-y-auto flex flex-col bg-[#0d111a]/60">
            {selectedReport ? (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Session ID: {selectedReport.sessionId}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{selectedReport.topic}</h3>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-300">Subtopics Covered:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedReport.subtopics || []).map((sub, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#07090e] border border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-400 leading-relaxed">
                    {selectedReport.finalReport?.substring(0, 500)}...
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      onLoadReport(selectedReport);
                      onClose();
                    }}
                    className="flex items-center space-x-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-indigo-600/30"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Load Report into Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-500 p-6">
                <FileText className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-xs font-medium text-slate-400">Select a report from the list to preview</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                  Click on any item on the left to inspect research subtopics and load it into the main viewer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
