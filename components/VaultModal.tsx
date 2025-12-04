import React, { useState } from 'react';
import { X, ArrowRight, Wallet, ShieldCheck, AlertCircle } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  ticker: string;
  balance: number;
  decimals?: number;
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose, type, ticker, balance }) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');

  if (!isOpen) return null;

  const handleMax = () => setAmount(balance.toString());

  const handleConfirm = () => {
    setStep('processing');
    // Simulate transaction delay
    setTimeout(() => {
        setStep('success');
    }, 2000);
  };

  const handleClose = () => {
      setStep('input');
      setAmount('');
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0c0c10] border border-white/10 rounded-xl shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#121218]">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    <ArrowRight size={16} className={type === 'deposit' ? '-rotate-45' : 'rotate-45'} />
                </div>
                <span className="font-bold text-white uppercase tracking-wider">{type} {ticker}</span>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors" title="Close Modal">
                <X size={18} />
            </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
            {step === 'input' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 font-mono">
                            <span>AMOUNT</span>
                            <span className="flex items-center gap-1">
                                <Wallet size={10} /> Bal: {balance} {ticker}
                            </span>
                        </div>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-black/50 border border-gray-700 focus:border-cyber-neon text-white text-2xl font-bold py-3 pl-4 pr-16 rounded outline-none placeholder:text-gray-700"
                            />
                            <button 
                                onClick={handleMax}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white/10 hover:bg-white/20 text-cyber-neon px-2 py-1 rounded transition-colors"
                                title="Use Max Balance"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded flex gap-3">
                        <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-[10px] text-blue-200 leading-relaxed">
                            Start small. This vault interacts with complex DeFi strategies. Ensure you understand the risks before depositing large amounts.
                        </div>
                    </div>

                    <button 
                        onClick={() => setStep('confirm')}
                        disabled={!amount || Number(amount) <= 0}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyber-neon transition-colors disabled:opacity-50 disabled:cursor-not-allowed clip-path-polygon"
                        title="Review Transaction"
                    >
                        Review {type}
                    </button>
                </div>
            )}

            {step === 'confirm' && (
                <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Confirm {type}</div>
                        <div className="text-3xl font-bold text-white font-mono">{amount} <span className="text-lg text-gray-500">{ticker}</span></div>
                    </div>

                    <div className="space-y-2 bg-white/5 p-4 rounded border border-white/5">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Gas Fee</span>
                            <span className="text-white font-mono">~0.004 ETH</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Wait Time</span>
                            <span className="text-white font-mono">~12 sec</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setStep('input')}
                            className="py-3 bg-transparent border border-white/20 text-white font-bold uppercase hover:bg-white/5 transition-colors rounded"
                            title="Go Back"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="py-3 bg-cyber-purple text-white font-bold uppercase hover:bg-cyber-purple/80 transition-colors rounded shadow-[0_0_15px_rgba(188,19,254,0.4)]"
                            title="Submit Transaction"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {step === 'processing' && (
                 <div className="py-10 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-cyber-neon rounded-full animate-spin"></div>
                    <div className="text-sm font-bold text-white uppercase tracking-widest animate-pulse">Processing on-chain...</div>
                    <div className="text-xs text-gray-500">Please confirm in your wallet</div>
                 </div>
            )}

            {step === 'success' && (
                <div className="py-6 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                        <ShieldCheck size={40} className="text-green-500" />
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-xl font-bold text-white uppercase tracking-widest">Transaction Sent</div>
                        <div className="text-xs text-gray-500">Your assets are moving securely.</div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors rounded-full"
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