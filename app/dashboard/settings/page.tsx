'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Eye, Lock, Moon } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('tradeSession');
    if (!session) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and application settings
            </p>
          </div>

          {/* Account Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Account</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Email Address
                </label>
                <Input type="email" placeholder="your.email@example.com" disabled />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Phone Number
                </label>
                <Input type="tel" placeholder="+49 123 456789" disabled />
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                  <Lock className="w-4 h-4 mr-2" />
                  Change PIN
                </Button>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Price Alerts</p>
                    <p className="text-xs text-muted-foreground">Get notified when prices change</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Trading Activity</p>
                    <p className="text-xs text-muted-foreground">Get notified about trades</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Market News</p>
                    <p className="text-xs text-muted-foreground">Receive market insights</p>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Use dark theme</p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Compact View</p>
                    <p className="text-xs text-muted-foreground">Show less information</p>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Security</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Manage your security settings and active sessions
              </p>

              <Button variant="outline" className="border-border">
                <Lock className="w-4 h-4 mr-2" />
                View Active Sessions
              </Button>

              <div className="pt-4">
                <Button variant="outline" className="border-border">
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </div>
          </Card>

          {/* Data & Privacy */}
          <Card className="p-6 border-destructive/20">
            <h2 className="text-xl font-semibold text-foreground mb-6">Data & Privacy</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Download your data or delete your account. These actions cannot be undone.
            </p>

            <div className="space-y-3">
              <Button variant="outline" className="border-border">
                Download My Data
              </Button>
              <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
