import React, { useState } from 'react';
import { X, Wallet, Mail, ChevronDown } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (method: 'web2' | 'web3') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'web2' | 'web3'>('web3');
  const [selectedChain, setSelectedChain] = useState('Ethereum');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a0a0f] border border-cyber-neon/30 rounded-lg shadow-[0_0_30px_rgba(0,243,255,0.2)] relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-cyber-panel">
          <h2 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
            ACCESS <span className="text-cyber-neon">GATEWAY</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab('web3')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'web3' ? 'bg-cyber-neon/10 text-cyber-neon border-b-2 border-cyber-neon' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Web3 Wallet
          </button>
          <button 
             onClick={() => setActiveTab('web2')}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'web2' ? 'bg-cyber-pink/10 text-cyber-pink border-b-2 border-cyber-pink' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Social Login
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {activeTab === 'web3' && (
            <>
              {/* Chain Selector */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-mono uppercase">Select Network</label>
                <div className="relative">
                  <select 
                    value={selectedChain} 
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="w-full bg-black border border-gray-700 text-white p-3 rounded appearance-none focus:border-cyber-neon outline-none"
                  >
                    <option>Ethereum</option>
                    <option>Solana</option>
                    <option>Arbitrum</option>
                    <option>Base</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Wallets */}
              <div className="space-y-3">
                <button 
                  onClick={() => onLogin('web3')}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded hover:bg-cyber-neon/10 hover:border-cyber-neon transition-all group"
                >
                  <span className="font-bold text-white group-hover:text-cyber-neon flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div> MetaMask
                  </span>
                  <span className="text-xs text-gray-500 font-mono">DETECTED</span>
                </button>
                
                <button 
                  onClick={() => onLogin('web3')}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded hover:bg-cyber-neon/10 hover:border-cyber-neon transition-all group"
                >
                  <span className="font-bold text-white group-hover:text-cyber-neon flex items-center gap-3">
                    <div className="w-6 h-6 bg-black border border-white rounded-full"></div> OKX Wallet
                  </span>
                </button>

                <button 
                   onClick={() => onLogin('web3')}
                   className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded hover:bg-cyber-neon/10 hover:border-cyber-neon transition-all group"
                >
                  <span className="font-bold text-white group-hover:text-cyber-neon flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full"></div> Phantom
                  </span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'web2' && (
             <div className="space-y-3 py-4">
                <button 
                  onClick={() => onLogin('web2')}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </button>
                <div className="text-center text-xs text-gray-500 my-4">- OR -</div>
                 <button className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 text-white font-bold rounded hover:bg-white/10 border border-white/10 transition-colors">
                  <Mail size={18} />
                  Sign up with Email
                </button>
             </div>
          )}

          <div className="text-[10px] text-center text-gray-600">
            By connecting, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};