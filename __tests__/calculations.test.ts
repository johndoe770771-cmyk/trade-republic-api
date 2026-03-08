/**
 * Example test file for financial calculations
 * To run: npm test or pnpm test
 */

import {
  calculatePercentageChange,
  calculateROI,
  calculateGain,
  calculatePortfolioValue,
  formatCurrency,
  formatPercentage,
  roundToDecimal,
} from '@/lib/calculations';

describe('Financial Calculations', () => {
  describe('calculatePercentageChange', () => {
    it('should calculate positive percentage change', () => {
      const result = calculatePercentageChange(150, 100);
      expect(result).toBe(50);
    });

    it('should calculate negative percentage change', () => {
      const result = calculatePercentageChange(50, 100);
      expect(result).toBe(-50);
    });

    it('should return 0 for zero previous value', () => {
      const result = calculatePercentageChange(100, 0);
      expect(result).toBe(0);
    });

    it('should handle equal values', () => {
      const result = calculatePercentageChange(100, 100);
      expect(result).toBe(0);
    });
  });

  describe('calculateROI', () => {
    it('should calculate positive ROI', () => {
      const roi = calculateROI(1200, 1000);
      expect(roi).toBe(20);
    });

    it('should calculate negative ROI', () => {
      const roi = calculateROI(800, 1000);
      expect(roi).toBe(-20);
    });

    it('should return 0 for zero invested amount', () => {
      const roi = calculateROI(100, 0);
      expect(roi).toBe(0);
    });

    it('should handle small investments', () => {
      const roi = calculateROI(110, 100);
      expect(roi).toBe(10);
    });
  });

  describe('calculateGain', () => {
    it('should calculate positive gain', () => {
      const gain = calculateGain(1200, 1000);
      expect(gain).toBe(200);
    });

    it('should calculate negative gain (loss)', () => {
      const gain = calculateGain(800, 1000);
      expect(gain).toBe(-200);
    });

    it('should return 0 for no change', () => {
      const gain = calculateGain(1000, 1000);
      expect(gain).toBe(0);
    });
  });

  describe('calculatePortfolioValue', () => {
    it('should calculate total portfolio value', () => {
      const positions = [
        { quantity: 10, currentPrice: 100 },
        { quantity: 5, currentPrice: 200 },
      ];
      const value = calculatePortfolioValue(positions);
      expect(value).toBe(2000); // 10*100 + 5*200
    });

    it('should handle empty portfolio', () => {
      const value = calculatePortfolioValue([]);
      expect(value).toBe(0);
    });

    it('should handle single position', () => {
      const positions = [{ quantity: 10, currentPrice: 100 }];
      const value = calculatePortfolioValue(positions);
      expect(value).toBe(1000);
    });
  });

  describe('formatCurrency', () => {
    it('should format positive currency', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1,234.56');
    });

    it('should format negative currency', () => {
      const result = formatCurrency(-100.50);
      expect(result).toContain('-100.50');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0.00');
    });

    it('should support different currencies', () => {
      const result = formatCurrency(100, 'EUR');
      expect(result).toContain('100');
    });
  });

  describe('formatPercentage', () => {
    it('should format positive percentage', () => {
      const result = formatPercentage(50.5);
      expect(result).toBe('+50.50%');
    });

    it('should format negative percentage', () => {
      const result = formatPercentage(-25.75);
      expect(result).toBe('-25.75%');
    });

    it('should handle different decimal places', () => {
      const result = formatPercentage(33.333, 1);
      expect(result).toBe('+33.3%');
    });

    it('should handle zero percentage', () => {
      const result = formatPercentage(0);
      expect(result).toBe('+0.00%');
    });
  });

  describe('roundToDecimal', () => {
    it('should round to specified decimal places', () => {
      const result = roundToDecimal(1.23456, 2);
      expect(result).toBe(1.23);
    });

    it('should round up', () => {
      const result = roundToDecimal(1.235, 2);
      expect(result).toBe(1.24);
    });

    it('should round down', () => {
      const result = roundToDecimal(1.234, 2);
      expect(result).toBe(1.23);
    });

    it('should handle zero decimal places', () => {
      const result = roundToDecimal(1.6, 0);
      expect(result).toBe(2);
    });
  });
});

describe('Integration Tests', () => {
  it('should calculate complete portfolio metrics', () => {
    const invested = 10000;
    const currentValue = 12500;

    const gain = calculateGain(currentValue, invested);
    const roi = calculateROI(currentValue, invested);
    const percentageChange = calculatePercentageChange(currentValue, invested);

    expect(gain).toBe(2500);
    expect(roi).toBe(25);
    expect(percentageChange).toBe(25);
  });

  it('should format metrics correctly', () => {
    const currentValue = 12500;
    const invested = 10000;

    const formatted = {
      value: formatCurrency(currentValue),
      invested: formatCurrency(invested),
      gain: formatCurrency(currentValue - invested),
      roi: formatPercentage(calculateROI(currentValue, invested)),
    };

    expect(formatted.value).toContain('12,500');
    expect(formatted.invested).toContain('10,000');
    expect(formatted.gain).toContain('2,500');
    expect(formatted.roi).toBe('+25.00%');
  });
});
