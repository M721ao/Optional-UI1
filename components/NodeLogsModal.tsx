import React, { useState } from 'react';
import { X, Copy, CheckCircle2, AlertOctagon, Loader2, AlertTriangle, Terminal, Clock, Activity } from 'lucide-react';

export interface LogEntry {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
  timestamp: string;
  message: string;
}

interface NodeLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeLabel: string;
  status: string;
  logs: LogEntry[];
  startTime: string;
  endTime: string;
}

export const NodeLogsModal: React.FC<NodeLogsModalProps> = ({ isOpen, onClose, nodeLabel, status, logs, startTime, endTime }) => {
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
      if (filter === 'ALL') return true;
      return log.level === filter;
  });

  const handleCopy = () => {
      const text = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.source}]: ${l.message}`).join('\n');
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch(status.toLowerCase()) {
      case 'running': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20"><Loader2 size={12} className="animate-spin" /> RUNNING</span>;
      case 'success': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500 border border-green-200 dark:border-green-500/20"><CheckCircle2 size={12} /> COMPLETED</span>;
      case 'failed': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500 border border-red-200 dark:border-red-500/20"><AlertOctagon size={12} /> FAILED</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700"><Activity size={12} /> IDLE</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div 
            className="w-full max-w-3xl bg-white dark:bg-[#121218] border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {/* 1. Header Title Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#18181f]">
                <div className="flex items-center gap-3">
                     <div className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md shadow-sm">
                        <Terminal size={18} className="text-gray-600 dark:text-gray-400" />
                     </div>
                     <div>
                         <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{nodeLabel} - Execution Log</h2>
                         <div className="text-[10px] text-gray-500 font-mono mt-0.5">ID: node-{Math.floor(Math.random() * 10000)}</div>
                     </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopy}
                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors hover:bg-gray-200 dark:hover:bg-white/5 rounded"
                        title="Copy Logs"
                    >
                        {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors hover:bg-gray-200 dark:hover:bg-white/5 rounded"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* 2. Execution Summary Stats (The requested addition) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-5 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#121218]">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status</span>
                    <div>{getStatusBadge()}</div>
                </div>
                <div className="flex flex-col gap-1">
                     <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Start Time</span>
                     <div className="text-xs font-mono text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                        {startTime || '--'}
                     </div>
                </div>
                <div className="flex flex-col gap-1">
                     <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">End Time</span>
                     <div className="text-xs font-mono text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                        {endTime || '--'}
                        {status === 'running' && <span className="animate-pulse text-yellow-500 text-[10px]">(Active)</span>}
                     </div>
                </div>
            </div>

            {/* 3. Filter Tabs */}
            <div className="flex border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#15151a] px-4">
                {['ALL', 'INFO', 'WARN', 'ERROR'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                            filter === f 
                            ? 'border-purple-600 dark:border-cyber-neon text-purple-600 dark:text-cyber-neon bg-gray-100 dark:bg-white/5' 
                            : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* 4. Log Content */}
            <div className="flex-1 overflow-y-auto p-0 bg-white dark:bg-[#0c0c10] font-mono text-xs">
                 {filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                         <Terminal size={24} className="opacity-20 mb-2" />
                         <span>No logs available</span>
                    </div>
                 ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="flex gap-4 p-3 px-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="text-gray-400 dark:text-gray-600 w-24 shrink-0 select-none text-[10px] pt-0.5">
                                    {log.timestamp.split(' ')[0]}
                                </div>
                                <div className={`w-12 shrink-0 font-bold ${
                                    log.level === 'ERROR' ? 'text-red-500' :
                                    log.level === 'WARN' ? 'text-yellow-500' :
                                    'text-blue-600 dark:text-blue-400'
                                }`}>
                                    {log.level}
                                </div>
                                <div className="flex-1 text-gray-700 dark:text-gray-300 break-words leading-relaxed">
                                    <span className="text-gray-500 dark:text-gray-500 mr-2 text-[10px] uppercase tracking-wider font-bold">[{log.source}]</span>
                                    {log.message}
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};