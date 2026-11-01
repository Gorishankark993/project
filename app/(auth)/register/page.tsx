import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { signUp } from '@/lib/auth/actions';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata = { title: 'Create account | SpendWise' };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect('/dashboard');

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start tracking your spending in under a minute.</p>
      </div>

      <AuthForm
        action={signUp}
        fields={[
          { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Aditi Sharma' },
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', placeholder: 'At least 8 characters' },
        ]}
        submitLabel="Create account"
        pendingLabel="Creating account..."
      >
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </AuthForm>
    </div>
  );
}
