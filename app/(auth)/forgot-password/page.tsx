import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { requestPasswordReset } from '@/lib/auth/actions';

export const metadata = { title: 'Forgot password | SpendWise' };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter the email linked to your account and we will send you a reset link.
        </p>
      </div>

      <AuthForm
        action={requestPasswordReset}
        fields={[{ name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' }]}
        submitLabel="Send reset link"
        pendingLabel="Sending..."
      >
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Back to log in
          </Link>
        </p>
      </AuthForm>
    </div>
  );
}
