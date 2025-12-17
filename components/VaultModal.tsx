
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Wallet, ShieldCheck, AlertCircle, Plus, ChevronDown, Check, Search, Loader2 } from 'lucide-react';
import { VaultAsset } from '../types';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  tokens: VaultAsset[];
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose, type, tokens }) => {
  // Steps: input (select+amount) -> confirm -> processing -> success
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset | null>(null);
  const [amount, setAmount] = useState('');
  
  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Custom Token State
  const [customAddress, setCustomAddress] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
        setStep('input');
        setAmount('');
        // Default to first token if available
        setSelectedAsset(tokens.length > 0 ? tokens[0] : null);
        setIsDropdownOpen(false);
        setCustomAddress('');
        setIsVerifying(false);
    }
  }, [isOpen, tokens]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSelectAsset = (asset: VaultAsset) => {
      setSelectedAsset(asset);
      setIsDropdownOpen(false);
  };

  const handleAddCustomToken = () => {
      // Mock validation logic
      if (customAddress.length > 5) {
          setIsVerifying(true);
          
          // Simulate network verification delay
          setTimeout(() => {
              const newAsset: VaultAsset = {
                  symbol: 'CUSTOM',
                  name: `Token ${customAddress.slice(0, 4)}...`,
                  balance: 0,
                  value: 0,
                  icon: 'bg-gray-500'
              };
              setSelectedAsset(newAsset);
              setCustomAddress('');
              setIsVerifying(false);
              setIsDropdownOpen(false);
          }, 1000);
      }
  };

  const handleMax = () => {
      if (selectedAsset) {
        setAmount(selectedAsset.balance.toString());
      }
  };

  const handleConfirm = () => {
    setStep('processing');
    // Simulate transaction delay
    setTimeout(() => {
        setStep('success');
    }, 2000);
  };

  const handleBack = () => {
      if (step === 'confirm') {
          setStep('input');
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121218]">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${type === 'deposit' ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-red-500/10 text-red-600 dark:text-red-500'}`}>
                    <ArrowRight size={16} className={type === 'deposit' ? '-rotate-45' : 'rotate-45'} />
                </div>
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {type} {selectedAsset ? selectedAsset.symbol : 'Assets'}
                </span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors" title="Close Modal">
                <X size={18} />
            </button>
        </div>

        {/* Content Body */}
        <div className="p-6 min-h-[350px] flex flex-col">
            
            {/* STEP 1: INPUT (Combined Selection + Amount) */}
            {step === 'input' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 flex-1 flex flex-col">
                    
                    {/* Asset Selector Dropdown */}
                    <div className="space-y-2 relative z-20" ref={dropdownRef}>
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest flex justify-between">
                            <span>Select Asset</span>
                        </label>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border bg-gray-50 dark:bg-white/5 transition-all ${isDropdownOpen ? 'border-purple-500 dark:border-cyber-neon ring-1 ring-purple-500/20 dark:ring-cyber-neon/20' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
                            >
                                {selectedAsset ? (
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm ${selectedAsset.icon}`}>
                                            {selectedAsset.symbol[0]}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{selectedAsset.symbol}</div>
                                            <div className="text-[10px] text-gray-500 mt-0.5">{selectedAsset.name}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500">Select a token...</span>
                                )}
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                                    {/* Search Bar */}
                                    <div className="p-2 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a20] shrink-0">
                                        <div className="relative">
                                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Search assets..." 
                                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded pl-8 pr-2 py-1.5 text-xs focus:outline-none focus:border-purple-500 dark:focus:border-cyber-neon text-gray-900 dark:text-white placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Scrollable List */}
                                    <div className="p-1 max-h-[160px] overflow-y-auto">
                                        {tokens.map((token, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => handleSelectAsset(token)}
                                                className={`w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group ${selectedAsset?.symbol === token.symbol ? 'bg-purple-50 dark:bg-cyber-neon/10' : ''}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm ${token.icon}`}>
                                                        {token.symbol[0]}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className={`text-xs font-bold ${selectedAsset?.symbol === token.symbol ? 'text-purple-700 dark:text-cyber-neon' : 'text-gray-900 dark:text-white'}`}>{token.symbol}</div>
                                                        <div className="text-[9px] text-gray-500">{token.name}</div>
                                                    </div>
                                                </div>
                                                {selectedAsset?.symbol === token.symbol && <Check size={14} className="text-purple-600 dark:text-cyber-neon" />}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Fixed Footer: Inline Custom Input */}
                                    <div className="p-2 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#15151a] shrink-0">
                                        <div className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 ml-1">Add Custom Token</div>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={customAddress}
                                                onChange={(e) => setCustomAddress(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddCustomToken();
                                                }}
                                                placeholder="0x... Contract Address"
                                                className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white p-1.5 pl-2 rounded text-[10px] font-mono outline-none focus:border-purple-500 dark:focus:border-cyber-neon"
                                            />
                                            <button 
                                                onClick={handleAddCustomToken}
                                                disabled={!customAddress || isVerifying}
                                                className="w-8 flex items-center justify-center bg-purple-600 dark:bg-cyber-neon text-white dark:text-black rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                                                title="Add Token"
                                            >
                                                {isVerifying ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 font-mono">
                            <span>AMOUNT</span>
                            {selectedAsset && (
                                <span className="flex items-center gap-1">
                                    <Wallet size={10} /> Bal: {selectedAsset.balance.toLocaleString()} {selectedAsset.symbol}
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-cyber-neon text-gray-900 dark:text-white text-2xl font-bold py-3 pl-4 pr-16 rounded outline-none placeholder:text-gray-400 dark:placeholder:text-gray-700 transition-colors"
                            />
                            <button 
                                onClick={handleMax}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white/50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-purple-600 dark:text-cyber-neon px-2 py-1 rounded transition-colors"
                                title="Use Max Balance"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 p-3 rounded flex gap-3">
                        <AlertCircle size={16} className="text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-[10px] text-blue-700 dark:text-blue-200 leading-relaxed">
                            Start small. This vault interacts with complex DeFi strategies. Ensure you understand the risks.
                        </div>
                    </div>

                    <div className="mt-auto pt-4">
                        <button 
                            onClick={() => setStep('confirm')}
                            disabled={!amount || Number(amount) <= 0 || !selectedAsset}
                            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-cyber-neon transition-colors disabled:opacity-50 disabled:cursor-not-allowed clip-path-polygon text-xs shadow-lg"
                        >
                            Review Transaction
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: CONFIRMATION */}
            {step === 'confirm' && selectedAsset && (
                <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                    <div className="space-y-1 mt-4">
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Confirm {type}</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white font-mono">{amount} <span className="text-lg text-gray-400">{selectedAsset.symbol}</span></div>
                    </div>

                    <div className="space-y-2 bg-gray-50 dark:bg-white/5 p-4 rounded border border-gray-200 dark:border-white/5 mx-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Gas Fee</span>
                            <span className="text-gray-900 dark:text-white font-mono">~0.004 ETH</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Wait Time</span>
                            <span className="text-gray-900 dark:text-white font-mono">~12 sec</span>
                        </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
                        <button 
                            onClick={handleBack}
                            className="py-3 bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-bold uppercase hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded text-xs"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="py-3 bg-purple-600 dark:bg-cyber-purple text-white font-bold uppercase hover:bg-purple-700 dark:hover:bg-cyber-purple/80 transition-colors rounded shadow-lg dark:shadow-[0_0_15px_rgba(188,19,254,0.4)] text-xs"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {step === 'processing' && (
                 <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500 flex-1">
                    <div className="w-16 h-16 border-4 border-gray-200 dark:border-white/10 border-t-purple-600 dark:border-t-cyber-neon rounded-full animate-spin"></div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest animate-pulse">Processing...</div>
                    <div className="text-xs text-gray-500">Please confirm in your wallet</div>
                 </div>
            )}

            {step === 'success' && (
                <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-300 flex-1">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                        <ShieldCheck size={40} className="text-green-600 dark:text-green-500" />
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest">Transaction Sent</div>
                        <div className="text-xs text-gray-500">Your assets are moving securely.</div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-full text-xs shadow-lg"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
