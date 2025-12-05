import React, { useState } from 'react';
import { X, Copy, CheckCircle2, AlertOctagon, Loader2, AlertTriangle, Terminal } from 'lucide-react';

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

export const NodeLogsModal: React.FC<NodeLogsModalProps> = ({ isOpen, onClose, nodeLabel, status, logs }) => {
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

  const getStatusIcon = () => {
    switch(status.toLowerCase()) {
      case 'running': return <Loader2 size={16} className="animate-spin text-yellow-500" />;
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'failed': return <AlertOctagon size={16} className="text-red-500" />;
      default: return <Terminal size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div 
            className="w-full max-w-3xl bg-white dark:bg-[#121218] border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#18181f]">
                <div className="flex items-center gap-3">
                     <div className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md">
                        {getStatusIcon()}
                     </div>
                     <div>
                         <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{nodeLabel}</h2>
                         <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-bold uppercase ${
                                status === 'success' ? 'text-green-600 dark:text-green-500' : 
                                status === 'failed' ? 'text-red-600 dark:text-red-500' : 
                                status === 'running' ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500'
                            }`}>
                                {status}
                            </span>
                            <span className="text-[10px] text-gray-400">•</span>
                            <span className="text-[10px] text-gray-500 font-mono">Execution Logs</span>
                         </div>
                     </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleCopy}
                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                        title="Copy Logs"
                    >
                        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#121218] px-4">
                {['ALL', 'INFO', 'WARN', 'ERROR'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${
                            filter === f 
                            ? 'border-purple-600 dark:border-cyber-neon text-purple-600 dark:text-cyber-neon bg-gray-50 dark:bg-white/5' 
                            : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Log Content */}
            <div className="flex-1 overflow-y-auto p-0 bg-white dark:bg-[#0c0c10] font-mono text-xs">
                 {filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                         <Terminal size={24} className="opacity-20 mb-2" />
                         <span>No logs available</span>
                    </div>
                 ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="text-gray-400 dark:text-gray-600 w-20 shrink-0 select-none">
                                    {log.timestamp.split(' ')[0]}
                                </div>
                                <div className={`w-12 shrink-0 font-bold ${
                                    log.level === 'ERROR' ? 'text-red-500' :
                                    log.level === 'WARN' ? 'text-yellow-500' :
                                    'text-blue-500 dark:text-blue-400'
                                }`}>
                                    {log.level}
                                </div>
                                <div className="flex-1 text-gray-700 dark:text-gray-300 break-words">
                                    <span className="text-gray-400 dark:text-gray-600 mr-2 text-[10px] uppercase tracking-wider">[{log.source}]</span>
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