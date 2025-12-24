
import React, { useState } from 'react';
import { X, Gift, Sparkles, Copy, Check, MessageCircle, Terminal, Zap, ChevronRight } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const userId = "#10003";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#08080a] border border-gray-200 dark:border-white/10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
        
        {/* Top Decorative Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 dark:via-cyber-neon to-transparent opacity-50 animate-flow-beam"></div>

        {/* Header: Compact & Techy */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-purple-600 dark:text-cyber-neon" />
            <div className="flex flex-col">
                <h2 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] leading-none">Resource_Center</h2>
                <span className="text-[8px] font-bold text-purple-500 dark:text-cyber-neon/60 uppercase mt-0.5">Free during beta!</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Compact Content Body */}
        <div className="p-4 space-y-4">
          
          {/* 1. Integrated Info Bar (Beta Bonus + Balance) */}
          <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border border-emerald-500/30 bg-emerald-500/5 rounded-sm">
                  <div className="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Sparkles size={10} /> Beta Bonus
                  </div>
                  <div className="text-[9px] text-emerald-800 dark:text-emerald-400/80 leading-tight">Join community for instant credits.</div>
              </div>
              <div className="p-2 border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/40 rounded-sm flex flex-col justify-center">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Balance</span>
                  <div className="text-lg font-mono font-bold text-gray-900 dark:text-white leading-none">0 <span className="text-[9px] opacity-40">CR</span></div>
              </div>
          </div>

          {/* 2. Compact Steps Flow */}
          <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Process_Steps</label>
              <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-sm overflow-hidden">
                  <StepRow number="01" text="Join Telegram Community" />
                  <StepRow number="02" text="Send User ID to our team" />
                  <StepRow number="03" text="Receive free credits" isLast />
              </div>
          </div>

          {/* 3. User ID Section (Horizontal & Dense) */}
          <div className="bg-black/5 dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-sm p-2 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                  <div className="px-1.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-[9px] font-mono text-gray-500 dark:text-gray-400 uppercase">UID</div>
                  <span className="text-xs font-mono font-bold text-gray-900 dark:text-white tracking-widest">{userId}</span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold uppercase bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 hover:border-purple-500 dark:hover:border-cyber-neon transition-all"
              >
                {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
          </div>

          {/* 4. Action Button (The Cyber Button) */}
          <button 
              className="w-full py-3 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-purple-700 dark:hover:bg-white text-[10px] clip-path-polygon shadow-[0_0_15px_rgba(188,19,254,0.3)] dark:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
              <MessageCircle size={14} fill="currentColor" />
              Initialize Join Sequence
          </button>
          
          <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Team_Online</span>
              </div>
              <span className="text-[8px] text-gray-400 italic">Response time: ~2 hours</span>
          </div>
        </div>
        
        {/* Bottom Detail line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 dark:via-cyber-neon to-transparent opacity-20"></div>
      </div>
    </div>
  );
};

const StepRow: React.FC<{ number: string; text: string; isLast?: boolean }> = ({ number, text, isLast }) => (
    <div className={`flex items-center gap-3 p-2 group hover:bg-white dark:hover:bg-white/5 transition-colors ${!isLast ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
        <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-cyber-neon/60 group-hover:text-purple-500 dark:group-hover:text-cyber-neon transition-colors">{number}</span>
        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide flex-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{text}</span>
        <ChevronRight size={10} className="text-gray-300 dark:text-white/10 group-hover:translate-x-0.5 transition-transform" />
    </div>
);
