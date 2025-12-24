
import React, { useState } from 'react';
import { X, Copy, Gift, Users, Zap, Check, Trophy, ShieldCheck, ChevronRight, MessageSquare, Terminal, QrCode, LockOpen, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { UserProfile, InviteCode } from '../types';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, user }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-sm h-full bg-white dark:bg-[#0a0a0c] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-gray-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-b border-gray-100 dark:border-white/5">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
          
          <div className="flex flex-col items-center mt-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyber-neon rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <img src={user.avatar} className="relative w-20 h-20 rounded-full border-2 border-white dark:border-[#0a0a0c]" alt="User" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full border-2 border-white dark:border-[#0a0a0c]">
                <ShieldCheck size={14} className="text-white" />
              </div>
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white uppercase tracking-widest">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">Activated_Operator</span>
            </div>
          </div>
        </div>

        {/* Unified Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* Section 1: Code Registry (Multi-Slot) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Gift size={14} className="text-purple-500" /> Invite_Registry
              </h3>
              <span className="text-[10px] font-bold text-gray-400">{user.inviteCodes.length}/3 Slots</span>
            </div>
            
            <div className="space-y-3">
              {user.inviteCodes.map((item, idx) => (
                <div key={idx} className="relative group animate-in slide-in-from-left-2" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="relative p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between hover:border-purple-500/30 transition-all">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-400 uppercase font-bold tracking-widest mb-1">Sequence_{idx + 1}</span>
                            <span className={`text-sm font-mono font-bold tracking-[0.2em] ${item.isUsed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                {item.code}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {item.isUsed ? (
                                <div className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-[8px] font-bold text-gray-500 uppercase">Used</div>
                            ) : (
                                <button 
                                    onClick={() => copyToClipboard(item.code)}
                                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-lg text-purple-600 dark:text-cyber-neon transition-all active:scale-95"
                                    title="Copy Code"
                                >
                                    {copiedCode === item.code ? <Check size={16} /> : <Copy size={16} />}
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
                  className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-gray-300 dark:border-white/20 rounded-xl text-[10px] font-bold text-gray-500 hover:text-purple-600 dark:hover:text-cyber-neon hover:border-purple-400 dark:hover:border-cyber-neon/50 transition-all bg-gray-50/50 dark:bg-transparent"
                >
                  {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  {isGenerating ? 'Decrypting Sequence...' : 'Generate New Invitation Slot'}
                </button>
              )}
            </div>
            
            <p className="text-[9px] text-gray-400 text-center uppercase tracking-tighter italic">
              Share these codes with new users to grant them instant access.
            </p>
          </div>

          {/* Section 2: Rewards Dashboard */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" /> Affiliate_Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Invited</div>
                <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    {user.inviteCodes.filter(c => c.isUsed).length}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Bonus</div>
                <div className="text-lg font-mono font-bold text-purple-600 dark:text-cyber-neon">
                    {user.inviteCodes.filter(c => c.isUsed).length * 500}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 dark:bg-[#0c0c0e] border-t border-gray-200 dark:border-white/10">
          <button className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all">
            <MessageSquare size={16} fill="currentColor" /> Share Access Via Telegram
          </button>
        </div>

      </div>
    </div>
  );
};
