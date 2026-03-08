import { AuthForm } from '@/components/auth-form';

export const metadata = {
  title: 'Connexion - TradeFlow',
  description: 'Connectez-vous à votre compte TradeFlow',
};

export default function AuthPage() {
  return <AuthForm />;
}
