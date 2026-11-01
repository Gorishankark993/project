import { AuthForm } from '@/components/auth/auth-form';
import { updatePassword } from '@/lib/auth/actions';

export const metadata = { title: 'Set new password | SpendWise' };

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="text-sm text-muted-foreground">Use at least 8 characters for your new password.</p>
      </div>

      <AuthForm
        action={updatePassword}
        fields={[
          { name: 'password', label: 'New password', type: 'password', autoComplete: 'new-password' },
          { name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
        ]}
        submitLabel="Update password"
        pendingLabel="Updating..."
      />
    </div>
  );
}
