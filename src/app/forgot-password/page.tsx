
import AuthLayout from '@/components/auth/AuthLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - HIGH-ER Hub',
  description: 'Reset your HIGH-ER Hub account password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
        title="Forgot your password?"
        description="No worries, we'll send you reset instructions."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
