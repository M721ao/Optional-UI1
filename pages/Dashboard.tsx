
import React, { useState, useEffect } from 'react';
import { Flow, Vault, VaultAsset, VaultTransaction } from '../types';
import { 
    Box, Activity, Search, MoreHorizontal, ChevronDown, ChevronUp,
    BarChart3, Radio, Database, Zap, Lock, Globe, ArrowUpRight,
    Wallet, Shield, History, Plus, Clock, Timer, AlertTriangle, Hammer, Play, Gauge,
    TrendingUp, ShieldCheck, MessageSquare, Trash2, Radar, Target, Eye, PauseCircle, PlayCircle, Settings,
    Link, RefreshCw, AlertCircle
} from 'lucide-react';
import { NeonChart } from '../components/NeonChart';
import { VaultModal } from '../components/VaultModal';
import { VaultInfoModal } from '../components/VaultInfoModal';
import { AIConnectionLoader } from '../components/AIConnectionLoader';
import { CyberButton } from '../components/CyberButton';

// --- REALISTIC CANVAS THUMBNAIL GENERATOR ---
const FlowThumbnail: React.FC<{ type: 'linear' | 'branching' | 'complex' }> = ({ type }) => {
    return (
        <div className="w-full h-36 bg-gray-100 dark:bg-[#121218] relative overflow-hidden group-hover:bg-gray-200 dark:group-hover:bg-[#15151b] transition-colors border-b border-gray-200 dark:border-white/5">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-30" 
                 style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center transform scale-[0.7] origin-center pointer-events-none text-gray-400 dark:text-gray-600">
                <svg width="400" height="200" viewBox="0 0 400 200" className="drop-shadow-2xl">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" className="fill-gray-500 dark:fill-gray-400" />
                        </marker>
                    </defs>

                    {/* EDGES (Wires) */}
                    {type === 'linear' && (
                        <>
                            <path d="M 90 100 C 140 100, 160 100, 210 100" stroke="#00f3ff" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" className="animate-pulse" />
                            <path d="M 290 100 C 310 100, 310 100, 330 100" strokeWidth="2" fill="none" className="stroke-gray-400 dark:stroke-gray-600" />
                        </>
                    )}
                    {type === 'branching' && (
                        <>
                            <path d="M 90 100 C 150 100, 150 60, 210 60" stroke="#bc13fe" strokeWidth="3" fill="none" />
                            <path d="M 90 100 C 150 100, 150 140, 210 140" stroke="#bc13fe" strokeWidth="3" fill="none" />
                            <path d="M 290 60 C 310 60, 320 60, 340 60" strokeWidth="2" fill="none" className="stroke-gray-400 dark:stroke-gray-600" />
                        </>
                    )}
                    {type === 'complex' && (
                        <>
                             <path d="M 80 50 C 120 50, 120 100, 180 100" stroke="#ff00ff" strokeWidth="3" fill="none" />
                             <path d="M 80 150 C 120 150, 120 100, 180 100" stroke="#00f3ff" strokeWidth="3" fill="none" />
                             <path d="M 260 100 C 300 100, 300 100, 340 100" strokeWidth="2" fill="none" className="stroke-gray-400 dark:stroke-gray-600" />
                        </>
                    )}

                    {/* NODES (Rectangles) */}
                    {/* Node 1 (Start) */}
                    <g transform={type === 'complex' ? "translate(10, 20)" : "translate(10, 80)"}>
                        <rect width="80" height="40" rx="4" strokeWidth="1" className="fill-white dark:fill-[#1e1e24] stroke-gray-400 dark:stroke-gray-600" />
                        <rect x="0" y="0" width="80" height="10" rx="4" className="fill-gray-200 dark:fill-[#333]" />
                        <circle cx="75" cy="20" r="3" className="fill-gray-400 dark:fill-[#666]" /> {/* Handle */}
                    </g>
                    
                    {/* Complex Node 1b */}
                    {type === 'complex' && (
                        <g transform="translate(10, 130)">
                            <rect width="80" height="40" rx="4" strokeWidth="1" className="fill-white dark:fill-[#1e1e24] stroke-gray-400 dark:stroke-gray-600" />
                            <rect x="0" y="0" width="80" height="10" rx="4" className="fill-gray-200 dark:fill-[#333]" />
                            <circle cx="75" cy="20" r="3" className="fill-gray-400 dark:fill-[#666]" />
                        </g>
                    )}

                    {/* Node 2 (Middle) */}
                    <g transform={type === 'branching' ? "translate(210, 40)" : "translate(210, 80)"}>
                        <rect width="80" height="40" rx="4" className="fill-white dark:fill-[#1e1e24]" stroke={type === 'linear' ? '#00f3ff' : type === 'branching' ? '#bc13fe' : '#ff00ff'} strokeWidth="2" filter="drop-shadow(0 0 4px rgba(0,243,255,0.3))" />
                        <rect x="0" y="0" width="80" height="10" rx="4" fill={type === 'linear' ? 'rgba(0,243,255,0.2)' : type === 'branching' ? 'rgba(188,19,254,0.2)' : 'rgba(255,0,255,0.2)'} />
                        <circle cx="5" cy="20" r="3" fill="#00f3ff" /> {/* Input Handle */}
                        <circle cx="75" cy="20" r="3" fill="#00f3ff" /> {/* Output Handle */}
                    </g>

                    {/* Node 2b (Branching Bottom) */}
                    {type === 'branching' && (
                         <g transform="translate(210, 120)">
                            <rect width="80" height="40" rx="4" className="fill-white dark:fill-[#1e1e24]" stroke="#bc13fe" strokeWidth="2" />
                            <rect x="0" y="0" width="80" height="10" rx="4" fill="rgba(188,19,254,0.2)" />
                            <circle cx="5" cy="20" r="3" fill="#bc13fe" />
                        </g>
                    )}

                    {/* Node 3 (End) */}
                    <g transform={type === 'branching' ? "translate(340, 40)" : "translate(340, 80)"}>
                        <rect width="50" height="40" rx="4" strokeWidth="1" className="fill-white dark:fill-[#1e1e24] stroke-gray-400 dark:stroke-white" />
                        <circle cx="5" cy="20" r="3" className="fill-gray-400 dark:fill-white" />
                    </g>

                </svg>
            </div>
            
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-[#121218] to-transparent opacity-30"></div>
        </div>
    );
};

// --- VISUAL RADAR COMPONENT ---
const RadarScanner: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
            <circle cx="50" cy="50" r="48" stroke="#00f3ff" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="36" stroke="#00f3ff" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="24" stroke="#00f3ff" strokeWidth="0.5" fill="none" />
            <line x1="50" y1="50" x2="50" y2="2" stroke="#00f3ff" strokeWidth="1">
                 <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 50 50" 
                    to="360 50 50" 
                    dur="4s" 
                    repeatCount="indefinite" 
                />
            </line>
        </svg>
        {/* Blips */}
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-gray-900 dark:bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        
        {/* Scanning Gradient Overlay */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,243,255,0.1)_60deg,transparent_60deg)] animate-spin-slow rounded-full"></div>
    </div>
);

