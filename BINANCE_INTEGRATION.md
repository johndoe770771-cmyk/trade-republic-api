# Binance Integration Guide

This document explains how the Binance market data is integrated into the TradeFlow dashboard.

## Overview

The TradeFlow dashboard includes real-time market data from Binance covering precious metals (Gold/Silver) and currencies:

- **XAU/USD** - Gold price in US Dollars (per troy ounce)
- **XAG/USD** - Silver price in US Dollars (per troy ounce)
- **EUR/USD** - Euro price in US Dollars
- **XAU/EUR** - Gold price in Euros (derived)
- **XAG/EUR** - Silver price in Euros (derived)

## Architecture

### Services & Components

#### 1. **Binance Service** (`lib/binance.ts`)
- Event-based WebSocket connection to Binance
- Auto-reconnection with exponential backoff
- Price caching and snapshot generation
- Singleton pattern for efficient resource usage

**Key Methods:**
```typescript
subscribe(symbol: string) // Subscribe to real-time price
getPrice(symbol: string) // Get current cached price
getSnapshot() // Get all market data snapshot
disconnect() // Close all connections
```

#### 2. **Market Snapshot Component** (`components/market-snapshot.tsx`)
- Client-side React component
- Displays live prices with 24h changes
- Connection status indicator
- Real-time updates via EventEmitter

#### 3. **API Endpoints**
- `GET /api/market/snapshot` - Returns all market data
- `GET /api/market/price/[symbol]` - Returns price for specific symbol

### Data Flow

```
Binance WebSocket
       ↓
BinanceService (lib/binance.ts)
       ↓
React Component (MarketSnapshot)
       ├→ Dashboard (/dashboard)
       └→ Market Page (/dashboard/market)
```

## Usage

### In Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { BinanceService, MarketSnapshot } from '@/lib/binance';

export function MyComponent() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);

  useEffect(() => {
    const binance = new BinanceService();
    
    // Subscribe to symbols
    binance.subscribe('XAUUSDT');
    binance.subscribe('EURUSDT');
    
    // Listen for updates
    const handleTick = () => {
      setSnapshot(binance.getSnapshot());
    };
    
    binance.on('tick', handleTick);
    
    return () => {
      binance.off('tick', handleTick);
      binance.disconnect();
    };
  }, []);

  if (!snapshot?.xau) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Gold: ${BinanceService.formatPrice(snapshot.xau.price, 2)}</p>
    </div>
  );
}
```

### API Integration

```typescript
import { getMarketSnapshot } from '@/lib/api-service';

async function fetchMarketData() {
  const snapshot = await getMarketSnapshot();
  if (snapshot) {
    console.log('XAU Price:', snapshot.xau?.price);
  }
}
```

## Real-Time Updates

The Binance service maintains WebSocket connections for real-time price updates:

1. **Initial Connection**: ~500-1000ms to establish WebSocket
2. **Update Frequency**: ~100-500ms between price ticks
3. **Reconnection**: Automatic with exponential backoff (max 5 attempts)

### Event Handling

```typescript
const binance = getBinanceService();

// Listen to price ticks
binance.on('tick', (data) => {
  console.log(`${data.symbol} updated to ${data.data.price}`);
});

// Listen to errors
binance.on('error', (err) => {
  console.error('Market data error:', err.message);
});
```

## Data Types

### BinancePrice
```typescript
interface BinancePrice {
  symbol: string;        // e.g., "XAUUSDT"
  price: number;         // Current price
  ts: number;           // Timestamp
  change24h?: number;   // 24h % change
  volume24h?: number;   // 24h volume
}
```

### MarketSnapshot
```typescript
interface MarketSnapshot {
  xau: BinancePrice | null;      // Gold/USD
  xag: BinancePrice | null;      // Silver/USD
  eur: BinancePrice | null;      // Euro/USD
  xauEur: number | null;         // Gold/EUR (calculated)
  xagEur: number | null;         // Silver/EUR (calculated)
  timestamp: number;              // Snapshot timestamp
}
```

## Troubleshooting

### Connection Issues

**Problem**: Prices showing as "waiting..." or "unavailable"

**Solution**:
1. Check browser console for connection errors
2. Verify Binance API is accessible (no regional blocks)
3. Check browser firewall/antivirus settings
4. Clear cache and reload page

### Stale Data

**Problem**: Prices not updating

**Solution**:
1. The WebSocket connection may have dropped
2. Service will auto-reconnect within 3-30 seconds
3. Manually trigger refresh if needed

### Performance

- Each symbol requires one WebSocket connection
- Currently tracking 3 symbols (XAUUSDT, XAGUSDT, EURUSDT)
- Memory footprint: ~1-2MB per connection
- CPU impact: Negligible

## Advanced Configuration

### Modify Tracked Symbols

In `lib/binance.ts`, update the subscription calls:

```typescript
// In your component
binance.subscribe('BTCUSDT');  // Bitcoin
binance.subscribe('ETHUSDT');  // Ethereum
```

### Change Update Frequency

Modify the WebSocket connection in `lib/binance.ts`:

```typescript
// Subscribe with reduced data:
binance.subscribe('XAUUSDT@ticker@500ms');  // 500ms updates
```

### Custom Price Formatting

```typescript
// Format with 4 decimals
BinanceService.formatPrice(price, 4);

// Format percentage
BinanceService.formatChange(change);
```

## API Endpoints

### Get Market Snapshot
```bash
GET /api/market/snapshot

Response:
{
  "data": {
    "xau": {
      "symbol": "XAUUSDT",
      "price": 5168.39,
      "ts": 1234567890,
      "change24h": 0.45
    },
    "xag": {...},
    "eur": {...},
    "xauEur": 4850.25,
    "xagEur": 79.50,
    "timestamp": 1234567890
  },
  "status": "success"
}
```

### Get Specific Price
```bash
GET /api/market/price/XAUUSDT

Response:
{
  "data": {
    "symbol": "XAUUSDT",
    "price": 5168.39,
    "timestamp": 1234567890,
    "change24h": 0.45,
    "volume24h": 1500000
  },
  "status": "success"
}
```

## Security Considerations

- All Binance data is public (no authentication required)
- WebSocket connections use secure WSS protocol
- No sensitive data stored locally
- API keys are not needed for public market data

## Performance Tips

1. **Reuse Singleton**: Always use `getBinanceService()` instead of creating new instances
2. **Cleanup**: Always unsubscribe and disconnect in cleanup functions
3. **Memoization**: Wrap snapshot components in `useMemo` for expensive calculations
4. **Lazy Loading**: Import Binance components only when needed

## References

- [Binance WebSocket API](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)
- [Binance Symbols](https://binance-docs.github.io/apidocs/spot/en/#exchange-information)
- [24hr Rolling Window Price Change](https://binance-docs.github.io/apidocs/spot/en/#24hr-rolling-window-price-change-statistics)

## Future Enhancements

- [ ] Historical price charts
- [ ] Price alerts (above/below certain levels)
- [ ] Custom symbol watchlist
- [ ] Export price history
- [ ] Advanced technical indicators
- [ ] Mobile-optimized charts
