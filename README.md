# TradeFlow - Modern Trading Dashboard

A beautiful, production-ready trading dashboard built with Next.js 16, shadcn/ui, and integrated with the Trade Republic API.

![TradeFlow Dashboard](https://via.placeholder.com/1200x600?text=TradeFlow+Dashboard)

## Features

- **Portfolio Management**: Real-time portfolio tracking with live updates
- **Performance Analytics**: 30-day performance charts and trend analysis
- **Asset Allocation**: Visualize your portfolio composition with pie charts
- **Market Watchlist**: Track favorite securities with real-time prices
- **Responsive Design**: Works seamlessly on all devices
- **Dark/Light Theme**: Full theme support for all use cases
- **Authentication**: Secure login with Trade Republic API integration
- **Settings Panel**: Manage notifications, preferences, and account settings

## Tech Stack

- **Frontend Framework**: Next.js 16 with React 19
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS v4 with OKLCH color system
- **Charts**: Recharts for data visualization
- **Type Safety**: TypeScript
- **API Integration**: Trade Republic API (WebSocket + REST)
- **Icons**: Lucide React

## Project Structure

```
├── app/                           # Next.js app directory
│   ├── page.tsx                   # Landing page with features
│   ├── auth/page.tsx              # Authentication page
│   ├── dashboard/
│   │   ├── page.tsx               # Main dashboard
│   │   └── settings/page.tsx      # Settings page
│   ├── error.tsx                  # Error boundary
│   ├── not-found.tsx              # 404 page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles & design tokens
├── components/
│   ├── auth-form.tsx              # Login component
│   ├── dashboard-nav.tsx          # Navigation bar
│   ├── portfolio-header.tsx       # Portfolio summary
│   ├── positions-table.tsx        # Holdings table
│   ├── performance-chart.tsx      # 30-day chart
│   ├── allocation-chart.tsx       # Asset allocation chart
│   ├── watchlist.tsx              # Market watchlist
│   └── ui/                        # shadcn components (50+)
├── lib/
│   ├── trade-republic.ts          # Portfolio utilities
│   ├── api-service.ts             # API integration
│   └── utils.ts                   # Helper functions
├── hooks/
│   └── use-portfolio.ts           # Portfolio state hook
├── trade-republic-api/            # Trade Republic API library
├── public/                        # Static assets
└── scripts/                       # Database & setup scripts
```

## Quick Start

### Prerequisites
- Node.js 18+ (v20 recommended)
- pnpm 8+ (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd trade-republic-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at http://localhost:3000

### Demo Mode

The app comes with a fully functional demo:

1. Visit http://localhost:3000
2. Click "Get Started" on the landing page
3. Enter any phone number and PIN
4. Explore the mock portfolio on the dashboard

## Configuration

### Environment Variables

Create a `.env.local` file for production deployment:

```env
# Trade Republic API (optional)
NEXT_PUBLIC_API_URL=https://api.traderepublic.com
```

### Design System

The color system is defined in `app/globals.css`:

```css
:root {
  --primary: oklch(0.5 0.28 142);          /* Green - positive returns */
  --destructive: oklch(0.6 0.24 25);       /* Red - losses */
  --background: oklch(0.98 0 0);           /* White */
  --foreground: oklch(0.15 0 0);           /* Black */
  --card: oklch(1 0 0);                    /* Card background */
  --muted-foreground: oklch(0.55 0 0);    /* Secondary text */
  --border: oklch(0.92 0 0);               /* Border color */
}

.dark {
  --primary: oklch(0.55 0.28 142);
  --background: oklch(0.1 0 0);
  --foreground: oklch(0.96 0 0);
  /* ... */
}
```

## Usage

### Landing Page
- Showcases features and benefits
- Call-to-action buttons for signup
- Responsive grid layout

### Authentication
- Phone number and PIN input
- Form validation
- Demo mode (no backend required)

### Dashboard
- Portfolio value with gain/loss indicators
- Performance chart (30 days)
- Asset allocation pie chart
- Holdings table with detailed metrics
- Real-time market watchlist
- Settings and account management

### Settings
- Account information
- Notification preferences
- Appearance settings
- Security management
- Data & privacy controls

## Integration with Trade Republic API

### Current Status
The dashboard currently uses **mock data** for demonstration. To integrate with the live Trade Republic API:

### Step 1: Update Authentication

Edit `components/auth-form.tsx`:

```typescript
import { TradeRepublicApi } from '@/trade-republic-api/src/api';

async function handleSubmit(phoneNumber: string, pin: string) {
  const api = new TradeRepublicApi(phoneNumber, pin);
  
  // Get device PIN from user
  const devicePin = await getDevicePinFromUser();
  
  // Authenticate
  const success = await api.login(() => Promise.resolve(devicePin));
  
  if (success) {
    // Save API instance for dashboard
    sessionStorage.setItem('apiInitialized', 'true');
    router.push('/dashboard');
  }
}
```

### Step 2: Fetch Portfolio Data

Edit `hooks/use-portfolio.ts`:

```typescript
async function fetchPortfolioData() {
  const api = getApiInstance(); // Retrieve saved API instance
  
  // Get portfolio
  const portfolio = await api.getPortfolio();
  
  // Transform and set data
  setData(transformPortfolio(portfolio));
}
```

### Step 3: Subscribe to Real-time Updates

```typescript
import { subscribeToPrice } from '@/lib/api-service';

// Subscribe to price updates
subscribeToPrice(api, 'US0378331005', (price) => {
  updatePosition('AAPL', price);
});
```

### Trade Republic API Methods

```typescript
// Authentication
await api.login(getDevicePin: () => Promise<string>): Promise<boolean>

// Portfolio data
await api.getPortfolio(): Promise<Portfolio>

// Real-time subscriptions
api.subscribe<T>(message: Message<T>, callback: (data: string) => void): number
api.subscribeOnce<T>(message: Message<T>, callback: (data: string) => void): number
api.unsubscribe(id: number): void

// Cleanup
await api.logout(): Promise<void>
```

See [SETUP.md](./SETUP.md) for detailed integration guide.

## Components

### PortfolioHeader
Displays total portfolio value, gain/loss, and key metrics.

```tsx
<PortfolioHeader data={portfolioData} />
```

### PositionsTable
Detailed table of all holdings with performance indicators.

```tsx
<PositionsTable positions={positions} />
```

### PerformanceChart
30-day performance visualization.

```tsx
<PerformanceChart />
```

### AllocationChart
Asset allocation pie chart.

```tsx
<AllocationChart />
```

### Watchlist
Market watch list component.

```tsx
<Watchlist />
```

## Hooks

### usePortfolio
Manage portfolio state and auto-refresh data.

```typescript
const { data, isLoading, error, refresh } = usePortfolio({
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
});
```

## API Routes

Currently, the dashboard is client-side only for demo purposes. For production, add API routes:

```
app/api/
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
├── portfolio/
│   └── route.ts
└── positions/
    └── route.ts
```

## Authentication Flow

```
User → Landing Page → Sign In
                        ↓
                  Phone + PIN
                        ↓
                 Trade Republic API
                        ↓
                  Device PIN verification
                        ↓
                   WebSocket connection
                        ↓
                    Dashboard
```

## Security Best Practices

### Development (Current)
- Session stored in localStorage
- No sensitive data persistence
- Demo mode only

### Production (Recommended)
- Use HTTP-only secure cookies for sessions
- Implement proper error handling
- Add CSRF protection
- Use environment variables for secrets
- Implement proper logging
- Add rate limiting
- Use HTTPS only
- Add input validation

## Performance

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Using Next.js Image component
- **CSS**: Tailwind CSS with purging
- **Charts**: Optimized Recharts components
- **State Management**: React hooks (no Redux needed)

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliant
- Screen reader friendly

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Self-Hosted

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## Troubleshooting

### Dashboard shows no data
1. Check browser console for errors
2. Verify Trade Republic API credentials
3. Ensure WebSocket connection is established

### Charts not rendering
1. Check if Recharts is installed
2. Verify data format is correct
3. Check browser console for errors

### Login redirect loop
1. Check localStorage is enabled
2. Verify session data format
3. Check authentication logic

## Development

### Run Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Run Linting
```bash
pnpm lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project includes the Trade Republic API library. See [trade-republic-api](./trade-republic-api) for licensing details.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Trade Republic API](https://github.com/NightOwl07/trade-republic-api)
- [Recharts](https://recharts.org)

## Support

For issues and questions:

1. Check the [SETUP.md](./SETUP.md) for detailed setup instructions
2. Review the [Trade Republic API documentation](https://github.com/NightOwl07/trade-republic-api)
3. Check browser console for errors
4. Review application logs

## Changelog

### v1.0.0 (Initial Release)
- Landing page with feature showcase
- Authentication page
- Main dashboard with portfolio tracking
- Performance charts and analytics
- Asset allocation visualization
- Market watchlist
- Settings page
- Dark/Light theme support
- Full responsive design
- Trade Republic API integration (mock data)

---

Made with ❤️ for traders who want a modern, beautiful trading experience.
