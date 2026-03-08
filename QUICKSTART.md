# Quick Start Guide - TradeFlow

Get TradeFlow running in 5 minutes.

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3. Explore the App

### Landing Page (/)
- View features and benefits
- Click "Get Started" to begin

### Authentication (/auth)
- Enter any phone number (e.g., +49 123 456789)
- Enter any PIN (e.g., 1234)
- Click "Sign In"

### Dashboard (/dashboard)
- View portfolio overview
- Check 30-day performance chart
- See asset allocation
- Browse holdings table
- Track market watchlist

### Settings (/dashboard/settings)
- Manage account settings
- Configure notifications
- Adjust appearance
- Security settings

## Demo Account

The app comes with demo mode enabled:
- **Phone**: Any number
- **PIN**: Any 4-6 digits
- **Data**: Mock portfolio data (pre-loaded)

## Project Structure

```
TradeFlow/
├── app/                  # Pages & layouts
├── components/           # React components
├── lib/                  # Utilities & hooks
├── trade-republic-api/   # API library
└── README.md            # Full documentation
```

## Key Features

- ✅ Beautiful, responsive design
- ✅ Dark/Light theme support
- ✅ Portfolio tracking
- ✅ Performance analytics
- ✅ Real-time charts
- ✅ Market watchlist
- ✅ Settings management

## Next Steps

### For Development
1. Read [DEVELOPER.md](./DEVELOPER.md) for architecture
2. Check [lib/trade-republic.ts](./lib/trade-republic.ts) for data utilities
3. Explore components in [components/](./components/)

### For Integration
1. Read [SETUP.md](./SETUP.md) for API integration
2. Update [lib/api-service.ts](./lib/api-service.ts) with real API calls
3. Connect Trade Republic API credentials

### For Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run tests (example setup)
```

## Project Features

### Pages
- **Home** (`/`): Landing page with hero, features, CTA
- **Auth** (`/auth`): Login with phone + PIN
- **Dashboard** (`/dashboard`): Main portfolio view
- **Settings** (`/dashboard/settings`): User preferences

### Components (47 Total)
- Portfolio summary with metrics
- Holdings table with details
- Performance chart (30 days)
- Asset allocation pie chart
- Market watchlist
- Navigation bar
- Authentication form
- 41+ shadcn/ui components

### Data Visualization
- Line charts (Recharts)
- Pie charts
- Data tables
- Real-time indicators

## Customization

### Change Theme Colors
Edit `app/globals.css`:
```css
:root {
  --primary: oklch(0.5 0.28 142);  /* Change primary color */
  --destructive: oklch(0.6 0.24 25); /* Change error color */
}
```

### Add New Pages
Create files in `app/` directory:
```
app/new-page/page.tsx
```

### Add API Routes
Create route handlers in `app/api/`:
```
app/api/portfolio/route.ts
```

### Modify Mock Data
Edit `lib/trade-republic.ts`:
```typescript
createMockPortfolioData() // Your data here
```

## Troubleshooting

### Port Already in Use
```bash
# Use different port
pnpm dev -- -p 3001
```

### Dependencies Issue
```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Theme Not Switching
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check localStorage

## Documentation

- 📖 [README.md](./README.md) - Full documentation
- 🔧 [SETUP.md](./SETUP.md) - Detailed setup & integration
- 👨‍💻 [DEVELOPER.md](./DEVELOPER.md) - Developer guide
- 📋 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview

## Need Help?

1. Check the relevant documentation file above
2. Review example code in `lib/` and `components/`
3. Check browser console for errors
4. Review Trade Republic API docs

## What's Next?

### Option 1: Explore Demo
- Click through all pages
- Try different screen sizes
- Toggle dark mode
- Check responsive design

### Option 2: Start Development
- Read DEVELOPER.md
- Create a new component
- Add a new page
- Modify existing features

### Option 3: Integrate API
- Read SETUP.md
- Connect Trade Republic API
- Replace mock data with real data
- Test with real credentials

## Stack Overview

**Frontend**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

**Charts & Data**
- Recharts
- React Hook Form

**Icons**
- Lucide React

**State**
- React Hooks
- Custom hooks

## Tech Highlights

- ⚡ Fast development with Turbopack
- 🎨 Beautiful UI with Tailwind & shadcn
- 📊 Data visualization with Recharts
- 🔒 Type-safe with TypeScript
- 🌙 Dark/Light theme built-in
- 📱 Fully responsive design
- ♿ Accessibility first
- 🚀 Production-ready code

## Performance

- Code splitting enabled
- Image optimization ready
- CSS minification
- Component lazy loading support
- Charts optimized

## Security

- TypeScript strict mode
- Environment variables ready
- Input validation
- Error handling
- CSRF protection ready

## Browser Support

✅ Chrome, Firefox, Safari, Edge (latest 2 versions)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## License

See LICENSE file for details.

---

**Happy Trading! 🚀**

Need more help? Check the documentation files or visit the project repository.
