
import React, { useState } from 'react';
import { Page, UserProfile } from '../types';
import { Terminal, LayoutDashboard, Wallet, User, LogOut, FileText, Moon, Sun, Globe, Copy, MessageCircle, Gift } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { ProfileModal } from './ProfileModal';
import { PricingModal } from './PricingModal';
import { CreditsMenu } from './CreditsMenu';
import { ReferralModal } from './ReferralModal';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children, theme, toggleTheme }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreditsMenuOpen, setIsCreditsMenuOpen] = useState(false);
  
  // Default to logged-in state as requested
  const [user, setUser] = useState<UserProfile | null>({
      id: 'u1',
      name: 'NeonMaster',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      credits: 2400,
      inviteCode: 'FLOW-8821',
      plan: 'FREE',
      walletAddress: '0x71C...38A9',
      chain: 'ETH'
  });

  // Mock Login Handler
  const handleLogin = (method: 'web2' | 'web3') => {
    // Simulate API Call
    setTimeout(() => {
        setUser({
            id: 'u1',
            name: method === 'web3' ? '0x71...8A9' : 'NeonMaster',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            credits: 2400,
            inviteCode: 'FLOW-8821',
            plan: 'FREE',
            walletAddress: '0x71C...38A9',
            chain: 'ETH'
        });
        setIsAuthModalOpen(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
      setUser(updatedUser);
  };

  return (
    <div className="h-screen bg-white dark:bg-cyber-black text-gray-900 dark:text-gray-200 font-sans selection:bg-cyber-neon selection:text-black flex flex-col overflow-hidden transition-colors duration-300">
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user} 
        onSave={handleUpdateProfile} 
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      {/* Referral Modal */}
      {user && (
        <ReferralModal
          isOpen={isReferralModalOpen}
          onClose={() => setIsReferralModalOpen(false)}
          user={user}
        />
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-gray-200 dark:border-white/10 h-16 flex-none flex items-center justify-between px-6 transition-all">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate(Page.LANDING)}
          title="Return to Home"
        >
          {/* Custom TradingFlow Logo (Mini Version) */}
          <div className="relative w-8 h-8">
             <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full drop-shadow-[0_0_8px_rgba(188,19,254,0.5)] group-hover:rotate-90 transition-transform duration-700 ease-in-out"
            >
                <defs>
                    <linearGradient id="nav-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff00ff" />
                        <stop offset="100%" stopColor="#bc13fe" />
                    </linearGradient>
                    <linearGradient id="nav-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff7e5f" />
                        <stop offset="100%" stopColor="#feb47b" />
                    </linearGradient>
                    <linearGradient id="nav-grad3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#bc13fe" />
                        <stop offset="100%" stopColor="#240b36" />
                    </linearGradient>
                    <linearGradient id="nav-grad4" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fcee0a" />
                        <stop offset="100%" stopColor="#fb8c00" />
                    </linearGradient>
                </defs>
                <path d="M52 50 Q 52 20 80 20 L 80 48 Q 52 48 52 50" fill="url(#nav-grad1)" />
                <path d="M50 52 Q 80 52 80 80 L 52 80 Q 52 52 50 52" fill="url(#nav-grad2)" />
                <path d="M48 50 Q 48 80 20 80 L 20 52 Q 48 52 48 50" fill="url(#nav-grad3)" />
                <path d="M50 48 Q 20 48 20 20 L 48 20 Q 48 48 50 48" fill="url(#nav-grad4)" />
                <circle cx="50" cy="50" r="4" fill="#fff" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
            Trading<span className="text-purple-600 dark:text-cyber-neon">Flow</span>
          </span>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate(Page.STUDIO)}
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === Page.STUDIO ? 'text-purple-600 dark:text-cyber-neon drop-shadow-[0_0_5px_rgba(188,19,254,0.5)] dark:drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
            title="Open Strategy Builder"
          >
            <Terminal size={18} />  Studio
          </button>
          <button 
             onClick={() => onNavigate(Page.DASHBOARD)}
             className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === Page.DASHBOARD ? 'text-cyber-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
             title="View Asset Dashboard"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
        </div>

        <div className="flex items-center gap-4">
            {!user ? (
                <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-cyber-dark border border-gray-300 dark:border-cyber-neon/30 hover:border-cyber-neon hover:bg-cyber-neon/10 text-gray-800 dark:text-cyber-neon px-4 py-2 rounded-sm transition-all duration-300 font-mono text-sm uppercase group"
                    title="Connect Wallet"
                >
                    <Wallet size={16} className="text-purple-600 dark:text-cyber-neon group-hover:animate-pulse" />
                    <span>Connect</span>
                </button>
            ) : (
                <div className="flex items-center gap-6 relative">
                    {/* Credits Display - Clickable Trigger */}
                    <button 
                        onClick={() => setIsCreditsMenuOpen(!isCreditsMenuOpen)}
                        className="hidden md:flex flex-col items-end hover:bg-gray-100 dark:hover:bg-white/5 p-1 rounded transition-colors group relative"
                        title="Manage Compute Credits"
                    >
                        <span className="text-[10px] text-gray-500 font-mono tracking-wider group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">CREDITS</span>
                        <span className="text-sm font-bold text-purple-600 dark:text-cyber-neon font-mono dark:text-glow transition-all">{user.credits.toLocaleString()}</span>
                        
                        {/* Credits Menu Popover */}
                        <CreditsMenu 
                            isOpen={isCreditsMenuOpen} 
                            onClose={() => setIsCreditsMenuOpen(false)} 
                            user={user}
                            onOpenPricing={() => {
                                setIsCreditsMenuOpen(false);
                                setIsPricingModalOpen(true);
                            }}
                        />
                    </button>

                    {/* Avatar & Dropdown Trigger */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-10 h-10 rounded-full border border-purple-200 dark:border-cyber-neon/50 p-0.5 overflow-hidden hover:shadow-[0_0_10px_rgba(188,19,254,0.5)] dark:hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all"
                            title="User Menu"
                        >
                            <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/10 rounded-md shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                                    {/* User Info Header */}
                                    <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                        <div className="font-bold text-gray-900 dark:text-white truncate">{user.name}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono bg-gray-200 dark:bg-black/50 px-1.5 py-0.5 rounded">INVITE: {user.inviteCode}</span>
                                            <button 
                                                className="text-gray-500 hover:text-black dark:hover:text-white" 
                                                title="Copy Invite Code"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(user.inviteCode);
                                                }}
                                            >
                                                <Copy size={10} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2 space-y-1">
                                        <button 
                                            onClick={() => { setIsDropdownOpen(false); setIsProfileModalOpen(true); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white rounded transition-colors text-left"
                                        >
                                            <User size={14} /> Profile Settings
                                        </button>

                                        <button 
                                            onClick={() => { setIsDropdownOpen(false); setIsReferralModalOpen(true); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white rounded transition-colors text-left"
                                        >
                                            <Gift size={14} /> Referrals & Rewards
                                        </button>
                                        
                                        <button 
                                            onClick={() => { setIsDropdownOpen(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white rounded transition-colors text-left"
                                        >
                                            <FileText size={14} /> Documentation
                                        </button>
                                        
                                        <a 
                                            href="https://t.me/neonflow_support"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white rounded transition-colors text-left"
                                        >
                                            <MessageCircle size={14} /> Feedback
                                        </a>

                                        <div className="h-[1px] bg-gray-200 dark:bg-white/5 my-1"></div>
                                        
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white rounded transition-colors text-left">
                                            <Globe size={14} /> Language: EN
                                        </button>
                                         <button 
                                            onClick={toggleTheme}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white rounded transition-colors text-left"
                                        >
                                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} 
                                            Theme: {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                        </button>
                                        
                                        <div className="h-[1px] bg-gray-200 dark:bg-white/5 my-1"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors text-left font-bold"
                                        >
                                            <LogOut size={14} /> Disconnect
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
      </nav>

      {/* Main Content - No Footer, Full Height, Internal Scrolling managed by pages */}
      <main className="flex-1 relative overflow-hidden bg-white dark:bg-cyber-black transition-colors duration-300">
        <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern opacity-40 dark:opacity-[0.05] pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
};
