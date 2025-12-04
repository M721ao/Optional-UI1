
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { RefreshCw, Zap, ChevronRight, CreditCard, Clock, CheckCircle2, Loader2, X, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface CreditsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenPricing?: () => void;
}

export const CreditsMenu: React.FC<CreditsMenuProps> = ({ isOpen, onClose, user, onOpenPricing }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenPricing) {
        onOpenPricing();
    }
  };

  const handleViewHistory = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowHistoryModal(true);
  };

  const closeModal = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setShowHistoryModal(false);
  };

  // Calculation: Assuming user.credits is "Available Balance"
  const maxCredits = 5000;
  const usedCredits = Math.max(0, maxCredits - user.credits);
  const usagePercentage = Math.min((usedCredits / maxCredits) * 100, 100);

  return (
    <>
      {/* Menu Backdrop - Closes menu when clicked outside, but only if modal isn't open */}
      {!showHistoryModal && <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onClose(); }}></div>}
      
      {/* MAIN DROPDOWN MENU */}
      <div 
        className={`absolute top-14 right-0 w-80 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col ${showHistoryModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside menu from bubbling
      >
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#121218] flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 dark:bg-cyber-purple/20 rounded text-purple-600 dark:text-cyber-neon">
                    <Zap size={14} fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Compute Resources</span>
            </div>
            <button 
                onClick={handleRefresh}
                className={`text-gray-400 hover:text-purple-600 dark:hover:text-cyber-neon transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                title="Refresh Balance"
            >
                <RefreshCw size={14} />
            </button>
        </div>

        {/* Balance Section */}
        <div className="p-5 flex flex-col items-center border-b border-gray-200 dark:border-white/5">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Available Balance</span>
            <div className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight flex items-baseline gap-1">
                {user.credits.toLocaleString()}
                <span className="text-sm font-normal text-gray-400">CR</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-gray-500">Monthly Usage</span>
                    <span className={`${usagePercentage > 85 ? 'text-red-500' : 'text-purple-600 dark:text-cyber-neon'}`}>
                        {Math.round(usagePercentage)}%
                    </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${usagePercentage > 85 ? 'bg-red-500' : 'bg-gradient-to-r from-cyber-neon to-cyber-purple'}`}
                        style={{ width: `${usagePercentage}%` }}
                    ></div>
                </div>
                <div className="text-[9px] text-gray-400 text-right">Resets in 12 days</div>
            </div>
        </div>

        {/* Plan Details */}
        <div className="p-4 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5">
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Current Plan</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white border border-gray-300 dark:border-white/10">
                    {user.plan} TIER
                </span>
            </div>
            
            <button 
                onClick={handleUpgrade}
                className="w-full py-3 font-bold uppercase tracking-widest text-xs rounded shadow-lg transition-all flex items-center justify-center gap-2 group bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
                <CreditCard size={14} />
                Upgrade to Pro
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Recent Activity Mini-List */}
        <div className="flex-1 overflow-y-auto max-h-[150px] bg-white dark:bg-[#0a0a0f] scrollbar-hide">
             <div className="sticky top-0 bg-white dark:bg-[#0a0a0f] px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 z-10">
                 Recent Deductions
             </div>
             <div className="divide-y divide-gray-100 dark:divide-white/5">
                 <ActivityItem label="Strategy Execution" amount={-15} time="2m ago" />
                 <ActivityItem label="AI Model Query (Gemini)" amount={-4} time="15m ago" />
                 <ActivityItem label="Vault Deployment" amount={-150} time="1h ago" />
                 <ActivityItem label="Daily Login Bonus" amount={+50} time="1d ago" isPositive />
             </div>
        </div>
        
        <div className="p-2 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#121218] text-center">
            <button 
                onClick={handleViewHistory}
                className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto hover:underline py-1 uppercase font-bold tracking-wider"
            >
                <History size={10} /> View Full History
            </button>
        </div>
      </div>

      {/* FULL HISTORY MODAL (SIMPLIFIED) */}
      {showHistoryModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={closeModal}>
            <div 
                className="w-full max-w-md bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121218]">
                    <div className="flex items-center gap-3">
                         <div className="p-1.5 bg-gray-100 dark:bg-white/10 rounded text-gray-600 dark:text-gray-300">
                             <History size={16} />
                         </div>
                         <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                             Transaction History
                         </h2>
                    </div>
                    <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0c0c10]">
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {Array.from({ length: 10 }).map((_, i) => (
                             <HistoryRow key={i} index={i} />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121218] text-right">
                    <button 
                        onClick={closeModal}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase rounded text-xs tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Mini list item for dropdown
const ActivityItem = ({ label, amount, time, isPositive = false }: { label: string, amount: number, time: string, isPositive?: boolean }) => (
    <div className="px-4 py-2.5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-default">
        <div className="flex items-center gap-3">
             <div className={`p-1 rounded-full ${isPositive ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                 {isPositive ? <CheckCircle2 size={10} /> : <Clock size={10} />}
             </div>
             <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{label}</span>
                 <span className="text-[9px] text-gray-400">{time}</span>
             </div>
        </div>
        <span className={`text-[10px] font-mono font-bold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-gray-900 dark:text-white'}`}>
            {isPositive ? '+' : ''}{amount} CR
        </span>
    </div>
);

// Expanded row for Modal
const HistoryRow = ({ index }: { index: number }) => {
    // Mock Data Generator
    const actions = [
        { label: 'Strategy Execution: Delta Farm', type: 'EXEC', amount: -15, icon: Zap },
        { label: 'Vault Deployment (ETH)', type: 'DEPLOY', amount: -150, icon: ArrowUpRight },
        { label: 'AI Model Query: Gemini', type: 'AI', amount: -4, icon: RefreshCw },
        { label: 'Referral Bonus', type: 'BONUS', amount: +250, icon: ArrowDownLeft, positive: true },
        { label: 'Daily Login Reward', type: 'BONUS', amount: +50, icon: CheckCircle2, positive: true },
    ];
    
    const item = actions[index % actions.length];
    const isPositive = item.positive || false;
    const daysAgo = Math.floor(index / 2);
    
    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-default group">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                    <item.icon size={16} />
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyber-neon transition-colors">{item.label}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">ID: #8821-{1000 + index} • {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}</div>
                </div>
            </div>
            <div className={`font-mono text-xs font-bold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-gray-900 dark:text-white'}`}>
                {isPositive ? '+' : ''}{item.amount} CR
            </div>
        </div>
    );
};
