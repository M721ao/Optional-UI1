
import React, { useState, useEffect } from 'react';
import { X, Copy, Gift, Users, Check, ShieldCheck, LockOpen, Plus, Sparkles, RefreshCw, UserCircle, Terminal } from 'lucide-react';
import { UserProfile, InviteCode } from '../types';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, user }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // For demonstration: Ensure the user starts with 2 used codes if it's the first time viewing
  // In a real app, this data comes from the backend
  useEffect(() => {
    if (isOpen && user.inviteCodes.length === 1) {
       // Mocking the '2 records already exist' state requested
       user.inviteCodes = [
         { code: 'FLOW-8821', isUsed: true },
         { code: 'FLOW-4920', isUsed: true },
         { code: 'FLOW-7712', isUsed: false }
       ];
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateCode = () => {
    if (user.inviteCodes.length >= 3) return;
    
    setIsGenerating(true);
    setTimeout(() => {
        const newCode = `FLOW-${Math.floor(1000 + Math.random() * 9000)}`;
        user.inviteCodes.push({ code: newCode, isUsed: false });
        setIsGenerating(false);
    }, 800);
  };

  // Generate history based on used codes
  const history = user.inviteCodes.filter(c => c.isUsed).map((c, i) => ({
    id: i,
    user: `operator_${c.code.split('-')[1]}`,
    time: i === 0 ? '2h ago' : '1d ago',
    reward: '+500'
  }));

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-sm h-full bg-white dark:bg-[#0a0a0c] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-gray-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Compressed Header with increased vertical padding */}
        <div className="relative px-5 py-6 bg-gradient-to-r from-purple-600/5 to-transparent border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={user.avatar} className="w-10 h-10 rounded-full border border-purple-500/30" alt="User" />
              <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-green-500 rounded-full border border-white dark:border-[#0a0a0c]">
                <ShieldCheck size={10} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider leading-none">{user.name}</h2>
              <span className="text-[9px] font-mono text-purple-600 dark:text-cyber-neon uppercase font-bold tracking-tighter mt-1">Activated_Operator</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide">
          
          {/* Section 1: Invitation Slots */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <LockOpen size={12} className="text-purple-500" /> Invitation Slots
              </h3>
              <span className="text-[10px] font-bold text-gray-400 font-mono">{user.inviteCodes.length}/3</span>
            </div>
            
            <div className="space-y-2">
              {user.inviteCodes.map((item, idx) => (
                <div key={idx} className="relative group animate-in slide-in-from-left-2" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`relative p-3 rounded-lg border flex items-center justify-between transition-all ${item.isUsed ? 'bg-gray-50/30 dark:bg-white/[0.01] border-gray-100 dark:border-white/5 opacity-50' : 'bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 hover:border-purple-500/30 shadow-sm'}`}>
                        <div className="flex flex-col">
                            <span className="text-[7px] text-gray-400 uppercase font-bold tracking-[0.2em] mb-0.5">Slot_0{idx + 1}</span>
                            <span className={`text-xs font-mono font-bold tracking-[0.15em] ${item.isUsed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                {item.code}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {item.isUsed ? (
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded">Exhausted</span>
                            ) : (
                                <button 
                                    onClick={() => copyToClipboard(item.code)}
                                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-lg text-purple-600 dark:text-cyber-neon transition-all active:scale-95"
                                >
                                    {copiedCode === item.code ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
              ))}

              {user.inviteCodes.length < 3 && (
                <button 
                  onClick={handleGenerateCode}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-gray-300 dark:border-white/20 rounded-lg text-[9px] font-bold text-gray-400 hover:text-purple-600 dark:hover:text-cyber-neon hover:border-purple-400 dark:hover:border-cyber-neon/50 transition-all bg-gray-50/50 dark:bg-transparent"
                >
                  {isGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                  {isGenerating ? 'Decrypting...' : 'Provision New Slot'}
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Invite History (Integrated Rewards) */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Users size={12} className="text-amber-500" /> Invite History
            </h3>
            
            <div className="bg-gray-50/50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden min-h-[100px] flex flex-col">
                {history.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 hover:bg-white dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-cyber-neon shrink-0 border border-purple-200 dark:border-purple-500/20">
                            <UserCircle size={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate font-mono uppercase">{item.user}</div>
                            <div className="text-[8px] text-gray-400 font-mono uppercase tracking-tighter">{item.time}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1.5">
                             <span className="text-[10px] font-mono font-bold text-green-600 dark:text-green-500">{item.reward}</span>
                             <span className="text-[8px] font-bold text-gray-400">CR</span>
                          </div>
                          <span className="text-[7px] text-gray-400 uppercase font-bold tracking-tighter px-1 rounded-sm bg-black/5 dark:bg-white/5">Claimed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center gap-2">
                     <Sparkles size={20} className="text-gray-200 dark:text-gray-800" />
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed">No activation records detected.<br/>Share your codes to start earning.</p>
                  </div>
                )}
            </div>

            <p className="text-[9px] text-gray-400 text-center uppercase tracking-tighter leading-relaxed px-4 opacity-60">
              Successful activations grant you <span className="text-purple-600 dark:text-cyber-neon font-bold">500 Compute Credits</span> per operative.
            </p>
          </div>
        </div>

        {/* Techy Footer Decoration */}
        <div className="p-4 flex items-center justify-center gap-2 opacity-20 border-t border-gray-100 dark:border-white/5">
          <Terminal size={10} className="text-gray-500" />
          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Protocol_Secure // v2.0.45</span>
        </div>
      </div>
    </div>
  );
};
