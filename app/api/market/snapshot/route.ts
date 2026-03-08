import { NextRequest, NextResponse } from 'next/server';
import { getBinanceService } from '@/lib/binance';

/**
 * GET /api/market/snapshot
 * Returns current Binance market snapshot (XAU/USD, XAG/USD, EUR/USD)
 */
export async function GET(request: NextRequest) {
  try {
    const binance = getBinanceService();

    // Ensure subscriptions are active
    binance.subscribe('XAUUSDT');
    binance.subscribe('XAGUSDT');
    binance.subscribe('EURUSDT');

    // Get current snapshot
    const snapshot = binance.getSnapshot();

    return NextResponse.json(
      {
        data: snapshot,
        timestamp: Date.now(),
        status: 'success',
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
