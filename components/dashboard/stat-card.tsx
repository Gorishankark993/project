import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

type StatTone = 'neutral' | 'income' | 'expense';

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  tone?: StatTone;
  helper?: string;
};

const TONE_STYLES: Record<StatTone, { value: string; icon: string }> = {
  neutral: { value: 'text-foreground', icon: 'bg-muted text-muted-foreground' },
  income: { value: 'text-emerald-600 dark:text-emerald-400', icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  expense: { value: 'text-red-600 dark:text-red-400', icon: 'bg-red-500/10 text-red-600 dark:text-red-400' },
};

export function StatCard({ title, value, icon: Icon, tone = 'neutral', helper }: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', TONE_STYLES[tone].icon)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <div className="space-y-1">
          <p className={cn('text-2xl font-semibold tabular-nums tracking-tight', TONE_STYLES[tone].value)}>{value}</p>
          {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
