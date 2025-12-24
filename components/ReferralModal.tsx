
import React, { useState } from 'react';
import { X, Copy, Gift, Users, Zap, Check, Trophy, Terminal, ChevronDown, ChevronRight, InputIcon, MessageSquare } from 'lucide-react';
import { UserProfile } from '../types';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, user }) => {
  const [copied, setCopied] = useState(false);
  const [bindCode, setBindCode] = useState('');
  const [isBinding, setIsBinding] = useState(false);
  const [bindSuccess, setBindSuccess] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBind = () => {
    if (!bindCode) return;
    setIsBinding(true);
    setTimeout(() => {
        setIsBinding(false);
        setBindSuccess(true);
    }, 1000);
  };

  // Mock Referral Data
  const referrals = [
      { id: 1, name: 'Alice_WAGMI', date: '2d', reward: '+500' },
      { id: 2, name: 'Quant_Dev', date: '5d', reward: '+500' },
      { id: 3, name: 'Sol_Maxi', date: '1w', reward: '+0' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#08080a] border border-gray-200 dark:border-white/10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
        
        {/* Top Decorative Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 dark:via-cyber-neon to-transparent opacity-50 animate-flow-beam"></div>

        {/* Header: Dense & Industrial */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-amber-500" />
            <div className="flex flex-col">
                <h2 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] leading-none">Affiliate_Engine</h2>
                <span className="text-[8px] font-bold text-amber-500/60 uppercase mt-0.5">Reward program active</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          
          {/* SECTION 1: MY INVITE CODE (Large Centerpiece) */}
          <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">My_Unique_Code</label>
              <div className="relative group">
                  <div className="absolute inset-0 bg-purple-500/10 dark:bg-cyber-neon/5 blur-sm opacity-50"></div>
                  <div className="relative bg-gray-50 dark:bg-black/60 border border-purple-200 dark:border-cyber-neon/30 p-4 flex items-center justify-between overflow-hidden rounded-sm">
                      <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-[0.2em]">
                          {user.inviteCode}
                      </div>
                      <button 
                        onClick={copyToClipboard}
                        className="px-3 py-1.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 hover:border-purple-600 dark:hover:border-cyber-neon text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                  </div>
              </div>
              <p className="text-[9px] text-gray-400 text-center uppercase tracking-tighter">Share to earn <span className="text-purple-600 dark:text-cyber-neon font-bold">500 Credits</span> per valid user</p>
          </div>

          {/* SECTION 2: BIND CODE (Compact Inline) */}
          <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Redeem_Affiliate</label>
              {!bindSuccess ? (
                  <div className="flex gap-2">
                      <input 
                          type="text" 
                          value={bindCode}
                          onChange={(e) => setBindCode(e.target.value)}
                          placeholder="PASTE CODE HERE"
                          className="flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white outline-none focus:border-purple-500 dark:focus:border-cyber-neon transition-colors uppercase placeholder:text-gray-300 dark:placeholder:text-gray-700"
                      />
                      <button 
                          onClick={handleBind}
                          disabled={!bindCode || isBinding}
                          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50 clip-path-polygon"
                      >
                          {isBinding ? '...' : 'Claim'}
                      </button>
                  </div>
              ) : (
                  <div className="p-2 border border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-500 text-[10px] font-bold uppercase flex items-center gap-2 justify-center">
                      <Check size={12} /> Reward Applied Successfully
                  </div>
              )}
          </div>

          {/* SECTION 3: STATS GRID */}
          <div className="grid grid-cols-2 gap-2">
              <div className="p-3 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-sm flex flex-col items-center">
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Total_Invited</span>
                  <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">03</span>
              </div>
              <div className="p-3 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-sm flex flex-col items-center">
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Earned_Reward</span>
                  <span className="text-lg font-mono font-bold text-purple-600 dark:text-cyber-neon">1.5K <span className="text-[9px] opacity-40">CR</span></span>
              </div>
          </div>

          {/* SECTION 4: LOGS / HISTORY (Compact List) */}
          <div className="pt-2">
              <button 
                onClick={() => setShowLogs(!showLogs)}
                className="w-full flex items-center justify-between px-1 mb-2 group"
              >
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-800 dark:group-hover:text-gray-300">Invite_Log</span>
                  <ChevronDown size={12} className={`text-gray-400 transition-transform ${showLogs ? 'rotate-180' : ''}`} />
              </button>
              
              {showLogs && (
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-sm overflow-hidden animate-in slide-in-from-top-2">
                      {referrals.map((ref) => (
                          <div key={ref.id} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-white dark:hover:bg-white/5 transition-colors">
                              <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold text-white">
                                      {ref.name[0]}
                                  </div>
                                  <span className="text-[10px] text-gray-700 dark:text-gray-400 truncate w-24 font-medium">{ref.name}</span>
                              </div>
                              <div className="flex gap-4 items-center">
                                  <span className="text-[9px] text-gray-400 font-mono">{ref.date}</span>
                                  <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-cyber-neon">{ref.reward}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
        </div>

        {/* Action Button: Share to external */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex gap-2">
            <button className="flex-1 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 clip-path-polygon shadow-lg shadow-blue-600/20">
                <MessageSquare size={12} /> Share On Telegram
            </button>
        </div>
        
        {/* Bottom Decorative Data */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 dark:via-cyber-neon to-transparent opacity-20"></div>
      </div>
    </div>
  );
};
