
import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, RefreshCw, WifiOff, Terminal } from 'lucide-react';

// --- TOAST NOTIFICATIONS ---

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

interface ToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div 
            key={n.id} 
            className="pointer-events-auto min-w-[300px] max-w-sm bg-white dark:bg-[#1a1a20] border-l-4 shadow-2xl rounded-sm overflow-hidden animate-in slide-in-from-right-full duration-300 relative group"
            style={{ 
                borderLeftColor: n.type === 'success' ? '#10b981' : n.type === 'error' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#3b82f6' 
            }}
        >
            <div className="p-4 flex items-start gap-3">
                <div className={`mt-0.5 ${
                     n.type === 'success' ? 'text-green-500' : n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`}>
                    {n.type === 'success' && <CheckCircle size={18} />}
                    {n.type === 'error' && <AlertCircle size={18} />}
                    {n.type === 'warning' && <AlertTriangle size={18} />}
                    {n.type === 'info' && <Info size={18} />}
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1 font-mono uppercase tracking-wider">{n.title}</h4>
                    {n.message && <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1">{n.message}</p>}
                </div>
                <button 
                    onClick={() => onDismiss(n.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
            {/* Timer Bar simulation */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-100 dark:bg-white/5">
                 <div 
                    className={`h-full opacity-70 animate-[shrink_5s_linear_forwards] ${
                        n.type === 'success' ? 'bg-green-500' : n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                 ></div>
            </div>
        </div>
      ))}
    </div>
  );
};

// --- PAGE LEVEL ERROR ---

interface PageErrorProps {
    error: string;
    code?: string;
    onRetry: () => void;
}

export const PageErrorState: React.FC<PageErrorProps> = ({ error, code = "ERR_CONNECTION_REFUSED", onRetry }) => {
    return (
        <div className="absolute inset-0 z-50 bg-gray-50 dark:bg-[#050505] flex flex-col items-center justify-center p-6 font-mono">
             {/* Background Glitch Effect */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent pointer-events-none"></div>
             
             <div className="relative mb-8 group cursor-default">
                 <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse group-hover:bg-red-500/30 transition-all"></div>
                 <div className="relative w-24 h-24 bg-red-50 dark:bg-red-900/10 border-2 border-red-500/50 rounded-full flex items-center justify-center text-red-500">
                     <WifiOff size={40} className="group-hover:scale-110 transition-transform duration-300" />
                 </div>
             </div>
             
             <div className="flex flex-col items-center text-center max-w-lg">
                 <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase tracking-widest text-xs border border-red-500/30 px-2 py-1 rounded bg-red-500/5">
                    <AlertTriangle size={12} /> System Critical
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                     Connection Lost
                 </h2>
                 <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                     {error || "The neural interface has been severed. Unable to synchronize workflow state with the distributed ledger node."}
                 </p>
                 
                 <div className="w-full bg-black/5 dark:bg-white/5 p-4 rounded mb-8 text-left border-l-2 border-red-500">
                    <div className="text-[10px] text-gray-400 uppercase mb-1 flex items-center gap-2">
                        <Terminal size={10} /> Error Log
                    </div>
                    <code className="text-xs text-red-600 dark:text-red-400 block font-bold">
                        {`> ${code}`}
                    </code>
                    <code className="text-[10px] text-gray-500 block mt-1">
                        at System.Net.Socket (0x842A...9F)
                    </code>
                 </div>
                 
                 <button 
                    onClick={onRetry}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest rounded shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                 >
                     <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> 
                     Reboot System
                 </button>
             </div>

             <div className="absolute bottom-8 text-[10px] text-gray-400 uppercase tracking-[0.2em] opacity-50">
                 TradingFlow Secure Environment
             </div>
        </div>
    );
};
