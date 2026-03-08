'use client';

import { PortfolioData } from '@/lib/trade-republic';
import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';

interface PortfolioHeaderProps {
  data: PortfolioData;
}

export function PortfolioHeader({ data }: PortfolioHeaderProps) {
  const isPositive = data.totalGain >= 0;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
        <div className="flex items-baseline gap-4">
          <h1 className="text-5xl font-bold text-foreground">
            ${data.totalValue.toFixed(2)}
          </h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${isPositive ? 'bg-primary/10' : 'bg-destructive/10'}`}>
            {isPositive ? (
              <ArrowUpRight className="w-5 h-5 text-primary" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-destructive" />
            )}
            <span className={isPositive ? 'text-primary font-semibold' : 'text-destructive font-semibold'}>
              {isPositive ? '+' : ''}{data.totalGainPercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Gain: {isPositive ? '+' : ''}<span className={isPositive ? 'text-primary' : 'text-destructive'}>
            ${data.totalGain.toFixed(2)}
          </span> from ${data.totalInvested.toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-2">Current Value</p>
          <p className="text-2xl font-bold">${data.totalValue.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-2">Total Invested</p>
          <p className="text-2xl font-bold">${data.totalInvested.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-2">Total Return</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{data.totalGainPercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
