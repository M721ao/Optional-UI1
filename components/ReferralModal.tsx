import React, { useState } from 'react';
import { X, Copy, Gift, Users, Share2, Award, Zap, Check, Trophy } from 'lucide-react';
import { UserProfile } from '../types';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'invite' | 'network'>('invite');
  const [copied, setCopied] = useState(false);
  const [bindCode, setBindCode] = useState('');
  const [isBinding, setIsBinding] = useState(false);
  const [bindSuccess, setBindSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBind = () => {
    if (!bindCode) return;
    setIsBinding(true);
    // Simulate API call
    setTimeout(() => {
        setIsBinding(false);
        setBindSuccess(true);
    }, 1200);
  };

  // Mock Referral Data
  const referrals = [
      { id: 1, name: 'Alice_WAGMI', date: '2 days ago', status: 'Active', reward: '500 CR', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: 2, name: 'CryptoKing99', date: '5 days ago', status: 'Active', reward: '500 CR', avatar: 'https://i.pravatar.cc/150?u=2' },
      { id: 3, name: 'SolanaMaxi', date: '1 week ago', status: 'Pending', reward: '0 CR', avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121218]">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                    <Trophy size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Referral Program</h2>
                    <p className="text-xs text-gray-500">Invite friends, earn compute credits.</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-white/10">
            <button 
                onClick={() => setActiveTab('invite')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'invite' ? 'border-purple-600 dark:border-cyber-neon text-purple-600 dark:text-cyber-neon bg-gray-50 dark:bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
            >
                Invite & Earn
            </button>
            <button 
                onClick={() => setActiveTab('network')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'network' ? 'border-purple-600 dark:border-cyber-neon text-purple-600 dark:text-cyber-neon bg-gray-50 dark:bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
            >
                My Network
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-[#0c0c10]">
            
            {/* TAB: INVITE */}
            {activeTab === 'invite' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    
                    {/* Your Code Section */}
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 dark:from-cyber-purple dark:to-cyber-neon p-6 md:p-8 text-white shadow-lg">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Your Exclusive Invite Code</div>
                                <div className="text-3xl md:text-4xl font-mono font-bold tracking-wider drop-shadow-md">{user.inviteCode}</div>
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 dark:text-black font-bold uppercase rounded-lg shadow-xl hover:scale-105 transition-transform active:scale-95"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* Rules Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                                <Share2 size={20} />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">1. Share Code</h4>
                            <p className="text-xs text-gray-500 mt-1">Send your unique code to friends or community.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                                <Users size={20} />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">2. They Join</h4>
                            <p className="text-xs text-gray-500 mt-1">Friends sign up and connect their wallet.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center justify-center mb-3">
                                <Award size={20} />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">3. Both Earn</h4>
                            <p className="text-xs text-gray-500 mt-1">You get <span className="text-yellow-600 dark:text-yellow-500 font-bold">500 Credits</span>, they get 200.</p>
                        </div>
                    </div>

                    {/* Bind Referrer Section */}
                    <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Gift size={16} className="text-pink-500" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Did someone invite you?</span>
                        </div>
                        
                        {!bindSuccess ? (
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    value={bindCode}
                                    onChange={(e) => setBindCode(e.target.value)}
                                    placeholder="Enter their Invite Code"
                                    className="flex-1 bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 dark:focus:border-cyber-neon text-gray-900 dark:text-white"
                                />
                                <button 
                                    onClick={handleBind}
                                    disabled={!bindCode || isBinding}
                                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    {isBinding ? '...' : 'Claim'}
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center gap-3">
                                <div className="p-1 bg-green-500 rounded-full text-white"><Check size={12} /></div>
                                <span className="text-sm text-green-700 dark:text-green-400 font-bold">Success! You received +200 Credits.</span>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-500 mt-2 ml-1">
                            * Enter a valid code to receive a one-time welcome bonus of 200 Compute Credits.
                        </p>
                    </div>
                </div>
            )}

            {/* TAB: NETWORK */}
            {activeTab === 'network' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Earned</div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-cyber-neon font-mono flex items-baseline gap-1">
                                1,500 <span className="text-sm text-gray-400">CR</span>
                            </div>
                        </div>
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Friends Invited</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                                3 <span className="text-sm text-gray-400">Users</span>
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 dark:bg-[#121218] border-b border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                            <span>User</span>
                            <span>Reward Status</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {referrals.map((ref) => (
                                <div key={ref.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={ref.avatar} alt={ref.name} className="w-8 h-8 rounded-full bg-gray-200" />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{ref.name}</div>
                                            <div className="text-[10px] text-gray-500">{ref.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold font-mono ${ref.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                            +{ref.reward}
                                        </div>
                                        <div className="text-[9px] text-gray-400 uppercase">{ref.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Claim Button */}
                    <div className="p-4 bg-purple-50 dark:bg-cyber-purple/10 rounded-xl border border-purple-100 dark:border-cyber-purple/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-cyber-purple/20 text-purple-600 dark:text-cyber-neon rounded-lg">
                                <Zap size={18} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white uppercase">Unclaimed Rewards</div>
                                <div className="text-xs text-purple-600 dark:text-cyber-neon font-bold font-mono">500 Credits Available</div>
                            </div>
                        </div>
                        <button className="px-5 py-2 bg-purple-600 dark:bg-cyber-neon text-white dark:text-black font-bold uppercase rounded text-xs hover:opacity-90 transition-opacity shadow-lg">
                            Claim Now
                        </button>
                    </div>

                </div>
            )}
        </div>
      </div>
    </div>
  );
};