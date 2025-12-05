import React, { useState } from 'react';
import { Shield, ArrowUpRight, DollarSign, Rocket, Activity, Check } from 'lucide-react';

export const VaultWidget: React.FC = () => {
    const [isDeployed, setIsDeployed] = useState(false);

    return (
        <div className="flex items-center gap-3 bg-white/90 dark:bg-cyber-panel/90 backdrop-blur-md p-1.5 pr-3 rounded-full border border-gray-200 dark:border-white/10 shadow-lg transition-colors animate-in fade-in slide-in-from-top-4">
            {/* Status Icon Area */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${isDeployed ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'}`}>
                {isDeployed ? <Check size={14} /> : <Shield size={14} />}
            </div>

            {/* Info Text */}
            <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Vault Status</span>
                <span className={`text-[10px] font-mono font-bold leading-none ${isDeployed ? 'text-cyber-green' : 'text-gray-600 dark:text-gray-300'}`}>
                    {isDeployed ? 'ACTIVE :: 0x7A...9f' : 'NOT DEPLOYED'}
                </span>
            </div>

            <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10 mx-1"></div>

            {!isDeployed ? (
                <button 
                    onClick={() => setIsDeployed(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                >
                    <Rocket size={10} /> Deploy
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-1">
                        <span className="text-[8px] text-gray-400">YIELD</span>
                        <span className="text-[10px] font-mono font-bold text-cyber-green">+12.4%</span>
                    </div>
                    <div className="flex gap-1">
                         <button className="p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors text-gray-700 dark:text-gray-200" title="Deposit">
                            <ArrowUpRight size={12} />
                        </button>
                        <button className="p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors text-gray-700 dark:text-gray-200" title="Withdraw">
                            <DollarSign size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};