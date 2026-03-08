'use client';

import { PortfolioPosition } from '@/lib/trade-republic';
import { Badge } from '@/components/ui/badge';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface PositionsTableProps {
  positions: PortfolioPosition[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Position</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Shares</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Avg. Buy-In</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Current Price</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Value</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Gain/Loss</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {positions.map((position) => {
            const gainPercent = position.gainPercent || 0;
            const isPositive = gainPercent >= 0;
            
            return (
              <tr key={position.isin} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground">
                        {position.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{position.name}</p>
                      <p className="text-xs text-muted-foreground">{position.isin}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  {parseFloat(position.netSize).toFixed(0)}
                </td>
                <td className="px-6 py-4 text-right text-foreground">
                  ${parseFloat(position.averageBuyIn).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-foreground">
                  ${(position.currentPrice || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  ${(position.currentValue || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`flex items-center justify-end gap-2 font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}{gainPercent.toFixed(2)}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
