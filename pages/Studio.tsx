
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  MarkerType,
  Handle, 
  Position,
  ReactFlowProvider,
  useReactFlow,
  NodeToolbar
} from 'reactflow';
import Editor from '@monaco-editor/react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { 
    Sparkles, Send, Cpu, TerminalSquare, Edit2, Zap, BrainCircuit, 
    ChevronDown, ChevronRight, Settings, Grid, PlayCircle, RotateCw, 
    CheckCircle2, BoxSelect, Server, ArrowRight, Activity, MousePointer2,
    Layers, Command, AlertCircle, ChevronUp, StopCircle, RefreshCw, BarChart3,
    Shield, Clock, Timer, AlertTriangle, Hammer, History, Play, Gauge,
    TrendingUp, ShieldCheck, Search, MessageSquare, Plus, Trash2, X, AlertOctagon, Loader2,
    Database, Network, Workflow, Lock, Cloud, Save, Code, Coins, MessageCircle, Globe, MoreHorizontal,
    PanelRightClose, Power, Minimize2, Maximize2
} from 'lucide-react';
import { VaultWidget } from '../components/VaultWidget';
import { NodeLogsModal, LogEntry } from '../components/NodeLogsModal';
import { NotificationType } from '../components/Notifications';
import { NodeField, NodeInput, NodeNumberInput, NodeSelect, NodeTextarea, NodeRadioGroup, NodeTokenSelect, NodeSlider } from '../components/NodeComponents';
import { AIConnectionLoader } from '../components/AIConnectionLoader';

// --- MOCK TOKEN DATA FOR SELECTORS ---
const TOKENS = [
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: 'bg-purple-500' },
    { id: 'usdc', symbol: 'USDC', name: 'USD Coin', icon: 'bg-blue-500' },
    { id: 'wbtc', symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: 'bg-orange-500' },
    { id: 'dai', symbol: 'DAI', name: 'Dai Stablecoin', icon: 'bg-yellow-500' },
    { id: 'usdt', symbol: 'USDT', name: 'Tether', icon: 'bg-green-500' },
];

// --- MOCK VAULT DATA ---
const VAULT_NETWORKS = [
    { value: 'ethereum', label: 'Ethereum Mainnet' },
    { value: 'arbitrum', label: 'Arbitrum One' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'polygon', label: 'Polygon' }
];

const VAULT_STRATEGIES: Record<string, {value: string, label: string, apy: string}[]> = {
    'ethereum': [
        { value: 'yearn_eth', label: 'Yearn ETH Vault (v2)', apy: '4.5%' },
        { value: 'lido_steth', label: 'Lido stETH Strategy', apy: '3.8%' },
        { value: 'morpho_usdc', label: 'Morpho Blue USDC', apy: '8.5%' }
    ],
    'arbitrum': [
        { value: 'gmx_glp', label: 'GMX GLP Auto-Compound', apy: '14.2%' },
        { value: 'radiant', label: 'Radiant Capital USDC', apy: '8.1%' },
        { value: 'pendle_arb', label: 'Pendle ARB Pool', apy: '22.1%' }
    ],
    'optimism': [
        { value: 'velodrome_stable', label: 'Velodrome Stable LP', apy: '6.2%' }
    ],
    'polygon': [
        { value: 'quickswap', label: 'Quickswap Dual Reward', apy: '9.2%' },
        { value: 'aave_matic', label: 'Aave V3 MATIC', apy: '5.1%' }
    ]
};

// --- CODE EDITOR MODAL ---
interface CodeEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    onSave: (code: string) => void;
}

