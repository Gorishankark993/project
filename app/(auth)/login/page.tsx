import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { signIn } from '@/lib/auth/actions';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata = { title: 'Log in | SpendWise' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  if (await getCurrentUser()) redirect('/dashboard');

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Log in to continue managing your money.</p>
      </div>

      <AuthForm
        action={signIn}
        hiddenFields={{ next: searchParams.next ?? '/dashboard' }}
        notice={searchParams.error === 'link_expired' ? 'That link has expired. Request a new one below.' : undefined}
        fields={[
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
        ]}
        submitLabel="Log in"
        pendingLabel="Logging in..."
      >
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="font-medium text-foreground underline-offset-4 hover:underline">
            Forgot password?
          </Link>
          <Link href="/register" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Create an account
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
