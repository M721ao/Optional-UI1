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
    CheckCircle2, BoxSelect, Server, ArrowRight
} from 'lucide-react';
import { VaultWidget } from '../components/VaultWidget';

// --- CUSTOM NODE COMPONENT ---
// Inputs on Left, Single Output on Right
const CyberNode = ({ data, isConnectable }: any) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="gradient-border-wrapper min-w-[280px] shadow-xl hover:shadow-neon transition-shadow group">
            <div className="gradient-border-content p-0 overflow-hidden flex flex-col bg-white dark:bg-[#121218]">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-white/5 p-3 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-purple-100 dark:bg-cyber-neon/20">
                           <Settings size={14} className="text-purple-600 dark:text-cyber-neon" />
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-sans uppercase tracking-wider">{data.label}</span>
                    </div>
                    <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                </div>
                
                {/* Body */}
                <div className="relative p-3">
                    {/* INPUTS (Left Side) */}
                    <div className="space-y-4 mb-2">
                        {data.inputs && data.inputs.map((input: string, index: number) => (
                            <div key={index} className="relative flex items-center h-5">
                                <Handle 
                                    type="target" 
                                    position={Position.Left} 
                                    id={`input-${index}`}
                                    style={{ 
                                        left: -13, 
                                        width: '10px', 
                                        height: '10px', 
                                        background: '#bc13fe',
                                        border: '2px solid #121218' 
                                    }} 
                                    isConnectable={isConnectable} 
                                />
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{input}</span>
                            </div>
                        ))}
                        {(!data.inputs || data.inputs.length === 0) && (
                            <div className="text-[9px] text-gray-300 dark:text-gray-600 italic pl-1">No Inputs</div>
                        )}
                    </div>

                    {/* Params (Expandable) */}
                    {expanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/5 space-y-2 animate-in fade-in slide-in-from-top-1">
                            {data.params ? (
                                Object.entries(data.params).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex justify-between items-center bg-gray-50 dark:bg-black/40 p-1.5 rounded border border-gray-200 dark:border-white/5">
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase">{key}</span>
                                        <span className="text-[10px] text-purple-600 dark:text-cyber-neon font-bold font-mono">{value}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-[10px] text-gray-400 italic">No parameters configured.</div>
                            )}
                        </div>
                    )}

                    {/* OUTPUT (Right Side - Single Flow Handler) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                         <Handle 
                            type="source" 
                            position={Position.Right} 
                            style={{ 
                                right: -7, 
                                width: '12px', 
                                height: '12px', 
                                background: '#00f3ff',
                                boxShadow: '0 0 5px #00f3ff',
                                border: '2px solid #121218'
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
    position: { x: 100, y: 100 },
  },
  { 
    id: '2', 
    type: 'cyber', 
    data: { 
        label: 'LOGIC: AI FILTER', 
        inputs: ['Trigger Data', 'Market Sentiment'],
        params: { model: 'Gemini 2.5', prompt: 'Volatility Check' } 
    }, 
    position: { x: 500, y: 100 },
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

const StudioContent: React.FC = () => {
  const nodeTypes = useMemo(() => ({ cyber: CyberNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('Alpha Arbitrage Strategy');
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'console'>('chat');
  
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

      if (typeof type === 'undefined' || !type) {
        return;
      }

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

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-white dark:bg-[#080808]">
        {/* Left: React Flow Canvas */}
        <div className="flex-1 h-full relative border-r border-gray-200 dark:border-white/10" ref={reactFlowWrapper}>
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
            
            {/* Header */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-white/90 dark:bg-cyber-panel/90 backdrop-blur-md p-2 rounded border border-gray-200 dark:border-white/10 shadow-lg">
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
                        className="bg-transparent border-b border-purple-500 dark:border-cyber-neon text-gray-900 dark:text-white px-2 py-0.5 text-sm font-bold outline-none"
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
        </div>

        {/* Right: Polymorphic Sidebar */}
        <div className="w-full md:w-[420px] flex flex-col bg-white dark:bg-cyber-black border-l border-gray-200 dark:border-white/5 z-20 h-full shadow-2xl">
            
            {/* 1. Vault Header (Compact) */}
            <VaultWidget />

            {/* 2. Content Area (Scrollable) */}
            <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-[#0c0c10]">
                
                {/* TAB A: AI CHAT */}
                <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${activeTab === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                   <ChatInterface setNodes={setNodes} setEdges={setEdges} />
                </div>

                {/* TAB B: NODE LIBRARY */}
                <div className={`absolute inset-0 flex flex-col p-4 overflow-y-auto transition-opacity duration-300 ${activeTab === 'library' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BoxSelect size={14} /> Available Modules
                    </h3>
                    <div className="space-y-3">
                        <DraggableNode type="cyber" label="Trigger: Price" inputs={['Oracle']} description="Fires when asset hits price." />
                        <DraggableNode type="cyber" label="Trigger: Time" inputs={['Cron']} description="Fires at specific interval." />
                        <DraggableNode type="cyber" label="Logic: Gemini AI" inputs={['Prompt', 'Context']} description="Reasoning engine for decision." />
                        <DraggableNode type="cyber" label="Action: Swap" inputs={['Token In', 'Route']} description="Execute DEX trade." />
                        <DraggableNode type="cyber" label="Action: Stake" inputs={['Token', 'Vault']} description="Deposit into protocol." />
                    </div>
                </div>

                {/* TAB C: CONSOLE / EXECUTOR */}
                <div className={`absolute inset-0 flex flex-col p-0 transition-opacity duration-300 ${activeTab === 'console' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <ConsoleInterface />
                </div>

            </div>

            {/* 3. Bottom Tabs Navigation */}
            <div className="h-12 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-cyber-panel flex text-xs font-bold uppercase tracking-wider">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'bg-purple-50 dark:bg-white/5 text-purple-600 dark:text-cyber-neon border-t-2 border-purple-600 dark:border-cyber-neon' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                >
                    <Sparkles size={14} /> Architect
                </button>
                <button 
                    onClick={() => setActiveTab('library')}
                    className={`flex-1 flex items-center justify-center gap-2 transition-colors ${activeTab === 'library' ? 'bg-purple-50 dark:bg-white/5 text-purple-600 dark:text-cyber-neon border-t-2 border-purple-600 dark:border-cyber-neon' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                >
                    <Grid size={14} /> Library
                </button>
                <button 
                    onClick={() => setActiveTab('console')}
                    className={`flex-1 flex items-center justify-center gap-2 transition-colors ${activeTab === 'console' ? 'bg-purple-50 dark:bg-white/5 text-purple-600 dark:text-cyber-neon border-t-2 border-purple-600 dark:border-cyber-neon' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                >
                    <Server size={14} /> Executor
                </button>
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
        className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 p-3 rounded cursor-grab hover:border-purple-500 dark:hover:border-cyber-neon transition-colors group shadow-sm"
        onDragStart={(event) => onDragStart(event, type)}
        draggable
      >
        <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyber-neon">{label}</span>
            <Grid size={12} className="text-gray-400" />
        </div>
        <p className="text-[10px] text-gray-500">{description}</p>
      </div>
    );
};

const ConsoleInterface = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'CHECKING' | 'RUNNING' | 'SUCCESS'>('IDLE');

    const runFlow = () => {
        setIsRunning(true);
        setStatus('CHECKING');
        setLogs(prev => [...prev, `[SYSTEM] Initiating syntax check...`]);
        
        setTimeout(() => {
            setLogs(prev => [...prev, `[OK] Node connectivity verified.`]);
            setLogs(prev => [...prev, `[OK] Gas estimation: 14 Gwei`]);
            setStatus('RUNNING');
            
            setTimeout(() => {
                setLogs(prev => [...prev, `[EXEC] Trigger: Price condition met.`]);
                setLogs(prev => [...prev, `[EXEC] AI Logic: Confidence 94%.`]);
                setLogs(prev => [...prev, `[TX] Swap Executed: 0x8a...33f`]);
                setLogs(prev => [...prev, `[PROFIT] Yield Generated: +0.4%`]);
                setIsRunning(false);
                setStatus('SUCCESS');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-cyber-panel flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'IDLE' ? 'bg-gray-400' : status === 'SUCCESS' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    <span className="text-xs font-bold text-gray-700 dark:text-white uppercase">{status}</span>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500 dark:text-gray-300" title="Check Syntax">
                        <CheckCircle2 size={16} />
                    </button>
                    <button 
                        onClick={runFlow}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black text-xs font-bold uppercase rounded hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isRunning ? <RotateCw size={14} className="animate-spin" /> : <PlayCircle size={14} />}
                        Execute
                    </button>
                </div>
            </div>
            <div className="flex-1 bg-black p-4 font-mono text-[10px] text-gray-300 overflow-y-auto space-y-1">
                <div className="text-gray-500 mb-2">--- CONSOLE READY ---</div>
                {logs.map((log, i) => (
                    <div key={i} className="border-l-2 border-cyber-neon pl-2">{log}</div>
                ))}
            </div>
            {status === 'SUCCESS' && (
                <div className="p-4 bg-green-50 dark:bg-cyber-green/10 border-t border-green-200 dark:border-cyber-green/20">
                    <div className="text-xs text-green-800 dark:text-cyber-green font-bold">ESTIMATED YIELD</div>
                    <div className="text-2xl font-mono text-green-600 dark:text-cyber-green font-bold">+12.4% APY</div>
                </div>
            )}
        </div>
    );
};

const ChatInterface = ({ setNodes, setEdges }: { setNodes: any, setEdges: any }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: 'NeonAI Protocol active. Describe a trading strategy.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const responseText = await geminiService.chat(input, history);
      
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
                finalText = "Workflow generated. Check the canvas.";
            }
        } catch (e) { console.error(e); }
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: finalText, timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
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

  return (
    <div className="flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50 dark:bg-[#0c0c10]">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-md text-sm font-mono leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-purple-600 dark:bg-cyber-purple/20 border border-purple-500 dark:border-cyber-purple/40 text-white dark:text-gray-100' 
                        : 'bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                    }`}>
                        {msg.text.split('```').map((part, index) => (
                             index % 2 === 1 
                                ? <pre key={index} className="text-[10px] bg-black text-green-400 p-2 mt-2 overflow-x-auto rounded">{part}</pre>
                                : <span key={index}>{part}</span>
                        ))}
                    </div>
                </div>
            ))}
            {isLoading && <div className="text-xs text-purple-500 dark:text-cyber-neon animate-pulse px-4">NEON_AI THINKING...</div>}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-cyber-panel border-t border-gray-200 dark:border-white/10">
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe a strategy..."
                    className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white pl-3 pr-10 py-3 text-sm focus:outline-none focus:border-purple-500 dark:focus:border-cyber-neon font-mono resize-none rounded-sm"
                    rows={2}
                />
                <button onClick={handleSendMessage} disabled={isLoading} className="absolute right-2 bottom-2.5 p-1.5 text-purple-600 dark:text-cyber-neon hover:bg-purple-100 dark:hover:bg-cyber-neon/10 rounded">
                    <Send size={16} />
                </button>
            </div>
        </div>
    </div>
  );
};