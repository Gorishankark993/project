import Link from 'next/link';
import { PERIOD_OPTIONS, type DateRange } from '@/lib/analytics/periods';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type PeriodSelectorProps = {
  active: DateRange;
  chart: string;
};

export function PeriodSelector({ active, chart }: PeriodSelectorProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
      <nav aria-label="Select period" className="flex flex-wrap gap-1 rounded-lg border bg-background p-1">
        {PERIOD_OPTIONS.filter((option) => option.value !== 'custom').map((option) => {
          const isActive = active.key === option.value;
          return (
            <Link
              key={option.value}
              href={`/dashboard?period=${option.value}&chart=${chart}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </nav>

      <form action="/dashboard" className="flex flex-wrap items-center gap-2 text-sm">
        <input type="hidden" name="period" value="custom" />
        <input type="hidden" name="chart" value={chart} />
        <label className="sr-only" htmlFor="custom-from">From date</label>
        <input
          id="custom-from"
          name="from"
          type="date"
          required
          defaultValue={active.key === 'custom' ? active.start : undefined}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="text-muted-foreground">to</span>
        <label className="sr-only" htmlFor="custom-to">To date</label>
        <input
          id="custom-to"
          name="to"
          type="date"
          required
          defaultValue={active.key === 'custom' ? active.end : undefined}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" variant="outline" size="sm" className="h-9">
          Apply range
        </Button>
      </form>
    </div>
  );
}