// --- SIMPLE SPARKLINE COMPONENT ---
const SimpleSparkline: React.FC<{ data: number[], isPositive: boolean }> = ({ data, isPositive }) => {
    const width = 60;
    const height = 20;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Create path d
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const color = isPositive ? '#22c55e' : '#ef4444'; // Green or Red

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <polyline 
                points={points} 
                fill="none" 
                stroke={color} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    );
};

// --- MOCK WALLET TOKENS ---
const CHAIN_TOKENS: Record<string, VaultAsset[]> = {
    'Flow EVM': [
        { symbol: 'FLOW', name: 'Flow Token', balance: 1450.00, value: 0, icon: 'bg-green-500' },
        { symbol: 'USDC', name: 'USD Coin', balance: 5000.00, value: 0, icon: 'bg-blue-500' },
        { symbol: 'WETH', name: 'Wrapped ETH', balance: 1.2, value: 0, icon: 'bg-purple-500' }
    ],
    'Aptos': [
        { symbol: 'APT', name: 'Aptos', balance: 240.5, value: 0, icon: 'bg-gray-500' },
        { symbol: 'USDC', name: 'USD Coin (LayerZero)', balance: 1200, value: 0, icon: 'bg-blue-500' }
    ],
    'BSC': [
        { symbol: 'BNB', name: 'Binance Coin', balance: 12.5, value: 0, icon: 'bg-yellow-500' },
        { symbol: 'BUSD', name: 'Binance USD', balance: 1000, value: 0, icon: 'bg-yellow-300' },
        { symbol: 'CAKE', name: 'PancakeSwap', balance: 500, value: 0, icon: 'bg-orange-400' }
    ],
    'Solana': [
        { symbol: 'SOL', name: 'Solana', balance: 45.2, value: 0, icon: 'bg-purple-600' },
        { symbol: 'USDC', name: 'USD Coin', balance: 850, value: 0, icon: 'bg-blue-500' }
    ],
    'Sui': [
         { symbol: 'SUI', name: 'Sui', balance: 4500, value: 0, icon: 'bg-blue-400' }
    ]
};

