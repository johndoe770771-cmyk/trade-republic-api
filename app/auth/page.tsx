import { AuthForm } from '@/components/auth-form';

export const metadata = {
  title: 'Sign In - TradeFlow',
  description: 'Sign in to your TradeFlow trading account',
};

export default function AuthPage() {
  return <AuthForm />;
}
