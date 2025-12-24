
export enum Page {
  LANDING = 'LANDING',
  STUDIO = 'STUDIO',
  DASHBOARD = 'DASHBOARD'
}

export interface NavItem {
  id: Page;
  label: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Flow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  triggers: number;
  lastRun: string;
  tvl: number;
  thumbnailType: 'linear' | 'branching' | 'complex'; 
}

export interface VaultAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  icon: string; 
}

export interface VaultTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'swap' | 'harvest';
  hash: string;
  time: string;
  amount: string;
  status: 'success' | 'pending' | 'failed';
}

export interface Vault {
  id: string;
  name: string;
  asset: string; 
  apy: number;
  balance: number;
  risk: 'low' | 'medium' | 'high';
  chain?: string;
  address?: string;
  isDeployed?: boolean;
  assets?: VaultAsset[];
  history?: VaultTransaction[];
}

export interface InviteCode {
  code: string;
  isUsed: boolean;
  usedBy?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string; 
  credits: number;
  inviteCodes: InviteCode[]; // Changed from single string
  isActivated: boolean;
  plan: 'FREE' | 'MASTER';
  walletAddress?: string;
  chain?: 'ETH' | 'SOL' | 'ARB' | 'BASE';
}

export interface CommunityStrategy {
  id: string;
  name: string;
  author: string;
  authorAvatar: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  description: string;
  tags: string[];
  copiers: number;
  price: string;
}
