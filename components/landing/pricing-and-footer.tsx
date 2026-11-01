import Link from 'next/link';
import { Check, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PLAN_FEATURES = [
  'Unlimited transactions',
  'Monthly budgets with progress alerts',
  'Recurring payments and bill splitting',
  'Analytics and rule-based insights',
  'Light and dark mode',
];

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Pricing</p>
          <h2 className="text-4xl font-semibold tracking-tight">Simple, honest pricing.</h2>
          <p className="text-muted-foreground">Start for free and keep everything you need to manage your money.</p>
        </div>
        <Card className="mx-auto mt-16 max-w-md border-foreground/10 shadow-xl">
          <CardContent className="space-y-8 p-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Personal</p>
              <p className="text-5xl font-semibold tracking-tight">Free</p>
              <p className="text-sm text-muted-foreground">For individuals tracking their own money.</p>
            </div>
            <ul className="space-y-3 text-sm">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button size="lg" className="h-12 w-full" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function CtaFooter() {
  return (
    <>
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 text-center text-slate-50 sm:px-16">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight">
            Start managing your finances today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Create your free account and see where your money goes within minutes.
          </p>
          <Button size="lg" variant="secondary" className="mt-8 h-12 px-8" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
                <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              SpendWise
            </Link>
            <p className="text-sm text-muted-foreground">Personal finance, made calm.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#analytics" className="hover:text-foreground">Analytics</a>
            <a href="#security" className="hover:text-foreground">Security</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <Link href="/login" className="hover:text-foreground">Log in</Link>
            <Link href="/register" className="hover:text-foreground">Sign up</Link>
          </nav>
        </div>
        <p className="pb-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SpendWise. All rights reserved.
        </p>
      </footer>
    </>
  );
}
