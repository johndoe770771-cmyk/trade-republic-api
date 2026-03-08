import { NextRequest, NextResponse } from 'next/server';
import { getBinanceService } from '@/lib/binance';

interface RouteParams {
  params: {
    symbol: string;
  };
}

/**
 * GET /api/market/price/[symbol]
 * Returns current price for a specific Binance symbol
 * Example: /api/market/price/XAUUSDT
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { symbol } = params;

    // Validate symbol format
    if (!symbol || typeof symbol !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid symbol parameter',
          status: 'error',
        },
        { status: 400 }
      );
    }

    const binance = getBinanceService();

    // Subscribe to symbol if not already subscribed
    binance.subscribe(symbol.toUpperCase());

    // Get current price
    const price = binance.getPrice(symbol.toUpperCase());

    if (!price) {
      return NextResponse.json(
        {
          error: `No price data available for ${symbol}. Connection may not be established yet.`,
          status: 'waiting',
          timestamp: Date.now(),
        },
        { status: 202 } // 202 Accepted - data not ready yet
      );
    }

    return NextResponse.json(
      {
        data: {
          symbol: price.symbol,
          price: price.price,
          timestamp: price.ts,
          change24h: price.change24h,
          volume24h: price.volume24h,
        },
        status: 'success',
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: message,
        status: 'error',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
