import { EventEmitter } from 'events';

export interface BinancePrice {
  symbol: string;
  price: number;
  ts: number;
  change24h?: number;
  volume24h?: number;
}

export interface MarketSnapshot {
  xau: BinancePrice | null;
  xag: BinancePrice | null;
  eur: BinancePrice | null;
  xauEur: number | null;
  xagEur: number | null;
  timestamp: number;
}

class BinanceService extends EventEmitter {
  private wsUrl = 'wss://stream.binance.com:9443/ws';
  private connections: Map<string, WebSocket> = new Map();
  private prices: Map<string, BinancePrice> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  /**
   * Subscribe to a Binance symbol
   */
  subscribe(symbol: string) {
    if (this.connections.has(symbol)) {
      return;
    }

    const streamName = `${symbol.toLowerCase()}@ticker`;
    const url = `${this.wsUrl}/${streamName}`;

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log(`[Binance] Connected to ${symbol}`);
        this.reconnectAttempts.set(symbol, 0);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const price: BinancePrice = {
            symbol: data.s,
            price: parseFloat(data.c),
            ts: data.E,
            change24h: parseFloat(data.P),
            volume24h: parseFloat(data.v),
          };
          this.prices.set(symbol, price);
          this.emit('tick', { symbol, data: price });
        } catch (error) {
          console.error(`[Binance] Error parsing ${symbol} data:`, error);
        }
      };

      ws.onerror = (error) => {
        console.error(`[Binance] WebSocket error for ${symbol}:`, error);
        this.handleReconnect(symbol);
      };

      ws.onclose = () => {
        console.log(`[Binance] Disconnected from ${symbol}`);
        this.connections.delete(symbol);
        this.handleReconnect(symbol);
      };

      this.connections.set(symbol, ws);
    } catch (error) {
      console.error(`[Binance] Failed to subscribe to ${symbol}:`, error);
      this.handleReconnect(symbol);
    }
  }

  /**
   * Unsubscribe from a symbol
   */
  unsubscribe(symbol: string) {
    const ws = this.connections.get(symbol);
    if (ws) {
      ws.close();
      this.connections.delete(symbol);
    }
    this.prices.delete(symbol);
  }

  /**
   * Get current price for a symbol
   */
  getPrice(symbol: string): BinancePrice | null {
    return this.prices.get(symbol) || null;
  }

  /**
   * Get market snapshot
   */
  getSnapshot(): MarketSnapshot {
    const xau = this.getPrice('XAUUSDT');
    const xag = this.getPrice('XAGUSDT');
    const eur = this.getPrice('EURUSDT');

    let xauEur = null;
    let xagEur = null;

    if (xau && eur) {
      xauEur = xau.price / eur.price;
    }

    if (xag && eur) {
      xagEur = xag.price / eur.price;
    }

    return {
      xau: xau || null,
      xag: xag || null,
      eur: eur || null,
      xauEur,
      xagEur,
      timestamp: Date.now(),
    };
  }

  /**
   * Handle reconnection with exponential backoff
   */
  private handleReconnect(symbol: string) {
    const attempts = (this.reconnectAttempts.get(symbol) || 0) + 1;
    this.reconnectAttempts.set(symbol, attempts);

    if (attempts > this.maxReconnectAttempts) {
      console.warn(`[Binance] Max reconnection attempts reached for ${symbol}`);
      this.emit('error', {
        symbol,
        message: `Failed to reconnect to ${symbol} after ${attempts} attempts`,
      });
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts - 1);
    console.log(`[Binance] Reconnecting to ${symbol} in ${delay}ms (attempt ${attempts})`);

    setTimeout(() => {
      this.subscribe(symbol);
    }, delay);
  }

  /**
   * Disconnect all WebSocket connections
   */
  disconnect() {
    this.connections.forEach((ws) => {
      try {
        ws.close();
      } catch (error) {
        console.error('[Binance] Error closing connection:', error);
      }
    });
    this.connections.clear();
    this.prices.clear();
    this.reconnectAttempts.clear();
  }

  /**
   * Format price with proper decimals
   */
  static formatPrice(price: number, decimals = 2): string {
    if (price == null) return '—';
    return price.toFixed(decimals);
  }

  /**
   * Format percentage change
   */
  static formatChange(change: number | undefined): string {
    if (change == null) return '—';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }
}

// Singleton instance
let instance: BinanceService | null = null;

export function getBinanceService(): BinanceService {
  if (!instance) {
    instance = new BinanceService();
  }
  return instance;
}

export default BinanceService;
