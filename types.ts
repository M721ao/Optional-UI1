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
  thumbnailType: 'linear' | 'branching' | 'complex'; // For CSS visualizer
}

export interface VaultAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  icon: string; // Color code or url
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
  asset: string; // Primary asset name for simple list
  apy: number;
  balance: number;
  risk: 'low' | 'medium' | 'high';
  // Detailed fields
  chain?: string;
  address?: string;
  isDeployed?: boolean;
  assets?: VaultAsset[];
  history?: VaultTransaction[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string; // URL
  credits: number;
  inviteCode: string;
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