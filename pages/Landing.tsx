
import React from 'react';
import { Page } from '../types';
import { 
  ArrowRight, 
  Brain, 
  Layers, 
  Shield, 
  Copy, 
  Activity, 
  Zap, 
  Cpu, 
  Code2, 
  ArrowRightLeft, 
  Lock,
  Workflow,
  Twitter,
  Github,
  Linkedin,
  Disc
} from 'lucide-react';

interface LandingProps {
  onNavigate: (page: Page) => void;
  onTestError?: () => void;
  onTestCrash?: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden relative bg-gray-50 dark:bg-[#030305] selection:bg-cyber-neon selection:text-black transition-colors duration-300 scroll-smooth">
        
        {/* === GLOBAL AMBIENT LAYER === */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
             {/* Top Left - Purple Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-500/20 dark:bg-cyber-purple/10 rounded-full blur-[120px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen"></div>
            {/* Top Right - Cyan Glow */}
            <div className="absolute top-[10%] right-[-20%] w-[1000px] h-[1000px] bg-cyan-400/20 dark:bg-cyber-neon/5 rounded-full blur-[100px] opacity-20 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"></div>
        </div>

        {/* I. HERO SECTION */}
        <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-4 md:px-0 text-center min-h-[90vh] border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#030305]">
            {/* Perspective Grid Background specific to Hero */}
            <div className="absolute inset-0 pointer-events-none perspective-container z-[-1] opacity-30 dark:opacity-60">
                <div className="moving-grid"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-[#030305]"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute top-20 left-20 w-1.5 h-1.5 bg-purple-600 dark:bg-cyber-neon rounded-full blur-[1px] animate-float opacity-70"></div>
            <div className="absolute bottom-40 right-40 w-2 h-2 bg-pink-500 dark:bg-cyber-purple rounded-full blur-[2px] animate-float opacity-50 delay-1000"></div>

            {/* H1 Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-gray-900 dark:text-white uppercase leading-none mb-8 drop-shadow-xl dark:drop-shadow-2xl relative">
                BECOME THE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 dark:from-cyber-neon dark:via-white dark:to-cyber-purple dark:text-glow animate-pulse-slow">QUANT MASTER</span>.
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl text-gray-600 dark:text-gray-400 text-lg md:text-xl font-light tracking-wide mb-16 px-6">
                Stop relying on others' calls. Use generative AI to turn complex trading logic into secure, non-custodial DeFi bots. <br/>
                <span className="text-purple-600 dark:text-cyber-neon font-medium">Make Every Decision a Master Stroke.</span>
            </p>

            {/* Interactive Hook: Prompt + Visual Flow */}
            <div className="w-full max-w-5xl bg-white/80 dark:bg-black/60 border border-gray-200 dark:border-cyber-neon/20 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl dark:shadow-neon mb-16 transform hover:scale-[1.01] transition-all duration-500">
                {/* 1. Prompt Bar */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-cyber-panel">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="ml-4 flex-1 font-mono text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <span className="text-purple-600 dark:text-cyber-neon">➜</span>
                        <span className="text-purple-600/70 dark:text-cyber-neon/70">Quant Master Prompt:</span>
                        <span className="text-gray-900 dark:text-white opacity-90 truncate">"创建套利策略：监控 Curve 上的 wETH/sETH 价差，当价差超过 1.5% 时，自动执行 Swap..."</span>
                        <span className="w-2 h-4 bg-purple-600 dark:bg-cyber-neon animate-pulse inline-block"></span>
                    </div>
                </div>

                {/* 2. Flow Animation (The Magic) */}
                <div className="p-10 relative min-h-[180px] flex items-center justify-center gap-4 md:gap-8 overflow-x-auto bg-gray-50/50 dark:bg-transparent">
                    {/* Background Trace Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent -z-10"></div>
                    
                    {/* Nodes */}
                    <NodeVisual icon={<Activity size={20} />} label="Binance Feed" color="text-yellow-600 dark:text-yellow-400" borderColor="border-yellow-400" />
                    <ConnectionBeam />
                    <NodeVisual icon={<Code2 size={20} />} label="AI Logic" color="text-purple-600 dark:text-cyber-neon" borderColor="border-purple-500 dark:border-cyber-neon" pulse />
                    <ConnectionBeam />
                    <NodeVisual icon={<ArrowRightLeft size={20} />} label="Curve Swap" color="text-pink-600 dark:text-cyber-pink" borderColor="border-pink-500 dark:border-cyber-pink" />
                    <ConnectionBeam />
                    <NodeVisual icon={<Lock size={20} />} label="Vault 0x9...A" color="text-gray-800 dark:text-white" borderColor="border-gray-800 dark:border-white" />
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-20">
                <button 
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="group relative px-10 py-5 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black font-bold text-xl uppercase tracking-widest clip-path-polygon hover:bg-purple-700 dark:hover:bg-white transition-all duration-300 shadow-xl dark:shadow-[0_0_20px_rgba(0,243,255,0.4)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                >
                    <span className="flex items-center gap-3 relative z-10">
                        Enter Master Studio <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                
                <button 
                    onClick={() => onNavigate(Page.DASHBOARD)}
                    className="px-8 py-4 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold text-lg uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white transition-all duration-300 clip-path-polygon backdrop-blur-sm"
                >
                    View Dashboard
                </button>
            </div>
        </section>

        {/* NEW: BACKED BY SECTION */}
        <section className="relative z-20 py-16 bg-white dark:bg-black border-b border-gray-200 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-12">Backed By Industry Leaders</h3>
                
                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
                     {/* Logo 1: Binance Labs Style */}
                     <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0 duration-500">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-[#FCD535]/50 transition-colors shadow-lg">
                            <svg viewBox="0 0 32 32" className="w-8 h-8 text-[#FCD535] fill-current"><path d="M16 4l-6 6 6 6 6-6-6-6zm-9 9l-6 6 6 6 6-6-6-6zm9 9l-6 6 6 6 6-6-6-6zm9-9l-6 6 6 6 6-6-6-6z" /></svg>
                        </div>
                     </div>

                     {/* Logo 2: Flow / Green Style */}
                     <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0 duration-500">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-[#00EF8B]/50 transition-colors shadow-lg">
                            <svg viewBox="0 0 32 32" className="w-8 h-8 text-[#00EF8B] fill-current"><path d="M8 8h16v4h-16zM8 16h10v4h-10zM8 24h6v4h-6z" /></svg>
                        </div>
                     </div>

                     {/* Logo 3: Multicoin Style */}
                     <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0 duration-500">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-white/50 transition-colors shadow-lg">
                             <svg viewBox="0 0 32 32" className="w-8 h-8 text-black dark:text-white fill-none stroke-current stroke-2"><circle cx="16" cy="16" r="10" /><path d="M10 20l6-8 6 8" /></svg>
                        </div>
                     </div>

                     {/* Logo 4: Solana Style */}
                     <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0 duration-500">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-purple-400/50 transition-colors shadow-lg">
                            <svg viewBox="0 0 32 32" className="w-8 h-8"><path d="M4 8h24l-4 4H4z" fill="#9945FF"/><path d="M8 16h24l-4 4H8z" fill="#14F195"/><path d="M4 24h24l-4 4H4z" fill="#9945FF"/></svg>
                        </div>
                     </div>

                     {/* Logo 5: Blue Chip Style */}
                     <div className="group flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0 duration-500">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-colors shadow-lg">
                            <div className="w-8 h-8 rounded-full border-4 border-blue-600 dark:border-blue-500"></div>
                        </div>
                     </div>
                </div>
            </div>
        </section>

        {/* II. THREE PILLARS (The Pillars of Mastery) */}
        <section className="relative z-10 py-32 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#08080a] backdrop-blur-sm transition-colors">
             {/* Background Texture: Dot Pattern */}
             <div className="absolute inset-0 bg-dot-pattern opacity-30 dark:opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">The Trinity of Automation</h2>
                    <div className="w-24 h-1 bg-purple-600 dark:bg-cyber-neon mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Pillar 1: AI Brain */}
                    <div className="glass-panel p-10 rounded-lg border border-purple-100 dark:border-cyber-neon/10 hover:border-purple-300 dark:hover:border-cyber-neon/60 transition-colors group relative overflow-hidden bg-white dark:bg-[#0c0c10]">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Brain size={120} className="text-purple-600 dark:text-cyber-neon -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-purple-100 dark:bg-cyber-neon/5 border border-purple-200 dark:border-cyber-neon/20 group-hover:bg-purple-200 dark:group-hover:bg-cyber-neon/20 transition-colors">
                            <Brain className="w-8 h-8 text-purple-600 dark:text-cyber-neon" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">THE QUANT MASTER BRAIN</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed z-10 relative">
                            Generate sophisticated, high-alpha strategies using simple prompts. Instantly turn your trading intuition into executable smart contract logic.
                        </p>
                    </div>

                    {/* Pillar 2: Visual Canvas */}
                    <div className="glass-panel p-10 rounded-lg border border-purple-100 dark:border-cyber-purple/10 hover:border-purple-300 dark:hover:border-cyber-purple/60 transition-colors group relative overflow-hidden bg-white dark:bg-[#0c0c10]">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Workflow size={120} className="text-purple-600 dark:text-cyber-purple -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-purple-100 dark:bg-cyber-purple/5 border border-purple-200 dark:border-cyber-purple/20 group-hover:bg-purple-200 dark:group-hover:bg-cyber-purple/20 transition-colors">
                            <Layers className="w-8 h-8 text-purple-600 dark:text-cyber-purple" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">THE STRATEGY CANVAS</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed z-10 relative">
                            Drag-and-drop nodes to visually refine and audit complex financial logic. Build like an expert, with zero code or error risk.
                        </p>
                    </div>

                    {/* Pillar 3: Execution */}
                    <div className="glass-panel p-10 rounded-lg border border-pink-100 dark:border-cyber-pink/10 hover:border-pink-300 dark:hover:border-cyber-pink/60 transition-colors group relative overflow-hidden bg-white dark:bg-[#0c0c10]">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Shield size={120} className="text-pink-600 dark:text-cyber-pink -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-pink-100 dark:bg-cyber-pink/5 border border-pink-200 dark:border-cyber-pink/20 group-hover:bg-pink-200 dark:group-hover:bg-cyber-pink/20 transition-colors">
                            <Shield className="w-8 h-8 text-pink-600 dark:text-cyber-pink" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">MASTER EXECUTION</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed z-10 relative">
                            Deploy secure, rule-based DeFi Vaults (Non-Custodial). Your keys, your rules. Ensure secure, low-latency execution 24/7.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* III. GALLERY (TradingFlow Gallery Nof1) */}
        <section className="relative z-10 py-32 px-6 overflow-hidden bg-white dark:bg-[#030305] border-b border-gray-200 dark:border-white/5 transition-colors">
            {/* Background Scanner Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/20 dark:via-cyber-neon/20 to-transparent z-0"></div>
            
            <div className="max-w-7xl mx-auto w-full relative">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 dark:border-white/10 pb-6 relative z-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">TRADINGFLOW GALLERY</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                            Explore workflows designed and shared by top community Masters. Clone, customize, and deploy to your Vault in seconds.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-purple-600 dark:text-cyber-neon hover:text-black dark:hover:text-white transition-colors font-mono uppercase text-sm tracking-widest mt-4 md:mt-0">
                        Explore All TradingFlows <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {/* Card 1: Smart DCA */}
                    <GalleryCard 
                        title="Smart DCA Master"
                        description="Buys ETH only when RSI < 30 and Gas < 15 Gwei. Maximizes entry efficiency."
                        stats={{ apy: '128% APY', risk: 'LOW', clones: '4.2k' }}
                        tags={['DCA', 'Accumulation']}
                        color="neon"
                    />

                    {/* Card 2: Whale Sniper */}
                    <GalleryCard 
                        title="Whale Sniping Master"
                        description="Monitors labelled whale wallets. Mirrors trades within same block via Flashbots."
                        stats={{ apy: '842% APY', risk: 'HIGH', clones: '1.1k' }}
                        tags={['CopyTrade', 'Mempool']}
                        color="purple"
                    />

                    {/* Card 3: Gas Harvester */}
                    <GalleryCard 
                        title="Low Gas Harvester"
                        description="Auto-compounds yield farming positions only during weekend low-gas windows."
                        stats={{ apy: '45% APY', risk: 'MED', clones: '8.5k' }}
                        tags={['Yield', 'Efficiency']}
                        color="pink"
                    />
                </div>
            </div>
        </section>

        {/* IV. FINAL CTA */}
        <section className="relative z-10 py-32 px-6 text-center bg-gray-100 dark:bg-[#0a0a0f]">
             {/* Dynamic Background for CTA */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-100 via-white to-gray-50 dark:from-cyber-neon/5 dark:via-cyber-purple/5 dark:to-[#0a0a0f] pointer-events-none"></div>
            {/* Animated Horizontal Beam */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 dark:via-cyber-neon to-transparent opacity-50 animate-flow-beam"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tighter leading-tight">
                    STOP TRADING. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-cyber-pink dark:to-cyber-purple animate-pulse">START AUTOMATING.</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    Your alpha is waiting. Deploy your first automated strategy in minutes and elevate your status from emotional trader to Quant Master.
                </p>
                <button 
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="px-16 py-6 bg-black dark:bg-white text-white dark:text-black font-bold text-2xl uppercase tracking-widest clip-path-polygon hover:bg-purple-700 dark:hover:bg-cyber-neon transition-all duration-300 shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_60px_rgba(0,243,255,0.5)] transform hover:-translate-y-1"
                >
                    ENTER MASTER STUDIO <ArrowRight className="inline ml-2" />
                </button>
            </div>
        </section>

        {/* V. FOOTER */}
        <footer className="py-16 px-6 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 z-20 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2">
                     <span className="text-2xl font-bold tracking-wider text-gray-900 dark:text-white mb-6 block">
                        Trading<span className="text-purple-600 dark:text-cyber-neon">Flow</span>
                     </span>
                     <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
                        The world's first generative AI platform for automated DeFi strategies. Build, backtest, and deploy non-custodial trading bots without writing code.
                     </p>
                     <div className="flex gap-4">
                         <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-cyber-neon/20 hover:text-purple-600 dark:hover:text-cyber-neon transition-colors"><Twitter size={18} /></a>
                         <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-cyber-neon/20 hover:text-purple-600 dark:hover:text-cyber-neon transition-colors"><Github size={18} /></a>
                         <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-cyber-neon/20 hover:text-purple-600 dark:hover:text-cyber-neon transition-colors"><Disc size={18} /></a>
                         <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-cyber-neon/20 hover:text-purple-600 dark:hover:text-cyber-neon transition-colors"><Linkedin size={18} /></a>
                     </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Product</h4>
                    <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">Strategy Studio</a></li>
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">Vault Dashboard</a></li>
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">Market Radar</a></li>
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">Pricing</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Resources</h4>
                    <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">API Reference</a></li>
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">Community Gallery</a></li>
                        <li><a href="#" className="hover:text-purple-600 dark:hover:text-cyber-neon transition-colors">Help Center</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                <p>&copy; 2024 TradingFlow Protocol. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Terms of Service</a>
                </div>
            </div>
        </footer>
    </div>
  );
};

// --- Sub-components for Visuals ---

const NodeVisual: React.FC<{ icon: React.ReactNode, label: string, color: string, borderColor: string, pulse?: boolean }> = ({ icon, label, color, borderColor, pulse }) => (
    <div className={`relative flex flex-col items-center gap-3 z-10 group cursor-default ${pulse ? 'animate-pulse' : ''}`}>
        <div className={`w-16 h-16 rounded-xl bg-white dark:bg-cyber-black border-2 ${borderColor} flex items-center justify-center ${color} shadow-lg dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 duration-300 z-10 relative bg-opacity-90`}>
            {icon}
        </div>
        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${color} bg-white/80 dark:bg-black/80 border border-gray-200 dark:border-white/10 px-2 py-1 rounded backdrop-blur-md shadow-sm`}>{label}</span>
    </div>
);

const ConnectionBeam: React.FC = () => (
    <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-800 relative min-w-[40px] max-w-[100px] overflow-hidden rounded-full">
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-purple-500 dark:via-cyber-neon to-transparent animate-flow-beam"></div>
    </div>
);

const GalleryCard: React.FC<{ title: string, description: string, stats: any, tags: string[], color: 'neon' | 'purple' | 'pink' }> = ({ title, description, stats, tags, color }) => {
    // Determine color classes based on mode support
    const getColorClasses = (c: string) => {
        switch(c) {
            case 'neon': return 'border-cyan-200 dark:border-cyber-neon/20 hover:border-cyan-400 dark:hover:border-cyber-neon/80 text-cyan-700 dark:text-cyber-neon hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]';
            case 'purple': return 'border-purple-200 dark:border-cyber-purple/20 hover:border-purple-400 dark:hover:border-cyber-purple/80 text-purple-700 dark:text-cyber-purple hover:shadow-[0_0_20px_rgba(188,19,254,0.2)]';
            case 'pink': return 'border-pink-200 dark:border-cyber-pink/20 hover:border-pink-400 dark:hover:border-cyber-pink/80 text-pink-700 dark:text-cyber-pink hover:shadow-[0_0_20px_rgba(255,0,255,0.2)]';
            default: return '';
        }
    };

    const colorClass = getColorClasses(color);

    return (
        <div className={`glass-panel p-8 border ${colorClass} transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden bg-white/80 dark:bg-black/40`}>
             {/* Scan line effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 dark:via-white/5 to-transparent -translate-y-full group-hover:animate-scan pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <div className={`p-3 rounded-md border bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-700 dark:text-white`}>
                        {color === 'neon' ? <Zap size={20} /> : color === 'purple' ? <Activity size={20} /> : <Cpu size={20} />}
                    </div>
                </div>
                <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    <Copy size={18} />
                </button>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-glow transition-all">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 h-12 leading-relaxed line-clamp-2">{description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono uppercase px-2 py-1 border border-gray-200 dark:border-white/10 rounded text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Stats Footer */}
            <div className="flex justify-between items-center pt-5 border-t border-gray-200 dark:border-white/10 font-mono text-xs">
                <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-600 mb-1">YIELD</span>
                    <span className={`font-bold text-lg ${color === 'neon' ? 'text-cyan-600 dark:text-cyber-neon' : color === 'purple' ? 'text-purple-600 dark:text-cyber-purple' : 'text-pink-600 dark:text-cyber-pink'}`}>{stats.apy}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-500 dark:text-gray-600 mb-1">RISK</span>
                    <span className="font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{stats.risk}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-500 dark:text-gray-600 mb-1">CLONES</span>
                    <span className="font-bold text-gray-800 dark:text-white">{stats.clones}</span>
                </div>
            </div>
        </div>
    );
};
