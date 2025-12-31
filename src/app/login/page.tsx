
import * as React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login - HIGH-ER Hub',
  description: 'Sign in to your HIGH-ER Hub account.',
};

export default function LoginPage() {
  return (
    <AuthLayout 
        title="Sign in to your account"
        description="Welcome back! Please enter your details."
    >
      <React.Suspense fallback={
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading form...</p>
        </div>
      }>
        <LoginForm />
      </React.Suspense>
    </AuthLayout>
  );
}
