
import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Terminal, Info, AlertTriangle } from 'lucide-react';

interface LogEntry {
  id: number;
  type: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
}

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeLabel: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  startTime?: string;
  endTime?: string;
  logs: LogEntry[];
}

export const LogModal: React.FC<LogModalProps> = ({ 
  isOpen, 
  onClose, 
  nodeLabel, 
  status, 
  startTime, 
  endTime, 
  logs 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#0e0e12] border border-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 bg-[#121218] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide">{nodeLabel} - Node Execution</h2>
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
              status === 'failed' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
              status === 'running' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
              'bg-gray-500/10 border-gray-500/30 text-gray-400'
            }`}>
              {status}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Clock size={16} className="text-gray-500" />
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-3 border-b border-gray-800 bg-[#0a0a0f] text-xs font-mono shrink-0">
            <div className="p-4 border-r border-gray-800">
                <div className="text-gray-500 mb-1">Status</div>
                <div className={`font-bold ${
                   status === 'success' ? 'text-green-500' :
                   status === 'failed' ? 'text-red-500' : 'text-white'
                }`}>{status === 'success' ? 'Completed' : status === 'failed' ? 'Failed' : 'Processing...'}</div>
            </div>
            <div className="p-4 border-r border-gray-800">
                <div className="text-gray-500 mb-1">Start Time</div>
                <div className="text-gray-300">{startTime || '--'}</div>
            </div>
            <div className="p-4">
                <div className="text-gray-500 mb-1">End Time</div>
                <div className="text-gray-300">{endTime || '--'}</div>
            </div>
        </div>

        {/* Logs Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050505] font-mono">
            {logs.length === 0 ? (
                <div className="text-center text-gray-600 italic py-10">No execution logs available.</div>
            ) : (
                logs.map((log) => (
                    <div key={log.id} className="p-3 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex gap-3 items-start group">
                        <div className="mt-0.5 shrink-0">
                            {log.type === 'INFO' && <Info size={14} className="text-blue-500" />}
                            {log.type === 'WARN' && <AlertTriangle size={14} className="text-yellow-500" />}
                            {log.type === 'ERROR' && <AlertCircle size={14} className="text-red-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold ${
                                    log.type === 'INFO' ? 'text-blue-500' : 
                                    log.type === 'WARN' ? 'text-yellow-500' : 'text-red-500'
                                }`}>{log.type}</span>
                                <span className="text-[10px] text-gray-500">node</span>
                                <span className="text-[10px] text-gray-600">{log.timestamp}</span>
                             </div>
                             <div className="text-xs text-gray-300 leading-relaxed break-words">
                                {log.message}
                             </div>
                        </div>
                    </div>
                ))
            )}
            
            {status === 'running' && (
                <div className="flex items-center gap-2 text-xs text-gray-500 animate-pulse px-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Waiting for next block...
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0e0e12] border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
            <div className="flex items-center gap-2">
                <Terminal size={12} />
                <span>Execution ID: 0x{Math.random().toString(16).slice(2, 10)}</span>
            </div>
            <div>
                 Gas Used: <span className="text-gray-300">145,200</span>
            </div>
        </div>

      </div>
    </div>
  );
};
