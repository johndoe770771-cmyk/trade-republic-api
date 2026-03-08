import { NextResponse } from 'next/server';
import { getMarketSnapshot } from '@/lib/binance-service';

/**
 * GET /api/market/snapshot
 * Returns current market prices from Binance (XAU, XAG, EUR pairs)
 */
export async function GET() {
  try {
    const snapshot = await getMarketSnapshot();

    return NextResponse.json(
      {
        success: true,
        data: snapshot,
        meta: {
          timestamp: snapshot.timestamp,
          source: snapshot.source,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[Market API] Error fetching snapshot:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market snapshot',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
