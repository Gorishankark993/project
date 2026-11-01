'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AuthActionState } from '@/lib/auth/actions';

export type AuthFormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  autoComplete: string;
  placeholder?: string;
};

type AuthFormProps = {
  action: (prev: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  fields: AuthFormField[];
  submitLabel: string;
  pendingLabel: string;
  hiddenFields?: Record<string, string>;
  notice?: string;
  children?: React.ReactNode;
};

export function AuthForm({
  action,
  fields,
  submitLabel,
  pendingLabel,
  hiddenFields,
  notice,
  children,
}: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    setMessage(null);
    setIsPending(true);
    try {
      const result = await action({}, formData);
      setError(result.error ?? null);
      setMessage(result.message ?? null);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {hiddenFields &&
        Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

      {notice && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          {notice}
        </p>
      )}

      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            required
            disabled={isPending}
            className="h-11"
          />
        </div>
      ))}

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
          {message}
        </p>
      )}

      <Button type="submit" className="h-11 w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {pendingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>

      {children}
    </form>
  );
}
