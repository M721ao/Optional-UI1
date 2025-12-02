import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Sparkles, Send, Save, PlayCircle, Code, Cpu } from 'lucide-react';

export const Studio: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: 'NeonAI Protocol initialized. Ready to assist with flow logic and smart contract auditing.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(`// Trigger: When ETH price drops > 5%
// Action: Swap 50% holdings to USDC
// Protocol: Uniswap V3

function executeFlow(context) {
    const ethPrice = context.oracle.getPrice('ETH');
    const prevPrice = context.store.get('prevPrice');
    
    if ((prevPrice - ethPrice) / prevPrice > 0.05) {
       return {
           action: 'SWAP',
           tokenIn: 'ETH',
           tokenOut: 'USDC',
           amount: '50%'
       };
    }
    return null;
}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      // Add code context if specifically asked about code
      let prompt = input;
      if (input.toLowerCase().includes('code') || input.toLowerCase().includes('audit') || input.toLowerCase().includes('fix')) {
         prompt = `${input}\n\nCurrent Editor Code:\n\`\`\`javascript\n${code}\n\`\`\``;
      }

      const responseText = await geminiService.chat(prompt, history);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // If response contains code block, optionally update editor (simplified for demo)
      // Real app would ask for confirmation or use a "diff" view
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden">
        {/* Left: Editor Area */}
        <div className="flex-1 flex flex-col border-r border-white/10 bg-[#0a0a0f]">
            <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-cyber-panel">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                    <Code size={14} />
                    <span>logic_controller.js</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/30 hover:bg-green-900/50 transition-colors uppercase">
                        <PlayCircle size={12} /> Test Run
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30 hover:bg-cyber-neon/20 transition-colors uppercase">
                        <Save size={12} /> Deploy
                    </button>
                </div>
            </div>
            <div className="flex-1 relative">
                <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-[#050505] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed selection:bg-cyber-purple selection:text-white"
                    spellCheck={false}
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono pointer-events-none">
                    Ln {code.split('\n').length}, Col {code.length}
                </div>
            </div>
        </div>

        {/* Right: AI Workbench */}
        <div className="w-full md:w-[450px] flex flex-col bg-cyber-black relative">
            <div className="h-12 border-b border-white/10 flex items-center px-4 bg-cyber-panel justify-between">
                <div className="flex items-center gap-2 text-cyber-neon font-bold uppercase text-sm tracking-wider">
                    <Sparkles size={14} /> NeonAI Assistant
                </div>
                <div className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] text-gray-500 font-mono">ONLINE</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div 
                            className={`max-w-[90%] p-3 rounded-sm text-sm font-mono leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-cyber-purple/20 border border-cyber-purple/50 text-white' 
                                : 'bg-gray-900 border border-gray-700 text-gray-300'
                            }`}
                        >
                            {/* Simple markdown parser for code blocks */}
                            {msg.text.split('```').map((part, index) => {
                                if (index % 2 === 1) {
                                    return <code key={index} className="block bg-black p-2 my-2 rounded text-xs text-green-400 whitespace-pre-wrap">{part}</code>;
                                }
                                return <span key={index}>{part}</span>;
                            })}
                        </div>
                        <span className="text-[10px] text-gray-600 mt-1 uppercase">{msg.role === 'user' ? 'Operator' : 'AI_Core'}</span>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-cyber-neon text-xs font-mono animate-pulse">
                        <Cpu size={12} className="animate-spin" />
                        PROCESSING...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-cyber-panel border-t border-white/10">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Command the AI (e.g., 'Audit this code')"
                        className="w-full bg-black/50 border border-gray-700 text-white pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50 placeholder-gray-600 font-mono"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyber-neon hover:bg-cyber-neon/10 rounded transition-colors disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};