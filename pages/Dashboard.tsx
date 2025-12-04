import React, { useState } from 'react';
import { Flow, Vault, CommunityStrategy } from '../types';
import { 
    Play, Pause, TrendingUp, Box, Activity, 
    Copy, Users, Zap, Search, ArrowUpRight, 
    Lock, Globe, MoreHorizontal, ChevronDown, ChevronUp,
    BarChart3, Radio, Wifi, Database
} from 'lucide-react';
import { NeonChart } from '../components/NeonChart';

// --- CSS-BASED FLOW THUMBNAIL VISUALIZER ---
const FlowThumbnail: React.FC<{ type: 'linear' | 'branching' | 'complex' }> = ({ type }) => {
    return (
        <div className="w-full h-24 bg-[#080808] relative overflow-hidden group-hover:bg-[#0a0a0f] transition-colors border-b border-white/5">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* Simulation of Nodes & Edges */}
            <div className="absolute inset-0 flex items-center justify-center scale-75 opacity-60 group-hover:opacity-100 group-hover:scale-90 transition-all duration-500">
                {type === 'linear' && (
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded bg-cyber-purple/20 border border-cyber-purple flex items-center justify-center"><Zap size={10} className="text-cyber-purple"/></div>
                        <div className="w-6 h-0.5 bg-gray-700"></div>
                        <div className="w-6 h-6 rounded bg-cyber-neon/20 border border-cyber-neon flex items-center justify-center"><Activity size={10} className="text-cyber-neon"/></div>
                        <div className="w-6 h-0.5 bg-gray-700"></div>
                        <div className="w-6 h-6 rounded bg-white/10 border border-white/40 flex items-center justify-center"><Box size={10} className="text-white"/></div>
                    </div>
                )}

                {type === 'branching' && (
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded bg-yellow-500/20 border border-yellow-500 flex items-center justify-center"><Activity size={10} className="text-yellow-500"/></div>
                        <div className="w-4 h-0.5 bg-gray-700"></div>
                        <div className="flex flex-col gap-4 relative">
                             {/* Vertical connector */}
                            <div className="absolute left-[-16px] top-[12px] bottom-[12px] w-0.5 bg-gray-700"></div>
                            {/* Top Branch */}
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-gray-700"></div>
                                <div className="w-6 h-6 rounded bg-cyber-pink/20 border border-cyber-pink"></div>
                            </div>
                            {/* Bottom Branch */}
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-gray-700"></div>
                                <div className="w-6 h-6 rounded bg-cyber-neon/20 border border-cyber-neon"></div>
                            </div>
                        </div>
                    </div>
                )}

                {type === 'complex' && (
                    <div className="relative w-32 h-16">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-700" strokeWidth="1">
                            <line x1="50%" y1="10%" x2="10%" y2="90%" />
                            <line x1="50%" y1="10%" x2="90%" y2="80%" />
                            <line x1="10%" y1="90%" x2="90%" y2="80%" />
                        </svg>
                        <div className="absolute top-0 left-10 w-4 h-4 rounded bg-cyber-purple/20 border border-cyber-purple z-10"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 rounded bg-cyber-neon/20 border border-cyber-neon z-10"></div>
                        <div className="absolute bottom-4 right-4 w-4 h-4 rounded bg-cyber-pink/20 border border-cyber-pink z-10"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
    const [isChartExpanded, setIsChartExpanded] = useState(false);

    // --- MOCK DATA ---
    const [intelStream] = useState([
        { id: '1', signal: 'ARBITRAGE', pair: 'ETH/USDC', dex: 'Uniswap -> Curve', gain: '+1.2%', time: '12s ago', type: 'neon' },
        { id: '2', signal: 'WHALE BUY', pair: 'PEPE', dex: 'Binance', gain: '$450k Vol', time: '45s ago', type: 'pink' },
        { id: '3', signal: 'YIELD SPIKE', pair: 'GMX', dex: 'Arbitrum', gain: '24% APY', time: '2m ago', type: 'purple' },
        { id: '4', signal: 'LIQUIDATION', pair: 'WBTC', dex: 'Aave', gain: '$1.2M', time: '5m ago', type: 'red' },
    ]);

    const [flows] = useState<Flow[]>([
        { id: 'f1', name: 'Auto-Compound Yield', status: 'active', triggers: 142, lastRun: '2m ago', tvl: 45000, thumbnailType: 'linear' },
        { id: 'f2', name: 'ETH Stop-Loss Protect', status: 'paused', triggers: 0, lastRun: '5d ago', tvl: 12000, thumbnailType: 'branching' },
        { id: 'f3', name: 'Arbitrage Scanner V2', status: 'error', triggers: 89, lastRun: '1h ago', tvl: 0, thumbnailType: 'complex' },
        { id: 'f4', name: 'Stablecoin Peg Watch', status: 'active', triggers: 1240, lastRun: '30s ago', tvl: 8500, thumbnailType: 'linear' },
    ]);

    const [vaults] = useState<Vault[]>([
        { id: 'v1', name: 'Alpha Vault [USDC]', asset: 'USDC', apy: 12.4, balance: 24500.50, risk: 'medium' },
        { id: 'v2', name: 'HODL Stash [WBTC]', asset: 'WBTC', apy: 4.2, balance: 1.05, risk: 'low' },
        { id: 'v3', name: 'Degen Farm [PEPE]', asset: 'PEPE', apy: 420.69, balance: 50000000, risk: 'high' },
    ]);

    return (
        <div className="h-full overflow-y-auto bg-[#050505] pb-20 scrollbar-hide">
            
            {/* 1. SLIM MARKET TICKER (Collapsible Header) */}
            <div className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center justify-between px-6 py-2">
                    {/* Ticker Items */}
                    <div className="flex items-center gap-6 overflow-hidden">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                            <Globe size={12} className="text-cyber-neon" />
                            <span>GLOBAL: <b className="text-white">$42.5B</b></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                            <Zap size={12} className="text-yellow-500" />
                            <span>GAS: <b className="text-yellow-500">14</b></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 hidden md:flex">
                            <Activity size={12} className="text-cyber-pink" />
                            <span>ETH: <b className="text-white">$2,840</b></span>
                            <span className="text-green-500 text-[10px]">(+2.4%)</span>
                        </div>
                    </div>

                    {/* Chart Toggle */}
                    <button 
                        onClick={() => setIsChartExpanded(!isChartExpanded)}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-all ${isChartExpanded ? 'bg-cyber-purple text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <BarChart3 size={12} /> Analytics
                        {isChartExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                </div>

                {/* Expanded Chart Area */}
                {isChartExpanded && (
                    <div className="h-64 border-b border-white/10 animate-in slide-in-from-top-2">
                        <NeonChart />
                    </div>
                )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 2. LEFT COLUMN: MY OPERATIONS (70% Width) */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* MY FLOWS HEADER */}
                    <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-1.5 bg-cyber-neon/10 rounded border border-cyber-neon/30">
                                <Box size={18} className="text-cyber-neon" /> 
                            </div>
                            Active Workflows
                        </h3>
                        <div className="flex gap-2">
                             <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"><Search size={16} /></button>
                             <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
                        </div>
                    </div>

                    {/* FLOWS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {flows.map(flow => (
                            <div key={flow.id} className="bg-[#0c0c10] border border-white/5 rounded-xl overflow-hidden hover:border-cyber-neon/50 transition-all group cursor-pointer shadow-lg relative">
                                {/* Thumbnail */}
                                <FlowThumbnail type={flow.thumbnailType} />
                                
                                {/* Status Light */}
                                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                                    flow.status === 'active' ? 'bg-cyber-neon shadow-[0_0_8px_rgba(0,243,255,0.8)]' : 
                                    flow.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>

                                {/* Body */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-cyber-neon truncate text-sm">{flow.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1 rounded">ID: {flow.id.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5 border-b mb-3">
                                         <div className="text-center border-r border-white/5">
                                            <span className="text-[9px] text-gray-500 uppercase block">Run</span>
                                            <span className="text-xs font-mono text-white">{flow.lastRun}</span>
                                         </div>
                                         <div className="text-center border-r border-white/5">
                                            <span className="text-[9px] text-gray-500 uppercase block">Ops</span>
                                            <span className="text-xs font-mono text-cyber-purple">{flow.triggers}</span>
                                         </div>
                                         <div className="text-center">
                                            <span className="text-[9px] text-gray-500 uppercase block">TVL</span>
                                            <span className="text-xs font-mono text-white">${(flow.tvl/1000).toFixed(1)}k</span>
                                         </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase py-2 rounded transition-colors flex items-center justify-center gap-2">
                                            <Activity size={12} /> Inspect
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-cyber-neon/20 hover:text-cyber-neon text-gray-500 rounded transition-colors">
                                            {flow.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                         
                         {/* Create New Flow Button */}
                        <div className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-colors cursor-pointer group gap-2 min-h-[220px]">
                            <div className="w-10 h-10 rounded-full bg-cyber-neon/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap size={20} className="text-cyber-neon" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider mt-2">Design New Flow</span>
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT COLUMN: VAULTS & INTEL (30% Width) */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* A. MY VAULTS */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-1.5 bg-cyber-purple/10 rounded border border-cyber-purple/30">
                                <Lock size={18} className="text-cyber-purple" />
                            </div>
                            My Vaults
                        </h3>
                        
                        <div className="bg-[#0c0c10] border border-white/5 rounded-xl p-1 divide-y divide-white/5">
                            {vaults.map(vault => (
                                <div key={vault.id} className="p-3 hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-white group-hover:text-cyber-purple transition-colors">{vault.name}</span>
                                            <span className={`w-1.5 h-1.5 rounded-full ${vault.risk === 'low' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-cyber-purple">{vault.apy}%</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-gray-500 font-mono">{vault.asset}</span>
                                        <span className="text-[10px] text-gray-300 font-mono">${vault.balance.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="p-2">
                                <button className="w-full text-[10px] text-gray-500 hover:text-white uppercase tracking-wider py-1 hover:bg-white/5 rounded transition-colors">
                                    + Deploy New Vault
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* B. LIVE INTEL STREAM (Reinvented Community) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Radio size={14} className="text-green-500 animate-pulse" /> Live Intel
                            </h3>
                            <span className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20 animate-pulse">LIVE</span>
                        </div>

                        <div className="bg-black border border-gray-800 rounded-lg overflow-hidden flex flex-col font-mono">
                             {/* Terminal Header */}
                            <div className="bg-gray-900 px-3 py-1.5 border-b border-gray-800 flex justify-between items-center">
                                <span className="text-[9px] text-gray-500">SIGNAL_STREAM_V4.0</span>
                                <Wifi size={10} className="text-gray-600" />
                            </div>
                            
                            {/* Feed */}
                            <div className="divide-y divide-gray-800/50">
                                {intelStream.map(item => (
                                    <div key={item.id} className="p-3 hover:bg-gray-900 transition-colors group relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-cyber-neon transition-colors"></div>
                                        
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-bold ${
                                                item.type === 'neon' ? 'text-cyber-neon' : 
                                                item.type === 'pink' ? 'text-cyber-pink' : 
                                                item.type === 'red' ? 'text-red-500' : 'text-cyber-purple'
                                            } uppercase`}>
                                                [{item.signal}]
                                            </span>
                                            <span className="text-[9px] text-gray-600">{item.time}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-300">{item.pair} on {item.dex}</span>
                                            <span className="text-xs text-green-500 font-bold">{item.gain}</span>
                                        </div>

                                        <button className="w-full flex items-center justify-center gap-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-[9px] uppercase tracking-wider rounded transition-colors opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 duration-200">
                                            <Database size={10} /> Clone Strategy
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 bg-gray-900 border-t border-gray-800 text-center">
                                <span className="text-[9px] text-gray-600 cursor-pointer hover:text-white">View Full Signal Log...</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
