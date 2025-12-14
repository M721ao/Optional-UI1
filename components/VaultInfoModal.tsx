
import React from 'react';
import { X, Shield, Key, Code, AlertTriangle, ExternalLink } from 'lucide-react';

interface VaultInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultInfoModal: React.FC<VaultInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-6 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-500/10 flex items-start gap-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Shield size={24} fill="currentColor" className="opacity-90" />
            </div>
            <div className="flex-1 pt-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">About TradingFlow Vault</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    Secure, transparent, and self-custodial on-chain asset management
                </p>
            </div>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors -mt-2 -mr-2 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
            >
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
            
            {/* Item 1 */}
            <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="shrink-0 mt-0.5 text-blue-500 dark:text-blue-400">
                    <Key size={20} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    TradingFlow does not custody any user private keys or funds. Through on-chain vault contracts on different blockchains, your assets are always stored in a contract account that you fully control.
                </p>
            </div>

            {/* Item 2 */}
            <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="shrink-0 mt-0.5 text-green-500 dark:text-green-400">
                    <Shield size={20} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    For your own vault, only you have full rights to deposit and withdraw funds. Your asset security is guaranteed by the blockchain itself, and TradingFlow cannot touch your funds.
                </p>
            </div>

            {/* Item 3 */}
            <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="shrink-0 mt-0.5 text-purple-600 dark:text-purple-400">
                    <Code size={20} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    TradingFlow can only send transaction signals to your vault contract through workflows you create, and only with your explicit authorization. All operations require your clear consent.
                </p>
            </div>

            {/* Warning */}
            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 flex gap-3">
                <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed font-medium">
                    <span className="font-bold">Important:</span> If you lose your private key, TradingFlow cannot help you recover your funds. Please keep your private key and mnemonic phrase safe.
                </p>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#121218] border-t border-gray-200 dark:border-white/5 text-center">
            <a href="#" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline font-mono">
                <Code size={14} /> View vault contract source code (100% open source) <ExternalLink size={12} />
            </a>
        </div>

      </div>
    </div>
  );
};
