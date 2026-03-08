'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { BinanceService, MarketSnapshot } from '@/lib/binance';

interface PriceRowProps {
  label: string;
  symbol: string;
  price: number | null;
  change24h?: number;
  currency?: string;
  decimals?: number;
  loading?: boolean;
}

function PriceRow({
  label,
  symbol,
  price,
  change24h,
  currency = 'USD',
  decimals = 2,
  loading = false,
}: PriceRowProps) {
  const isPositive = change24h ? change24h >= 0 : false;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-primary' : 'text-destructive';

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors">
      <div className="flex-1">
        <div className="font-semibold text-foreground">
          {label}
          <span className="text-xs text-muted-foreground ml-2">({symbol})</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="text-muted-foreground">waiting…</div>
        ) : price != null ? (
          <>
            <div className="text-right">
              <div className="font-mono font-bold text-foreground">
                {BinanceService.formatPrice(price, decimals)}
              </div>
              <div className="text-xs text-muted-foreground">{currency}</div>
            </div>
            {change24h != null && (
              <div className={`flex items-center gap-1 ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {BinanceService.formatChange(change24h)}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-muted-foreground text-sm">unavailable</div>
        )}
      </div>
    </div>
  );
}

export function MarketSnapshot() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const binance = new BinanceService();

    // Subscribe to symbols
    binance.subscribe('XAUUSDT');
    binance.subscribe('XAGUSDT');
    binance.subscribe('EURUSDT');

    // Update snapshot on price changes
    const handleTick = () => {
      setSnapshot(binance.getSnapshot());
      setLoading(false);
      setConnected(true);
    };

    const handleError = (err: any) => {
      setError(err.message || 'Failed to fetch market data');
      setConnected(false);
    };

    binance.on('tick', handleTick);
    binance.on('error', handleError);

    // Initial snapshot
    const timer = setTimeout(() => {
      const snap = binance.getSnapshot();
      if (snap.xau || snap.xag || snap.eur) {
        setSnapshot(snap);
        setLoading(false);
        setConnected(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      binance.off('tick', handleTick);
      binance.off('error', handleError);
      binance.disconnect();
    };
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="bg-accent/5 border-b border-border p-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Binance Market Data
        </h3>
        <p className="text-xs text-muted-foreground mt-1">Live prices updated in real-time</p>
      </div>

      {error && !connected && (
        <div className="p-4 bg-destructive/10 border-b border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Connection Error</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        <div className="p-4 bg-secondary/30 border-b border-border">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Spot Prices (USD)
          </h4>
          <PriceRow
            label="Gold"
            symbol="XAU/USD"
            price={snapshot?.xau?.price ?? null}
            change24h={snapshot?.xau?.change24h}
            decimals={2}
            loading={loading && !snapshot?.xau}
          />
          <PriceRow
            label="Silver"
            symbol="XAG/USD"
            price={snapshot?.xag?.price ?? null}
            change24h={snapshot?.xag?.change24h}
            decimals={4}
            loading={loading && !snapshot?.xag}
          />
          <PriceRow
            label="Euro"
            symbol="EUR/USD"
            price={snapshot?.eur?.price ?? null}
            change24h={snapshot?.eur?.change24h}
            decimals={5}
            loading={loading && !snapshot?.eur}
          />
        </div>

        <div className="p-4 bg-secondary/15">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Derived Prices (EUR)
          </h4>
          <PriceRow
            label="Gold"
            symbol="XAU/EUR"
            price={snapshot?.xauEur ?? null}
            currency="EUR"
            decimals={2}
            loading={loading && !snapshot?.xauEur}
          />
          <PriceRow
            label="Silver"
            symbol="XAG/EUR"
            price={snapshot?.xagEur ?? null}
            currency="EUR"
            decimals={4}
            loading={loading && !snapshot?.xagEur}
          />
        </div>
      </div>

      <div className="px-4 py-3 bg-muted/20 border-t border-border text-xs text-muted-foreground">
        {snapshot?.timestamp ? (
          <div>
            Last updated: {new Date(snapshot.timestamp).toLocaleTimeString()}
            {connected && <span className="text-primary ml-2">● Live</span>}
          </div>
        ) : (
          <div>Initializing connection…</div>
        )}
      </div>
    </Card>
  );
}
