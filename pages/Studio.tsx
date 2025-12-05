
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
} from 'reactflow';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { 
    Sparkles, Send, TerminalSquare, Edit2, Zap, BrainCircuit, 
    ChevronDown, ChevronRight, PlayCircle, CheckCircle2, ArrowRight, Activity, MousePointer2,
    Command, StopCircle, RefreshCw,
    Shield, History, Play, Gauge,
    TrendingUp, ShieldCheck, Search, Plus, Network,
    Cpu, Layers, Code, Play as PlayIcon
} from 'lucide-react';
import { VaultWidget } from '../components/VaultWidget';
import { LogModal } from '../components/LogModal';

// --- CUSTOM NODE COMPONENT ---
// Defined outside to prevent re-creation on render
const CyberNode = ({ id, data, isConnectable }: any) => {
    const [expanded, setExpanded] = useState(true);
    
    const getCategoryStyles = () => {
        const label = data.label?.toLowerCase() || '';
        
        if (label.includes('trigger')) {
            return {
                border: 'border-yellow-500/50 hover:border-yellow-400',
                bg: 'bg-[#1a180e]', 
                header: 'bg-yellow-500/10',
                text: 'text-yellow-500',
                shadow: 'shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.5)]',
                handle: '#eab308',
                icon: <Zap size={12} />
            };
        } else if (label.includes('action')) {
             return {
                border: 'border-pink-500/50 hover:border-pink-400',
                bg: 'bg-[#1a0e14]', 
                header: 'bg-pink-500/10',
                text: 'text-pink-500',
                shadow: 'shadow-[0_0_15px_-5px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_-5px_rgba(236,72,153,0.5)]',
                handle: '#ec4899',
                icon: <Activity size={12} />
            };
        } else if (label.includes('ai') || label.includes('gemini') || label.includes('model')) {
             return {
                border: 'border-purple-500/50 hover:border-purple-400',
                bg: 'bg-[#140e1a]', 
                header: 'bg-purple-500/10',
                text: 'text-purple-400',
                shadow: 'shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]',
                handle: '#a855f7',
                icon: <BrainCircuit size={12} />
            };
        } else {
             return {
                border: 'border-cyan-500/50 hover:border-cyan-400',
                bg: 'bg-[#0e161a]',
                header: 'bg-cyan-500/10',
                text: 'text-cyan-400',
                shadow: 'shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]',
                handle: '#06b6d4',
                icon: <Network size={12} />
            };
        }
    };

    const styles = getCategoryStyles();
    const status = data.status || 'idle'; 

    const handleStatusClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop ReactFlow from capturing the click
        // Dispatch custom event to parent
        const event = new CustomEvent('OPEN_LOG_MODAL', { 
            detail: { id, label: data.label, status } 
        });
        window.dispatchEvent(event);
    };

    const getStatusColor = () => {
        switch(status) {
            case 'running': return 'text-yellow-500 animate-pulse';
            case 'success': return 'text-green-500';
            case 'failed': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className={`relative min-w-[240px] rounded-lg transition-all duration-300 bg-[#0a0a0f] border-2 ${styles.border} ${styles.shadow}`}>
            
            <div className="p-0 overflow-hidden flex flex-col">
                {/* Header */}
                <div className={`p-2.5 flex items-center justify-between border-b border-white/5 ${styles.header}`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-1 rounded bg-black/40 ${styles.text}`}>
                           {styles.icon}
                        </div>
                        <span className={`text-xs font-bold font-sans uppercase tracking-wider ${styles.text}`}>
                            {data.label}
                        </span>
                    </div>
                    
                    {/* Status Pill - Clickable */}
                    <button 
                        onClick={handleStatusClick}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer group z-50"
                        title="View Execution Logs"
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-yellow-500 animate-pulse' : status === 'success' ? 'bg-green-500' : status === 'failed' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                        <span className={`text-[9px] font-bold uppercase ${getStatusColor()}`}>
                            {status === 'running' ? 'Running' : status}
                        </span>
                        <TerminalSquare size={10} className="text-gray-500 group-hover:text-white transition-colors" />
                    </button>
                </div>
                
                {/* Body */}
                <div className={`relative p-3 ${styles.bg}`}>
                    {/* Expand Toggle */}
                    <button 
                        onClick={() => setExpanded(!expanded)} 
                        className="absolute top-2 right-2 text-gray-600 hover:text-white transition-colors z-10" 
                    >
                        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>

                    {/* INPUTS (Left Side) */}
                    <div className="space-y-4 mb-2">
                        {data.inputs && data.inputs.map((input: string, index: number) => (
                            <div key={index} className="relative flex items-center h-4">
                                <Handle 
                                    type="target" 
                                    position={Position.Left} 
                                    id={`input-${index}`}
                                    style={{ 
                                        left: -16, 
                                        width: '8px', 
                                        height: '8px', 
                                        background: styles.handle,
                                        border: '1px solid #121218',
                                        borderRadius: '2px'
                                    }} 
                                    isConnectable={isConnectable} 
                                />
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider ml-1">{input}</span>
                            </div>
                        ))}
                    </div>

                    {/* Params (Expandable) */}
                    {expanded && (
                        <div className="mt-4 pt-2 border-t border-white/5 space-y-2 animate-in fade-in slide-in-from-top-1">
                            {data.params ? (
                                Object.entries(data.params).map(([key, value]: [string, any]) => {
                                    if (key === 'status') return null;
                                    return (
                                        <div key={key} className="flex justify-between items-center bg-black/40 px-2 py-1.5 rounded border border-white/5">
                                            <span className="text-[9px] text-gray-500 font-mono uppercase">{key}</span>
                                            <span className={`text-[9px] font-bold font-mono ${styles.text} truncate max-w-[120px]`}>{value}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-[9px] text-gray-500 italic">No params.</div>
                            )}
                        </div>
                    )}

                    {/* OUTPUT (Right Side) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                         <Handle 
                            type="source" 
                            position={Position.Right} 
                            style={{ 
                                right: -10, 
                                width: '10px', 
                                height: '10px', 
                                background: styles.handle,
                                boxShadow: `0 0 8px ${styles.handle}`,
                                border: '1px solid #121218',
                                borderRadius: '2px'
                            }} 
                            isConnectable={isConnectable} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};


// Initial Nodes
const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'cyber', 
    data: { 
        label: 'TRIGGER: PRICE', 
        inputs: ['Oracle Feed'],
        status: 'success',
        params: { asset: 'ETH/USDC', condition: 'Price < $2800' } 
    }, 
    position: { x: 100, y: 150 },
  },
  { 
    id: '2', 
    type: 'cyber', 
    data: { 
        label: 'AI: GEMINI FLASH', 
        inputs: ['Trigger Data'],
        status: 'idle',
        params: { model: 'Gemini 2.5', prompt: 'Volatility Check' } 
    }, 
    position: { x: 500, y: 150 },
  },
  { 
    id: '3', 
    type: 'cyber', 
    data: { 
        label: 'ACTION: SWAP', 
        inputs: ['Decision'],
        status: 'idle',
        params: { route: 'Uniswap V3', slip: '0.5%' } 
    }, 
    position: { x: 900, y: 150 },
  },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } }
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
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  
  // Execution State
  const [activeTab, setActiveTab] = useState<'build' | 'run'>('build');
  const [isRunning, setIsRunning] = useState(false);
  const [executionInterval, setExecutionInterval] = useState(2000); 
  const [currentLog, setCurrentLog] = useState<string[]>([]);
  const [history, setHistory] = useState<ExecutionRecord[]>([]);
  const [stats, setStats] = useState({ yield: 12.42, loops: 1420, gas: 14 });
  
  // Logic for Vault Highlight
  const [isActionActive, setIsActionActive] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Handle Opening the Log Modal via Event (Fixes React State Loops)
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
        const customEvent = e as CustomEvent;
        const { label, status } = customEvent.detail;
        
        // Mock Logs Generator
        const now = new Date();
        const startTime = new Date(now.getTime() - 10000).toLocaleString(); // 10s ago
        const endTime = status === 'success' || status === 'failed' ? now.toLocaleString() : undefined;

        const mockLogs = [
            { id: 1, type: 'INFO', message: `Initializing ${label} sequence...`, timestamp: new Date(now.getTime() - 9000).toLocaleTimeString() },
            { id: 2, type: 'INFO', message: `Checking wallet permissions for 0x71...38a`, timestamp: new Date(now.getTime() - 8500).toLocaleTimeString() },
            { id: 3, type: 'INFO', message: `Loading context parameters: { asset: 'ETH', chain: 'BASE' }`, timestamp: new Date(now.getTime() - 8000).toLocaleTimeString() },
        ];

        if (status === 'success') {
            mockLogs.push({ id: 4, type: 'INFO', message: `Execution completed successfully.`, timestamp: now.toLocaleTimeString() });
            if (label.includes('ACTION')) {
                 mockLogs.push({ id: 5, type: 'INFO', message: `TxHash: 0x3d...22a (Confirmed in block 192341)`, timestamp: now.toLocaleTimeString() });
            }
        } else if (status === 'failed') {
            mockLogs.push({ id: 4, type: 'ERROR', message: `RPC Timeout: Execution reverted.`, timestamp: now.toLocaleTimeString() });
        } else if (status === 'running') {
            mockLogs.push({ id: 4, type: 'WARN', message: `Awaiting block confirmation...`, timestamp: now.toLocaleTimeString() });
        } else {
             mockLogs.push({ id: 4, type: 'INFO', message: `Node is idle. Waiting for trigger.`, timestamp: now.toLocaleTimeString() });
        }

        setSelectedNodeData({
            label,
            status,
            logs: mockLogs,
            startTime,
            endTime
        });
        setModalOpen(true);
    };

    window.addEventListener('OPEN_LOG_MODAL', handleOpenModal);
    return () => window.removeEventListener('OPEN_LOG_MODAL', handleOpenModal);
  }, []);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#00f3ff' } }, eds)), [setEdges]);

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
        data: { 
            label: label, 
            inputs: inputs, 
            status: 'idle', 
            params: { status: 'New' }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // --- SIMULATION ENGINE ---
  useEffect(() => {
    let interval: any;
    if (isRunning) {
        if (activeTab !== 'run') setActiveTab('run');
        
        // Sequence Start
        setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'running'}})));
        setIsActionActive(true); 

        interval = setInterval(() => {
            const eventType = Math.random();
            const cycleId = Math.floor(Math.random() * 10000);
            
            if (eventType > 0.8) {
                // Success Scenario
                const yieldGain = Math.random() * 0.05;
                setStats(s => ({ ...s, yield: s.yield + yieldGain, loops: s.loops + 1 }));
                
                // Update Nodes status
                setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'success'}})));
                
                // Highlight Action Nodes
                setIsActionActive(true);
                setTimeout(() => setIsActionActive(false), 2000); 

                setCurrentLog(prev => [...prev, `[EXEC] Cycle #${cycleId}: Opportunity captured (+${yieldGain.toFixed(3)}%)`]);

            } else if (eventType > 0.6) {
                 // Skip Scenario
                 setStats(s => ({ ...s, loops: s.loops + 1 }));
                 setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'idle'}})));
                 setIsActionActive(false);
                 setCurrentLog(prev => [...prev, `[SCAN] Cycle #${cycleId}: No alpha found.`]);
            } else {
                 // Wait Scenario
                 setCurrentLog(prev => [...prev, `[WAIT] Pending block...`]);
            }
            
            setCurrentLog(prev => prev.slice(-20)); // Keep console clean

        }, executionInterval);
    } else {
        // Reset when stopped
        setNodes((nds) => nds.map(n => ({...n, data: {...n.data, status: 'idle'}})));
        setIsActionActive(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, executionInterval, setNodes]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentLog]);

  const toggleExecution = () => setIsRunning(!isRunning);

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-white dark:bg-[#080808]">
        
        {/* LOG MODAL */}
        {selectedNodeData && (
            <LogModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                nodeLabel={selectedNodeData.label}
                status={selectedNodeData.status}
                startTime={selectedNodeData.startTime}
                endTime={selectedNodeData.endTime}
                logs={selectedNodeData.logs}
            />
        )}

        {/* LEFT SIDEBAR */}
        <div className="flex w-80 z-20 shadow-xl bg-white dark:bg-[#0a0a0f] border-r border-gray-200 dark:border-white/5 shrink-0">
             
             {/* NAV STRIP */}
             <div className="w-12 bg-gray-100 dark:bg-black/40 border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-4 gap-4 shrink-0">
                 <button 
                    onClick={() => setActiveTab('build')}
                    className={`p-2 rounded transition-all ${activeTab === 'build' ? 'bg-white dark:bg-white/10 text-purple-600 dark:text-cyber-neon shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                 >
                     <Layers size={20} />
                 </button>
                 <button 
                    onClick={() => setActiveTab('run')}
                    className={`p-2 rounded transition-all ${activeTab === 'run' ? 'bg-white dark:bg-white/10 text-green-500 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                 >
                     <PlayIcon size={20} />
                 </button>
             </div>

             {/* CONTENT PANEL */}
             <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0c0c10]">
                 
                 {/* BUILD MODE */}
                 {activeTab === 'build' && (
                     <div className="flex-1 overflow-y-auto p-4 space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="pb-2 border-b border-gray-200 dark:border-white/5">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Node Library</h2>
                        </div>

                        {/* Yellow: Triggers */}
                        <div>
                            <h4 className="text-[10px] font-bold text-yellow-500 uppercase mb-2 pl-1">Triggers</h4>
                            <div className="space-y-2">
                                <DraggableNode type="cyber" label="Trigger: Price" inputs={['Oracle']} description="Execute on price target." color="yellow" />
                                <DraggableNode type="cyber" label="Trigger: Event" inputs={['Log']} description="On-chain event listener." color="yellow" />
                            </div>
                        </div>

                         {/* Cyan: Logic */}
                        <div>
                            <h4 className="text-[10px] font-bold text-cyan-400 uppercase mb-2 pl-1">Logic</h4>
                            <div className="space-y-2">
                                <DraggableNode type="cyber" label="Logic: Condition" inputs={['A', 'B']} description="If/Else logic block." color="cyan" />
                                <DraggableNode type="cyber" label="Logic: Filter" inputs={['List']} description="Filter dataset." color="cyan" />
                            </div>
                        </div>

                        {/* Purple: AI */}
                        <div>
                            <h4 className="text-[10px] font-bold text-purple-400 uppercase mb-2 pl-1">AI Models</h4>
                            <div className="space-y-2">
                                <DraggableNode type="cyber" label="AI: Gemini Flash" inputs={['Context']} description="Fast reasoning model." color="purple" />
                                <DraggableNode type="cyber" label="AI: Sentiment" inputs={['Text']} description="Analyze market mood." color="purple" />
                            </div>
                        </div>

                         {/* Pink: Actions */}
                         <div>
                            <h4 className="text-[10px] font-bold text-pink-500 uppercase mb-2 pl-1">Execution</h4>
                            <div className="space-y-2">
                                 <DraggableNode type="cyber" label="Action: Swap" inputs={['Token In']} description="DEX swap execution." color="pink" />
                                 <DraggableNode type="cyber" label="Action: Stake" inputs={['Token']} description="Deposit to vault." color="pink" />
                            </div>
                        </div>
                     </div>
                 )}

                 {/* RUN MODE */}
                 {activeTab === 'run' && (
                     <div className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-left-2 duration-300">
                         {/* Control Deck */}
                         <div className="p-4 bg-white dark:bg-[#121218] border-b border-gray-200 dark:border-white/5 shadow-md z-10 flex flex-col gap-4">
                             
                             {/* LCD Display */}
                             <div className="bg-black/90 p-3 rounded-md border border-gray-200 dark:border-white/10 relative overflow-hidden shadow-inner">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1"><Gauge size={10} /> Yield</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                </div>
                                <div className="text-2xl font-mono font-bold text-green-500 tracking-tighter">
                                    ${stats.yield.toFixed(4)}
                                </div>
                             </div>

                             {/* Action Buttons */}
                             <div className="grid grid-cols-2 gap-2">
                                 <button 
                                    onClick={toggleExecution}
                                    className={`h-8 rounded font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all border ${
                                        isRunning 
                                        ? 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20' 
                                        : 'bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20'
                                    }`}
                                 >
                                     {isRunning ? <StopCircle size={12} /> : <PlayCircle size={12} />}
                                     {isRunning ? 'Stop' : 'Run'}
                                 </button>
                                 <div className="flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded border border-transparent dark:border-white/10">
                                     <span className="text-[10px] font-mono text-gray-500">{executionInterval/1000}s/block</span>
                                 </div>
                             </div>
                         </div>

                         {/* Console */}
                         <div className="h-full bg-black border-t border-gray-800 flex flex-col font-mono text-[10px] shrink-0">
                            <div className="px-3 py-1 bg-[#1a1a20] border-b border-gray-800 flex justify-between items-center text-gray-500">
                                <span className="uppercase flex items-center gap-2"><TerminalSquare size={10} /> Output</span>
                                <button onClick={() => setCurrentLog([])} className="hover:text-white"><RefreshCw size={10} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 text-gray-300 space-y-1">
                                {currentLog.map((log, i) => (
                                    <div key={i} className={`${log.includes('[EXEC]') ? 'text-green-400' : log.includes('[SCAN]') ? 'text-gray-500' : 'text-gray-400'}`}>
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

        {/* MIDDLE: CANVAS */}
        <div className="flex-1 h-full relative flex flex-col bg-white dark:bg-[#080808]" ref={reactFlowWrapper}>
            <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
                <div className="bg-white/90 dark:bg-[#121218]/90 backdrop-blur-md p-2 rounded border border-gray-200 dark:border-white/10 shadow-lg pointer-events-auto flex items-center gap-3">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
                        <Cpu size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    {isEditingName ? (
                        <input 
                            type="text" 
                            value={flowName} 
                            onChange={(e) => setFlowName(e.target.value)}
                            onBlur={() => setIsEditingName(false)}
                            autoFocus
                            className="bg-transparent border-b border-purple-500 text-gray-900 dark:text-white px-2 py-0.5 text-sm font-bold outline-none w-48"
                        />
                    ) : (
                        <h1 
                            className="text-sm font-bold text-gray-900 dark:text-white tracking-wide cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2"
                            onClick={() => setIsEditingName(true)}
                        >
                            {flowName}
                            <Edit2 size={12} className="opacity-50" />
                        </h1>
                    )}
                </div>

                {/* VAULT WIDGET - HIGHLIGHTS WHEN ACTIONS RUN */}
                <div className="pointer-events-auto transition-transform duration-300">
                    <VaultWidget needsAttention={isActionActive} />
                </div>
            </div>

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
                <Background color="#555" gap={24} className="opacity-10" />
                <Controls className="dark:bg-black dark:border-white/10 dark:fill-white" />
                <MiniMap 
                    nodeColor={() => '#333'} 
                    maskColor="rgba(0,0,0,0.8)" 
                    className="bg-white dark:bg-[#121218] border border-gray-200 dark:border-white/10" 
                />
            </ReactFlow>
        </div>

        {/* RIGHT SIDEBAR: CHAT */}
        <div className="w-96 bg-white dark:bg-[#0a0a0f] border-l border-gray-200 dark:border-white/5 flex flex-col z-20 shadow-2xl shrink-0">
             <ChatInterface setNodes={setNodes} setEdges={setEdges} />
        </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const DraggableNode = ({ type, label, inputs, description, color }: any) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.setData('application/label', label);
      event.dataTransfer.setData('application/inputs', JSON.stringify(inputs));
      event.dataTransfer.effectAllowed = 'move';
    };

    const colors: any = {
        yellow: 'border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/5',
        cyan: 'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5',
        purple: 'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5',
        pink: 'border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-500/5',
    }
  
    return (
      <div 
        className={`bg-white dark:bg-[#121218] border ${colors[color]} p-3 rounded cursor-grab transition-all group shadow-sm flex items-center justify-between`}
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
        <div>
            <div className="text-xs font-bold text-gray-800 dark:text-white">{label}</div>
            <div className="text-[9px] text-gray-500 mt-0.5">{description}</div>
        </div>
        <MousePointer2 size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
};

const ChatInterface = ({ setNodes, setEdges }: { setNodes: any, setEdges: any }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if(!input.trim()) return;
        const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
        setMessages(p => [...p, newMsg]);
        setInput('');
        setIsLoading(true);
        try {
            const res = await geminiService.chat(input, []);
            setMessages(p => [...p, { id: Date.now().toString(), role: 'model', text: res, timestamp: Date.now() }]);
        } catch(e) { console.error(e); } 
        setIsLoading(false);
    };

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0c0c10]">
            <div className="p-3 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#121218] flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-500" /> AI Assistant
                </span>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] text-gray-500 font-mono">ONLINE</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="text-center mt-20 opacity-50">
                        <BrainCircuit size={48} className="mx-auto text-purple-500 mb-4" />
                        <h3 className="text-sm font-bold text-white">Trading Architect</h3>
                        <p className="text-xs text-gray-500 mt-2">Ask me to build a strategy.</p>
                    </div>
                )}
                {messages.map(m => (
                    <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[90%] p-3 rounded-md text-xs font-mono leading-relaxed ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-[#1a1a20] text-gray-300 border border-white/10'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-[10px] text-purple-500 animate-pulse px-2">THINKING...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 bg-white dark:bg-[#121218] border-t border-gray-200 dark:border-white/10 relative">
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a command..."
                    className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 text-white pl-3 pr-10 py-3 text-xs outline-none focus:border-purple-500 rounded-sm font-mono"
                />
                <button onClick={handleSendMessage} className="absolute right-5 top-5 text-purple-500 hover:text-white"><Send size={14} /></button>
            </div>
        </div>
    );
};
