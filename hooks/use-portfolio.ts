import { useState, useEffect, useCallback } from 'react';
import { createMockPortfolioData, PortfolioData } from '@/lib/trade-republic';

interface UsePortfolioOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function usePortfolio(options: UsePortfolioOptions = {}) {
  const { autoRefresh = true, refreshInterval = 30000 } = options;

  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In production, this would fetch from the Trade Republic API
      // For now, we're using mock data
      const portfolioData = createMockPortfolioData();

      setData(portfolioData);
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setError(errorMessage);
      console.error('[usePortfolio] Error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshPortfolio();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshPortfolio]);

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refresh: refreshPortfolio,
  };
}
