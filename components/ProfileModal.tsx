import React, { useState, useEffect } from 'react';
import { X, User, Camera, Mail, Save, CreditCard, Shield, Copy, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSave: (user: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onSave({ ...user, ...formData } as UserProfile);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const copyAddress = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121218]">
            <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-purple-500/10 text-purple-600 dark:text-cyber-neon">
                    <User size={16} />
                </div>
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Profile Settings
                </span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors" title="Close">
                <X size={18} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 dark:border-cyber-neon p-1">
                        <img 
                            src={formData.avatar} 
                            alt="Avatar" 
                            className="w-full h-full rounded-full object-cover" 
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} className="text-white" />
                    </div>
                </div>
                <button className="text-[10px] font-bold uppercase text-purple-600 dark:text-cyber-neon hover:underline">
                    Change Avatar
                </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                
                {/* Display Name */}
                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase font-bold">Display Name</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={formData.name || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white p-3 pl-10 rounded text-sm font-bold outline-none focus:border-purple-500 dark:focus:border-cyber-neon transition-colors"
                        />
                        <User size={14} className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                </div>

                {/* Wallet Address (Read Only) */}
                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase font-bold">Connected Wallet</label>
                    <div className="relative group">
                         <div className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 p-3 pl-10 rounded text-sm font-mono truncate">
                             {user.walletAddress}
                         </div>
                         <Shield size={14} className="absolute left-3 top-3.5 text-gray-400" />
                         <button 
                            onClick={copyAddress}
                            className="absolute right-3 top-2.5 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-black dark:hover:text-white"
                            title="Copy Address"
                         >
                             {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                         </button>
                    </div>
                </div>

                {/* Plan Info */}
                 <div className="bg-purple-50 dark:bg-cyber-purple/10 border border-purple-100 dark:border-cyber-purple/20 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-black/20 rounded-full text-purple-600 dark:text-cyber-neon">
                            <CreditCard size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white uppercase">Current Plan</div>
                            <div className="text-[10px] text-purple-600 dark:text-cyber-neon font-bold tracking-wider">{user.plan} TIER</div>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 bg-white dark:bg-black/20 border border-purple-200 dark:border-cyber-purple/30 rounded text-[10px] font-bold uppercase text-purple-600 dark:text-cyber-neon hover:bg-purple-50 dark:hover:bg-cyber-purple/20 transition-colors">
                        Upgrade
                    </button>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                    onClick={onClose}
                    className="py-3 bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-bold uppercase hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded text-xs"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:bg-gray-800 dark:hover:bg-cyber-neon transition-colors rounded shadow-lg flex items-center justify-center gap-2 text-xs"
                >
                    {isSaving ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save size={14} /> Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};