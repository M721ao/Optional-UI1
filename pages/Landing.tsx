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
  TrendingUp, 
  Cpu, 
  Code2, 
  ArrowRightLeft, 
  Lock,
  Hexagon
} from 'lucide-react';

interface LandingProps {
  onNavigate: (page: Page) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#030305] overflow-hidden selection:bg-cyber-neon selection:text-black">
        
        {/* === GLOBAL AMBIENT LAYER === */}
        {/* Large colored orbs to create depth and break the black monotony */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
             {/* Top Left - Purple Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyber-purple/10 rounded-full blur-[120px] opacity-40 mix-blend-screen"></div>
            {/* Top Right - Cyan Glow */}
            <div className="absolute top-[10%] right-[-20%] w-[1000px] h-[1000px] bg-cyber-neon/5 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
            {/* Bottom Center - Pink Glow */}
            <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-cyber-pink/5 rounded-full blur-[150px] opacity-30 mix-blend-screen"></div>
        </div>

        {/* I. HERO SECTION (The Master's Call) */}
        <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-4 md:px-0 text-center min-h-[90vh]">
            {/* Perspective Grid Background specific to Hero */}
            <div className="absolute inset-0 pointer-events-none perspective-container z-[-1] opacity-60">
                <div className="moving-grid"></div>
                {/* Fade out grid at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030305]"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute top-20 left-20 w-1.5 h-1.5 bg-cyber-neon rounded-full blur-[1px] animate-float opacity-70"></div>
            <div className="absolute bottom-40 right-40 w-2 h-2 bg-cyber-purple rounded-full blur-[2px] animate-float opacity-50 delay-1000"></div>

            {/* H1 Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white uppercase leading-none mb-8 drop-shadow-2xl relative">
                BECOME THE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-white to-cyber-purple text-glow">QUANT MASTER</span>.
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl text-gray-400 text-lg md:text-xl font-light tracking-wide mb-16 px-6">
                Stop relying on others' calls. Use generative AI to turn complex trading logic into secure, non-custodial DeFi bots. <br/>
                <span className="text-cyber-neon font-medium">Make Every Decision a Master Stroke.</span>
            </p>

            {/* Interactive Hook: Prompt + Visual Flow */}
            <div className="w-full max-w-5xl bg-black/60 border border-cyber-neon/20 backdrop-blur-xl rounded-lg overflow-hidden shadow-neon mb-16 transform hover:scale-[1.01] transition-transform duration-500">
                {/* 1. Prompt Bar */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-cyber-panel">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="ml-4 flex-1 font-mono text-sm text-gray-300 flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <span className="text-cyber-neon">➜</span>
                        <span className="text-cyber-neon/70">Quant Master Prompt:</span>
                        <span className="text-white opacity-90 truncate">"创建套利策略：监控 Curve 上的 wETH/sETH 价差，当价差超过 1.5% 时，自动执行 Swap..."</span>
                        <span className="w-2 h-4 bg-cyber-neon animate-pulse inline-block"></span>
                    </div>
                </div>

                {/* 2. Flow Animation (The Magic) */}
                <div className="p-10 relative min-h-[180px] flex items-center justify-center gap-4 md:gap-8 overflow-x-auto bg-gradient-to-b from-black/40 to-black/80">
                    {/* Background Trace Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent -z-10"></div>
                    
                    {/* Nodes */}
                    <NodeVisual icon={<Activity size={20} />} label="Binance Feed" color="text-yellow-400" borderColor="border-yellow-400" />
                    <ConnectionBeam />
                    <NodeVisual icon={<Code2 size={20} />} label="AI Logic" color="text-cyber-neon" borderColor="border-cyber-neon" pulse />
                    <ConnectionBeam />
                    <NodeVisual icon={<ArrowRightLeft size={20} />} label="Curve Swap" color="text-cyber-pink" borderColor="border-cyber-pink" />
                    <ConnectionBeam />
                    <NodeVisual icon={<Lock size={20} />} label="Vault 0x9...A" color="text-white" borderColor="border-white" />
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-20">
                <button 
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="group relative px-10 py-5 bg-cyber-neon text-black font-bold text-xl uppercase tracking-widest clip-path-polygon hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                >
                    <span className="flex items-center gap-3 relative z-10">
                        Enter Master Studio <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Button Glitch Effect Overlay */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                
                <button 
                    onClick={() => onNavigate(Page.DASHBOARD)}
                    className="px-8 py-4 border border-white/20 text-white font-bold text-lg uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all duration-300 clip-path-polygon backdrop-blur-sm"
                >
                    View Dashboard
                </button>
            </div>
        </section>

        {/* II. THREE PILLARS (The Pillars of Mastery) */}
        <section className="relative z-10 py-32 border-t border-white/5 bg-[#030305]/80 backdrop-blur-sm">
             {/* Background Texture: Dot Pattern + Vignette */}
             <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-transparent to-[#030305] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Pillar 1: AI Brain */}
                    <div className="glass-panel p-10 rounded-lg border border-cyber-neon/10 hover:border-cyber-neon/60 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Brain size={120} className="text-cyber-neon -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-cyber-neon/5 border border-cyber-neon/20 group-hover:bg-cyber-neon/20 transition-colors">
                            <Brain className="w-8 h-8 text-cyber-neon" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">THE QUANT MASTER BRAIN</h3>
                        <p className="text-gray-400 leading-relaxed z-10 relative">
                            Generate sophisticated, high-alpha strategies using simple prompts. Instantly turn your trading intuition into executable smart contract logic.
                        </p>
                    </div>

                    {/* Pillar 2: Visual Canvas */}
                    <div className="glass-panel p-10 rounded-lg border border-cyber-purple/10 hover:border-cyber-purple/60 transition-colors group relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Hexagon size={120} className="text-cyber-purple -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-cyber-purple/5 border border-cyber-purple/20 group-hover:bg-cyber-purple/20 transition-colors">
                            <Layers className="w-8 h-8 text-cyber-purple" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">THE STRATEGY CANVAS</h3>
                        <p className="text-gray-400 leading-relaxed z-10 relative">
                            Drag-and-drop nodes to visually refine and audit complex financial logic. Build like an expert, with zero code or error risk.
                        </p>
                    </div>

                    {/* Pillar 3: Execution */}
                    <div className="glass-panel p-10 rounded-lg border border-cyber-pink/10 hover:border-cyber-pink/60 transition-colors group relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Shield size={120} className="text-cyber-pink -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-cyber-pink/5 border border-cyber-pink/20 group-hover:bg-cyber-pink/20 transition-colors">
                            <Shield className="w-8 h-8 text-cyber-pink" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">MASTER EXECUTION</h3>
                        <p className="text-gray-400 leading-relaxed z-10 relative">
                            Deploy secure, rule-based DeFi Vaults (Non-Custodial). Your keys, your rules. Ensure secure, low-latency execution 24/7.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* III. GALLERY (MasterFlow Gallery Nof1) */}
        <section className="relative z-10 py-32 px-6 overflow-hidden">
            {/* Background Scanner Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-cyber-neon/20 to-transparent z-0"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyber-dark via-[#030305] to-[#030305] opacity-80 -z-10"></div>

            <div className="max-w-7xl mx-auto w-full relative">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 relative z-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">MASTERFLOW GALLERY</h2>
                        <p className="text-gray-400 max-w-xl">
                            Explore workflows designed and shared by top community Masters. Clone, customize, and deploy to your Vault in seconds.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-cyber-neon hover:text-white transition-colors font-mono uppercase text-sm tracking-widest mt-4 md:mt-0">
                        Explore All MasterFlows <ArrowRight size={16} />
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
        <section className="relative z-10 py-32 px-6 text-center border-t border-white/5">
             {/* Dynamic Background for CTA */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-neon/10 via-cyber-purple/5 to-[#030305] pointer-events-none"></div>
            {/* Animated Horizontal Beam */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-neon to-transparent opacity-50 animate-flow-beam"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight">
                    STOP TRADING. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple animate-pulse">START AUTOMATING.</span>
                </h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    Your alpha is waiting. Deploy your first automated strategy in minutes and elevate your status from emotional trader to Quant Master.
                </p>
                <button 
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="px-16 py-6 bg-white text-black font-bold text-2xl uppercase tracking-widest clip-path-polygon hover:bg-cyber-neon transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(0,243,255,0.5)] transform hover:-translate-y-1"
                >
                    ENTER MASTER STUDIO <ArrowRight className="inline ml-2" />
                </button>
            </div>
        </section>
    </div>
  );
};

// --- Sub-components for Visuals ---

const NodeVisual: React.FC<{ icon: React.ReactNode, label: string, color: string, borderColor: string, pulse?: boolean }> = ({ icon, label, color, borderColor, pulse }) => (
    <div className={`relative flex flex-col items-center gap-3 z-10 group cursor-default ${pulse ? 'animate-pulse' : ''}`}>
        <div className={`w-16 h-16 rounded-xl bg-cyber-black border-2 ${borderColor} flex items-center justify-center ${color} shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 duration-300 z-10 relative bg-opacity-90`}>
            {icon}
        </div>
        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${color} bg-black/80 border border-white/10 px-2 py-1 rounded backdrop-blur-md`}>{label}</span>
    </div>
);

const ConnectionBeam: React.FC = () => (
    <div className="flex-1 h-0.5 bg-gray-800 relative min-w-[40px] max-w-[100px] overflow-hidden rounded-full">
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-cyber-neon to-transparent animate-flow-beam"></div>
    </div>
);

const GalleryCard: React.FC<{ title: string, description: string, stats: any, tags: string[], color: 'neon' | 'purple' | 'pink' }> = ({ title, description, stats, tags, color }) => {
    const colorClasses = {
        neon: 'border-cyber-neon/20 hover:border-cyber-neon/80 text-cyber-neon hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]',
        purple: 'border-cyber-purple/20 hover:border-cyber-purple/80 text-cyber-purple hover:shadow-[0_0_20px_rgba(188,19,254,0.2)]',
        pink: 'border-cyber-pink/20 hover:border-cyber-pink/80 text-cyber-pink hover:shadow-[0_0_20px_rgba(255,0,255,0.2)]'
    };

    return (
        <div className={`glass-panel p-8 border ${colorClasses[color]} transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden bg-black/40`}>
             {/* Scan line effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:animate-scan pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <div className={`p-3 rounded-md bg-${color === 'neon' ? 'cyber-neon' : color === 'purple' ? 'cyber-purple' : 'cyber-pink'}/10 border border-white/5`}>
                        {color === 'neon' ? <Zap size={20} /> : color === 'purple' ? <Activity size={20} /> : <Cpu size={20} />}
                    </div>
                </div>
                <button className="text-gray-600 hover:text-white transition-colors">
                    <Copy size={18} />
                </button>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-glow transition-all">{title}</h3>
            <p className="text-gray-400 text-sm mb-8 h-12 leading-relaxed line-clamp-2">{description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono uppercase px-2 py-1 border border-white/10 rounded text-gray-400 bg-white/5">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Stats Footer */}
            <div className="flex justify-between items-center pt-5 border-t border-white/10 font-mono text-xs">
                <div className="flex flex-col">
                    <span className="text-gray-600 mb-1">YIELD</span>
                    <span className={`font-bold text-lg ${color === 'neon' ? 'text-cyber-neon' : color === 'purple' ? 'text-cyber-purple' : 'text-cyber-pink'}`}>{stats.apy}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-600 mb-1">RISK</span>
                    <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">{stats.risk}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-600 mb-1">CLONES</span>
                    <span className="font-bold text-white">{stats.clones}</span>
                </div>
            </div>
        </div>
    );
};