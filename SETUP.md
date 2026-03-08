# TradeFlow - Trade Republic Dashboard Setup Guide

Welcome to TradeFlow! This is a modern trading dashboard built with Next.js and integrated with the Trade Republic API.

## Features

- **Real-time Portfolio Tracking**: Monitor your investments with live updates
- **Performance Analytics**: Visualize your portfolio performance over time
- **Asset Allocation**: Understand your portfolio composition
- **Market Watchlist**: Track favorite securities in real-time
- **Position Management**: View detailed information about all your holdings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
├── app/
│   ├── page.tsx                 # Landing page
│   ├── auth/page.tsx            # Authentication page
│   ├── dashboard/page.tsx       # Main dashboard
│   └── layout.tsx               # Root layout
├── components/
│   ├── auth-form.tsx            # Login form
│   ├── dashboard-nav.tsx        # Navigation bar
│   ├── portfolio-header.tsx     # Portfolio summary
│   ├── positions-table.tsx      # Holdings table
│   ├── performance-chart.tsx    # Performance chart
│   ├── allocation-chart.tsx     # Asset allocation chart
│   ├── watchlist.tsx            # Market watch list
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── trade-republic.ts        # Trade Republic utilities
│   ├── api-service.ts           # API integration service
│   └── utils.ts                 # Utility functions
├── trade-republic-api/          # Trade Republic API library
└── public/                      # Static assets
```

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Demo Account

The application comes with a demo mode for testing:

- **Landing Page**: Visit the home page to see the feature overview
- **Get Started**: Click "Get Started" or "Start Trading" to access the login page
- **Demo Login**: Enter any phone number and PIN (they will be stored locally for the demo)
- **Dashboard**: Explore the mock portfolio data with real charts and analytics

## Integrating with Trade Republic API

To connect with the real Trade Republic API, follow these steps:

### 1. Review API Integration Points

The Trade Republic API integration is handled in these files:

- **`lib/api-service.ts`**: Main API service with methods for authentication, data fetching, and trading
- **`lib/trade-republic.ts`**: Utility functions for portfolio calculations and mock data
- **`trade-republic-api/`**: The actual Trade Republic API library (already included)

### 2. Update Authentication

Edit `components/auth-form.tsx` to connect with the real Trade Republic API:

```typescript
// Current: Demo mode
localStorage.setItem('tradeSession', JSON.stringify({
  phoneNumber,
  timestamp: new Date().toISOString(),
}));

// Real implementation:
const api = new TradeRepublicApi(phoneNumber, pin);
const loginSuccess = await api.login();
if (loginSuccess) {
  // Save API instance for later use
  sessionStorage.setItem('apiInitialized', 'true');
  router.push('/dashboard');
}
```

### 3. Update Dashboard Data Fetching

Edit `app/dashboard/page.tsx` to fetch real portfolio data:

```typescript
// Current: Mock data
const portfolioData = createMockPortfolioData();

// Real implementation:
const api = new TradeRepublicApi(phoneNumber, pin);
await api.login(getDevicePin);
const portfolio = await api.getPortfolio();
const portfolioData = transformPortfolioData(portfolio);
```

### 4. Implement Real-time Subscriptions

Use the API's WebSocket subscriptions for live price updates:

```typescript
import { subscribeToPrice } from '@/lib/api-service';

// Subscribe to a specific security
const unsubscribe = subscribeToPrice(api, 'US0378331005', (price) => {
  // Update UI with new price
  updatePositionPrice('AAPL', price);
});

// Cleanup
unsubscribe();
```

## API Reference

### TradeRepublicApi Methods

```typescript
// Authentication
await api.login(getDevicePin?: () => Promise<string>): Promise<boolean>

// Portfolio
await api.getPortfolio(): Promise<Portfolio>

// Subscriptions (WebSocket)
api.subscribe<T>(message: Message<T>, callback: (data: string | null) => void): number
api.subscribeOnce<T>(message: Message<T>, callback: (data: string | null) => void): number
api.unsubscribe(id: number): void

// Disconnect
await api.disconnect(): Promise<void>
```

## Design System

The application uses a custom color palette designed for fintech:

- **Primary Color**: Green (#22c55e) - Represents positive returns
- **Destructive Color**: Red (#ff4444) - Represents losses
- **Neutrals**: Black/White/Gray - For contrast and readability
- **Light & Dark Modes**: Full theme support

All styling is managed through CSS custom properties in `app/globals.css`.

## Components Overview

### PortfolioHeader
Displays total portfolio value, gain/loss, and key metrics.

### PositionsTable
Detailed table of all holdings with performance indicators.

### PerformanceChart
30-day performance visualization using Recharts.

### AllocationChart
Pie chart showing asset allocation across categories.

### Watchlist
Real-time market watch list for tracking securities.

### DashboardNav
Navigation bar with authentication controls.

## Authentication Flow

1. User lands on home page
2. Clicks "Get Started" → redirected to `/auth`
3. Enters credentials (phone + PIN)
4. Application authenticates with Trade Republic API
5. On success, user is redirected to `/dashboard`
6. Dashboard loads portfolio data and displays it
7. User can log out, which clears session and returns to home

## Security Considerations

- **For Production**: Implement proper session management with HTTP-only cookies
- **For Production**: Never store sensitive credentials in localStorage
- **For Production**: Add proper error handling and validation
- **For Production**: Use environment variables for API credentials
- **For Demo**: This version uses localStorage for demonstration purposes only

## Deployment

The application can be deployed to Vercel:

```bash
# Build the application
pnpm build

# Deploy to Vercel
npx vercel
```

## Environment Variables

For production deployment, add these to your `.env.local`:

```
NEXT_PUBLIC_API_URL=https://api.traderepublic.com
TRADE_REPUBLIC_PHONE=your_phone_number
TRADE_REPUBLIC_PIN=your_pin
```

## Troubleshooting

### Dashboard shows no data
- Check browser console for errors
- Verify Trade Republic API credentials
- Ensure WebSocket connection is established

### Charts not rendering
- Verify Recharts library is installed
- Check browser console for rendering errors
- Ensure data is in the correct format

### Login keeps redirecting
- Check if session is being properly stored
- Verify localStorage is enabled
- Check authentication logic in `auth-form.tsx`

## Support

For issues with the Trade Republic API, visit: https://github.com/NightOwl07/trade-republic-api

For issues with TradeFlow, check the application logs and browser console.

## License

This project includes the Trade Republic API library. See the original repository for licensing information.