const CodeEditorModal: React.FC<CodeEditorModalProps> = ({ isOpen, onClose, code, onSave }) => {
    const [currentCode, setCurrentCode] = useState(code);

    useEffect(() => {
        setCurrentCode(code);
    }, [code]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-2xl flex flex-col h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Code size={16} className="text-blue-400" />
                        <span className="text-sm font-bold text-gray-200 uppercase tracking-wider">Python Script Editor</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={onClose}
                            className="px-4 py-1.5 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => onSave(currentCode)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded flex items-center gap-2 transition-colors"
                        >
                            <Save size={14} /> Save & Close
                        </button>
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={currentCode}
                        onChange={(value) => setCurrentCode(value || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>
                
                {/* Footer */}
                <div className="px-4 py-2 bg-[#007acc] text-white text-[10px] font-mono flex justify-between items-center">
                    <span>Python 3.10 Runtime Environment</span>
                    <span>Ready</span>
                </div>
            </div>
        </div>
    );
};

// --- TELEGRAM NODE FORM ---
const TelegramNodeForm = ({ isConnectable, initialParams = {} }: { isConnectable: boolean, initialParams: any }) => {
    const [status, setStatus] = useState<'idle' | 'waiting' | 'authorized' | 'failed'>(initialParams.username ? 'authorized' : 'idle');
    const [username, setUsername] = useState(initialParams.username || '');
    const [message, setMessage] = useState(initialParams.message || '');
    const [errorMsg, setErrorMsg] = useState('');

    const handleConnect = () => {
        setStatus('waiting');
        setErrorMsg('');
        // Simulate checking external auth or waiting for user to click link
        const authWindow = window.open('https://t.me/NeonFlowBot?start=auth_simulation', '_blank');
        
        // Simulate polling for auth success
        setTimeout(() => {
            // For demo purposes: 50% chance of failure to allow testing retry logic
            const isSuccess = Math.random() > 0.5;
            
            if (isSuccess) {
                setStatus('authorized');
                setUsername('@NeonUser_Alpha');
            } else {
                setStatus('failed');
                setErrorMsg('Validation timed out. Please try again.');
            }
            // authWindow?.close(); 
        }, 3000);
    };

    return (
        <div className="flex flex-col gap-3 p-1 animate-in fade-in slide-in-from-top-1 min-w-[260px]">
            {status === 'idle' || status === 'waiting' || status === 'failed' ? (
                <div className={`flex flex-col gap-3 p-2 rounded border ${status === 'failed' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-500/20' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20'}`}>
                    
                    {status === 'failed' ? (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                             <AlertCircle size={16} />
                             <span className="text-xs font-bold uppercase">Verification Failed</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                             <MessageCircle size={16} />
                             <span className="text-xs font-bold uppercase">Bot Authorization</span>
                        </div>
                    )}
                    
                    <p className={`text-[10px] leading-relaxed ${status === 'failed' ? 'text-red-500/80 font-mono' : 'text-gray-500 dark:text-gray-400'}`}>
                        {status === 'failed' ? errorMsg : "Link your Telegram account to receive automated alerts and reports."}
                    </p>
                    
                    {status === 'waiting' ? (
                        <div className="flex items-center justify-center gap-2 py-2 bg-white dark:bg-black/20 rounded border border-gray-200 dark:border-white/10">
                            <Loader2 size={12} className="animate-spin text-blue-500" />
                            <span className="text-[10px] font-bold text-gray-500">Waiting for verify...</span>
                        </div>
                    ) : (
                        <button 
                            onClick={handleConnect}
                            className={`flex items-center justify-center gap-2 py-2 text-white rounded text-[10px] font-bold uppercase transition-colors shadow-lg ${status === 'failed' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'}`}
                        >
                            {status === 'failed' ? <RefreshCw size={12} /> : <Send size={12} />} 
                            {status === 'failed' ? 'Retry Connection' : 'Connect Telegram'}
                        </button>
                    )}
                    
                    {status !== 'failed' && (
                        <div className="text-[9px] text-center text-gray-400">
                            Opens tg://resolve?domain=NeonFlowBot
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in">
                    {/* Auth Banner */}
                     <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-500">
                                <CheckCircle2 size={12} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-500 uppercase">Connected</span>
                                <span className="text-xs font-bold text-green-700 dark:text-green-400">{username}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setStatus('idle'); setUsername(''); }}
                            className="text-[9px] text-gray-400 underline hover:text-red-500"
                        >
                            Unlink
                        </button>
                    </div>

                    {/* Message Input */}
                    <NodeField label="Message Template" required handleId="in-msg" isConnectable={isConnectable} handlePosition={Position.Left}>
                        <NodeTextarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter alert message... (Supports variables like {{price}})"
                            rows={3}
                        />
                    </NodeField>
                </div>
            )}
        </div>
    );
};

// --- VAULT NODE FORM ---
const VaultNodeForm = ({ isConnectable, initialParams = {} }: { isConnectable: boolean, initialParams: any }) => {
    const [chain, setChain] = useState(initialParams.chain || '');
    const [vault, setVault] = useState(initialParams.vault || '');
    const [isLoading, setIsLoading] = useState(false);
    const [availableVaults, setAvailableVaults] = useState<any[]>(
        initialParams.chain && VAULT_STRATEGIES[initialParams.chain] 
            ? VAULT_STRATEGIES[initialParams.chain] 
            : []
    );

    const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newChain = e.target.value;
        setChain(newChain);
        setVault(''); // Reset vault
        
        if (newChain) {
            setIsLoading(true);
            // Simulate dynamic loading from chain
            setTimeout(() => {
                setAvailableVaults(VAULT_STRATEGIES[newChain] || []);
                setIsLoading(false);
            }, 800);
        } else {
            setAvailableVaults([]);
        }
    };

    return (
        <div className="flex flex-col gap-3 p-1 animate-in fade-in slide-in-from-top-1 min-w-[260px]">
            <NodeField label="Network" required handleId="in-chain" isConnectable={isConnectable} handlePosition={Position.Left}>
                 <NodeSelect 
                    value={chain}
                    onChange={handleChainChange}
                    options={[{value: '', label: 'Select Chain...'}, ...VAULT_NETWORKS]}
                />
            </NodeField>

            <NodeField label="Select Vault" required handleId="in-vault-select" isConnectable={isConnectable}>
                 <div className="relative">
                    {isLoading ? (
                        <div className="w-full py-2 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded flex items-center gap-2 text-xs text-gray-500">
                             <Loader2 size={12} className="animate-spin" /> Fetching Vaults...
                        </div>
                    ) : (
                         <NodeSelect 
                            value={vault}
                            onChange={(e) => setVault(e.target.value)}
                            options={[{value: '', label: 'Select Strategy...'}, ...availableVaults]}
                            disabled={!chain}
                            className={!chain ? 'opacity-50 cursor-not-allowed' : ''}
                        />
                    )}
                 </div>
            </NodeField>
            
            {/* Info Box if Vault Selected */}
            {vault && !isLoading && (
                 <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 p-2 rounded flex justify-between items-center animate-in fade-in">
                      <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">PROJECTED APY</span>
                      <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                          {availableVaults.find(v => v.value === vault)?.apy || '0%'}
                      </span>
                 </div>
            )}

             {/* Output Handle */}
             <div className="mt-1 bg-gray-50 dark:bg-white/5 rounded px-2 py-2 flex items-center justify-between relative border border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                     <Shield size={12} className="text-gray-400" />
                     <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Vault Entity</span>
                </div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                    <Handle 
                        type="source" 
                        position={Position.Right} 
                        id="out-vault"
                        style={{ width: '8px', height: '8px', background: '#3b82f6', border: '1px solid #121218' }} 
                        isConnectable={isConnectable} 
                    />
                </div>
                 <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
            </div>
        </div>
    );
};

// --- CODE NODE FORM ---
const CodeNodeForm = ({ isConnectable, initialParams = {}, onEdit }: { isConnectable: boolean, initialParams: any, onEdit: () => void }) => {
    const previewCode = initialParams.code ? initialParams.code.split('\n').slice(0, 3).join('\n') + '...' : '# No code';

    return (
        <div className="flex flex-col gap-3 p-1 animate-in fade-in slide-in-from-top-1 min-w-[260px]">
            <NodeField 
                label="Input Data" 
                handleId="in-data" 
                handlePosition={Position.Left} 
                isConnectable={isConnectable}
                handleColor="#94a3b8"
            >
                {/* Visual placeholder for input data connection */}
                <div className="text-[10px] text-gray-400 italic bg-gray-100 dark:bg-white/5 p-2 rounded border border-dashed border-gray-300 dark:border-white/10">
                    Connect data stream...
                </div>
            </NodeField>

            <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Script Logic</label>
                <div className="relative group">
                    <div className="w-full bg-[#1e1e1e] text-gray-300 font-mono text-[10px] p-2 rounded border border-gray-700 h-16 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                        <pre>{previewCode}</pre>
                    </div>
                    <button 
                        onClick={onEdit}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded backdrop-blur-[1px]"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase rounded shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Edit2 size={12} /> Edit Code
                        </div>
                    </button>
                </div>
            </div>

             {/* Custom Output Handle */}
             <div className="mt-2 bg-slate-100 dark:bg-slate-900 rounded px-2 py-2 flex items-center justify-between relative border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Output Data</span>
                </div>
                {/* Output Handle */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                    <Handle 
                        type="source" 
                        position={Position.Right} 
                        id="out-data"
                        style={{ width: '8px', height: '8px', background: '#94a3b8', border: '1px solid #121218' }} 
                        isConnectable={isConnectable} 
                    />
                </div>
                 <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            </div>
        </div>
    );
};

// --- AI PREDICTION FORM COMPONENT ---
const AIPredictionForm = ({ isConnectable, initialParams = {} }: { isConnectable: boolean, initialParams: any }) => {
    const [model, setModel] = useState(initialParams.model || 'GPT-4');
    const [prompt, setPrompt] = useState(initialParams.prompt || '');
    const [parameters, setParameters] = useState<{id: string, name: string, value: string}[]>(
        initialParams.parameters || [
            { id: '1', name: '', value: '' },
            { id: '2', name: '', value: '' }
        ]
    );

    const addParameter = () => {
        setParameters([...parameters, { id: Date.now().toString(), name: '', value: '' }]);
    };

    const updateParameter = (id: string, field: 'name' | 'value', val: string) => {
        setParameters(parameters.map(p => p.id === id ? { ...p, [field]: val } : p));
    };

    const removeParameter = (id: string) => {
        setParameters(parameters.filter(p => p.id !== id));
    };

    return (
        <div className="flex flex-col gap-3 p-1 animate-in fade-in slide-in-from-top-1 min-w-[260px]">
             {/* Header Description */}
             <div className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight px-0.5">
                Leverage GPT-4 to analyze market data and generate trading insights automatically.
             </div>

            {/* MODEL SELECTOR */}
            <NodeField 
                label="Model" 
                required 
                handleId="in-model" 
                handlePosition={Position.Left} 
                isConnectable={isConnectable}
                className="mt-1"
            >
                <NodeSelect 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    options={[
                        { value: "GPT-4", label: "GPT-4" },
                        { value: "Gemini-2.5-Flash", label: "Gemini 2.5 Flash" },
                        { value: "Claude-3-Opus", label: "Claude 3 Opus" }
                    ]}
                />
            </NodeField>

            {/* PROMPT */}
            <NodeField 
                label="Prompt" 
                required 
                handleId="in-prompt" 
                handlePosition={Position.Left} 
                isConnectable={isConnectable}
            >
                <NodeTextarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt for market analysis, trading signals, or other tasks"
                    rows={3}
                    className="min-h-[80px]"
                />
            </NodeField>

            {/* PARAMETERS */}
            <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Parameters</label>
                </div>
                
                <div className="space-y-2">
                    {parameters.map((param) => (
                        <div key={param.id} className="flex items-center gap-2 group animate-in slide-in-from-left-2">
                            <NodeInput 
                                value={param.name}
                                onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                                placeholder="Parameter name"
                                className="flex-1 min-w-0"
                            />
                            <NodeInput 
                                value={param.value}
                                onChange={(e) => updateParameter(param.id, 'value', e.target.value)}
                                placeholder="Value"
                                className="flex-1 min-w-0"
                            />
                            <button 
                                onClick={() => removeParameter(param.id)}
                                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors p-1"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={addParameter}
                    className="w-full py-2 border border-dashed border-gray-300 dark:border-white/20 rounded text-[10px] font-bold text-gray-500 hover:text-purple-600 dark:hover:text-cyber-neon hover:border-purple-400 dark:hover:border-cyber-neon/50 transition-colors flex items-center justify-center gap-1 bg-gray-50 dark:bg-transparent"
                >
                    <Plus size={12} /> Add Parameter
                </button>
            </div>

            {/* AI RESPONSE OUTPUT */}
             <div className="mt-2 bg-gray-50 dark:bg-white/5 rounded px-2 py-2 flex items-center justify-between relative group/output">
                 {/* Output Handle */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                    <Handle 
                        type="source" 
                        position={Position.Right} 
                        id="out-response"
                        style={{ width: '8px', height: '8px', background: '#ff00ff', border: '1px solid #121218' }} 
                        isConnectable={isConnectable} 
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-gray-400 dark:text-gray-500">
                        <X size={12} className="rounded-full border border-current p-[1px]" /> 
                    </div>
                     <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">AI Response</span>
                </div>
                
                 <div className="w-2 h-2 rounded-full border border-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.5)]"></div>
            </div>
        </div>
    );
};

// --- SWAP FORM COMPONENT ---
const SwapForm = ({ isConnectable, initialParams = {} }: { isConnectable: boolean, initialParams: any }) => {
    const [fromToken, setFromToken] = useState(initialParams.fromToken || '');
    const [toToken, setToToken] = useState(initialParams.toToken || '');
    // Updated state for 4 options
    const [amountType, setAmountType] = useState<string>(initialParams.amountType || 'from-fixed');
    const [amount, setAmount] = useState(initialParams.amount || '');
    const [slippage, setSlippage] = useState(initialParams.slippage || '0.5');

    const isPercentage = amountType.includes('%');

    return (
        <div className="flex flex-col gap-3 p-1 animate-in fade-in slide-in-from-top-1">
            {/* FROM TOKEN */}
            <NodeField label="From Token" required handleId="in-from-token" isConnectable={isConnectable}>
                <NodeTokenSelect 
                    tokens={TOKENS} 
                    value={fromToken} 
                    onChange={setFromToken} 
                />
            </NodeField>

            {/* TO TOKEN */}
            <NodeField label="To Token" required handleId="in-to-token" isConnectable={isConnectable}>
                <NodeTokenSelect 
                    tokens={TOKENS} 
                    value={toToken} 
                    onChange={setToToken} 
                />
            </NodeField>

            {/* AMOUNT */}
            <NodeField label="Amount" required handleId="in-amount" isConnectable={isConnectable} handlePosition={Position.Left}>
                {/* 4 Radio Buttons Grid */}
                <NodeRadioGroup 
                    name="amt"
                    value={amountType}
                    onChange={setAmountType}
                    variant="danger"
                    options={[
                        { value: 'from-fixed', label: 'From - Fixed' },
                        { value: 'to-fixed', label: 'To - Fixed' },
                        { value: 'from-%', label: 'From - %' },
                        { value: 'to-%', label: 'To - %' },
                    ]}
                />

                {/* Input / Slider */}
                <div className="mt-3 space-y-2">
                    {isPercentage ? (
                        <div className="animate-in fade-in slide-in-from-top-1">
                             <div className="flex items-center justify-between px-1 mb-1">
                                 <NodeSlider 
                                    value={Number(amount) || 0}
                                    onChange={(val) => setAmount(val.toString())}
                                    className="flex-1 mr-3"
                                 />
                                 <span className="text-[10px] text-red-500 font-bold w-6 text-right">{amount}%</span>
                             </div>
                             <div className="flex justify-between text-[9px] text-gray-400 font-mono px-0.5">
                                 <span>0%</span>
                                 <span>100%</span>
                             </div>
                             <div className="mt-2">
                                 <NodeInput 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    rightElement={<span className="text-[10px] text-gray-400 font-bold pr-2">%</span>}
                                />
                             </div>
                        </div>
                    ) : (
                        <NodeInput 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={amountType.includes('fixed') ? "23" : "50"}
                            type="number"
                        />
                    )}
                </div>
            </NodeField>

            {/* SLIPPAGE */}
            <NodeField label="Slippage Tolerance (%)" required handleId="in-slippage" isConnectable={isConnectable}>
                <NodeNumberInput 
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                />
            </NodeField>

            {/* VAULT (Read Only) */}
             <NodeField label="Vault" required handleId="in-vault" isConnectable={isConnectable}>
                {/* Empty Dashed Box for Vault */}
                <div className="w-full h-[28px] border border-dashed border-gray-300 dark:border-white/20 rounded opacity-30"></div>
            </NodeField>
            
            {/* RECEIPT MOCK (HIGH VISIBILITY) */}
             <div className="mt-2 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black border border-purple-700 dark:border-cyber-neon rounded px-2 py-1.5 flex items-center justify-between shadow-lg shadow-purple-500/20 dark:shadow-[0_0_10px_rgba(0,243,255,0.4)]">
                <span className="text-[10px] font-bold uppercase tracking-tight">Trade Receipt</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold">STRUCT</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black shadow-[0_0_5px_currentColor] animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}

// --- CUSTOM NODE COMPONENT ---
// Inputs on Left, Single Output on Right
const CyberNode = ({ id, data, isConnectable, selected }: any) => {
    const [expanded, setExpanded] = useState(true);
    const { setNodes } = useReactFlow();

    // --- NEW EDITING STATE ---
    const [isEditing, setIsEditing] = useState(false);
    const [editLabel, setEditLabel] = useState(data.label);
    const [editDesc, setEditDesc] = useState(data.description);

    // Node Action Handlers
    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
    };

    const onRun = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Trigger status update to running then success
        data.onStatusClick && data.onStatusClick(id, data.label, 'running');
        setTimeout(() => {
             data.onStatusClick && data.onStatusClick(id, data.label, 'success');
        }, 1500);
    };

    const onOptimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Just visual simulation for now
        data.onStatusClick && data.onStatusClick(id, data.label, 'running');
        setTimeout(() => {
             alert(`AI Optimization complete for ${data.label}. Parameters auto-tuned for efficiency.`);
             data.onStatusClick && data.onStatusClick(id, data.label, 'success');
        }, 1000);
    };
    
    // 1. Determine Category & Colors based on Label
    // 4 Categories: Trigger (Yellow/Gold), Logic (Cyan/Blue), AI (Violet/Purple), Action (Emerald/Green)
    const getCategoryStyles = () => {
        const label = data.label?.toLowerCase() || '';
        
        if (label.includes('trigger')) {
            return {
                border: 'border-amber-400/60 hover:border-amber-400',
                bg: 'bg-amber-400/5',
                header: 'bg-amber-400/10',
                text: 'text-amber-600 dark:text-amber-400',
                shadow: 'shadow-[0_0_10px_rgba(251,191,36,0.1)] hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]',
                handle: '#fbbf24',
                icon: <Zap size={12} />
            };
        } else if (label.includes('action') || label.includes('swap')) {
             return {
                border: 'border-emerald-500/60 hover:border-emerald-500',
                bg: 'bg-emerald-500/5',
                header: 'bg-emerald-500/10',
                text: 'text-emerald-600 dark:text-emerald-500',
                shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
                handle: '#10b981',
                icon: <Activity size={12} />
            };
        } else if (label.includes('ai') || label.includes('gemini') || label.includes('prediction')) {
             return {
                border: 'border-violet-500/60 hover:border-violet-500',
                bg: 'bg-violet-500/5',
                header: 'bg-violet-500/10',
                text: 'text-violet-600 dark:text-violet-400',
                shadow: 'shadow-[0_0_10px_rgba(139,92,246,0.1)] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]',
                handle: '#8b5cf6',
                icon: <BrainCircuit size={12} />
            };
        } else if (label.includes('code') || label.includes('script') || label.includes('python')) {
             return {
                border: 'border-slate-500/60 hover:border-slate-500',
                bg: 'bg-slate-500/5',
                header: 'bg-slate-500/10',
                text: 'text-slate-600 dark:text-slate-300',
                shadow: 'shadow-[0_0_10px_rgba(148,163,184,0.1)] hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]',
                handle: '#94a3b8',
                icon: <Code size={12} />
            };
        } else if (label.includes('vault')) {
             return {
                border: 'border-blue-500/60 hover:border-blue-500',
                bg: 'bg-blue-500/5',
                header: 'bg-blue-500/10',
                text: 'text-blue-600 dark:text-blue-400',
                shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
                handle: '#3b82f6',
                icon: <Shield size={12} />
            };
        } else if (label.includes('telegram')) {
             return {
                border: 'border-sky-500/60 hover:border-sky-500',
                bg: 'bg-sky-500/5',
                header: 'bg-sky-500/10',
                text: 'text-sky-600 dark:text-sky-400',
                shadow: 'shadow-[0_0_10px_rgba(14,165,233,0.1)] hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]',
                handle: '#0ea5e9',
                icon: <Send size={12} />
            };
        } else {
             // Logic / Default
             return {
                border: 'border-cyan-500/60 hover:border-cyan-500',
                bg: 'bg-cyan-500/5',
                header: 'bg-cyan-500/10',
                text: 'text-cyan-600 dark:text-cyan-400',
                shadow: 'shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
                handle: '#06b6d4',
                icon: <Network size={12} />
            };
        }
    };

    const styles = getCategoryStyles();
    const status = data.status || 'idle'; // idle, running, success, failed
    const isSwapNode = data.label?.toLowerCase().includes('swap');
    const isAINode = data.label?.toLowerCase().includes('ai') || data.label?.toLowerCase().includes('prediction');
    const isCodeNode = data.label?.toLowerCase().includes('code');
    const isVaultNode = data.label?.toLowerCase().includes('vault');
    const isTelegramNode = data.label?.toLowerCase().includes('telegram');

    const handleStatusClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onStatusClick) {
            data.onStatusClick(id, data.label, status);
        }
    };

    // Advanced Status Configuration
    const getStatusConfig = (s: string) => {
        switch(s?.toLowerCase()) {
            case 'pending': 
                return { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20', label: 'PENDING', animate: 'animate-pulse' };
            case 'running': 
                return { icon: Loader2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', label: 'RUNNING', animate: 'animate-spin' };
            case 'syncing': 
                return { icon: RefreshCw, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-500/20', label: 'SYNCING', animate: 'animate-spin' };
            case 'completed': 
            case 'success':
                return { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/10', border: 'border-green-200 dark:border-green-500/20', label: 'COMPLETED', animate: '' };
            case 'error': 
                return { icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/20', label: 'ERROR', animate: '' };
            case 'failed': 
                return { icon: AlertOctagon, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', label: 'FAILED', animate: '' };
            case 'cancelled': 
                return { icon: X, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-500/10', border: 'border-gray-200 dark:border-gray-500/20', label: 'CANCELLED', animate: '' };
            default: 
                return { icon: Activity, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-500/10', border: 'border-gray-200 dark:border-gray-500/20', label: 'IDLE', animate: '' };
        }
    };

    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    // --- EDIT HANDLERS ---
    const startEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditLabel(data.label);
        setEditDesc(data.description || '');
    };

    const saveEdit = (e?: React.MouseEvent | React.KeyboardEvent) => {
        e?.stopPropagation();
        setIsEditing(false);
        setNodes((nds) => nds.map((n) => {
            if (n.id === id) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        label: editLabel,
                        description: editDesc
                    }
                };
            }
            return n;
        }));
    };

    const cancelEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(false);
        setEditLabel(data.label);
        setEditDesc(data.description);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveEdit(e);
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditLabel(data.label);
            setEditDesc(data.description);
        }
    };

    return (
        <div className={`group relative min-w-[240px] rounded-lg transition-all duration-300 bg-white dark:bg-[#0c0c10] border-2 ${styles.border} ${styles.shadow}`}>
            
            <NodeToolbar isVisible={selected} position={Position.Top} offset={10}>
                 <div className="flex items-center gap-0.5 bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 shadow-xl rounded-full px-1.5 py-1 backdrop-blur-md min-w-max">
                     {/* Run */}
                     <button onClick={onRun} className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 dark:text-green-400 transition-colors group/btn">
                         <Play size={10} className="fill-current" />
                         <span className="text-[9px] font-bold uppercase tracking-wider">Run</span>
                     </button>
                     
                     <div className="w-[1px] h-3 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                     {/* AI Optimize */}
                     <button onClick={onOptimize} className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 text-purple-600 dark:text-cyber-neon transition-colors group/btn">
                         <Sparkles size={10} />
                         <span className="text-[9px] font-bold uppercase tracking-wider">AI Fix</span>
                     </button>

                     <div className="w-[1px] h-3 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                     {/* Delete */}
                     <button onClick={onDelete} className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors group/btn">
                         <Trash2 size={10} />
                         <span className="text-[9px] font-bold uppercase tracking-wider">Delete</span>
                     </button>
                     
                     {/* More */}
                     <div className="w-[1px] h-3 bg-gray-200 dark:bg-white/10 mx-0.5"></div>
                     <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
                        <MoreHorizontal size={10} />
                     </button>
                 </div>
            </NodeToolbar>

            <div className="p-0 overflow-hidden flex flex-col">
                {/* Header */}
                <div className={`p-2.5 flex items-start justify-between border-b border-gray-100 dark:border-white/5 ${styles.header} min-h-[50px]`}>
                    <div className="flex items-start gap-2 overflow-hidden flex-1">
                        <div className={`p-1 rounded bg-white dark:bg-black/20 ${styles.text} shrink-0 mt-0.5`}>
                           {styles.icon}
                        </div>
                        
                        <div className="flex flex-col min-w-0 flex-1 mr-2">
                            {isEditing ? (
                                <div className="flex flex-col gap-1.5 w-full animate-in fade-in duration-200 pr-1">
                                    <input 
                                        autoFocus
                                        value={editLabel}
                                        onChange={(e) => setEditLabel(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full bg-white dark:bg-black/40 border-b border-purple-500 dark:border-cyber-neon text-xs font-bold text-gray-900 dark:text-white uppercase p-1 outline-none rounded-t-sm"
                                        placeholder="LABEL"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <input 
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full bg-white dark:bg-black/40 border-b border-gray-300 dark:border-gray-600 text-[10px] text-gray-600 dark:text-gray-300 p-1 outline-none rounded-t-sm"
                                        placeholder="Description..."
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        <button 
                                            onClick={saveEdit}
                                            className="px-2 py-0.5 bg-green-500 text-white rounded-[2px] text-[9px] font-bold uppercase hover:bg-green-600 transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={cancelEdit}
                                            className="px-2 py-0.5 text-gray-500 hover:text-red-500 text-[9px] font-bold uppercase transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="group/text cursor-text" onDoubleClick={startEditing}>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold font-sans uppercase tracking-wider ${styles.text} truncate`}>
                                            {data.label}
                                        </span>
                                        <button 
                                            onClick={startEditing}
                                            className="opacity-0 group-hover/text:opacity-100 transition-opacity text-gray-400 hover:text-black dark:hover:text-white"
                                            title="Edit Title"
                                        >
                                            <Edit2 size={10} />
                                        </button>
                                    </div>
                                    <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5 block break-words line-clamp-2">
                                        {data.description || 'No description'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Status Pill - Hide during edit to prevent clutter */}
                    {!isEditing && (
                        <button 
                            onClick={handleStatusClick}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all cursor-pointer group/status shrink-0 ${statusConfig.bg} ${statusConfig.border}`}
                            title="View Node Logs"
                        >
                            <StatusIcon size={10} className={`${statusConfig.color} ${statusConfig.animate}`} />
                            <span className={`text-[9px] font-bold uppercase ${statusConfig.color}`}>
                                {statusConfig.label}
                            </span>
                            <TerminalSquare size={8} className="text-gray-400 dark:text-gray-600 ml-1 opacity-0 group-hover/status:opacity-100 transition-opacity" />
                        </button>
                    )}
                </div>
                
                {/* Body */}
                <div className={`relative p-2.5 ${styles.bg}`}>
                    {/* Expand Toggle */}
                    <button 
                        onClick={() => setExpanded(!expanded)} 
                        className="absolute top-2 right-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors z-10" 
                    >
                        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>

                    {/* INPUTS (Left Side) - Only show if NOT a swap/AI/Code/Vault node (they handle own inputs) */}
                    {!isSwapNode && !isAINode && !isCodeNode && !isVaultNode && !isTelegramNode && (
                        <div className="space-y-4 mb-2">
                            {data.inputs && data.inputs.map((input: string, index: number) => (
                                <div key={index} className="relative flex items-center h-4">
                                    <Handle 
                                        type="target" 
                                        position={Position.Left} 
                                        id={`input-${index}`}
                                        style={{ 
                                            left: -14, 
                                            width: '8px', 
                                            height: '8px', 
                                            background: styles.handle,
                                            border: '1px solid #999',
                                            borderColor: 'var(--edge-primary)'
                                        }} 
                                        isConnectable={isConnectable} 
                                    />
                                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{input}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Params (Expandable) */}
                    {expanded && (
                        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-white/5 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                            {/* SPECIAL RENDER FOR SPECIFIC NODES */}
                            {isSwapNode ? (
                                <SwapForm isConnectable={isConnectable} initialParams={data.params} />
                            ) : isAINode ? (
                                <AIPredictionForm isConnectable={isConnectable} initialParams={data.params} />
                            ) : isCodeNode ? (
                                <CodeNodeForm isConnectable={isConnectable} initialParams={data.params} onEdit={() => data.onEditCode ? data.onEditCode(id, data.params?.code) : null} />
                            ) : isVaultNode ? (
                                <VaultNodeForm isConnectable={isConnectable} initialParams={data.params} />
                            ) : isTelegramNode ? (
                                <TelegramNodeForm isConnectable={isConnectable} initialParams={data.params} />
                            ) : (
                                // GENERIC RENDER
                                data.params ? (
                                    Object.entries(data.params).map(([key, value]: [string, any]) => {
                                        if (key === 'status') return null; // Don't show status in params list
                                        return (
                                            <div key={key} className="flex justify-between items-center bg-white dark:bg-white/10 px-2 py-1.5 rounded border border-gray-200 dark:border-white/20 shadow-sm">
                                                <span className="text-[10px] text-gray-700 dark:text-gray-200 font-bold font-mono uppercase">{key}</span>
                                                <span className={`text-[10px] font-bold font-mono ${styles.text} truncate max-w-[120px]`}>{value}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-[9px] text-gray-400 italic">No params.</div>
                                )
                            )}
                        </div>
                    )}

                    {/* OUTPUT (Right Side - Single Flow Handler) */}
                    {!isAINode && !isCodeNode && !isVaultNode && !isTelegramNode && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <Handle 
                                type="source" 
                                position={Position.Right} 
                                style={{ 
                                    right: -8, 
                                    width: '10px', 
                                    height: '10px', 
                                    background: styles.handle,
                                    boxShadow: `0 0 8px ${styles.handle}`,
                                    border: '1px solid #121218'
                                }} 
                                isConnectable={isConnectable} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// Initial Nodes Data
const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'cyber', 
    data: { 
        label: 'TRIGGER: PRICE', 
        description: 'Oracle Feed Monitor',
        inputs: ['Oracle Feed'],
        status: 'success',
        params: { asset: 'ETH/USDC', condition: 'Price < $2800' } 
    }, 
    position: { x: 50, y: 150 },
  },
  { 
    id: '2', 
    type: 'cyber', 
    data: { 
        label: 'AI PREDICTION', 
        description: 'GPT-4 Market Analysis',
        inputs: [], 
        status: 'pending',
        params: { model: 'GPT-4', prompt: 'Analyze ETH trend', parameters: [{id:'1',name:'Timeframe',value:'4h'}] } 
    }, 
    position: { x: 400, y: 50 },
  },
  { 
    id: '3', 
    type: 'cyber', 
    data: { 
        label: 'ACTION: SWAP', 
        description: 'Uniswap V3 Execution',
        inputs: [], // Swap node handles inputs internally
        status: 'idle',
        params: { fromToken: 'ETH', toToken: 'USDC', amount: '23', amountType: 'from-%' } 
    }, 
    position: { x: 750, y: 150 },
  },
];

// Edges now use CSS variable for stroke color
const initialEdges: Edge[] = [
    { 
        id: 'e1-2', 
        source: '1', 
        target: '2', 
        animated: true, 
        markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--edge-primary)' } 
    },
     { 
        id: 'e2-3', 
        source: '2', 
        target: '3', 
        animated: true, 
        markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--edge-primary)' } 
    }
];

interface ExecutionRecord {
    id: number;
    timestamp: string;
    type: 'success' | 'skip' | 'error' | 'audit';
    message: string;
    yield?: number;
    gas?: number;
}

interface StudioContentProps {
    addNotification: (type: NotificationType, title: string, message?: string) => void;
}

const StudioContent: React.FC<StudioContentProps> = ({ addNotification }) => {
  const nodeTypes = useMemo(() => ({ cyber: CyberNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('Alpha Arbitrage Strategy');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);
  
  // Auto-Save State
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // UI State
  const [activeTab, setActiveTab] = useState<'build' | 'run'>('build');
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [executionInterval, setExecutionInterval] = useState(2000); // ms
  const [currentLog, setCurrentLog] = useState<string[]>([]); // Detailed logs for the terminal
  const [history, setHistory] = useState<ExecutionRecord[]>([]); // Structured history
  const [stats, setStats] = useState({ yield: 12.42, loops: 1420, gas: 14 });
  const logsEndRef = useRef<HTMLDivElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Code Modal State
  const [codeModal, setCodeModal] = useState({ isOpen: false, nodeId: '', code: '' });
  
  // Modal State for Node Logs
  const [logModal, setLogModal] = useState<{
      isOpen: boolean;
      nodeLabel: string;
      status: string;
      logs: LogEntry[];
      startTime: string;
      endTime: string;
  }>({
      isOpen: false,
      nodeLabel: '',
      status: 'idle',
      logs: [],
      startTime: '',
      endTime: ''
  });

  // React Flow DND hooks
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Initial Load Simulation
  useEffect(() => {
    // Simulate fetching historical graph data with the fancy loader
    const timer = setTimeout(() => {
        setIsCanvasLoading(false);
        addNotification('success', 'Workspace Loaded', 'Historical flow data synced with chain.');
    }, 2500); // Slightly longer to show off the loader
    return () => clearTimeout(timer);
  }, []);

  // Auto-Save Effect
  useEffect(() => {
    if (isCanvasLoading) return;
    
    setSaveStatus('saving');
    const timer = setTimeout(() => {
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 2000); // Debounce save
    
    return () => clearTimeout(timer);
  }, [nodes, edges, flowName, isCanvasLoading]);

  // LOG HANDLER
  const handleNodeStatusClick = useCallback((nodeId: string, label: string, status: string) => {
    const now = new Date();
    // Simulate realistic timestamps based on status
    const endTime = status === 'running' ? '' : now.toLocaleTimeString();
    // Start time was 2.4s ago
    const startTime = new Date(now.getTime() - 2400).toLocaleTimeString();
    
    const formattedTime = now.toLocaleTimeString();

    // Generate Context-Aware Mock Logs for the Modal
    const mockLogs: LogEntry[] = [
        { id: `l1-${nodeId}`, level: 'INFO', source: 'system', timestamp: new Date(now.getTime() - 2400).toLocaleTimeString(), message: `Node execution started for [${label}]` },
        { id: `l2-${nodeId}`, level: 'INFO', source: 'context', timestamp: new Date(now.getTime() - 2000).toLocaleTimeString(), message: `Loaded context data from upstream nodes. Inputs verified.` },
    ];

    if (label.toLowerCase().includes('trigger') || label.toLowerCase().includes('price')) {
         mockLogs.push({ id: `l3-${nodeId}`, level: 'INFO', source: 'oracle', timestamp: new Date(now.getTime() - 1500).toLocaleTimeString(), message: `Connecting to Chainlink Aggregator (0x5f4...243) for ETH/USD` });
         mockLogs.push({ id: `l4-${nodeId}`, level: 'INFO', source: 'logic', timestamp: new Date(now.getTime() - 1200).toLocaleTimeString(), message: `Received price: $2845.20. Comparison: 2845.20 < 2800.00 = FALSE.` });
         mockLogs.push({ id: `l5-${nodeId}`, level: 'WARN', source: 'logic', timestamp: new Date(now.getTime() - 1000).toLocaleTimeString(), message: `Threshold not met. Execution might skip downstream nodes.` });
    } else if (label.toLowerCase().includes('ai') || label.includes('gemini') || label.includes('prediction')) {
         mockLogs.push({ id: `l3-${nodeId}`, level: 'INFO', source: 'gemini', timestamp: new Date(now.getTime() - 1800).toLocaleTimeString(), message: `Preparing prompt context window (4096 tokens)...` });
         mockLogs.push({ id: `l4-${nodeId}`, level: 'INFO', source: 'gemini', timestamp: new Date(now.getTime() - 800).toLocaleTimeString(), message: `Sending request to Gemini 2.5 Flash API...` });
         mockLogs.push({ id: `l5-${nodeId}`, level: 'INFO', source: 'gemini', timestamp: new Date(now.getTime() - 200).toLocaleTimeString(), message: `Response received. Sentiment Analysis: Bullish (0.89 confidence).` });
    } else if (label.toLowerCase().includes('action') || label.toLowerCase().includes('swap')) {
         mockLogs.push({ id: `l3-${nodeId}`, level: 'INFO', source: 'dex_aggregator', timestamp: new Date(now.getTime() - 1500).toLocaleTimeString(), message: `Finding best route for 1000 USDC -> ETH...` });
         mockLogs.push({ id: `l4-${nodeId}`, level: 'INFO', source: 'dex_aggregator', timestamp: new Date(now.getTime() - 800).toLocaleTimeString(), message: `Route found: Uniswap V3 (0.3%) -> Curve sETH` });
         
         if (status === 'success') {
            mockLogs.push({ id: `l6-${nodeId}`, level: 'INFO', source: 'chain', timestamp: new Date(now.getTime() - 100).toLocaleTimeString(), message: `Transaction submitted: 0x8a...32f (Gas: 15 gwei)` });
            mockLogs.push({ id: `l7-${nodeId}`, level: 'INFO', source: 'chain', timestamp: now.toLocaleTimeString(), message: `Transaction confirmed in block 18239402.` });
         }
    } else if (label.toLowerCase().includes('code')) {
        mockLogs.push({ id: `l3-${nodeId}`, level: 'INFO', source: 'python_runtime', timestamp: new Date(now.getTime() - 1500).toLocaleTimeString(), message: `Initializing isolated Python environment...` });
        mockLogs.push({ id: `l4-${nodeId}`, level: 'INFO', source: 'python_runtime', timestamp: new Date(now.getTime() - 1000).toLocaleTimeString(), message: `Executing script...` });
        mockLogs.push({ id: `l5-${nodeId}`, level: 'INFO', source: 'python_runtime', timestamp: new Date(now.getTime() - 500).toLocaleTimeString(), message: `Output generated: { "signal": "BUY", "confidence": 0.95 }` });
    } else if (label.toLowerCase().includes('vault')) {
        mockLogs.push({ id: `l3-${nodeId}`, level: 'INFO', source: 'vault_registry', timestamp: new Date(now.getTime() - 1500).toLocaleTimeString(), message: `Querying Vault Registry for selected strategy...` });
        mockLogs.push({ id: `l4-${nodeId}`, level: 'INFO', source: 'chain', timestamp: new Date(now.getTime() - 1000).toLocaleTimeString(), message: `Fetching current APY and TVL stats...` });
        mockLogs.push({ id: `l5-${nodeId}`, level: 'INFO', source: 'vault', timestamp: new Date(now.getTime() - 500).toLocaleTimeString(), message: `Vault connection established. Ready for interaction.` });
    } else if (label.toLowerCase().includes('telegram')) {
        mockLogs.push({ id: `l3-${nodeId}`, level: 'INFO', source: 'telegram_api', timestamp: new Date(now.getTime() - 1500).toLocaleTimeString(), message: `Authenticating with Bot API...` });
        mockLogs.push({ id: `l4-${nodeId}`, level: 'INFO', source: 'telegram_api', timestamp: new Date(now.getTime() - 1000).toLocaleTimeString(), message: `Formatting message template with context variables...` });
        mockLogs.push({ id: `l5-${nodeId}`, level: 'INFO', source: 'telegram_api', timestamp: new Date(now.getTime() - 500).toLocaleTimeString(), message: `Message sent to user @NeonUser_Alpha. ID: 482910` });
    }

    if (status === 'failed') {
        mockLogs.push({ id: `err-${nodeId}`, level: 'ERROR', source: 'runtime', timestamp: now.toLocaleTimeString(), message: `Execution halted. Error: Timeout waiting for RPC response or gas limit exceeded.` });
    } else if (status === 'success') {
         mockLogs.push({ id: `suc-${nodeId}`, level: 'INFO', source: 'system', timestamp: now.toLocaleTimeString(), message: `Node execution completed successfully.` });
    }

    // Open Modal
    setLogModal({
        isOpen: true,
        nodeLabel: label,
        status: status,
        logs: mockLogs,
        startTime,
        endTime
    });

    // Also update bottom console for continuity
    setCurrentLog(prev => [
        ...prev,
        `\n>>> INSPECTING NODE [${nodeId}]: ${label}`,
        `[${formattedTime}] STATUS: ${status.toUpperCase()}`,
        `[${formattedTime}] LOGS: View detailed logs in modal...`,
        status === 'failed' ? `[ERROR] Connection timeout at block 192843` : `[INFO] Execution verified on-chain.`,
        `----------------------------------------`
    ]);
  }, []);

  const handleEditCode = useCallback((nodeId: string, currentCode: string) => {
      setCodeModal({ isOpen: true, nodeId, code: currentCode || '# Write your Python code here\n\ndef main(input_data):\n    # Process input data and return result\n    return input_data\n' });
  }, []);

  const saveCode = (newCode: string) => {
    setNodes(nds => nds.map(n => n.id === codeModal.nodeId ? { ...n, data: { ...n.data, params: { ...n.data.params, code: newCode } } } : n));
    setCodeModal(prev => ({ ...prev, isOpen: false }));
    addNotification('success', 'Code Saved', 'Python script updated successfully.');
  };

  // Update nodes with handlers on mount
  useEffect(() => {
    setNodes((nds) => nds.map(n => ({
        ...n,
        data: { ...n.data, onStatusClick: handleNodeStatusClick, onEditCode: handleEditCode }
    })));
  }, [handleNodeStatusClick, handleEditCode, setNodes]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--edge-primary)' } }, eds)), [setEdges]);

  // DND Handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');
      const description = event.dataTransfer.getData('application/description');
      const inputs = JSON.parse(event.dataTransfer.getData('application/inputs') || '[]');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { 
            label: label, 
            description: description,
            inputs: inputs, 
            status: 'idle', // Initialize status
            params: { status: 'New', code: '' },
            onStatusClick: handleNodeStatusClick,
            onEditCode: handleEditCode
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addNotification('success', 'Component Added', `Added ${label} to the workflow.`);
    },
    [reactFlowInstance, setNodes, handleNodeStatusClick, handleEditCode, addNotification]
  );

  // Helper to add history
  const addHistory = (type: 'success' | 'skip' | 'error' | 'audit', message: string, yieldVal?: number, gasVal?: number) => {
      const newRecord: ExecutionRecord = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          type,
          message,
          yield: yieldVal,
          gas: gasVal
      };
      setHistory(prev => [newRecord, ...prev].slice(0, 50)); // Keep last 50
  };

  // Simulation Loop
  useEffect(() => {
    let interval: any;
    if (isRunning) {
        if (activeTab !== 'run') setActiveTab('run');
        
        setCurrentLog(prev => [...prev, `[SYSTEM] Cycle started...`]);

        // Update random node to running status
        setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'running'}})));

        interval = setInterval(() => {
            // Random events simulation
            const eventType = Math.random();
            const cycleId = Math.floor(Math.random() * 10000);
            
            if (eventType > 0.85) {
                const yieldGain = Math.random() * 0.05;
                setStats(s => ({ ...s, yield: s.yield + yieldGain, loops: s.loops + 1 }));
                addHistory('success', `Cycle #${cycleId}: Opportunity Executed`, yieldGain, 24);
                setCurrentLog(prev => [...prev, `[EXEC] Cycle #${cycleId}: Swapping on Curve... (+${yieldGain.toFixed(3)}%)`]);
                setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'success'}})));
            } else if (eventType > 0.7) {
                 setStats(s => ({ ...s, loops: s.loops + 1, gas: Math.floor(10 + Math.random() * 5) }));
                 addHistory('skip', `Cycle #${cycleId}: No arb found`, undefined, 12);
                 setCurrentLog(prev => [...prev, `[SCAN] Cycle #${cycleId}: Block scanned. No arbitrage.`]);
                 setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'idle'}})));
            } else {
                 // Silent check
                 setCurrentLog(prev => [...prev, `[WAIT] Pending next block...`]);
            }
            
            // Limit live logs
            setCurrentLog(prev => prev.slice(-50));

        }, executionInterval);
    } else {
        // Reset status when stopped
        setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'idle'}})));
    }
    return () => clearInterval(interval);
  }, [isRunning, executionInterval, setNodes]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentLog]);

  const toggleExecution = () => {
      if (!isRunning) {
          // Starting
          setActiveTab('run');
          setCurrentLog(prev => [...prev, `[SYSTEM] Engine Warmup... Sequence Start.`]);
      } else {
          setCurrentLog(prev => [...prev, `[SYSTEM] Engine Paused.`]);
      }
      setIsRunning(!isRunning);
  };

  const handleSyntaxCheck = () => {
    setActiveTab('run');
    setCurrentLog(prev => [...prev, '[AUDIT] Running Syntax & Security Check...']);
    
    // Set all to checking
    setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'running'}})));

    setTimeout(() => {
        const connectedNodes = new Set();
        edges.forEach(e => {
            connectedNodes.add(e.source);
            connectedNodes.add(e.target);
        });

        const dangling = nodes.filter(n => !connectedNodes.has(n.id));
        
        if (dangling.length > 0) {
             setCurrentLog(prev => [...prev, `[WARN] Found ${dangling.length} disconnected nodes. Flow may fail.`]);
             addHistory('error', `Audit Failed: ${dangling.length} disconnected nodes`);
             addNotification('warning', 'Audit Warning', `${dangling.length} nodes are disconnected. Logic may be incomplete.`);
             // Mark dangling as failed
             setNodes((nds) => nds.map(n => {
                 if (!connectedNodes.has(n.id)) return {...n, data: {...n.data, status: 'failed'}};
                 return {...n, data: {...n.data, status: 'success'}};
             }));
        } else {
             setCurrentLog(prev => [...prev, `[PASS] Syntax Clean. All nodes connected. Gas Optimized.`]);
             addHistory('audit', `Security Audit Passed`, 0, 0);
             addNotification('success', 'Audit Passed', 'Workflow is secure and ready for deployment.');
             setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'success'}})));
        }
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-white dark:bg-[#080808]">
        
        {/* Node Log Modal - Rendered conditionally */}
        <NodeLogsModal 
            isOpen={logModal.isOpen} 
            onClose={() => setLogModal(prev => ({ ...prev, isOpen: false }))} 
            nodeLabel={logModal.nodeLabel}
            status={logModal.status}
            logs={logModal.logs}
            startTime={logModal.startTime}
            endTime={logModal.endTime}
        />

        {/* Code Editor Modal */}
        <CodeEditorModal 
            isOpen={codeModal.isOpen}
            onClose={() => setCodeModal(prev => ({ ...prev, isOpen: false }))}
            code={codeModal.code}
            onSave={saveCode}
        />

        {/* 1. LEFT SIDEBAR: DUAL MODE COMMAND CENTER (w-80) */}
        <div className="flex w-80 z-20 shadow-xl bg-white dark:bg-[#0a0a0f] border-r border-gray-200 dark:border-white/5 shrink-0">
             
             {/* A. NAV STRIP (Icons) */}
             <div className="w-12 bg-gray-100 dark:bg-black/40 border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-4 gap-4 shrink-0">
                 <button 
                    onClick={() => setActiveTab('build')}
                    className={`p-2 rounded transition-all ${activeTab === 'build' ? 'bg-white dark:bg-white/10 text-purple-600 dark:text-cyber-neon shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Build Mode"
                 >
                     <Hammer size={20} />
                 </button>
                 <button 
                    onClick={() => setActiveTab('run')}
                    className={`p-2 rounded transition-all ${activeTab === 'run' ? 'bg-white dark:bg-white/10 text-green-500 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Run & Monitor"
                 >
                     <Play size={20} />
                 </button>
             </div>

             {/* B. CONTENT PANEL (Build or Run) */}
             <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0c0c10]">
                 
                 {/* MODE: BUILD */}
                 {activeTab === 'build' && (
                     <div className="flex-1 overflow-y-auto p-4 space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="pb-4 border-b border-gray-200 dark:border-white/5">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Node Library</h2>
                            <p className="text-[10px] text-gray-500">Drag components to canvas</p>
                        </div>

                        {/* Category 1: Triggers (Yellow) */}
                        <div>
                            <h4 className="text-xs font-bold text-amber-500 uppercase mb-4 flex items-center gap-2 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                <Zap size={14} /> Triggers
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="Trigger: Price" inputs={['Oracle']} description="Execute on price target." />
                                <DraggableNode type="cyber" label="Trigger: Time" inputs={['Cron']} description="Execute at intervals." />
                                <DraggableNode type="cyber" label="Trigger: Event" inputs={['Log']} description="On-chain event listener." />
                            </div>
                        </div>

                         {/* Category 2: Logic (Cyan) */}
                        <div>
                            <h4 className="text-xs font-bold text-cyan-500 uppercase mb-4 flex items-center gap-2 bg-cyan-500/10 p-2 rounded border border-cyan-500/20">
                                <Network size={14} /> Logic & Flow
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="Logic: Code" inputs={['Input Data']} description="Python script block." />
                                <DraggableNode type="cyber" label="Logic: Condition" inputs={['Value A', 'Value B']} description="If/Else logic block." />
                                <DraggableNode type="cyber" label="Logic: Filter" inputs={['List']} description="Filter dataset." />
                                <DraggableNode type="cyber" label="Logic: Loop" inputs={['Array']} description="Iterate over items." />
                            </div>
                        </div>

                        {/* Category 3: AI (Violet) */}
                        <div>
                            <h4 className="text-xs font-bold text-violet-500 uppercase mb-4 flex items-center gap-2 bg-violet-500/10 p-2 rounded border border-violet-500/20">
                                <BrainCircuit size={14} /> AI Models
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="AI Prediction" inputs={['Prompt', 'Context']} description="High-speed reasoning." />
                                <DraggableNode type="cyber" label="AI: Sentiment" inputs={['Text']} description="Analyze market mood." />
                                <DraggableNode type="cyber" label="AI: Strategy" inputs={['History']} description="Generative Alpha." />
                            </div>
                        </div>

                         {/* Category 4: Actions (Emerald) */}
                         <div>
                            <h4 className="text-xs font-bold text-emerald-500 uppercase mb-4 flex items-center gap-2 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                                <Activity size={14} /> Actions
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="Action: Swap" inputs={['Token In', 'Route']} description="DEX swap execution." />
                                <DraggableNode type="cyber" label="Action: Stake" inputs={['Token', 'Vault']} description="Deposit to yield vault." />
                                <DraggableNode type="cyber" label="Action: Flash Loan" inputs={['Amount']} description="Borrow capital." />
                            </div>
                        </div>

                        {/* Category 5: Resources (Blue) */}
                        <div>
                            <h4 className="text-xs font-bold text-blue-500 uppercase mb-4 flex items-center gap-2 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                                <Shield size={14} /> Resources
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="Vault: Selector" inputs={[]} description="Select chain & strategy." />
                            </div>
                        </div>

                        {/* Category 6: Integrations (Sky) */}
                        <div>
                            <h4 className="text-xs font-bold text-sky-500 uppercase mb-4 flex items-center gap-2 bg-sky-500/10 p-2 rounded border border-sky-500/20">
                                <MessageCircle size={14} /> Integrations
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="Telegram: Alert" inputs={['Message']} description="Send bot notification." />
                            </div>
                        </div>
                     </div>
                 )}

                 {/* MODE: RUN */}
                 {activeTab === 'run' && (
                     <div className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-left-2 duration-300">
                         {/* 1. Control Deck */}
                         <div className="p-4 bg-white dark:bg-[#121218] border-b border-gray-200 dark:border-white/5 shadow-md z-10 flex flex-col gap-4">
                             
                             {/* Live Metrics - LARGE LCD STYLE */}
                             <div className="bg-black/90 p-4 rounded-md border border-gray-200 dark:border-white/10 relative overflow-hidden shadow-inner">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-transparent to-transparent"></div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Gauge size={12} /> Real-Time Yield
                                    </span>
                                    <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                </div>
                                <div className="text-3xl font-mono font-bold text-green-500 dark:text-green-400 tracking-tighter">
                                    ${stats.yield.toFixed(4)}
                                </div>
                                <div className="flex gap-4 mt-2 pt-2 border-t border-white/10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-500">CYCLES</span>
                                        <span className="text-xs font-mono text-white">{stats.loops}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-500">GAS (GWEI)</span>
                                        <span className="text-xs font-mono text-yellow-500">{stats.gas}</span>
                                    </div>
                                </div>
                             </div>

                             {/* Frequency Selector */}
                             <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Execution Interval</span>
                                <select 
                                    value={executionInterval}
                                    onChange={(e) => setExecutionInterval(Number(e.target.value))}
                                    className="bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-gray-700 text-[10px] py-1 px-2 rounded font-mono focus:outline-none hover:border-gray-400 transition-colors"
                                    title="Set execution speed"
                                >
                                    <option value={1000}>1s (Turbo)</option>
                                    <option value={3000}>3s (Fast)</option>
                                    <option value={12000}>12s (Block)</option>
                                </select>
                             </div>

                             {/* Action Buttons - Compact */}
                             <div className="grid grid-cols-2 gap-3">
                                 <button 
                                    onClick={toggleExecution}
                                    className={`h-9 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm border ${
                                        isRunning 
                                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/50 dark:hover:bg-red-500/20' 
                                        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/50 dark:hover:bg-green-500/20'
                                    }`}
                                    title={isRunning ? "Stop Simulation" : "Start Simulation"}
                                 >
                                     {isRunning ? <StopCircle size={14} /> : <PlayCircle size={14} />}
                                     {isRunning ? 'Stop' : 'Start'}
                                 </button>
                                 <button 
                                    onClick={handleSyntaxCheck}
                                    className="h-9 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-cyber-neon transition-all"
                                    title="Audit workflow logic"
                                 >
                                     <CheckCircle2 size={14} />
                                     Audit
                                 </button>
                             </div>
                         </div>

                         {/* 2. History List */}
                         <div className="flex-1 overflow-y-auto p-0 bg-gray-50 dark:bg-[#0c0c10]">
                             <div className="sticky top-0 bg-gray-100 dark:bg-[#1a1a20] px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-white/5 flex items-center gap-2 z-0">
                                 <History size={12} /> Execution Log
                             </div>
                             <div className="divide-y divide-gray-200 dark:divide-white/5">
                                 {history.length === 0 && (
                                     <div className="p-8 text-center text-xs text-gray-400 italic">No cycles executed yet.</div>
                                 )}
                                 {history.map((record) => (
                                     <div key={record.id} className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                         <div className="flex justify-between items-start mb-1">
                                             <div className="flex items-center gap-2">
                                                 <span className={`w-1.5 h-1.5 rounded-full ${
                                                     record.type === 'success' ? 'bg-green-500' : 
                                                     record.type === 'error' ? 'bg-red-500' : 
                                                     record.type === 'audit' ? 'bg-purple-500' : 'bg-gray-500'
                                                 }`}></span>
                                                 <span className={`text-[10px] font-bold uppercase ${
                                                     record.type === 'success' ? 'text-green-600 dark:text-green-400' : 
                                                     record.type === 'error' ? 'text-red-500' : 'text-gray-500'
                                                 }`}>{record.type}</span>
                                             </div>
                                             <span className="text-[9px] font-mono text-gray-400">{record.timestamp}</span>
                                         </div>
                                         <div className="text-[10px] text-gray-700 dark:text-gray-300 font-mono pl-3.5 leading-tight">
                                             {record.message}
                                         </div>
                                         {record.yield && (
                                              <div className="mt-1 pl-3.5 flex items-center gap-2">
                                                  <span className="text-[9px] bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-1 rounded font-mono">
                                                      +${record.yield.toFixed(4)}
                                                  </span>
                                              </div>
                                         )}
                                     </div>
                                 ))}
                                 <div ref={historyEndRef} />
                             </div>
                         </div>

                         {/* 3. Terminal (Bottom fixed) */}
                         <div className="h-40 bg-black border-t border-gray-800 flex flex-col font-mono text-[10px] shrink-0">
                            <div className="px-3 py-1 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-gray-500">
                                <span className="uppercase flex items-center gap-2"><TerminalSquare size={10} /> Live Console</span>
                                <button onClick={() => setCurrentLog([])} className="hover:text-white" title="Clear Console"><RefreshCw size={10} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 text-gray-300 space-y-1">
                                {currentLog.length === 0 && <span className="text-gray-600 italic">Ready for commands... Click a node status to inspect.</span>}
                                {currentLog.map((log, i) => (
                                    <div key={i} className={`${log.includes('[EXEC]') ? 'text-cyber-neon' : log.includes('[SYSTEM]') ? 'text-yellow-500' : log.includes('[WARN]') ? 'text-orange-500' : log.includes('[PASS]') ? 'text-green-500' : log.includes('>>>') ? 'text-white font-bold bg-white/10' : 'text-gray-400'}`}>
                                        {log}
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        </div>
                     </div>
                 )}

             </div>
        </div>

        {/* 2. MIDDLE: CANVAS */}
        <div className="flex-1 h-full relative flex flex-col bg-white dark:bg-[#080808]" ref={reactFlowWrapper}>
            {/* Canvas Header Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
                {/* Title (Left) */}
                <div className="bg-white/90 dark:bg-cyber-panel/90 backdrop-blur-md p-3 rounded border border-gray-200 dark:border-white/10 shadow-lg pointer-events-auto flex items-center gap-3">
                    
                    {/* Icon */}
                    <div className="p-2 bg-purple-100 dark:bg-cyber-neon/20 rounded flex items-center justify-center">
                        <TerminalSquare size={20} className="text-purple-600 dark:text-cyber-neon" />
                    </div>

                    {/* Vertical Stack: Title + Status */}
                    <div className="flex flex-col justify-center gap-0.5">
                        
                        {/* Top: Title */}
                        {isEditingName ? (
                            <input 
                                type="text" 
                                value={flowName} 
                                onChange={(e) => setFlowName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                                autoFocus
                                className="bg-transparent border-b border-purple-500 dark:border-cyber-neon text-gray-900 dark:text-white px-0 py-0 text-xs font-bold outline-none w-48"
                            />
                        ) : (
                            <h1 
                                className="text-xs font-bold text-gray-900 dark:text-white tracking-wide cursor-pointer hover:text-purple-600 dark:hover:text-cyber-neon flex items-center gap-2"
                                onClick={() => setIsEditingName(true)}
                                title="Edit Flow Name"
                            >
                                {flowName}
                                <Edit2 size={10} className="opacity-50" />
                            </h1>
                        )}

                        {/* Bottom: Save Status */}
                        <div className="flex items-center gap-1.5 h-3">
                            {saveStatus === 'saving' ? (
                                 <>
                                    <Loader2 size={8} className="text-gray-400 animate-spin" />
                                    <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Saving to chain...</span>
                                 </>
                            ) : (
                                 <>
                                    <CheckCircle2 size={8} className="text-green-500" />
                                    <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Saved {lastSavedTime}</span>
                                 </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="pointer-events-auto flex items-start gap-3">
                     <VaultWidget />
                </div>
            </div>

            {/* --- LOADING OVERLAY --- */}
            {isCanvasLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-[#080808]/90 backdrop-blur-md transition-opacity duration-300">
                    <div className="relative">
                        {/* Outer pulsing ring */}
                        <div className="w-24 h-24 border-2 border-gray-200 dark:border-white/5 rounded-full animate-pulse"></div>
                        
                        {/* Spinning Segments */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-r-2 border-purple-500 dark:border-cyber-neon rounded-full animate-spin duration-700 ease-linear"></div>
                        <div className="absolute top-2 left-2 w-20 h-20 border-b-2 border-l-2 border-pink-500 dark:border-cyber-purple rounded-full animate-spin-slow duration-1000"></div>

                        {/* Center Logo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Workflow size={28} className="text-gray-900 dark:text-white animate-pulse" />
                        </div>
                    </div>
                    
                    {/* Text Data Stream */}
                    <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] animate-pulse">
                            Initializing
                        </div>
                        <div className="flex flex-col items-center text-[9px] text-gray-500 font-mono gap-1">
                             <span className="animate-in fade-in slide-in-from-bottom-2 duration-500">Syncing node states...</span>
                             <span className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100 text-purple-600 dark:text-cyber-neon">Validating edge connections...</span>
                             <span className="animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">Retrieving historical logs...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* React Flow */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
                className="bg-dot-pattern"
            >
                <Background color="#888" gap={24} className="dark:opacity-20 opacity-10" />
                <Controls className="dark:bg-black dark:border-white/10" />
                <MiniMap 
                    nodeColor={() => '#00f3ff'} 
                    maskColor="rgba(0,0,0,0.7)" 
                    className="bg-white dark:bg-cyber-panel border border-gray-200 dark:border-white/10" 
                />
            </ReactFlow>

            {/* Floating AI Trigger (Bottom Right) */}
            {!isAiSidebarOpen && (
                <div className="absolute bottom-8 right-8 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <button
                        onClick={() => setIsAiSidebarOpen(true)}
                        className="group relative flex items-center gap-3 pl-1 pr-4 py-1 bg-white/10 dark:bg-black/40 backdrop-blur-md border border-purple-500/30 dark:border-cyber-neon/30 rounded-full shadow-2xl hover:bg-white/20 dark:hover:bg-black/60 transition-all hover:border-purple-500 dark:hover:border-cyber-neon hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                    >
                        {/* Icon Circle */}
                        <div className="w-10 h-10 rounded-full bg-purple-600 dark:bg-cyber-neon flex items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50"></div>
                            <Sparkles size={18} className="text-white dark:text-black animate-pulse" />
                        </div>
                        
                        {/* Text */}
                        <div className="flex flex-col items-start">
                            <span className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">AI Copilot</span>
                            <span className="text-xs font-bold text-gray-800 dark:text-white leading-none">Initialize</span>
                        </div>

                        {/* Status Dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black animate-bounce"></div>
                    </button>
                </div>
            )}
        </div>

        {/* 3. RIGHT SIDEBAR: CHAT ONLY (w-96) */}
        {isAiSidebarOpen && (
            <div className="w-96 bg-white dark:bg-[#0a0a0f] border-l border-gray-200 dark:border-white/5 flex flex-col z-20 shadow-2xl shrink-0 animate-in slide-in-from-right-10 duration-300">
                {/* Chat Interface (Fills entire Right Sidebar now) */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <ChatInterface 
                        setNodes={setNodes} 
                        setEdges={setEdges} 
                        setIsCanvasLoading={setIsCanvasLoading} 
                        onClose={() => setIsAiSidebarOpen(false)}
                    />
                </div>
            </div>
        )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const DraggableNode = ({ type, label, inputs, description }: { type: string, label: string, inputs: string[], description: string }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.setData('application/label', label);
      event.dataTransfer.setData('application/inputs', JSON.stringify(inputs));
      event.dataTransfer.setData('application/description', description);
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div 
        className="bg-white dark:bg-[#121218] border border-gray-200 dark:border-white/10 p-3 rounded cursor-grab hover:border-purple-500 dark:hover:border-cyber-neon transition-all group shadow-sm flex items-center justify-between"
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
        <div>
            <div className="text-xs font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyber-neon">{label}</div>
            <div className="text-[9px] text-gray-500 mt-0.5">{description}</div>
        </div>
        <MousePointer2 size={12} className="text-gray-400 group-hover:text-cyber-neon opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
};

interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    timestamp: number;
}

const ChatInterface = ({ 
    setNodes, setEdges, setIsCanvasLoading, onClose
}: { 
    setNodes: any, 
    setEdges: any, 
    setIsCanvasLoading: (loading: boolean) => void,
    onClose: () => void
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocketConnecting, setIsSocketConnecting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat History State
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
      { id: 's1', title: 'Arbitrage Scanner Setup', timestamp: Date.now() - 3600000, messages: [] },
      { id: 's2', title: 'Yield Farm Optimization', timestamp: Date.now() - 86400000, messages: [] }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Simulate WebSocket Connection
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsSocketConnecting(false);
    }, 2500); // 2.5s connection simulation
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    // Start new session if needed
    if (!currentSessionId) {
        const newId = Date.now().toString();
        setCurrentSessionId(newId);
        setSessions(prev => [{ id: newId, title: text.slice(0, 20) + '...', timestamp: Date.now(), messages: [] }, ...prev]);
    }

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const responseText = await geminiService.chat(text, history, selectedModel);
      
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      let finalText = responseText;

      if (jsonMatch && jsonMatch[1]) {
        try {
            const flowData = JSON.parse(jsonMatch[1]);
            if (flowData.nodes && flowData.edges) {
                // Trigger Canvas Loader
                setIsCanvasLoading(true);
                
                const styledNodes = flowData.nodes.map((n: Node) => ({
                    ...n,
                    type: 'cyber',
                    data: { ...n.data, inputs: n.data.inputs || [] }
                }));
                const styledEdges = flowData.edges.map((e: Edge) => ({
                    ...e,
                    animated: true,
                    // Use CSS variable for edge color
                    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--edge-primary)' }
                }));
                
                // Artificial Delay for effect
                setTimeout(() => {
                    setNodes(styledNodes);
                    setEdges(styledEdges);
                    setIsCanvasLoading(false);
                }, 1200);

                finalText = "Workflow generated based on your parameters. Check the canvas.";
            }
        } catch (e) { console.error(e); }
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: finalText, timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Error connecting to AI Network.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  const createNewChat = () => {
      setMessages([]);
      setCurrentSessionId(null);
      setShowHistory(false);
      // Re-trigger connection simulation for effect
      setIsSocketConnecting(true);
      setTimeout(() => setIsSocketConnecting(false), 1500);
  }

  // --- WELCOME LAUNCHPAD ---
  const WelcomeLaunchpad = () => (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         {/* Branding */}
         <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-500/10 dark:bg-cyber-neon/10 rounded-2xl flex items-center justify-center border border-purple-500/20 dark:border-cyber-neon/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] dark:shadow-[0_0_30px_rgba(0,243,255,0.15)] mb-4 relative group">
                <BrainCircuit size={32} className="text-purple-600 dark:text-cyber-neon relative z-10" />
                <div className="absolute inset-0 bg-purple-500/20 dark:bg-cyber-neon/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-widest">TRADING ARCHITECT</h3>
            <p className="text-xs text-gray-500 max-w-[240px] mx-auto mt-2 leading-relaxed">
              Describe a strategy, paste code, or ask for market analysis. I can build the flow for you.
            </p>
         </div>

         {/* Suggestions Grid */}
         <div className="w-full space-y-5">
            <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left pl-1 flex items-center gap-1">
                    <TrendingUp size={10} /> Trending Strategies
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <button 
                        onClick={() => handleSendMessage("Create a Delta Neutral Yield Farming strategy on AAVE with stablecoin pairing")} 
                        className="group flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-green-500/50 hover:bg-green-500/5 transition-all text-left"
                        title="Auto-fill prompt for Delta Neutral Farm"
                    >
                        <div className="p-2 bg-green-500/10 rounded-md text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform"><Activity size={14} /></div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-green-500">Delta Neutral Farm</div>
                            <div className="text-[9px] text-gray-500 mt-0.5">Automated hedging on Aave • <span className="text-green-500 font-mono">~14% APY</span></div>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => handleSendMessage("Build an Arbitrage Sniper bot for Curve ETH/stETH pools")} 
                        className="group flex items-center gap-3 p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left"
                        title="Auto-fill prompt for Arbitrage Sniper"
                    >
                        <div className="p-2 bg-purple-500/10 rounded-md text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"><Zap size={14} /></div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-500">Flash Arbitrage</div>
                            <div className="text-[9px] text-gray-500 mt-0.5">Curve ETH/stETH • <span className="text-purple-500 font-mono">High Risk</span></div>
                        </div>
                    </button>
                </div>
            </div>
         </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0c0c10] relative">
        {/* Connection Loader Overlay */}
        {isSocketConnecting && (
            <AIConnectionLoader overlay message="Linking to Neural Net..." />
        )}

        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#121218] flex justify-between items-center shrink-0 relative z-20">
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-cyber-neon" /> AI Assistant
                </span>
                
                {/* Chat History Button */}
                <div className="relative">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`p-1.5 rounded-md transition-colors ${showHistory ? 'bg-purple-100 dark:bg-cyber-purple/20 text-purple-600 dark:text-cyber-neon' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        title="View Chat History"
                    >
                        <History size={14} />
                    </button>
                    
                    {/* History Popover */}
                    {showHistory && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowHistory(false)}></div>
                            <div className="absolute top-8 left-0 w-64 bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 shadow-2xl rounded-md z-40 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-2 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">History</span>
                                    <button onClick={createNewChat} className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-cyber-neon font-bold hover:underline" title="Start new conversation">
                                        <Plus size={10} /> New Chat
                                    </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {sessions.length === 0 ? (
                                        <div className="p-4 text-center text-[10px] text-gray-400 italic">No history yet.</div>
                                    ) : (
                                        sessions.map(s => (
                                            <button 
                                                key={s.id}
                                                onClick={() => {
                                                    // In a real app, load messages here
                                                    setMessages([]); // Mock loading
                                                    setShowHistory(false);
                                                }}
                                                className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 group"
                                                title={`Load: ${s.title}`}
                                            >
                                                <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-purple-500 dark:group-hover:text-cyber-neon">{s.title}</div>
                                                <div className="text-[9px] text-gray-400 font-mono mt-0.5">{new Date(s.timestamp).toLocaleDateString()}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
             </div>

             <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1">
                     <div className={`w-1.5 h-1.5 rounded-full ${isSocketConnecting ? 'bg-yellow-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
                     <span className="text-[9px] text-gray-500 font-mono">{isSocketConnecting ? 'CONNECTING...' : 'ONLINE'}</span>
                 </div>
                 {/* Close Button */}
                 <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    title="Close Assistant"
                >
                     <PanelRightClose size={16} />
                 </button>
             </div>
        </div>

        {/* Messages or Welcome Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 ? (
                <WelcomeLaunchpad />
            ) : (
                messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[90%] p-3 rounded-md text-xs font-mono leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-purple-600 dark:bg-cyber-purple/20 border border-purple-500 dark:border-cyber-purple/40 text-white dark:text-gray-100' 
                            : 'bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                        }`}>
                            {msg.text.split('```').map((part, index) => (
                                index % 2 === 1 
                                    ? <pre key={index} className="text-[9px] bg-black text-green-400 p-2 mt-2 overflow-x-auto rounded border border-white/10">{part}</pre>
                                    : <span key={index}>{part}</span>
                            ))}
                        </div>
                    </div>
                ))
            )}
            
            {isLoading && (
                <div className="flex items-center gap-2 text-[10px] text-purple-500 dark:text-cyber-neon animate-pulse px-2">
                    <BrainCircuit size={12} /> PROCESSING...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-[#121218] border-t border-gray-200 dark:border-white/10 space-y-2 shrink-0">
             <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Trading Architect..."
                    className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white pl-3 pr-10 py-3 text-xs focus:outline-none focus:border-purple-500 dark:focus:border-cyber-neon font-mono resize-none rounded-sm min-h-[60px]"
                />
                <button 
                    onClick={() => handleSendMessage()} 
                    disabled={isLoading} 
                    className="absolute right-2 bottom-2 p-1.5 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    title="Send Message"
                >
                    <Send size={14} />
                </button>
            </div>
            
            {/* Model Selection Dropdown (Below Input) */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                     <span className="text-[9px] font-bold text-gray-400 uppercase">Model</span>
                     <div className="relative group">
                        <select 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="appearance-none bg-transparent text-gray-600 dark:text-gray-400 text-[9px] font-mono focus:text-purple-600 dark:focus:text-cyber-neon outline-none cursor-pointer pr-4 hover:underline"
                            title="Select AI Model"
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-flash-lite-latest">Gemini Flash Lite</option>
                            <option value="gemini-3-pro-preview">Gemini 3.0 Pro</option>
                        </select>
                        <ChevronDown size={8} className="absolute right-0 top-1.5 text-gray-500 pointer-events-none" />
                    </div>
                </div>
                {messages.length > 0 && (
                    <button className="text-[9px] text-gray-400 hover:text-red-500" onClick={() => setMessages([])} title="Clear conversation history">CLEAR CHAT</button>
                )}
            </div>
        </div>
    </div>
  );
};

interface StudioProps {
  addNotification: (type: NotificationType, title: string, message?: string) => void;
}

export const Studio: React.FC<StudioProps> = ({ addNotification }) => {
    return (
        <ReactFlowProvider>
            <StudioContent addNotification={addNotification} />
        </ReactFlowProvider>
    );
};