export const Dashboard: React.FC = () => {
    const [isChartExpanded, setIsChartExpanded] = useState(false);
    
    // --- VAULT MANAGER STATE ---
    const [selectedChain, setSelectedChain] = useState<'Aptos' | 'Flow EVM' | 'BSC' | 'Solana' | 'Sui'>('Flow EVM');
    const [selectedVaultIndex, setSelectedVaultIndex] = useState(0);
    const [vaultTab, setVaultTab] = useState<'allocation' | 'history'>('allocation');
    const [historyLimit, setHistoryLimit] = useState(6);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    
    // Added vault loading state for chain switching
    const [isVaultLoading, setIsVaultLoading] = useState(false);
    
    // Wallet State
    const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
    const [isWalletRefreshing, setIsWalletRefreshing] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{isOpen: boolean, type: 'deposit' | 'withdraw'}>({
        isOpen: false, 
        type: 'deposit'
    });

    // Vault Info Modal State
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // --- MY FLOWS STATE ---
    const [visibleFlowsCount, setVisibleFlowsCount] = useState(4);
    const [activeMenuFlowId, setActiveMenuFlowId] = useState<string | null>(null);

    // Effect: Reset vault selection when chain changes
    useEffect(() => {
        setSelectedVaultIndex(0);
        setVaultTab('allocation');
        setHistoryLimit(6); // Reset history pagination
    }, [selectedChain]);

    // Handle Chain Switching with Loading Simulation
    const handleChainSwitch = (chain: any) => {
        if (chain === selectedChain) return;
        
        setIsVaultLoading(true);
        setSelectedChain(chain);
        
        // Simulate data fetch delay
        setTimeout(() => {
            setIsVaultLoading(false);
        }, 800);
    };

    // --- DATA ---
    const [radarItems] = useState([
        { id: '1', signal: 'ARBITRAGE', pair: 'ETH/USDC', dex: 'Uniswap', confidence: 98, gain: '+1.2%', time: '12s', type: 'neon', chartData: [10, 15, 12, 18, 24, 28, 32], isPositive: true },
        { id: '2', signal: 'WHALE BUY', pair: 'PEPE', dex: 'Binance', confidence: 85, gain: '$450k', time: '45s', type: 'pink', chartData: [5, 8, 20, 18, 25, 30, 45], isPositive: true },
        { id: '3', signal: 'YIELD SPIKE', pair: 'GMX', dex: 'Arbitrum', confidence: 92, gain: '24%', time: '2m', type: 'purple', chartData: [12, 12, 14, 15, 20, 22, 24], isPositive: true },
        { id: '4', signal: 'LIQUIDATION', pair: 'WBTC', dex: 'Aave', confidence: 74, gain: '$1.2M', time: '5m', type: 'red', chartData: [50, 40, 35, 30, 25, 20, 15], isPositive: false },
        { id: '5', signal: 'FRONTRUN', pair: 'SOL/USDC', dex: 'Raydium', confidence: 66, gain: '+0.8%', time: '7m', type: 'yellow', chartData: [10, 12, 11, 14, 13, 15, 16], isPositive: true },
    ]);

    const allFlows: Flow[] = [
        { id: 'f1', name: 'Auto-Compound Yield', status: 'active', triggers: 142, lastRun: '2m ago', tvl: 45000, thumbnailType: 'linear' },
        { id: 'f2', name: 'ETH Stop-Loss Protect', status: 'paused', triggers: 0, lastRun: '5d ago', tvl: 12000, thumbnailType: 'branching' },
        { id: 'f3', name: 'Arbitrage Scanner V2', status: 'error', triggers: 89, lastRun: '1h ago', tvl: 0, thumbnailType: 'complex' },
        { id: 'f4', name: 'Stablecoin Peg Watch', status: 'active', triggers: 1240, lastRun: '30s ago', tvl: 8500, thumbnailType: 'linear' },
        { id: 'f5', name: 'Mempool Sniper', status: 'active', triggers: 2305, lastRun: '1s ago', tvl: 120000, thumbnailType: 'complex' },
        { id: 'f6', name: 'DCA Accumulator', status: 'active', triggers: 45, lastRun: '4h ago', tvl: 5000, thumbnailType: 'linear' },
        { id: 'f7', name: 'NFT Floor Sweeper', status: 'paused', triggers: 12, lastRun: '2d ago', tvl: 2500, thumbnailType: 'branching' },
        { id: 'f8', name: 'Gas Fee Hedge', status: 'active', triggers: 332, lastRun: '15m ago', tvl: 1500, thumbnailType: 'complex' },
    ];

    const flows = allFlows.slice(0, visibleFlowsCount);

    const vaultData: Record<string, Vault[]> = {
        'Aptos': [],
        'Flow EVM': [
            { 
                id: 'v-flow-1', name: 'Flow Yield Master', chain: 'Flow EVM', address: '0x71c...38a', 
                isDeployed: true, 
                asset: 'FLOW', apy: 12.4, balance: 24500.50, risk: 'medium',
                assets: [
                    { symbol: 'FLOW', name: 'Flow Token', balance: 14500, value: 14500, icon: 'bg-green-500' },
                    { symbol: 'USDC', name: 'USD Coin', balance: 10000, value: 10000.50, icon: 'bg-blue-500' },
                    { symbol: 'WETH', name: 'Wrapped ETH', balance: 0.5, value: 1200, icon: 'bg-purple-500' }
                ],
                history: [
                    { id: 't1', type: 'harvest', hash: '0xabc...123', time: '2h ago', amount: '+45.2 FLOW', status: 'success' },
                    { id: 't2', type: 'deposit', hash: '0xdef...456', time: '1d ago', amount: '10,000 USDC', status: 'success' },
                    { id: 't3', type: 'swap', hash: '0x789...012', time: '3d ago', amount: 'FLOW -> USDC', status: 'success' },
                    { id: 't4', type: 'harvest', hash: '0xabc...124', time: '1d ago', amount: '+42.1 FLOW', status: 'success' },
                    { id: 't5', type: 'harvest', hash: '0xabc...125', time: '2d ago', amount: '+40.8 FLOW', status: 'success' },
                    { id: 't6', type: 'deposit', hash: '0xdef...457', time: '4d ago', amount: '5,000 USDC', status: 'success' },
                    // Mocks for pagination
                    { id: 't7', type: 'swap', hash: '0x789...013', time: '5d ago', amount: 'USDC -> FLOW', status: 'success' },
                    { id: 't8', type: 'harvest', hash: '0xabc...126', time: '6d ago', amount: '+38.5 FLOW', status: 'success' },
                    { id: 't9', type: 'withdraw', hash: '0xdef...458', time: '1w ago', amount: '1,000 USDC', status: 'success' },
                    { id: 't10', type: 'harvest', hash: '0xabc...127', time: '1w ago', amount: '+35.2 FLOW', status: 'success' },
                    { id: 't11', type: 'deposit', hash: '0xdef...459', time: '2w ago', amount: '20,000 USDC', status: 'success' },
                ]
            },
            { 
                id: 'v-flow-2', name: 'Stablecoin LP', chain: 'Flow EVM', address: '0x88d...11b', 
                isDeployed: true, 
                asset: 'USDC', apy: 8.2, balance: 5400.00, risk: 'low',
                assets: [
                    { symbol: 'USDC', name: 'USD Coin', balance: 5400, value: 5400, icon: 'bg-blue-500' }
                ],
                history: [
                    { id: 't9', type: 'deposit', hash: '0x999...111', time: '5d ago', amount: '+5400 USDC', status: 'success' },
                ]
            }
        ],
        'BSC': [
            {
                id: 'v-bsc-1', name: 'BSC Degen', chain: 'BSC', address: '0x99a...22c', 
                isDeployed: true,
                asset: 'BNB', apy: 5.2, balance: 1200, risk: 'high',
                assets: [{ symbol: 'BNB', name: 'Binance Coin', balance: 2.5, value: 1200, icon: 'bg-yellow-500' }],
                history: []
            }
        ],
        'Solana': [],
        'Sui': [],
    };

    const currentChainVaults = vaultData[selectedChain] || [];
    const activeVault = currentChainVaults[selectedVaultIndex];
    const visibleHistory = activeVault?.history?.slice(0, historyLimit) || [];
    const hasMoreHistory = activeVault?.history ? activeVault.history.length > historyLimit : false;
    
    // Check if connected wallet matches vault owner (Simulated)
    const isOwnerMatch = connectedWallet === activeVault?.address;

    // --- HANDLERS ---
    
    const handleConnectWallet = () => {
        // Simulate a connect delay
        setTimeout(() => {
            setConnectedWallet('0x71c...38a'); // Matches one of the demo vaults
        }, 500);
    };

    const handleRefreshWallet = () => {
        setIsWalletRefreshing(true);
        setTimeout(() => {
            setIsWalletRefreshing(false);
        }, 1200);
    };

    const handleLoadMoreHistory = () => {
        setIsHistoryLoading(true);
        setTimeout(() => {
            setHistoryLimit(prev => prev + 5);
            setIsHistoryLoading(false);
        }, 800);
    };

    const handleLoadMoreFlows = () => {
        setVisibleFlowsCount(prev => prev + 4);
    };

    const toggleFlowMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (activeMenuFlowId === id) {
            setActiveMenuFlowId(null);
        } else {
            setActiveMenuFlowId(id);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuFlowId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#050505] pb-20 scrollbar-hide">
            
            <VaultModal 
                isOpen={modalConfig.isOpen} 
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
                type={modalConfig.type} 
                tokens={CHAIN_TOKENS[selectedChain] || []}
            />

            {/* Info Modal */}
            <VaultInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />

            {/* 1. SLIM GLOBAL TICKER */}
            <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between px-6 py-2">
                    <div className="flex items-center gap-6 overflow-hidden">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400" title="Total ecosystem liquidity">
                            <Globe size={12} className="text-cyber-neon" />
                            <span>GLOBAL: <b className="text-gray-900 dark:text-white">$42.5B</b></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400" title="Current network gas price">
                            <Zap size={12} className="text-yellow-500" />
                            <span>GAS: <b className="text-yellow-600 dark:text-yellow-500">14</b></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hidden sm:flex" title="Bitcoin Price">
                            <TrendingUp size={12} className="text-green-500" />
                            <span>BTC: <b className="text-gray-900 dark:text-white">$64,230</b></span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsChartExpanded(!isChartExpanded)}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-all ${isChartExpanded ? 'bg-cyber-purple text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                        title="Toggle Analytics View"
                    >
                        <BarChart3 size={12} /> Analytics
                        {isChartExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                </div>

                {isChartExpanded && (
                    <div className="h-64 border-b border-gray-200 dark:border-white/10 animate-in slide-in-from-top-2">
                        <NeonChart />
                    </div>
                )}
            </div>

            {/* MAIN CONTENT GRID - 50/50 SPLIT */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1600px] mx-auto items-start">
                
                {/* 2. LEFT COLUMN: RADAR + FLOWS (50%) */}
                <div className="space-y-8">
                    
                    {/* A. MARKET RADAR (Top of Left Column) */}
                    <div className="bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col relative group">
                        
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
                             {/* Radar Grid Background */}
                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#9ca3af_1px,_transparent_1px)] dark:bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:10px_10px]"></div>

                            <div className="flex items-center gap-4 z-10">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-black border border-green-500/30 relative overflow-hidden">
                                     <RadarScanner />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2" title="Live market opportunities scanner">
                                    Market Radar
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 z-10">
                                <span className="text-[9px] font-bold text-green-600 dark:text-green-500 animate-pulse">LIVE FEED</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                            </div>
                        </div>
                        
                        {/* Radar Content */}
                        <div className="max-h-[220px] overflow-y-auto scrollbar-hide relative bg-gray-50 dark:bg-black/20">
                             <div className="divide-y divide-gray-200 dark:divide-gray-800/30">
                                {radarItems.map((item) => (
                                    <div key={item.id} className="p-3 hover:bg-white dark:hover:bg-white/5 transition-all cursor-pointer border-l-2 border-transparent hover:border-green-500 flex items-center justify-between group/item" title="Click to analyze signal">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 group-hover/item:bg-green-100 dark:group-hover/item:bg-green-400/10 transition-colors">
                                                <Target size={14} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                     <span className="text-[10px] font-bold text-gray-800 dark:text-white bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded">{item.signal}</span>
                                                     <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300 font-mono tracking-tight">{item.pair}</span>
                                                </div>
                                                <div className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                                                    {item.dex} <span className="text-gray-400 dark:text-gray-700">|</span> {item.time} ago
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Chart & Stats */}
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:block opacity-60">
                                                <SimpleSparkline data={item.chartData} isPositive={item.isPositive} />
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xs font-bold font-mono tracking-tight ${item.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{item.gain}</div>
                                                <div className="text-[9px] text-gray-500 dark:text-gray-600">{item.confidence}% Conf</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             {/* Faded bottom for visual continuity if scrolling */}
                             <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-50 dark:from-[#0c0c10] to-transparent pointer-events-none"></div>
                        </div>
                    </div>


                    {/* B. MY FLOWS */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                             <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-cyber-neon/10 rounded border border-purple-200 dark:border-cyber-neon/30 shadow-none dark:shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                                    <Box size={18} className="text-purple-600 dark:text-cyber-neon" /> 
                                </div>
                                My Flows
                            </h3>
                            <div className="flex gap-2">
                                 <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors" title="Search Flows"><Search size={16} /></button>
                                 <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors" title="Sort Options"><MoreHorizontal size={16} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Create New Flow Card */}
                            <div className="border border-dashed border-gray-300 dark:border-white/20 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-gray-100 dark:hover:bg-white/5 hover:border-purple-400 dark:hover:border-cyber-neon/50 transition-all cursor-pointer group gap-3 min-h-[220px]" title="Create a new automated workflow">
                                <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-cyber-neon/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-cyber-neon/20 transition-all duration-300">
                                    <Plus size={28} className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-cyber-neon" />
                                </div>
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white uppercase tracking-wider">Create New Flow</span>
                            </div>

                            {/* Flow Cards */}
                            {flows.map(flow => (
                                <div key={flow.id} className="bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-cyber-neon/50 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(0,0,0,0.7)] transition-all duration-300 group cursor-pointer relative flex flex-col h-[280px]" title={`Manage Flow: ${flow.name}`}>
                                    <FlowThumbnail type={flow.thumbnailType} />
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200 dark:border-white/10 shadow-lg">
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            flow.status === 'active' ? 'bg-green-500 dark:bg-cyber-neon shadow-[0_0_5px_rgba(34,197,94,1)] dark:shadow-[0_0_5px_rgba(0,243,255,1)] animate-pulse' : 
                                            flow.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                        <span className="text-[9px] font-bold uppercase text-gray-800 dark:text-white">{flow.status}</span>
                                    </div>

                                    {/* Menu Button */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <button 
                                            onClick={(e) => toggleFlowMenu(e, flow.id)}
                                            className="p-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                            title="Options"
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {activeMenuFlowId === flow.id && (
                                            <div className="absolute top-8 left-0 w-32 bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 rounded shadow-xl py-1 z-20 animate-in fade-in zoom-in duration-200">
                                                <button className="w-full text-left px-3 py-2 text-[10px] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white flex items-center gap-2">
                                                    <Settings size={12} /> Edit
                                                </button>
                                                <button className="w-full text-left px-3 py-2 text-[10px] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white flex items-center gap-2">
                                                    {flow.status === 'active' ? <PauseCircle size={12} /> : <PlayCircle size={12} />} 
                                                    {flow.status === 'active' ? 'Pause' : 'Resume'}
                                                </button>
                                                <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-1"></div>
                                                <button className="w-full text-left px-3 py-2 text-[10px] text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-cyber-neon transition-colors truncate mb-1">{flow.name}</h4>
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                                                <Clock size={10} /> Last run: {flow.lastRun}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4 mt-auto">
                                             <div className="flex flex-col">
                                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Executions</span>
                                                <span className="text-sm font-mono text-gray-900 dark:text-white font-bold">{flow.triggers.toLocaleString()}</span>
                                             </div>
                                             <div className="flex flex-col text-right">
                                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">TVL</span>
                                                <span className="text-sm font-mono text-purple-600 dark:text-cyber-purple font-bold">${(flow.tvl).toLocaleString()}</span>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Flows */}
                        {visibleFlowsCount < allFlows.length && (
                             <CyberButton 
                                variant="secondary" 
                                size="sm" 
                                onClick={handleLoadMoreFlows}
                                className="w-full"
                            >
                                Load More Flows
                            </CyberButton>
                        )}
                    </div>
                </div>

                {/* 3. RIGHT COLUMN: VAULT MANAGER (50%) */}
                <div className="space-y-4 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Lock size={16} className="text-purple-600 dark:text-cyber-purple" /> Vault Manager
                        </h3>
                        <button 
                            onClick={() => setIsInfoModalOpen(true)}
                            className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white underline" 
                            title="Learn more about TradingFlow Vaults"
                        >
                            What is this?
                        </button>
                    </div>

                    {/* Merged Header: Chain Tabs & Vault Switcher */}
                    <div className="bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-lg p-3 flex flex-col gap-3">
                         {/* 1. Chain Selector */}
                         <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide border-b border-gray-100 dark:border-white/5 pb-2">
                            {['Aptos', 'Flow EVM', 'BSC', 'Solana', 'Sui'].map((chain) => (
                                <CyberButton
                                    key={chain}
                                    variant={selectedChain === chain ? "ghost" : "ghost"}
                                    size="xs"
                                    onClick={() => handleChainSwitch(chain)}
                                    active={selectedChain === chain}
                                    className="whitespace-nowrap rounded-md"
                                >
                                    {chain}
                                </CyberButton>
                            ))}
                        </div>

                        {/* 2. Vault Selector (Multi-Vault Support) */}
                        {currentChainVaults.length > 0 && !isVaultLoading && (
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                                {currentChainVaults.map((vault, index) => (
                                    <button
                                        key={vault.id}
                                        onClick={() => setSelectedVaultIndex(index)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${
                                            selectedVaultIndex === index
                                            ? 'bg-purple-50 dark:bg-cyber-purple/20 border-purple-200 dark:border-cyber-purple text-purple-600 dark:text-cyber-purple shadow-sm dark:shadow-[0_0_10px_rgba(188,19,254,0.3)]'
                                            : 'bg-gray-100 dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30'
                                        }`}
                                        title={`Manage ${vault.name}`}
                                    >
                                        <Shield size={10} />
                                        {vault.name}
                                    </button>
                                ))}
                                <button className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 transition-all" title="Create new vault on this chain">
                                    <Plus size={10} /> New
                                </button>
                            </div>
                        )}

                        {/* 3. Wallet Context - UPDATED LOGIC */}
                        <div className="flex items-center justify-between px-1 mt-1">
                            {connectedWallet ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1" title="Connected Wallet Address">
                                        <Wallet size={10} /> {connectedWallet}
                                    </span>
                                    <button 
                                        onClick={handleRefreshWallet} 
                                        disabled={isWalletRefreshing}
                                        className={`text-[10px] text-gray-400 hover:text-purple-600 dark:hover:text-cyber-neon transition-colors ${isWalletRefreshing ? 'animate-spin' : ''}`}
                                        title="Refresh Wallet Connection"
                                    >
                                        <RefreshCw size={10} />
                                    </button>
                                    {!isOwnerMatch && activeVault && (
                                        <div className="flex items-center gap-1 text-[9px] text-orange-500 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20" title="Connected wallet does not match vault owner">
                                            <AlertCircle size={8} /> OWNER MISMATCH
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <CyberButton 
                                    variant="neon"
                                    size="xs"
                                    icon={<Wallet size={10} />}
                                    onClick={handleConnectWallet}
                                >
                                    Connect Wallet
                                </CyberButton>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Status</span>
                                <div className={`w-2 h-2 rounded-full ${activeVault?.isDeployed && !isVaultLoading ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,1)]' : 'bg-gray-400 dark:bg-gray-600'}`} title={activeVault?.isDeployed ? 'Vault Active' : 'Vault Inactive'}></div>
                            </div>
                        </div>
                    </div>

                    {/* Vault Content Card */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative" key={`${selectedChain}-${selectedVaultIndex}`}>
                        
                        {/* Loading Overlay for Vault Switching */}
                        {isVaultLoading && (
                             <AIConnectionLoader overlay message={`Connecting to ${selectedChain}...`} size="md" />
                        )}

                        {!activeVault || !activeVault.isDeployed ? (
                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#151520] dark:to-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center text-center h-[300px] justify-center">
                                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800/50 flex items-center justify-center mb-4">
                                    <Shield size={32} className="text-gray-500 dark:text-gray-600" />
                                </div>
                                <div className="text-base font-bold text-gray-900 dark:text-white mb-2">No Vault Deployed</div>
                                <div className="text-xs text-gray-500 mb-6 max-w-xs leading-relaxed">
                                    Deploy a non-custodial Smart Vault on <span className="text-purple-600 dark:text-cyber-purple">{selectedChain}</span> to manage assets and run automated flows.
                                </div>
                                <CyberButton 
                                    variant="neon" 
                                    size="sm"
                                    icon={<Shield size={14} />}
                                >
                                    Deploy New Vault
                                </CyberButton>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col">
                                {/* 1. Net Worth Header */}
                                <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black p-5 border-b border-gray-200 dark:border-white/5 relative group">
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Removed settings for now or keep hidden */}
                                    </div>
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase mb-1">Total Vault Value</div>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">${activeVault.balance.toLocaleString()}</span>
                                        <div className="flex items-center gap-1 mb-2 px-2 py-0.5 bg-green-500/10 dark:bg-green-900/20 rounded border border-green-500/20">
                                            <TrendingUp size={12} className="text-green-600 dark:text-green-500" />
                                            <span className="text-xs text-green-600 dark:text-green-500 font-bold">+{activeVault.apy}% APY</span>
                                        </div>
                                    </div>
                                    
                                    {/* Actions Bar */}
                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                        <CyberButton 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => setModalConfig({isOpen: true, type: 'deposit'})}
                                            disabled={!connectedWallet}
                                            icon={<ArrowUpRight size={14} className="rotate-180" />}
                                        >
                                            Deposit
                                        </CyberButton>
                                        <CyberButton 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => setModalConfig({isOpen: true, type: 'withdraw'})}
                                            disabled={!connectedWallet}
                                            icon={<ArrowUpRight size={14} />}
                                        >
                                            Withdraw
                                        </CyberButton>
                                    </div>
                                </div>

                                {/* 2. Tabbed View: Assets vs History */}
                                <div className="flex flex-col">
                                    {/* Tabs */}
                                    <div className="flex border-b border-gray-200 dark:border-white/5">
                                        <button 
                                            onClick={() => setVaultTab('allocation')}
                                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${vaultTab === 'allocation' ? 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-b-2 border-purple-500 dark:border-cyber-purple' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                                            title="View asset breakdown"
                                        >
                                            <Database size={12} /> Allocation
                                        </button>
                                        <button 
                                            onClick={() => setVaultTab('history')}
                                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${vaultTab === 'history' ? 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-b-2 border-purple-500 dark:border-cyber-purple' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                                            title="View transaction log"
                                        >
                                            <History size={12} /> History
                                        </button>
                                    </div>

                                    {/* Content Panel - Flexible Height to fix empty space issues */}
                                    <div className="bg-white dark:bg-[#0c0c10] p-0 overflow-hidden min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-hide">
                                        
                                        {/* TAB: ALLOCATION */}
                                        {vaultTab === 'allocation' && (
                                            <div className="p-4 space-y-2">
                                                 <div className="flex justify-between text-[9px] text-gray-500 font-mono uppercase px-2 mb-2">
                                                    <span>Asset</span>
                                                    <span>Value / %</span>
                                                 </div>
                                                 {activeVault.assets?.map((asset, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-white/5 cursor-default">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg ${asset.icon}`}>
                                                                {asset.symbol[0]}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-900 dark:text-white">{asset.symbol}</div>
                                                                <div className="text-[10px] text-gray-500">{asset.balance.toLocaleString()}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-mono text-gray-900 dark:text-white">${asset.value.toLocaleString()}</div>
                                                            <div className="text-[10px] text-gray-500 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-cyber-neon transition-colors">
                                                                {((asset.value / activeVault.balance) * 100).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* TAB: HISTORY */}
                                        {vaultTab === 'history' && (
                                             <div className="p-4 space-y-2">
                                                {visibleHistory.length === 0 ? (
                                                     <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 opacity-50">
                                                         <Activity size={32} className="mb-2" />
                                                         <span className="text-xs">No activity recorded</span>
                                                     </div>
                                                ) : (
                                                    <>
                                                        {visibleHistory.map((tx) => (
                                                            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-white/5 cursor-default">
                                                                <div className="flex items-center gap-3">
                                                                     <div className={`p-2 rounded-md ${
                                                                        tx.type === 'deposit' ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 
                                                                        tx.type === 'withdraw' ? 'bg-red-500/10 text-red-600 dark:text-red-500' : 'bg-blue-500/10 text-blue-600 dark:text-blue-500'
                                                                    }`}>
                                                                        {tx.type === 'deposit' ? <ArrowUpRight size={14} className="rotate-180" /> : <ArrowUpRight size={14} />}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase group-hover:text-black dark:group-hover:text-white">{tx.type}</span>
                                                                        <span className="text-[10px] text-gray-500 dark:text-gray-600 font-mono flex items-center gap-1">
                                                                            {tx.time} <span className="text-gray-400 dark:text-gray-700">•</span> {tx.hash}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-xs font-mono text-gray-900 dark:text-white font-bold">{tx.amount}</span>
                                                                    <span className={`text-[9px] uppercase font-bold ${tx.status === 'success' ? 'text-green-600 dark:text-green-500' : 'text-gray-500'}`}>{tx.status}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        
                                                        {/* Pagination Load More */}
                                                        {hasMoreHistory && (
                                                            <CyberButton 
                                                                variant="secondary" 
                                                                size="sm" 
                                                                onClick={handleLoadMoreHistory}
                                                                isLoading={isHistoryLoading}
                                                                className="w-full mt-2"
                                                            >
                                                                Load Previous Activity
                                                            </CyberButton>
                                                        )}
                                                    </>
                                                )}
                                             </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
