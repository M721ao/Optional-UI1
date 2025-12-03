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
  Lock
} from 'lucide-react';

interface LandingProps {
  onNavigate: (page: Page) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-cyber-black overflow-hidden">
        {/* I. BACKGROUND EFFECTS */}
        <div className="absolute inset-0 pointer-events-none perspective-container z-0">
            <div className="moving-grid"></div>
        </div>
        
        {/* Floating Particles (Simulated) */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyber-neon rounded-full blur-[2px] animate-float opacity-50"></div>
        <div className="absolute bottom-40 right-40 w-3 h-3 bg-cyber-purple rounded-full blur-[3px] animate-float opacity-40 delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-cyber-pink rounded-full blur-[1px] animate-pulse-fast opacity-60"></div>

        {/* II. HERO SECTION (The Master's Call) */}
        <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-0 text-center">
            
            {/* H1 Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white uppercase leading-none mb-6 drop-shadow-2xl">
                BECOME THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-white to-cyber-purple text-glow">QUANT MASTER</span>.
                <br />
                <span className="text-3xl md:text-5xl lg:text-6xl text-white/90">POWERED BY AI.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl text-gray-400 text-lg md:text-xl font-light tracking-wide mb-12">
                Stop relying on others' calls. Use generative AI to turn complex trading logic into secure, non-custodial DeFi bots. <br/>
                <span className="text-cyber-neon font-medium">Make Every Decision a Master Stroke.</span>
            </p>

            {/* Interactive Hook: Prompt + Visual Flow */}
            <div className="w-full max-w-4xl bg-black/80 border border-cyber-neon/30 backdrop-blur-xl rounded-lg overflow-hidden shadow-neon mb-12">
                {/* 1. Prompt Bar */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-cyber-panel">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 flex-1 font-mono text-sm text-gray-300 flex items-center gap-2">
                        <span className="text-cyber-neon">➜</span>
                        <span className="text-cyber-neon/70">Quant Master Prompt:</span>
                        <span className="typing-effect text-white">"创建套利策略：监控 Curve 上的 wETH/sETH 价差，当价差超过 1.5% 时，自动执行 Swap 节点进行套利，最大 Gas 限制 40 Gwei。"</span>
                        <span className="w-2 h-4 bg-cyber-neon animate-pulse"></span>
                    </div>
                </div>

                {/* 2. Flow Animation (The Magic) */}
                <div className="p-8 relative min-h-[160px] flex items-center justify-center gap-4 md:gap-8 overflow-x-auto">
                    {/* Background Trace Line */}
                    <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gray-800 -z-10"></div>
                    
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
            <div className="flex flex-col md:flex-row items-center gap-6">
                <button 
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="group relative px-10 py-5 bg-cyber-neon text-black font-bold text-xl uppercase tracking-widest clip-path-polygon hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                >
                    <span className="flex items-center gap-3">
                        Enter Master Studio <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
                
                <button 
                    onClick={() => onNavigate(Page.DASHBOARD)}
                    className="px-8 py-4 border border-white/30 text-white font-bold text-lg uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all duration-300 clip-path-polygon"
                >
                    View Dashboard
                </button>
            </div>
        </section>

        {/* III. THREE PILLARS (The Pillars of Mastery) */}
        <section className="relative z-10 py-24 bg-cyber-dark/80 border-y border-white/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Pillar 1: AI Brain */}
                    <div className="glass-panel p-8 rounded-lg border border-cyber-neon/20 hover:border-cyber-neon/60 transition-colors group">
                        <div className="mb-6 inline-flex p-4 rounded-full bg-cyber-neon/10 border border-cyber-neon/30 group-hover:bg-cyber-neon/20 transition-colors">
                            <Brain className="w-8 h-8 text-cyber-neon" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">THE QUANT MASTER BRAIN</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Generate sophisticated, high-alpha strategies using simple prompts. Instantly turn your trading intuition into executable smart contract logic.
                        </p>
                    </div>

                    {/* Pillar 2: Visual Canvas */}
                    <div className="glass-panel p-8 rounded-lg border border-cyber-purple/20 hover:border-cyber-purple/60 transition-colors group">
                        <div className="mb-6 inline-flex p-4 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 group-hover:bg-cyber-purple/20 transition-colors">
                            <Layers className="w-8 h-8 text-cyber-purple" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">THE MASTER STRATEGY CANVAS</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Drag-and-drop nodes to visually refine and audit complex financial logic. Build like an expert, with zero code or error risk.
                        </p>
                    </div>

                    {/* Pillar 3: Execution */}
                    <div className="glass-panel p-8 rounded-lg border border-cyber-pink/20 hover:border-cyber-pink/60 transition-colors group">
                        <div className="mb-6 inline-flex p-4 rounded-full bg-cyber-pink/10 border border-cyber-pink/30 group-hover:bg-cyber-pink/20 transition-colors">
                            <Shield className="w-8 h-8 text-cyber-pink" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">MASTER-LEVEL EXECUTION</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Deploy secure, rule-based DeFi Vaults (Non-Custodial). Your keys, your rules. Ensure secure, low-latency execution 24/7 without human emotion.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* IV. GALLERY (MasterFlow Gallery Nof1) */}
        <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">MASTERFLOW GALLERY (Nof1)</h2>
                    <p className="text-gray-400 max-w-xl">
                        Explore workflows designed and shared by top community Masters. Clone, customize, and deploy to your Vault in seconds.
                    </p>
                </div>
                <button className="hidden md:flex items-center gap-2 text-cyber-neon hover:text-white transition-colors font-mono uppercase text-sm tracking-widest mt-4 md:mt-0">
                    Explore All MasterFlows <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            
             <button className="md:hidden w-full flex justify-center items-center gap-2 text-cyber-neon hover:text-white transition-colors font-mono uppercase text-sm tracking-widest mt-8 border border-cyber-neon/30 py-3 rounded">
                Explore All MasterFlows <ArrowRight size={16} />
            </button>
        </section>

        {/* V. FINAL CTA */}
        <section className="relative z-10 py-32 px-6 bg-gradient-to-t from-cyber-neon/5 to-transparent text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                STOP TRADING. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple">START AUTOMATING.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Your alpha is waiting. Deploy your first automated strategy in minutes and elevate your status from emotional trader to Quant Master.
            </p>
            <button 
                onClick={() => onNavigate(Page.STUDIO)}
                className="px-12 py-6 bg-white text-black font-bold text-2xl uppercase tracking-widest clip-path-polygon hover:bg-cyber-neon transition-colors shadow-neon"
            >
                ENTER MASTER STUDIO <ArrowRight className="inline ml-2" />
            </button>
        </section>
    </div>
  );
};

// --- Sub-components for Visuals ---

const NodeVisual: React.FC<{ icon: React.ReactNode, label: string, color: string, borderColor: string, pulse?: boolean }> = ({ icon, label, color, borderColor, pulse }) => (
    <div className={`relative flex flex-col items-center gap-3 z-10 ${pulse ? 'animate-pulse' : ''}`}>
        <div className={`w-16 h-16 rounded-xl bg-cyber-black border-2 ${borderColor} flex items-center justify-center ${color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
            {icon}
        </div>
        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${color} bg-black/50 px-2 py-1 rounded`}>{label}</span>
    </div>
);

const ConnectionBeam: React.FC = () => (
    <div className="flex-1 h-0.5 bg-gray-800 relative min-w-[40px] overflow-hidden">
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-cyber-neon to-transparent animate-flow-beam"></div>
    </div>
);

const GalleryCard: React.FC<{ title: string, description: string, stats: any, tags: string[], color: 'neon' | 'purple' | 'pink' }> = ({ title, description, stats, tags, color }) => {
    const colorClasses = {
        neon: 'border-cyber-neon/30 hover:border-cyber-neon text-cyber-neon',
        purple: 'border-cyber-purple/30 hover:border-cyber-purple text-cyber-purple',
        pink: 'border-cyber-pink/30 hover:border-cyber-pink text-cyber-pink'
    };

    return (
        <div className={`glass-panel p-6 border ${colorClasses[color]} transition-all duration-300 group hover:-translate-y-2`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded bg-${color === 'neon' ? 'cyber-neon' : color === 'purple' ? 'cyber-purple' : 'cyber-pink'}/10`}>
                        {color === 'neon' ? <Zap size={18} /> : color === 'purple' ? <Activity size={18} /> : <Cpu size={18} />}
                    </div>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <Copy size={16} />
                </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-shadow-glow transition-all">{title}</h3>
            <p className="text-gray-400 text-sm mb-6 h-10">{description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono uppercase px-2 py-1 border border-white/10 rounded text-gray-300">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Stats Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10 font-mono text-xs">
                <div className="flex flex-col">
                    <span className="text-gray-500">YIELD</span>
                    <span className={`font-bold text-lg ${color === 'neon' ? 'text-cyber-neon' : color === 'purple' ? 'text-cyber-purple' : 'text-cyber-pink'}`}>{stats.apy}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-500">RISK</span>
                    <span className="font-bold text-white">{stats.risk}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-500">CLONES</span>
                    <span className="font-bold text-white">{stats.clones}</span>
                </div>
            </div>
        </div>
    );
};
