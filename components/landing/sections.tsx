import {
  BarChart3,
  Database,
  Lock,
  Receipt,
  Repeat,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Users,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Receipt,
    title: 'Expense Tracking',
    description: 'Log income and expenses in seconds, tagged by category and payment method.',
  },
  {
    icon: Target,
    title: 'Smart Budgets',
    description: 'Set monthly limits per category and see exactly how much room you have left.',
  },
  {
    icon: BarChart3,
    title: 'Financial Analytics',
    description: 'Charts that show income against expenses over days, months, and years.',
  },
  {
    icon: Repeat,
    title: 'Recurring Expenses',
    description: 'Keep subscriptions, rent, and bills on a schedule so nothing catches you off guard.',
  },
  {
    icon: Users,
    title: 'Bill Splitting',
    description: 'Divide shared costs equally or by custom amounts and track who has settled up.',
  },
  {
    icon: Sparkles,
    title: 'Spending Insights',
    description: 'Plain-language observations about where your money went and what changed.',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-20 border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Features</p>
          <h2 className="text-4xl font-semibold tracking-tight">Everything you need to manage your money.</h2>
          <p className="text-muted-foreground">Focused tools for tracking, planning, and understanding your finances.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="group transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <CardContent className="space-y-4 p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background transition-transform group-hover:scale-105">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const SAMPLE_CATEGORIES = [
  { label: 'Food', share: 32, color: 'bg-emerald-600' },
  { label: 'Rent', share: 28, color: 'bg-sky-600' },
  { label: 'Transport', share: 18, color: 'bg-slate-600' },
  { label: 'Shopping', share: 14, color: 'bg-amber-600' },
  { label: 'Other', share: 8, color: 'bg-slate-400' },
];

const MONTH_BARS = [
  { month: 'Jan', income: 80, expense: 56 },
  { month: 'Feb', income: 74, expense: 62 },
  { month: 'Mar', income: 88, expense: 58 },
  { month: 'Apr', income: 82, expense: 70 },
  { month: 'May', income: 92, expense: 64 },
  { month: 'Jun', income: 86, expense: 60 },
];

export function AnalyticsPreview() {
  return (
    <section id="analytics" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Analytics</p>
            <h2 className="text-4xl font-semibold tracking-tight">See the shape of your spending.</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Compare months, track your savings rate, and spot the categories that quietly take the biggest share.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Income against expenses, month by month</li>
              <li>Savings rate calculated from your real transactions</li>
              <li>Category rankings with percentage of total spend</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-4 text-sm font-semibold">Income vs expenses</p>
                <div className="flex h-48 items-end gap-3">
                  {MONTH_BARS.map((bar) => (
                    <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full flex-1 items-end justify-center gap-1">
                        <div className="w-1/2 rounded-t-sm bg-emerald-500/80" style={{ height: `${bar.income}%` }} />
                        <div className="w-1/2 rounded-t-sm bg-red-500/70" style={{ height: `${bar.expense}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <div
                  className="h-28 w-28 rounded-full"
                  style={{
                    background:
                      'conic-gradient(#059669 0 32%, #0284c7 32% 60%, #475569 60% 78%, #d97706 78% 92%, #94a3b8 92% 100%)',
                    WebkitMask: 'radial-gradient(circle, transparent 55%, black 56%)',
                    mask: 'radial-gradient(circle, transparent 55%, black 56%)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 border-t pt-6 text-xs text-muted-foreground sm:grid-cols-3">
              {SAMPLE_CATEGORIES.map((category) => (
                <li key={category.label} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${category.color}`} aria-hidden="true" />
                  {category.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const SECURITY_POINTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Lock,
    title: 'Secure authentication',
    description: 'Passwords are handled by Supabase Auth and never stored or exposed by SpendWise.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected user data',
    description: 'Every transaction is locked to its owner with row-level security in the database.',
  },
  {
    icon: ServerCog,
    title: 'Server-side validation',
    description: 'Every amount, date, and category is checked again on the server before it is saved.',
  },
  {
    icon: Database,
    title: 'Database-backed architecture',
    description: 'Your records live in PostgreSQL with constraints that keep monetary values exact.',
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="scroll-mt-20 border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Security</p>
          <h2 className="text-4xl font-semibold tracking-tight">Your finances deserve real protection.</h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {SECURITY_POINTS.map((point) => (
            <div key={point.title} className="flex gap-4 rounded-xl border bg-background p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <point.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="space-y-1.5">
                <h3 className="font-semibold">{point.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
