import React from 'react';
import { Page } from '../types';
import { Terminal, Zap, LayoutDashboard, Wallet, Hexagon } from 'lucide-react';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children }) => {
  return (
    <div className="min-h-screen bg-cyber-black text-gray-200 font-sans selection:bg-cyber-neon selection:text-black flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 h-16 flex items-center justify-between px-6">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate(Page.LANDING)}
        >
          <Hexagon className="w-8 h-8 text-cyber-neon group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-2xl font-bold tracking-wider text-white">NEON<span className="text-cyber-neon">FLOW</span></span>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate(Page.STUDIO)}
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === Page.STUDIO ? 'text-cyber-neon drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]' : 'text-gray-400 hover:text-white'}`}
          >
            <Terminal size={18} /> Workbench
          </button>
          <button 
             onClick={() => onNavigate(Page.DASHBOARD)}
             className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === Page.DASHBOARD ? 'text-cyber-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
        </div>

        <button className="flex items-center gap-2 bg-cyber-dark border border-cyber-neon/30 hover:border-cyber-neon hover:bg-cyber-neon/10 text-cyber-neon px-4 py-2 rounded-sm transition-all duration-300 font-mono text-sm uppercase">
          <Wallet size={16} />
          <span>0x4...9A2</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-cyber-black py-6 text-center text-xs text-gray-600 font-mono">
        <p>SYSTEM_VERSION: 2.0.45 // NEON_FLOW_PROTOCOL // SECURED_BY_GEMINI</p>
      </footer>
    </div>
  );
};