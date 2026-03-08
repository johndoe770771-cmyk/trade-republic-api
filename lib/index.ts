// Export all trade-republic utilities
export {
  createMockPortfolioData,
  generatePerformanceData,
  generateAllocationData,
} from './trade-republic';

export type {
  StockQuote,
  PortfolioData,
  PortfolioPosition,
} from './trade-republic';

// Export API service functions
export {
  initializeTradeRepublicAPI,
  fetchPortfolioData,
  subscribeToPrice,
  executeTrade,
  fetchPositions,
  disconnectAPI,
} from './api-service';

// Export utilities
export { cn } from './utils';
