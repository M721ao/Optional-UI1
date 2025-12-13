
import React from 'react';
import { Page } from '../types';
import { 
  ArrowRight, 
  Brain, 
  Layers, 
  Shield, 
  Activity, 
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
    <div className="h-full overflow-y-auto overflow-x-hidden relative bg-gray-50 dark:bg-[#030305] text-gray-900 dark:text-white selection:bg-purple-200 dark:selection:bg-cyber-neon selection:text-purple-900 dark:selection:text-black transition-colors duration-300 scroll-smooth">
        
        {/* === GLOBAL AMBIENT LAYER === */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
             {/* Top Left - Purple Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-300/20 dark:bg-purple-900/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
            {/* Top Right - Cyan Glow */}
            <div className="absolute top-[10%] right-[-20%] w-[1000px] h-[1000px] bg-cyan-300/20 dark:bg-cyan-900/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
            {/* Bottom - Extra Glow */}
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        </div>

        {/* I. HERO SECTION */}
        <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-32 px-4 md:px-0 text-center min-h-[90vh] bg-gray-50/50 dark:bg-[#030305]">
            {/* Perspective Grid Background */}
            <div className="absolute inset-0 pointer-events-none perspective-container z-[-1] opacity-30 dark:opacity-40">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px)`,
                        backgroundSize: '4rem 4rem',
                        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)'
                    }}
                ></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-100/5 dark:via-purple-900/5 to-gray-50 dark:to-[#030305]"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute top-20 left-20 w-1.5 h-1.5 bg-purple-600 dark:bg-cyber-neon rounded-full blur-[1px] animate-float opacity-70"></div>
            <div className="absolute bottom-40 right-40 w-2 h-2 bg-blue-500 dark:bg-cyber-purple rounded-full blur-[2px] animate-float opacity-50 delay-1000"></div>

            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-1000 shadow-sm dark:shadow-none">
                <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-cyber-neon animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-600 dark:text-gray-400 uppercase">Powered by Generative AI</span>
            </div>

            {/* H1 Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-gray-900 dark:text-white uppercase leading-none mb-8 drop-shadow-sm dark:drop-shadow-2xl relative z-10">
                BECOME THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 dark:from-cyber-neon dark:via-white dark:to-cyber-purple dark:text-glow animate-pulse-slow whitespace-nowrap">QUANT MASTER</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl text-gray-600 dark:text-gray-400 text-lg md:text-xl font-light tracking-wide mb-16 px-6 leading-relaxed">
                The only non-custodial AI studio that translates complex trading logic into secure, executable DeFi workflows. <span className="text-purple-700 dark:text-cyber-neon font-bold block md:inline mt-2 md:mt-0">Make Every Decision a Master Stroke.</span>
            </p>

            {/* Interactive Hook: Prompt + Visual Flow */}
            <div className="w-full max-w-5xl bg-white/80 dark:bg-black/60 border border-purple-200 dark:border-cyber-neon/20 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl dark:shadow-neon mb-16 transform hover:scale-[1.01] transition-all duration-500">
                {/* 1. Prompt Bar */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-cyber-panel">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="ml-4 flex-1 font-mono text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <span className="text-purple-600 dark:text-cyber-neon">➜</span>
                        <span className="text-purple-600/70 dark:text-cyber-neon/70">Quant Master Prompt:</span>
                        <span className="text-gray-800 dark:text-white opacity-90 truncate">"Monitor Curve wETH/sETH spread, if > 1.5% execute swap..."</span>
                        <span className="w-2 h-4 bg-purple-600 dark:bg-cyber-neon animate-pulse inline-block"></span>
                    </div>
                </div>

                {/* 2. Flow Animation (The Magic) */}
                <div className="p-10 relative min-h-[180px] flex items-center justify-center gap-4 md:gap-8 overflow-x-auto bg-transparent">
                    {/* Background Trace Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-300 dark:bg-gray-700 -z-10"></div>
                    
                    {/* Nodes */}
                    <NodeVisual icon={<Activity size={20} />} label="Binance Feed" color="text-yellow-600 dark:text-yellow-400" borderColor="border-yellow-400" />
                    <ConnectionBeam />
                    <NodeVisual icon={<Brain size={20} />} label="AI Logic" color="text-purple-600 dark:text-cyber-neon" borderColor="border-purple-500 dark:border-cyber-neon" pulse />
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
                    className="group relative px-10 py-5 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black font-bold text-xl uppercase tracking-widest clip-path-polygon hover:bg-purple-700 dark:hover:bg-white transition-all duration-300 shadow-xl shadow-purple-500/30 dark:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                >
                    <span className="flex items-center gap-3 relative z-10">
                        Enter Master Studio <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </button>
                
                <button 
                    onClick={() => onNavigate(Page.DASHBOARD)}
                    className="px-8 py-4 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold text-lg uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-900 dark:hover:border-white transition-all duration-300 clip-path-polygon backdrop-blur-sm"
                >
                    View Dashboard
                </button>
            </div>
        </section>

        {/* II. THREE PILLARS (The Pillars of Mastery) */}
        <section className="relative z-10 py-32 bg-gray-50 dark:bg-[#08080a] transition-colors">
             {/* Background Texture: Dot Pattern */}
             <div className="absolute inset-0 bg-dot-pattern opacity-[0.15] dark:opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">The Trinity of Automation</h2>
                    <div className="w-24 h-1 bg-purple-600 dark:bg-cyber-neon mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Pillar 1: AI Brain */}
                    <div className="glass-panel p-10 rounded-lg border border-gray-200 dark:border-cyber-neon/10 hover:border-purple-400 dark:hover:border-cyber-neon/60 transition-colors group relative overflow-hidden bg-white dark:bg-[#0c0c10] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none">
                        <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity">
                            <Brain size={120} className="text-purple-600 dark:text-cyber-neon -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-purple-50 dark:bg-cyber-neon/5 border border-purple-100 dark:border-cyber-neon/20 group-hover:bg-purple-100 dark:group-hover:bg-cyber-neon/20 transition-colors">
                            <Brain className="w-8 h-8 text-purple-600 dark:text-cyber-neon" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">THE QUANT MASTER BRAIN</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed z-10 relative">
                            Generate sophisticated, high-alpha strategies using simple prompts. Instantly turn your trading intuition into executable smart contract logic.
                        </p>
                    </div>

                    {/* Pillar 2: Visual Canvas */}
                    <div className="glass-panel p-10 rounded-lg border border-gray-200 dark:border-cyber-purple/10 hover:border-pink-400 dark:hover:border-cyber-purple/60 transition-colors group relative overflow-hidden bg-white dark:bg-[#0c0c10] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none">
                         <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity">
                            <Workflow size={120} className="text-pink-600 dark:text-cyber-purple -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-pink-50 dark:bg-cyber-purple/5 border border-pink-100 dark:border-cyber-purple/20 group-hover:bg-pink-100 dark:group-hover:bg-cyber-purple/20 transition-colors">
                            <Layers className="w-8 h-8 text-pink-600 dark:text-cyber-purple" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">THE MASTER STRATEGY CANVAS</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed z-10 relative">
                            Drag-and-drop nodes to visually refine and audit complex financial logic. Build like an expert, with zero code or error risk.
                        </p>
                    </div>

                    {/* Pillar 3: Execution */}
                    <div className="glass-panel p-10 rounded-lg border border-gray-200 dark:border-cyber-pink/10 hover:border-blue-400 dark:hover:border-cyber-pink/60 transition-colors group relative overflow-hidden bg-white dark:bg-[#0c0c10] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none">
                         <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity">
                            <Shield size={120} className="text-blue-600 dark:text-cyber-pink -rotate-12" />
                        </div>
                        <div className="mb-8 inline-flex p-4 rounded-full bg-blue-50 dark:bg-cyber-pink/5 border border-blue-100 dark:border-cyber-pink/20 group-hover:bg-blue-100 dark:group-hover:bg-cyber-pink/20 transition-colors">
                            <Shield className="w-8 h-8 text-blue-600 dark:text-cyber-pink" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">MASTER-LEVEL EXECUTION</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed z-10 relative">
                            Deploy secure, rule-based DeFi Vaults (Non-Custodial). Your keys, your rules. Ensure secure, low-latency execution 24/7.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* IV. FINAL CTA + BACKED BY */}
        <section className="relative z-10 py-32 px-6 text-center bg-white dark:bg-[#0a0a0f]">
             {/* Dynamic Background for CTA */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-50/50 via-transparent to-white dark:from-cyber-neon/5 dark:via-cyber-purple/5 dark:to-[#0a0a0f] pointer-events-none"></div>
            {/* Animated Horizontal Beam */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 dark:via-cyber-neon to-transparent opacity-50 animate-flow-beam"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tighter leading-tight">
                    STOP TRADING. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-cyber-pink dark:to-cyber-purple animate-pulse">START AUTOMATING.</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    Your alpha is waiting. Deploy your first automated strategy in minutes and elevate your status from emotional trader to Quant Master.
                </p>
                <button 
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="px-16 py-6 bg-purple-600 dark:bg-white text-white dark:text-black font-bold text-2xl uppercase tracking-widest clip-path-polygon hover:bg-purple-700 dark:hover:bg-cyber-neon transition-all duration-300 shadow-xl shadow-purple-500/20 dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_60px_rgba(0,243,255,0.5)] transform hover:-translate-y-1"
                >
                    ENTER MASTER STUDIO <ArrowRight className="inline ml-2" />
                </button>

                {/* BACKED BY SECTION (Moved Here) */}
                <div className="mt-32 pt-16 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-12">Backed By Industry Leaders</h3>
                    
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 grayscale hover:grayscale-0 transition-all duration-500">
                         {/* Logo 1 */}
                         <div className="group opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-[#FCD535]/50 transition-colors shadow-sm dark:shadow-lg">
                                <svg viewBox="0 0 32 32" className="w-8 h-8 text-[#FCD535] fill-current"><path d="M16 4l-6 6 6 6 6-6-6-6zm-9 9l-6 6 6 6 6-6-6-6zm9 9l-6 6 6 6 6-6-6-6zm9-9l-6 6 6 6 6-6-6-6z" /></svg>
                            </div>
                         </div>

                         {/* Logo 2 */}
                         <div className="group opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-[#00EF8B]/50 transition-colors shadow-sm dark:shadow-lg">
                                <svg viewBox="0 0 32 32" className="w-8 h-8 text-[#00EF8B] fill-current"><path d="M8 8h16v4h-16zM8 16h10v4h-10zM8 24h6v4h-6z" /></svg>
                            </div>
                         </div>

                         {/* Logo 3 */}
                         <div className="group opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-lg">
                                 <svg viewBox="0 0 32 32" className="w-8 h-8 text-black dark:text-white fill-none stroke-current stroke-2"><circle cx="16" cy="16" r="10" /><path d="M10 20l6-8 6 8" /></svg>
                            </div>
                         </div>

                         {/* Logo 4 */}
                         <div className="group opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-purple-400/50 transition-colors shadow-sm dark:shadow-lg">
                                <svg viewBox="0 0 32 32" className="w-8 h-8"><path d="M4 8h24l-4 4H4z" fill="#9945FF"/><path d="M8 16h24l-4 4H8z" fill="#14F195"/><path d="M4 24h24l-4 4H4z" fill="#9945FF"/></svg>
                            </div>
                         </div>

                         {/* Logo 5 */}
                         <div className="group opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-colors shadow-sm dark:shadow-lg">
                                <div className="w-8 h-8 rounded-full border-4 border-blue-500"></div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>

        {/* V. FOOTER (UPDATED) */}
        <footer className="py-8 px-6 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 z-20 relative font-mono text-xs text-gray-500 dark:text-gray-400">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* System Status Text */}
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="uppercase tracking-widest text-[10px] md:text-xs">
                        SYSTEM_VERSION: 2.0.45 // TRADING_FLOW_PROTOCOL // POWERED_BY_AI
                    </span>
                </div>

                {/* Socials */}
                <div className="flex gap-4">
                     <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Twitter size={16} /></a>
                     <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Github size={16} /></a>
                     <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Disc size={16} /></a>
                     <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Linkedin size={16} /></a>
                 </div>
            </div>
        </footer>
    </div>
  );
};

// --- Sub-components for Visuals ---

const NodeVisual: React.FC<{ icon: React.ReactNode, label: string, color: string, borderColor: string, pulse?: boolean }> = ({ icon, label, color, borderColor, pulse }) => (
    <div className={`relative flex flex-col items-center gap-3 z-10 group cursor-default ${pulse ? 'animate-pulse' : ''}`}>
        <div className={`w-16 h-16 rounded-xl bg-white dark:bg-cyber-black border-2 ${borderColor} flex items-center justify-center ${color} shadow-lg dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 duration-300 z-10 relative bg-opacity-90 dark:bg-opacity-90`}>
            {icon}
        </div>
        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${color} bg-white/90 dark:bg-black/80 border border-gray-200 dark:border-white/10 px-2 py-1 rounded backdrop-blur-md shadow-sm`}>{label}</span>
    </div>
);

const ConnectionBeam: React.FC = () => (
    <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-800 relative min-w-[40px] max-w-[100px] overflow-hidden rounded-full">
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-purple-400 dark:via-cyber-neon to-transparent animate-flow-beam"></div>
    </div>
);
