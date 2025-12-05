import React from 'react';
import { X, Clock, Info, CheckCircle2, AlertOctagon, Loader2, AlertTriangle, Terminal } from 'lucide-react';

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
  if (!isOpen) return null;

  const getStatusBadge = () => {
     switch(status.toLowerCase()) {
      case 'success': return <span className="flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.4)]"><CheckCircle2 size={12} /> Completed</span>;
      case 'failed': return <span className="flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.4)]"><AlertOctagon size={12} /> Failed</span>;
      case 'running': return <span className="flex items-center gap-1.5 bg-yellow-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.4)]"><Loader2 size={12} className="animate-spin" /> Running</span>;
      default: return <span className="bg-gray-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Idle</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-[#0a0a0f] border border-gray-800 rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#121218]">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white tracking-wide font-sans">{nodeLabel} - Node Execution</h2>
                {getStatusBadge()}
            </div>
            <div className="flex items-center gap-6">
                 <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <Clock size={14} className="text-gray-500" />
                    <span>Duration: {endTime ? '10.2s' : 'Running...'}</span>
                 </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-[#0c0c10] border-b border-gray-800 text-sm">
            <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold mb-1.5 tracking-widest">Status</span>
                <span className="text-white font-mono text-sm">{status === 'success' ? 'Completed' : status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold mb-1.5 tracking-widest">Start Time</span>
                <span className="text-white font-mono text-sm">{startTime || '--'}</span>
            </div>
             <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold mb-1.5 tracking-widest">End Time</span>
                <span className="text-white font-mono text-sm">{endTime || '--'}</span>
            </div>
        </div>

        {/* Logs Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#050505] font-mono text-sm relative">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

            {logs.length === 0 ? (
                <div className="text-gray-500 italic text-center py-20 flex flex-col items-center gap-4">
                    <Terminal size={32} className="opacity-50" />
                    <span className="text-xs uppercase tracking-widest">Waiting for logs...</span>
                </div>
            ) : (
                logs.map((log) => (
                    <div key={log.id} className="border border-gray-800 rounded-lg p-4 bg-[#0a0a0f]/90 backdrop-blur flex gap-4 hover:border-gray-700 transition-colors group relative z-10">
                        <div className="mt-0.5 shrink-0">
                            {log.level === 'ERROR' ? (
                                <AlertOctagon size={18} className="text-red-500" />
                            ) : log.level === 'WARN' ? (
                                <AlertTriangle size={18} className="text-yellow-500" />
                            ) : (
                                <Info size={18} className="text-blue-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                                <span className={`text-[10px] font-bold ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-400'}`}>
                                    {log.level}
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{log.source}</span>
                                <span className="text-[10px] text-gray-600">{log.timestamp}</span>
                            </div>
                            <div className="text-gray-300 break-words whitespace-pre-wrap leading-relaxed text-xs md:text-sm">
                                {log.message}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
