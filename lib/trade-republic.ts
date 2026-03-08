// Trade Republic API Integration Service
import type { Portfolio, Position, Category } from '../trade-republic-api/src/portfolio';

export interface StockQuote {
  isin: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  lastUpdate: Date;
}

export interface PortfolioData {
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  totalGainPercent: number;
  positions: PortfolioPosition[];
}

export interface PortfolioPosition extends Position {
  currentPrice?: number;
  currentValue?: number;
  gain?: number;
  gainPercent?: number;
}

// Mock data for demo - in production, connect to real Trade Republic API
export const createMockPortfolioData = (): PortfolioData => {
  const positions: PortfolioPosition[] = [
    {
      instrumentType: 'STOCK',
      name: 'Apple Inc.',
      isin: 'US0378331005',
      imageId: 'apple',
      averageBuyIn: '180.50',
      netSize: '10',
      currentPrice: 195.75,
      currentValue: 1957.50,
      gain: 1525.00,
      gainPercent: 8.47,
    },
    {
      instrumentType: 'STOCK',
      name: 'Microsoft Corporation',
      isin: 'US5949181045',
      imageId: 'microsoft',
      averageBuyIn: '330.20',
      netSize: '5',
      currentPrice: 415.30,
      currentValue: 2076.50,
      gain: 425.00,
      gainPercent: 25.78,
    },
    {
      instrumentType: 'STOCK',
      name: 'Tesla Inc.',
      isin: 'US88160R1014',
      imageId: 'tesla',
      averageBuyIn: '245.00',
      netSize: '3',
      currentPrice: 238.45,
      currentValue: 715.35,
      gain: -19.65,
      gainPercent: -2.63,
    },
    {
      instrumentType: 'ETF',
      name: 'Vanguard S&P 500 ETF',
      isin: 'IE00B4L5Y983',
      imageId: 'vanguard',
      averageBuyIn: '520.00',
      netSize: '2',
      currentPrice: 545.80,
      currentValue: 1091.60,
      gain: 51.60,
      gainPercent: 4.95,
    },
  ];

  const totalValue = positions.reduce((sum, pos) => sum + (pos.currentValue || 0), 0);
  const totalInvested = positions.reduce((sum, pos) => {
    const avgBuyIn = parseFloat(pos.averageBuyIn);
    const netSize = parseFloat(pos.netSize);
    return sum + avgBuyIn * netSize;
  }, 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = (totalGain / totalInvested) * 100;

  return {
    totalValue: Math.round(totalValue * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalGain: Math.round(totalGain * 100) / 100,
    totalGainPercent: Math.round(totalGainPercent * 100) / 100,
    positions,
  };
};

// Generate chart data for portfolio performance
export const generatePerformanceData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseValue = 5000;
    const variance = Math.sin(i * 0.5) * 500 + Math.random() * 300;
    const value = baseValue + variance;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
};

// Generate asset allocation data
export const generateAllocationData = (positions: PortfolioPosition[]) => {
  const allocation = [
    { name: 'Stocks', value: 65, color: '#22c55e' },
    { name: 'ETFs', value: 25, color: '#3b82f6' },
    { name: 'Bonds', value: 10, color: '#f59e0b' },
  ];
  
  return allocation;
};
