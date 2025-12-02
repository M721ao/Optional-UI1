import React, { useState } from 'react';
import { Flow, Vault } from '../types';
import { Play, Pause, AlertTriangle, TrendingUp, Box, Activity } from 'lucide-react';
import { NeonChart } from '../components/NeonChart';

export const Dashboard: React.FC = () => {
    // Mock Data
    const [flows] = useState<Flow[]>([
        { id: 'f1', name: 'Auto-Compound Yield', status: 'active', triggers: 142, lastRun: '2m ago', tvl: 45000 },
        { id: 'f2', name: 'ETH Stop-Loss Protect', status: 'paused', triggers: 0, lastRun: '5d ago', tvl: 12000 },
        { id: 'f3', name: 'Arbitrage Scanner V2', status: 'error', triggers: 89, lastRun: '1h ago', tvl: 0 },
    ]);

    const [vaults] = useState<Vault[]>([
        { id: 'v1', name: 'Alpha Vault', asset: 'USDC', apy: 12.4, balance: 24500.50, risk: 'medium' },
        { id: 'v2', name: 'HODL Stash', asset: 'WBTC', apy: 4.2, balance: 1.05, risk: 'low' },
    ]);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-wide">COMMAND_CENTER</h2>
                    <p className="text-cyber-neon font-mono text-sm">Network Status: OPTIMAL // Gas: 14 Gwei</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-panel px-4 py-2 flex flex-col items-end border-r-2 border-r-cyber-purple">
                        <span className="text-xs text-gray-400 uppercase">Total Value Locked</span>
                        <span className="text-xl font-bold text-white">$1,204,500.00</span>
                    </div>
                </div>
            </header>

            {/* Main Stats Chart */}
            <div className="glass-panel p-6 rounded-sm border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-neon via-cyber-purple to-cyber-pink"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Activity size={18} className="text-cyber-neon" />
                        Network Activity
                    </h3>
                    <select className="bg-black/50 border border-gray-700 text-xs text-gray-300 p-1 rounded font-mono">
                        <option>24H</option>
                        <option>7D</option>
                        <option>30D</option>
                    </select>
                </div>
                <NeonChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Flows */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Box className="text-cyber-purple" /> Active Flows
                    </h3>
                    <div className="space-y-3">
                        {flows.map(flow => (
                            <div key={flow.id} className="glass-panel p-4 flex items-center justify-between group hover:border-cyber-purple/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-sm ${
                                        flow.status === 'active' ? 'bg-cyber-neon shadow-[0_0_8px_#00f3ff]' : 
                                        flow.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-cyber-purple transition-colors">{flow.name}</h4>
                                        <div className="text-xs text-gray-500 font-mono flex gap-3 mt-1">
                                            <span>Runs: {flow.triggers}</span>
                                            <span>Last: {flow.lastRun}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-200">${flow.tvl.toLocaleString()}</div>
                                    <div className="text-xs font-mono uppercase mt-1">
                                        {flow.status === 'active' && <span className="text-cyber-neon flex items-center justify-end gap-1"><Play size={10} /> Running</span>}
                                        {flow.status === 'paused' && <span className="text-yellow-500 flex items-center justify-end gap-1"><Pause size={10} /> Paused</span>}
                                        {flow.status === 'error' && <span className="text-red-500 flex items-center justify-end gap-1"><AlertTriangle size={10} /> Error</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vault Management */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-cyber-pink" /> My Vaults
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {vaults.map(vault => (
                            <div key={vault.id} className="bg-cyber-panel border border-gray-800 p-5 rounded-sm relative overflow-hidden hover:border-cyber-pink/40 transition-all">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyber-pink/10 rounded-full blur-2xl"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{vault.name}</h4>
                                        <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded mt-1 inline-block">{vault.risk.toUpperCase()} RISK</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-cyber-pink">{vault.apy}%</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">APY</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-800 pt-4 relative z-10">
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase">Balance</div>
                                        <div className="text-white font-mono">{vault.balance} <span className="text-gray-500">{vault.asset}</span></div>
                                    </div>
                                    <button className="px-3 py-1 text-xs border border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black transition-colors font-bold uppercase">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        ))}
                         <button className="w-full py-3 border border-dashed border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-colors uppercase text-sm font-bold tracking-widest">
                            + Deploy New Vault
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};