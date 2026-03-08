# TradeFlow Developer Guide

This guide helps developers understand the TradeFlow architecture and how to extend it.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           User Browser                   │
│  ┌─────────────────────────────────────┐ │
│  │    Next.js Frontend (React 19)       │ │
│  │  ┌───────────────────────────────┐  │ │
│  │  │  Pages & Routes               │  │ │
│  │  │  - Landing (/)                │  │ │
│  │  │  - Auth (/auth)               │  │ │
│  │  │  - Dashboard (/dashboard)     │  │ │
│  │  │  - Settings (/dashboard/...)  │  │ │
│  │  └───────────────────────────────┘  │ │
│  │  ┌───────────────────────────────┐  │ │
│  │  │  Components (React)            │  │ │
│  │  │  - Portfolio Header            │  │ │
│  │  │  - Charts (Recharts)           │  │ │
│  │  │  - Tables                      │  │ │
│  │  │  - Forms (React Hook Form)     │  │ │
│  │  └───────────────────────────────┘  │ │
│  │  ┌───────────────────────────────┐  │ │
│  │  │  State Management              │  │ │
│  │  │  - React Hooks (useState)      │  │ │
│  │  │  - Custom Hooks (usePortfolio) │  │ │
│  │  │  - Context API (optional)      │  │ │
│  │  └───────────────────────────────┘  │ │
│  │  ┌───────────────────────────────┐  │ │
│  │  │  Utilities                     │  │ │
│  │  │  - Calculations                │  │ │
│  │  │  - Formatting                  │  │ │
│  │  │  - Constants                   │  │ │
│  │  └───────────────────────────────┘  │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
    localStorage          Trade Republic API
    (session)         (WebSocket + REST)
```

## Code Organization

### `/app` - Next.js App Router
- **page.tsx**: Page components (auto-routed)
- **layout.tsx**: Layout wrapper
- **error.tsx**: Error boundaries
- **not-found.tsx**: 404 handling
- **globals.css**: Global styles & tokens

### `/components` - React Components
- **UI Components**: shadcn/ui imports (50+)
- **Feature Components**: Business logic
- **Reusable Components**: Shared across pages

### `/lib` - Utilities & Services
- **trade-republic.ts**: Portfolio calculations
- **api-service.ts**: API integration
- **calculations.ts**: Financial math
- **constants.ts**: App configuration
- **utils.ts**: Helpers

### `/hooks` - Custom React Hooks
- **use-portfolio.ts**: Portfolio state management
- **use-toast.ts**: Notifications (from shadcn)

### `/types` - TypeScript Definitions
- **index.ts**: Global type definitions

### `/trade-republic-api` - External Library
- Handles API communication
- WebSocket subscriptions
- Authentication flow

## Development Workflow

### 1. Setup Development Environment

```bash
# Install dependencies
pnpm install

# Start development server with hot reload
pnpm dev

# Open browser
open http://localhost:3000
```

### 2. Component Development

#### Creating a New Component

```typescript
// components/my-component.tsx
'use client'; // Client component if needed

import { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  isLoading?: boolean;
}

export function MyComponent({
  title,
  isLoading = false,
  className,
  ...props
}: MyComponentProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {isLoading ? <p>Loading...</p> : <p>Content here</p>}
    </div>
  );
}
```

#### Using the Component

```typescript
// app/page.tsx or another component
import { MyComponent } from '@/components/my-component';

export default function Page() {
  return (
    <MyComponent title="My Component" />
  );
}
```

### 3. Creating API Routes

```typescript
// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get data from Trade Republic API
    const data = await fetchPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
```

### 4. State Management

#### Using Custom Hooks

```typescript
// In a component
'use client';

import { usePortfolio } from '@/hooks/use-portfolio';

