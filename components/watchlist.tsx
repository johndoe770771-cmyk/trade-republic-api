'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isFavorite?: boolean;
}

const watchlistItems: WatchlistItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 195.75,
    change: 5.25,
    changePercent: 2.75,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: 415.30,
    change: 25.10,
    changePercent: 6.45,
  },
  {
    symbol: 'GOOGL',
    name: 'Google',
    price: 178.50,
    change: -3.50,
    changePercent: -1.92,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: 892.50,
    change: 42.30,
    changePercent: 4.97,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    price: 238.45,
    change: -6.55,
    changePercent: -2.68,
  },
];

export function Watchlist() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Market Watch</h3>
        <Badge variant="outline" className="text-xs">Real-time</Badge>
      </div>

      <div className="space-y-3">
        {watchlistItems.map((item) => {
          const isPositive = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground">{item.symbol[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{item.symbol}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-foreground text-sm">${item.price.toFixed(2)}</p>
                  <p className={`text-xs font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full mt-4">
        View Full Market Data
      </Button>
    </Card>
  );
}
