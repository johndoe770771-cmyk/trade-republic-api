'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { PortfolioHeader } from '@/components/portfolio-header';
import { PositionsTable } from '@/components/positions-table';
import { PerformanceChart } from '@/components/performance-chart';
import { AllocationChart } from '@/components/allocation-chart';
import { Watchlist } from '@/components/watchlist';
import { createMockPortfolioData } from '@/lib/trade-republic';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(createMockPortfolioData());

  useEffect(() => {
    // Check if user is authenticated
    const session = localStorage.getItem('tradeSession');
    if (!session) {
      router.push('/');
      return;
    }

    // Simulate data loading
    setTimeout(() => {
      setPortfolioData(createMockPortfolioData());
      setIsLoading(false);
    }, 500);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Portfolio Header */}
        <PortfolioHeader data={portfolioData} />

        {/* Charts and Watchlist Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PerformanceChart />
            <AllocationChart />
          </div>
          <Watchlist />
        </div>

        {/* Positions Table */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Positions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track your current holdings
            </p>
          </div>
          <PositionsTable positions={portfolioData.positions} />
        </div>

        {/* Footer Info */}
        <div className="border-t border-border pt-8 pb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Market Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9:30 AM - 4:00 PM ET
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Last Updated</h3>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">
                Need help? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
