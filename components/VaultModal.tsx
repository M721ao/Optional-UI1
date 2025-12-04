import React, { useState } from 'react';
import { X, ArrowRight, Wallet, ShieldCheck, AlertCircle, Plus } from 'lucide-react';
import { VaultAsset } from '../types';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  tokens: VaultAsset[];
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose, type, tokens }) => {
  const [step, setStep] = useState<'select-asset' | 'input' | 'confirm' | 'processing' | 'success'>('select-asset');
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset | null>(null);
  const [amount, setAmount] = useState('');
  
  // Custom token state
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

  if (!isOpen) return null;

  const handleSelectAsset = (asset: VaultAsset) => {
      setSelectedAsset(asset);
      setStep('input');
  };

  const handleCustomToken = () => {
      // Mock validation
      if (customAddress.length > 10) {
          const newAsset: VaultAsset = {
              symbol: 'CUSTOM',
              name: 'Custom Token',
              balance: 0,
              value: 0,
              icon: 'bg-gray-500'
          };
          setSelectedAsset(newAsset);
          setStep('input');
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

  const handleClose = () => {
      setStep('select-asset');
      setSelectedAsset(null);
      setAmount('');
      setCustomAddress('');
      setIsCustomToken(false);
      onClose();
  };

  const handleBack = () => {
      if (step === 'input') {
          setStep('select-asset');
          setAmount('');
      } else if (step === 'confirm') {
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
            <button onClick={handleClose} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors" title="Close Modal">
                <X size={18} />
            </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
            {/* STEP 1: SELECT ASSET */}
            {step === 'select-asset' && (
                <div className="space-y-4">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Select Token</div>
                    
                    {!isCustomToken ? (
                        <>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {tokens.map((token, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => handleSelectAsset(token)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/5 hover:border-purple-500 dark:hover:border-cyber-neon hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${token.icon}`}>
                                                {token.symbol[0]}
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyber-neon transition-colors">{token.symbol}</div>
                                                <div className="text-[10px] text-gray-500">{token.name}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-mono font-bold text-gray-900 dark:text-white">{token.balance}</div>
                                            <div className="text-[10px] text-gray-500">Available</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setIsCustomToken(true)}
                                className="w-full py-3 border border-dashed border-gray-300 dark:border-white/20 text-gray-500 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-white/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Add Custom Token
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-2">
                             <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 font-mono uppercase">Token Contract Address</label>
                                <input 
                                    type="text" 
                                    value={customAddress}
                                    onChange={(e) => setCustomAddress(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded text-xs font-mono outline-none focus:border-purple-500 dark:focus:border-cyber-neon"
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                 <button 
                                    onClick={() => setIsCustomToken(false)}
                                    className="py-3 text-xs font-bold uppercase text-gray-500 hover:text-black dark:hover:text-white border border-gray-200 dark:border-white/10 rounded"
                                 >
                                    Cancel
                                 </button>
                                 <button 
                                    onClick={handleCustomToken}
                                    className="py-3 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black text-xs font-bold uppercase rounded hover:opacity-90"
                                    disabled={!customAddress}
                                 >
                                    Add Token
                                 </button>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 2: INPUT AMOUNT */}
            {step === 'input' && selectedAsset && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 font-mono">
                            <span>AMOUNT</span>
                            <span className="flex items-center gap-1">
                                <Wallet size={10} /> Bal: {selectedAsset.balance} {selectedAsset.symbol}
                            </span>
                        </div>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-cyber-neon text-gray-900 dark:text-white text-2xl font-bold py-3 pl-4 pr-16 rounded outline-none placeholder:text-gray-400 dark:placeholder:text-gray-700"
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
                            Start small. This vault interacts with complex DeFi strategies. Ensure you understand the risks before depositing large amounts.
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                             onClick={handleBack}
                             className="py-3 bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-bold uppercase hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded text-xs"
                        >
                            Back
                        </button>
                        <button 
                            onClick={() => setStep('confirm')}
                            disabled={!amount || Number(amount) <= 0}
                            className="py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-cyber-neon transition-colors disabled:opacity-50 disabled:cursor-not-allowed clip-path-polygon text-xs"
                        >
                            Review
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 'confirm' && selectedAsset && (
                <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Confirm {type}</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white font-mono">{amount} <span className="text-lg text-gray-400">{selectedAsset.symbol}</span></div>
                    </div>

                    <div className="space-y-2 bg-gray-50 dark:bg-white/5 p-4 rounded border border-gray-200 dark:border-white/5">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Gas Fee</span>
                            <span className="text-gray-900 dark:text-white font-mono">~0.004 ETH</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Wait Time</span>
                            <span className="text-gray-900 dark:text-white font-mono">~12 sec</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleBack}
                            className="py-3 bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-bold uppercase hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded text-xs"
                            title="Go Back"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="py-3 bg-purple-600 dark:bg-cyber-purple text-white font-bold uppercase hover:bg-purple-700 dark:hover:bg-cyber-purple/80 transition-colors rounded shadow-lg dark:shadow-[0_0_15px_rgba(188,19,254,0.4)] text-xs"
                            title="Submit Transaction"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {step === 'processing' && (
                 <div className="py-10 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
                    <div className="w-16 h-16 border-4 border-gray-200 dark:border-white/10 border-t-purple-600 dark:border-t-cyber-neon rounded-full animate-spin"></div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest animate-pulse">Processing on-chain...</div>
                    <div className="text-xs text-gray-500">Please confirm in your wallet</div>
                 </div>
            )}

            {step === 'success' && (
                <div className="py-6 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                        <ShieldCheck size={40} className="text-green-600 dark:text-green-500" />
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest">Transaction Sent</div>
                        <div className="text-xs text-gray-500">Your assets are moving securely.</div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-full"
                        title="Close"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};