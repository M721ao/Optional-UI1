
import React, { useState } from 'react';
import { Lock, ShieldAlert, Terminal, ChevronRight, Zap, Loader2, AlertCircle, Key, MessageSquare } from 'lucide-react';

interface ActivationGateProps {
  onActivate: (code: string) => void;
}

export const ActivationGate: React.FC<ActivationGateProps> = ({ onActivate }) => {
  const [view, setView] = useState<'selection' | 'input'>('selection');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);

  const handleVerify = () => {
    if (code.length < 4) return;
    setIsVerifying(true);
    setError(false);
    
    // Simulate verification
    setTimeout(() => {
      // In a real app, this checks the global registry
      if (code.startsWith('FLOW-') && code.length === 9) {
        onActivate(code);
      } else {
        setIsVerifying(false);
        setError(true);
      }
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-gray-50 dark:bg-[#050505] p-6 font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-sm relative group animate-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* Header */}
          <div className="p-8 pb-4 text-center">
             <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-200 dark:border-purple-500/20">
                <Lock className="text-purple-600 dark:text-cyber-neon" size={24} />
             </div>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest">Access Required</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
               The Studio and Dashboard are restricted to <span className="text-purple-600 dark:text-cyber-neon font-bold">Activated Operators</span>. Please choose a path below.
             </p>
          </div>

          <div className="p-8 pt-4 space-y-4">
            {view === 'selection' ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <button 
                  onClick={() => setView('input')}
                  className="w-full group flex items-center justify-between p-4 bg-purple-600 dark:bg-cyber-neon hover:bg-purple-700 dark:hover:bg-white text-white dark:text-black rounded-xl transition-all shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Key size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">I have a code</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <a 
                  href="https://t.me/neonflow_support" 
                  target="_blank"
                  className="w-full group flex items-center justify-between p-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-cyber-neon rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-cyber-neon" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Apply for code</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </a>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="FLOW-XXXX"
                      className={`w-full bg-gray-50 dark:bg-black/40 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} p-4 rounded-xl text-sm font-mono text-gray-900 dark:text-white outline-none focus:border-purple-500 dark:focus:border-cyber-neon transition-all uppercase text-center tracking-widest`}
                      autoFocus
                    />
                    {error && (
                      <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-[9px] text-red-500 font-bold uppercase animate-in slide-in-from-top-1">
                        <AlertCircle size={10} /> Sequence Invalid
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setView('selection')}
                    className="flex-1 py-3 border border-gray-200 dark:border-white/10 text-gray-500 text-xs font-bold uppercase rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleVerify}
                    disabled={isVerifying || code.length < 4}
                    className="flex-[2] py-3 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black font-bold text-xs uppercase rounded-xl shadow-lg transition-all hover:opacity-90 disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Authenticate'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Decoration */}
          <div className="bg-gray-50 dark:bg-white/5 px-8 py-4 flex items-center justify-center gap-2">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Access Protocol v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
