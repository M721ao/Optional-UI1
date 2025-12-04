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
  useReactFlow
} from 'reactflow';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { 
    Sparkles, Send, Cpu, TerminalSquare, Edit2, Zap, BrainCircuit, 
    ChevronDown, ChevronRight, Settings, Grid, PlayCircle, RotateCw, 
    CheckCircle2, BoxSelect, Server, ArrowRight, Activity, MousePointer2,
    Layers, Command, AlertCircle, ChevronUp, StopCircle, RefreshCw, BarChart3,
    Shield, Clock, Timer, AlertTriangle, Hammer, History, Play, Gauge,
    TrendingUp, ShieldCheck, Search, MessageSquare, Plus, Trash2
} from 'lucide-react';
import { VaultWidget } from '../components/VaultWidget';

// --- CUSTOM NODE COMPONENT ---
// Inputs on Left, Single Output on Right
const CyberNode = ({ data, isConnectable }: any) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="gradient-border-wrapper min-w-[240px] shadow-lg hover:shadow-neon transition-shadow group">
            <div className="gradient-border-content p-0 overflow-hidden flex flex-col bg-white dark:bg-[#121218]">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-white/5 p-2.5 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${data.color || 'bg-purple-100 dark:bg-cyber-neon/20'}`}>
                           <Settings size={12} className="text-purple-600 dark:text-cyber-neon" />
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white font-sans uppercase tracking-wider">{data.label}</span>
                    </div>
                    <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                </div>
                
                {/* Body */}
                <div className="relative p-2.5">
                    {/* INPUTS (Left Side) */}
                    <div className="space-y-3 mb-1">
                        {data.inputs && data.inputs.map((input: string, index: number) => (
                            <div key={index} className="relative flex items-center h-4">
                                <Handle 
                                    type="target" 
                                    position={Position.Left} 
                                    id={`input-${index}`}
                                    style={{ 
                                        left: -12, 
                                        width: '8px', 
                                        height: '8px', 
                                        background: '#bc13fe',
                                        border: '1px solid #121218' 
                                    }} 
                                    isConnectable={isConnectable} 
                                />
                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{input}</span>
                            </div>
                        ))}
                    </div>

                    {/* Params (Expandable) */}
                    {expanded && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/5 space-y-1 animate-in fade-in slide-in-from-top-1">
                            {data.params ? (
                                Object.entries(data.params).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex justify-between items-center bg-gray-50 dark:bg-black/40 px-2 py-1 rounded border border-gray-200 dark:border-white/5">
                                        <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono uppercase">{key}</span>
                                        <span className="text-[9px] text-purple-600 dark:text-cyber-neon font-bold font-mono">{value}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-[9px] text-gray-400 italic">No params.</div>
                            )}
                        </div>
                    )}

                    {/* OUTPUT (Right Side - Single Flow Handler) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                         <Handle 
                            type="source" 
                            position={Position.Right} 
                            style={{ 
                                right: -6, 
                                width: '10px', 
                                height: '10px', 
                                background: '#00f3ff',
                                boxShadow: '0 0 5px #00f3ff',
                                border: '1px solid #121218'
                            }} 
                            isConnectable={isConnectable} 
                        />
                    </div>
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
        inputs: ['Oracle Feed'],
        params: { asset: 'ETH/USDC', condition: 'Price < $2800' } 
    }, 
    position: { x: 100, y: 150 },
  },
  { 
    id: '2', 
    type: 'cyber', 
    data: { 
        label: 'LOGIC: AI FILTER', 
        inputs: ['Trigger Data', 'Market Sentiment'],
        params: { model: 'Gemini 2.5', prompt: 'Volatility Check' } 
    }, 
    position: { x: 500, y: 150 },
  },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00f3ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00f3ff' } }
];

export const Studio: React.FC = () => {
    return (
        <ReactFlowProvider>
            <StudioContent />
        </ReactFlowProvider>
    );
};

interface ExecutionRecord {
    id: number;
    timestamp: string;
    type: 'success' | 'skip' | 'error' | 'audit';
    message: string;
    yield?: number;
    gas?: number;
}

const StudioContent: React.FC = () => {
  const nodeTypes = useMemo(() => ({ cyber: CyberNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('Alpha Arbitrage Strategy');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'build' | 'run'>('build');
  
  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [executionInterval, setExecutionInterval] = useState(2000); // ms
  const [currentLog, setCurrentLog] = useState<string[]>([]); // Detailed logs for the terminal
  const [history, setHistory] = useState<ExecutionRecord[]>([]); // Structured history
  const [stats, setStats] = useState({ yield: 12.42, loops: 1420, gas: 14 });
  const logsEndRef = useRef<HTMLDivElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  
  // React Flow DND hooks
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#00f3ff' } }, eds)), [setEdges]);

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
        data: { label: label, inputs: inputs, params: { status: 'New' } },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
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

        interval = setInterval(() => {
            // Random events simulation
            const eventType = Math.random();
            const cycleId = Math.floor(Math.random() * 10000);
            
            if (eventType > 0.85) {
                const yieldGain = Math.random() * 0.05;
                setStats(s => ({ ...s, yield: s.yield + yieldGain, loops: s.loops + 1 }));
                addHistory('success', `Cycle #${cycleId}: Opportunity Executed`, yieldGain, 24);
                setCurrentLog(prev => [...prev, `[EXEC] Cycle #${cycleId}: Swapping on Curve... (+${yieldGain.toFixed(3)}%)`]);
            } else if (eventType > 0.7) {
                 setStats(s => ({ ...s, loops: s.loops + 1, gas: Math.floor(10 + Math.random() * 5) }));
                 addHistory('skip', `Cycle #${cycleId}: No arb found`, undefined, 12);
                 setCurrentLog(prev => [...prev, `[SCAN] Cycle #${cycleId}: Block scanned. No arbitrage.`]);
            } else {
                 // Silent check
                 setCurrentLog(prev => [...prev, `[WAIT] Pending next block...`]);
            }
            
            // Limit live logs
            setCurrentLog(prev => prev.slice(-50));

        }, executionInterval);
    }
    return () => clearInterval(interval);
  }, [isRunning, executionInterval]);

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
        } else {
             setCurrentLog(prev => [...prev, `[PASS] Syntax Clean. All nodes connected. Gas Optimized.`]);
             addHistory('audit', `Security Audit Passed`, 0, 0);
        }
    }, 800);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-white dark:bg-[#080808]">
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

                        {/* Section: Triggers */}
                        <div>
                            <h4 className="text-xs font-bold text-purple-600 dark:text-cyber-neon uppercase mb-4 flex items-center gap-2 bg-purple-50 dark:bg-cyber-neon/10 p-2 rounded border border-purple-100 dark:border-cyber-neon/20">
                                <Zap size={14} /> Triggers
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="Trigger: Price" inputs={['Oracle']} description="Execute on price target." />
                                <DraggableNode type="cyber" label="Trigger: Time" inputs={['Cron']} description="Execute at intervals." />
                                <DraggableNode type="cyber" label="Trigger: Event" inputs={['Log']} description="On-chain event listener." />
                                <DraggableNode type="cyber" label="Trigger: Mempool" inputs={['Stream']} description="Watch pending txs." />
                            </div>
                        </div>

                        {/* Section: Logic */}
                        <div>
                            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 p-2 rounded border border-blue-100 dark:border-blue-500/20">
                                <BrainCircuit size={14} /> Intelligence
                            </h4>
                            <div className="space-y-3 pl-1">
                                <DraggableNode type="cyber" label="Logic: Gemini AI" inputs={['Prompt', 'Context']} description="AI reasoning engine." />
                                <DraggableNode type="cyber" label="Logic: Condition" inputs={['Value A', 'Value B']} description="If/Else logic block." />
                                <DraggableNode type="cyber" label="Logic: Filter" inputs={['List']} description="Filter dataset." />
                            </div>
                        </div>

                         {/* Section: Actions */}
                         <div>
                            <h4 className="text-xs font-bold text-pink-600 dark:text-cyber-pink uppercase mb-4 flex items-center gap-2 bg-pink-50 dark:bg-cyber-pink/10 p-2 rounded border border-pink-100 dark:border-cyber-pink/20">
                                <Activity size={14} /> Actions
                            </h4>
                            <div className="space-y-3 pl-1">
                                 <DraggableNode type="cyber" label="Action: Swap" inputs={['Token In', 'Route']} description="DEX swap execution." />
                                 <DraggableNode type="cyber" label="Action: Stake" inputs={['Token', 'Vault']} description="Deposit to yield vault." />
                                 <DraggableNode type="cyber" label="Action: Flash" inputs={['Amount']} description="Borrow flash loan." />
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
                                 >
                                     {isRunning ? <StopCircle size={14} /> : <PlayCircle size={14} />}
                                     {isRunning ? 'Stop' : 'Start'}
                                 </button>
                                 <button 
                                    onClick={handleSyntaxCheck}
                                    className="h-9 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-cyber-neon transition-all"
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
                                <button onClick={() => setCurrentLog([])} className="hover:text-white"><RefreshCw size={10} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 text-gray-300 space-y-1">
                                {currentLog.length === 0 && <span className="text-gray-600 italic">Ready for commands...</span>}
                                {currentLog.map((log, i) => (
                                    <div key={i} className={`${log.includes('[EXEC]') ? 'text-cyber-neon' : log.includes('[SYSTEM]') ? 'text-yellow-500' : log.includes('[WARN]') ? 'text-orange-500' : log.includes('[PASS]') ? 'text-green-500' : 'text-gray-400'}`}>
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
                <div className="bg-white/90 dark:bg-cyber-panel/90 backdrop-blur-md p-2 rounded border border-gray-200 dark:border-white/10 shadow-lg pointer-events-auto flex items-center gap-3">
                    <div className="p-1.5 bg-purple-100 dark:bg-cyber-neon/20 rounded">
                        <TerminalSquare size={16} className="text-purple-600 dark:text-cyber-neon" />
                    </div>
                    {isEditingName ? (
                        <input 
                            type="text" 
                            value={flowName} 
                            onChange={(e) => setFlowName(e.target.value)}
                            onBlur={() => setIsEditingName(false)}
                            autoFocus
                            className="bg-transparent border-b border-purple-500 dark:border-cyber-neon text-gray-900 dark:text-white px-2 py-0.5 text-sm font-bold outline-none w-48"
                        />
                    ) : (
                        <h1 
                            className="text-sm font-bold text-gray-900 dark:text-white tracking-wide cursor-pointer hover:text-purple-600 dark:hover:text-cyber-neon flex items-center gap-2"
                            onClick={() => setIsEditingName(true)}
                        >
                            {flowName}
                            <Edit2 size={12} className="opacity-50" />
                        </h1>
                    )}
                </div>

                {/* Vault Widget (Right) */}
                <div className="pointer-events-auto">
                    <VaultWidget />
                </div>
            </div>

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
        </div>

        {/* 3. RIGHT SIDEBAR: CHAT ONLY (w-96) */}
        <div className="w-96 bg-white dark:bg-[#0a0a0f] border-l border-gray-200 dark:border-white/5 flex flex-col z-20 shadow-2xl shrink-0">
            {/* Chat Interface (Fills entire Right Sidebar now) */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                 <ChatInterface setNodes={setNodes} setEdges={setEdges} />
            </div>
        </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const DraggableNode = ({ type, label, inputs, description }: { type: string, label: string, inputs: string[], description: string }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.setData('application/label', label);
      event.dataTransfer.setData('application/inputs', JSON.stringify(inputs));
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

const ChatInterface = ({ setNodes, setEdges }: { setNodes: any, setEdges: any }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat History State
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
      { id: 's1', title: 'Arbitrage Scanner Setup', timestamp: Date.now() - 3600000, messages: [] },
      { id: 's2', title: 'Yield Farm Optimization', timestamp: Date.now() - 86400000, messages: [] }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

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
                const styledNodes = flowData.nodes.map((n: Node) => ({
                    ...n,
                    type: 'cyber',
                    data: { ...n.data, inputs: n.data.inputs || [] }
                }));
                const styledEdges = flowData.edges.map((e: Edge) => ({
                    ...e,
                    animated: true,
                    style: { stroke: '#00f3ff', strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#00f3ff' }
                }));
                setNodes(styledNodes);
                setEdges(styledEdges);
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
                    >
                        <div className="p-2 bg-purple-500/10 rounded-md text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"><Zap size={14} /></div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-500">Flash Arbitrage</div>
                            <div className="text-[9px] text-gray-500 mt-0.5">Curve ETH/stETH • <span className="text-purple-500 font-mono">High Risk</span></div>
                        </div>
                    </button>
                </div>
            </div>

             <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left pl-1 flex items-center gap-1">
                    <Command size={10} /> Quick Actions
                </div>
                 <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                        onClick={() => handleSendMessage("Audit the current workflow for security vulnerabilities and logical errors")}
                        className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <ShieldCheck size={10} /> Audit Security
                    </button>
                     <button 
                        onClick={() => handleSendMessage("Analyze gas usage and suggest optimizations for this flow")}
                        className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <Search size={10} /> Optimize Gas
                    </button>
                 </div>
             </div>
         </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0c0c10]">
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
                                    <button onClick={createNewChat} className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-cyber-neon font-bold hover:underline">
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

             <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[9px] text-gray-500 font-mono">ONLINE</span>
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
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-flash-lite-latest">Gemini Flash Lite</option>
                            <option value="gemini-3-pro-preview">Gemini 3.0 Pro</option>
                        </select>
                        <ChevronDown size={8} className="absolute right-0 top-1.5 text-gray-500 pointer-events-none" />
                    </div>
                </div>
                {messages.length > 0 && (
                    <button className="text-[9px] text-gray-400 hover:text-red-500" onClick={() => setMessages([])}>CLEAR CHAT</button>
                )}
            </div>
        </div>
    </div>
  );
};