export function MyDashboard() {
  const { data, isLoading, error, refresh } = usePortfolio({
    autoRefresh: true,
    refreshInterval: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Portfolio Value: ${data?.totalValue}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

#### Creating a Custom Hook

```typescript
// hooks/use-my-feature.ts
import { useState, useCallback } from 'react';

export function useMyFeature() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/my-endpoint');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetch };
}
```

## Styling

### Design System

Colors are defined in `app/globals.css` using OKLCH:

```css
:root {
  --primary: oklch(0.5 0.28 142);        /* Green */
  --destructive: oklch(0.6 0.24 25);     /* Red */
  --background: oklch(0.98 0 0);         /* White */
  --foreground: oklch(0.15 0 0);         /* Black */
}

.dark {
  --primary: oklch(0.55 0.28 142);
  --background: oklch(0.1 0 0);
  --foreground: oklch(0.96 0 0);
}
```

### Using Tailwind CSS

```typescript
// Use semantic classes
<div className="flex items-center justify-between gap-4 p-6 rounded-lg bg-card border border-border">
  <h2 className="text-lg font-semibold text-foreground">Title</h2>
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Action
  </button>
</div>

// Avoid hardcoded colors
<div className="bg-[#22c55e]">❌ Don't do this</div>
<div className="bg-primary">✅ Do this instead</div>
```

### Responsive Design

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
  {items.map((item) => (
    <div key={item.id} className="p-4 rounded-lg border border-border">
      {item.name}
    </div>
  ))}
</div>
```

## Type Safety

### Using TypeScript

```typescript
// Define types
interface User {
  id: string;
  name: string;
  email: string;
}

// Use in components
interface UserListProps {
  users: User[];
  onSelect: (user: User) => void;
}

export function UserList({ users, onSelect }: UserListProps) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} onClick={() => onSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### Type Exports

```typescript
// types/index.ts
export interface Portfolio {
  value: number;
  gain: number;
}

// In a component
import type { Portfolio } from '@/types';

function MyComponent(portfolio: Portfolio) {
  // ...
}
```

## Testing

### Unit Tests (Example)

```typescript
// lib/__tests__/calculations.test.ts
import { calculateROI } from '@/lib/calculations';

describe('calculateROI', () => {
  it('should calculate ROI correctly', () => {
    const roi = calculateROI(1200, 1000);
    expect(roi).toBe(20);
  });

  it('should return 0 for zero invested amount', () => {
    const roi = calculateROI(100, 0);
    expect(roi).toBe(0);
  });
});
```

### Component Tests (Example)

```typescript
// components/__tests__/portfolio-header.test.tsx
import { render, screen } from '@testing-library/react';
import { PortfolioHeader } from '@/components/portfolio-header';

describe('PortfolioHeader', () => {
  it('displays portfolio value', () => {
    const mockData = {
      totalValue: 10000,
      totalGain: 500,
      totalGainPercent: 5,
      totalInvested: 9500,
      positions: [],
    };

    render(<PortfolioHeader data={mockData} />);
    expect(screen.getByText(/10000/)).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting

Next.js automatically code-splits at the page level. For large components:

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if not needed
});

export default function Page() {
  return <HeavyChart />;
}
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize component
const PositionItem = memo(function PositionItem({ position }: Props) {
  return <div>{position.name}</div>;
});

// Memoize computed values
const totalValue = useMemo(
  () => positions.reduce((sum, pos) => sum + pos.value, 0),
  [positions]
);

// Memoize callbacks
const handleClick = useCallback(
  (id: string) => {
    // Handle click
  },
  [dependencies]
);
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/images/portfolio.png"
  alt="Portfolio Overview"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

## Debugging

### Console Logging

```typescript
// Use descriptive messages
console.log('[Portfolio] Data loaded:', data);
console.error('[API] Request failed:', error);
console.warn('[Performance] Slow operation detected');
```

### React DevTools

1. Install React DevTools extension
2. Open DevTools → Components tab
3. Inspect component props and state

### Network Debugging

1. Open DevTools → Network tab
2. Filter by API calls
3. Check request/response headers
4. Verify payload

## Environment Variables

### Development

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

### Production

Set in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_WS_URL=wss://api.example.com
```

## Common Tasks

### Adding a New Feature

1. Create page in `/app/feature/page.tsx`
2. Create components in `/components/feature-*.tsx`
3. Create hooks in `/hooks/use-feature.ts` if needed
4. Create API routes in `/app/api/feature/route.ts` if needed
5. Update `/components/dashboard-nav.tsx` with new link
6. Test and deploy

### Modifying Styles

1. Check `app/globals.css` for design tokens
2. Use semantic classes (e.g., `text-primary`)
3. Update color tokens if needed
4. Test in both light and dark modes

### Integrating Trade Republic API

1. Update `lib/api-service.ts` with API calls
2. Use `hooks/use-portfolio.ts` in components
3. Handle errors gracefully
4. Show loading states

### Adding Calculations

1. Add function to `lib/calculations.ts`
2. Export function
3. Add types if needed
4. Write tests
5. Use in components

## Best Practices

### Code Quality
- Use TypeScript strict mode
- Avoid `any` types
- Use semantic variable names
- Keep functions pure
- Add JSDoc comments for exports

### Performance
- Lazy load components
- Memoize expensive computations
- Use `useCallback` for callbacks
- Optimize images
- Minify CSS/JS

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Test with keyboard
- Use color + text for emphasis
- Ensure sufficient contrast

### Security
- Validate input on client AND server
- Never expose secrets in client code
- Use HTTPS
- Sanitize user input
- Implement CSRF protection

### Error Handling
- Handle promise rejections
- Show user-friendly errors
- Log errors for debugging
- Graceful degradation
- Error boundaries

## Deployment Checklist

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] No hardcoded URLs
- [ ] Environment variables set
- [ ] Security review
- [ ] Performance audit
- [ ] Accessibility check
- [ ] Mobile responsive
- [ ] Dark mode working
- [ ] Error pages working

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)

## Support

For questions or issues:
1. Check existing documentation
2. Search GitHub issues
3. Ask in discussions
4. Contact maintainers
