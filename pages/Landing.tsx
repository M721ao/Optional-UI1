import React from 'react';
import { Page } from '../types';
import { ArrowRight, Cpu, Layers, ShieldCheck, Zap } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: Page) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        {/* Background ambient light */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-neon/10 rounded-full blur-[128px]"></div>

        <div className="max-w-6xl w-full z-10 flex flex-col items-center text-center space-y-8 mt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neon/30 bg-cyber-neon/10 text-cyber-neon text-xs font-mono tracking-widest uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse"></span>
                System Online // Protocol v2
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white uppercase leading-none">
                Automate The <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-purple drop-shadow-neon">Metaverse</span>
            </h1>

            <p className="max-w-2xl text-gray-400 text-lg md:text-xl font-light tracking-wide">
                Build complex DeFi flows, manage vaults, and execute smart contract logic with the power of generative AI. The first Nof1 automation studio.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
                <button 
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="group relative px-8 py-4 bg-cyber-neon text-black font-bold text-lg uppercase tracking-widest clip-path-polygon hover:bg-white transition-all duration-300"
                >
                    <span className="flex items-center gap-2">
                        Enter Workbench <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 border border-white group-hover:translate-x-1 group-hover:translate-y-1 transition-transform pointer-events-none mix-blend-exclusion"></div>
                </button>
                
                <button 
                    onClick={() => onNavigate(Page.DASHBOARD)}
                    className="px-8 py-4 border border-cyber-pink/50 text-cyber-pink font-bold text-lg uppercase tracking-widest hover:bg-cyber-pink/10 transition-all duration-300"
                >
                    View Dashboard
                </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left">
                <div className="glass-panel p-6 border-l-4 border-l-cyber-neon hover:border-l-white transition-colors group">
                    <Cpu className="w-10 h-10 text-cyber-neon mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">AI-Powered Logic</h3>
                    <p className="text-gray-400 text-sm">Generate Solidity snippets and flow logic instantly using our fine-tuned Gemini model.</p>
                </div>
                <div className="glass-panel p-6 border-l-4 border-l-cyber-purple hover:border-l-white transition-colors group">
                    <Layers className="w-10 h-10 text-cyber-purple mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Visual Flows</h3>
                    <p className="text-gray-400 text-sm">Drag-and-drop triggers and actions. Connect wallets, protocols, and vaults seamlessly.</p>
                </div>
                <div className="glass-panel p-6 border-l-4 border-l-cyber-pink hover:border-l-white transition-colors group">
                    <ShieldCheck className="w-10 h-10 text-cyber-pink mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Non-Custodial Vaults</h3>
                    <p className="text-gray-400 text-sm">Deploy Nof1 vaults. You own keys. You set the rules. Total asset control.</p>
                </div>
            </div>
        </div>
    </div>
  );
};