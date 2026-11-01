import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PREVIEW_BARS = [38, 62, 48, 74, 56, 88, 66, 80, 52, 70, 44, 92];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[480px] bg-[radial-gradient(ellipse_at_top,hsl(160_84%_39%/0.12),transparent_60%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1fr_1.1fr] lg:pt-28">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Personal finance, made calm
          </span>
          <div className="space-y-5">
            <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Take control of your money.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Track spending, manage budgets, and understand where your money goes — all in one place.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 gap-2 px-6" asChild>
              <Link href="/register">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6" asChild>
              <a href="#product">View Demo</a>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {['Income and expense tracking', 'Monthly budgets', 'Bill splitting'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div id="product" className="relative scroll-mt-24">
          <div className="rounded-2xl border bg-background p-4 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Overview</p>
                <p className="text-sm font-semibold">This month</p>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['Balance', 'Income', 'Expenses'].map((label, index) => (
                <div key={label} className="rounded-xl border p-3">
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                  <div
                    className={`mt-2 h-3 w-16 rounded-full ${
                      index === 1
                        ? 'bg-emerald-500/70'
                        : index === 2
                          ? 'bg-red-500/70'
                          : 'bg-foreground/70'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border p-4">
              <div className="flex h-40 items-end gap-2">
                {PREVIEW_BARS.map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500/80 to-emerald-400/30"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-32 rounded-full bg-foreground/20" />
                    <div className="h-2 w-20 rounded-full bg-muted-foreground/20" />
                  </div>
                  <div className={`h-2.5 w-14 rounded-full ${row === 0 ? 'bg-emerald-500/60' : 'bg-red-500/50'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
