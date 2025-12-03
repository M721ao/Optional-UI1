import React, { useState } from 'react';
import { Shield, ArrowUpRight, DollarSign, Rocket, Activity } from 'lucide-react';

export const VaultWidget: React.FC = () => {
    const [isDeployed, setIsDeployed] = useState(false);

    return (
        <div className="bg-white dark:bg-cyber-panel border-b border-gray-200 dark:border-white/10 p-4 shrink-0 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={14} className={isDeployed ? "text-cyber-green" : "text-gray-400"} />
                    Vault Status
                </h3>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${isDeployed ? 'border-cyber-green/50 text-cyber-green bg-cyber-green/10' : 'border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5'}`}>
                    {isDeployed ? 'ACTIVE :: 0x7A...9f' : 'NOT DEPLOYED'}
                </span>
            </div>

            {!isDeployed ? (
                <div className="flex items-center gap-3">
                    <div className="flex-1 text-[10px] text-gray-500 leading-tight">
                        Strategy logic is ready. Deploy to secure vault to start execution.
                    </div>
                    <button 
                        onClick={() => setIsDeployed(true)}
                        className="px-4 py-2 bg-black dark:bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-transparent dark:border-cyber-neon/50 text-white dark:text-cyber-neon text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 rounded shadow-sm"
                    >
                        <Rocket size={12} /> Create Vault
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex-1 bg-gray-100 dark:bg-black/40 px-2 py-1.5 rounded border border-gray-200 dark:border-white/5 flex justify-between items-center">
                        <span className="text-[9px] text-gray-500">YIELD (24H)</span>
                        <span className="text-xs font-mono font-bold text-cyber-green">+12.4%</span>
                    </div>
                    <div className="flex gap-1">
                         <button className="p-1.5 bg-gray-100 dark:bg-cyber-green/10 border border-gray-200 dark:border-cyber-green/30 text-cyber-green hover:bg-cyber-green/20 rounded transition-colors" title="Deposit">
                            <ArrowUpRight size={14} />
                        </button>
                        <button className="p-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded transition-colors" title="Withdraw">
                            <DollarSign size={14} />
                        </button>
                         <button className="p-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded transition-colors" title="Activity Log">
                            <Activity size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};