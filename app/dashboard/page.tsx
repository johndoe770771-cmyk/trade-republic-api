'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { ISINTrader } from '@/components/isin-trader';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('tradeSession');
    if (!session) {
      router.push('/auth');
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <Skeleton className="h-96 rounded-lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Trading ISIN</h1>
          <p className="text-muted-foreground mt-2">Achetez et vendez des actifs en temps réel avec les meilleures prix Bid/Ask</p>
        </div>

        <ISINTrader />
      </main>
    </div>
  );
}
