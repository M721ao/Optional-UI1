
import React, { useState } from 'react';
import { X, Check, Zap, Shield, Cpu, Crown } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Starter',
      price: '0',
      period: 'Forever',
      description: 'Essential tools for casual automation.',
      features: ['5 Active Flows', 'Basic Strategy Builder', 'Community Support', 'Standard Execution Speed'],
      icon: Shield,
      color: 'gray',
      cta: 'Current Plan',
      disabled: true
    },
    {
      name: 'Quant Master',
      price: billingCycle === 'yearly' ? '49' : '65',
      period: 'per month',
      description: 'For serious traders needing alpha & speed.',
      features: ['Unlimited Flows', 'Gemini 2.5 AI Logic', 'Mempool Sniping (<1s)', 'Priority Support', 'Gas Optimization'],
      icon: Zap,
      color: 'neon',
      popular: true,
      cta: 'Upgrade to Master'
    },
    {
      name: 'Whale',
      price: '299',
      period: 'per month',
      description: 'Institutional grade infrastructure.',
      features: ['Dedicated Nodes', 'Custom Smart Contracts', 'White-glove Onboarding', '0% Protocol Fees', 'API Access'],
      icon: Crown,
      color: 'gold',
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 md:p-8 text-center bg-gray-50 dark:bg-[#121218] border-b border-gray-200 dark:border-white/5 relative">
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-white/5 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Upgrade your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-cyber-neon dark:to-cyber-purple">Alpha</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
                Unlock higher compute limits, faster execution speeds, and advanced AI models.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center p-1 bg-gray-200 dark:bg-black/40 rounded-full border border-gray-300 dark:border-white/10 relative">
                <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all z-10 ${billingCycle === 'monthly' ? 'text-black dark:text-white' : 'text-gray-500'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all z-10 ${billingCycle === 'yearly' ? 'text-black dark:text-white' : 'text-gray-500'}`}
                >
                    Yearly <span className="ml-1 text-[9px] text-green-600 dark:text-green-500 font-normal">-20%</span>
                </button>
                <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-white/10 rounded-full shadow-sm transition-all duration-300 ${billingCycle === 'yearly' ? 'translate-x-full left-0' : 'left-1'}`}
                ></div>
            </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-[#0c0c10]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, idx) => (
                    <div 
                        key={idx}
                        className={`relative rounded-xl border p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                            plan.popular 
                            ? 'bg-purple-50/50 dark:bg-cyber-purple/5 border-purple-500 dark:border-cyber-neon shadow-xl shadow-purple-500/10 dark:shadow-[0_0_30px_rgba(0,243,255,0.15)] z-10 scale-105' 
                            : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-cyber-neon dark:to-cyber-purple text-white dark:text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                                plan.color === 'neon' ? 'bg-purple-100 dark:bg-cyber-neon/20 text-purple-600 dark:text-cyber-neon' :
                                plan.color === 'gold' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500' :
                                'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                            }`}>
                                <plan.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 min-h-[32px]">{plan.description}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                                {plan.price !== '0' && <span className="text-sm text-gray-500 dark:text-gray-400">/{billingCycle === 'yearly' ? 'mo' : 'mo'}</span>}
                            </div>
                            {billingCycle === 'yearly' && plan.price !== '0' && (
                                <div className="text-[10px] text-green-600 dark:text-green-500 mt-1 font-bold">Billed ${Number(plan.price) * 12} yearly</div>
                            )}
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <Check size={16} className={`shrink-0 mt-0.5 ${
                                        plan.popular ? 'text-purple-600 dark:text-cyber-neon' : 'text-gray-400'
                                    }`} />
                                    <span className="text-xs">{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-all ${
                                plan.disabled 
                                ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-default' 
                                : plan.popular 
                                    ? 'bg-purple-600 dark:bg-cyber-neon text-white dark:text-black hover:brightness-110 shadow-lg'
                                    : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200'
                            }`}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Need a custom enterprise solution? <a href="#" className="text-purple-600 dark:text-cyber-neon hover:underline">Contact our sales team</a>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
