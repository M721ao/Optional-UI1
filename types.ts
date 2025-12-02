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
}

export interface Vault {
  id: string;
  name: string;
  asset: string;
  apy: number;
  balance: number;
  risk: 'low' | 'medium' | 'high';
}