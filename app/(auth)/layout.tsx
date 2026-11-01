import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-slate-50 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
            <Wallet className="h-5 w-5" />
          </span>
          SpendWise
        </Link>
        <div className="max-w-md space-y-6">
          <p className="text-3xl font-semibold leading-tight tracking-tight">
            Clarity over every rupee you earn and spend.
          </p>
          <p className="text-base leading-relaxed text-slate-400">
            Track transactions, stay within budgets, and see exactly where your money goes.
          </p>
        </div>
        <p className="text-sm text-slate-500">Your data is private to your account and protected at the database level.</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2 font-semibold tracking-tight lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900">
              <Wallet className="h-4 w-4" />
            </span>
            SpendWise
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
