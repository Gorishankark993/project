import { eachDayOfInterval, eachMonthOfInterval, format, parseISO, subDays, startOfMonth, subMonths } from 'date-fns';
import type { TransactionRecord } from '@/lib/transactions/repository';
import { toIsoDate } from '@/lib/analytics/periods';

export const SERIES_OPTIONS = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '6m', label: '6 months' },
  { value: '1y', label: '1 year' },
] as const;

export type SeriesRangeKey = (typeof SERIES_OPTIONS)[number]['value'];

export type FlowPoint = {
  label: string;
  income: number;
  expense: number;
};

type FlowRow = Pick<TransactionRecord, 'type' | 'amount' | 'date'>;

export function resolveSeriesRange(raw: string | undefined, now: Date = new Date()) {
  const key = (SERIES_OPTIONS.find((option) => option.value === raw)?.value ?? '30d') as SeriesRangeKey;

  switch (key) {
    case '7d':
      return { key, start: toIsoDate(subDays(now, 6)), end: toIsoDate(now), granularity: 'day' as const };
    case '30d':
      return { key, start: toIsoDate(subDays(now, 29)), end: toIsoDate(now), granularity: 'day' as const };
    case '6m':
      return {
        key,
        start: toIsoDate(startOfMonth(subMonths(now, 5))),
        end: toIsoDate(now),
        granularity: 'month' as const,
      };
    case '1y':
      return {
        key,
        start: toIsoDate(startOfMonth(subMonths(now, 11))),
        end: toIsoDate(now),
        granularity: 'month' as const,
      };
  }
}

export function buildFlowSeries(
  rows: FlowRow[],
  range: ReturnType<typeof resolveSeriesRange>,
): FlowPoint[] {
  const start = parseISO(range.start);
  const end = parseISO(range.end);
  const isDaily = range.granularity === 'day';

  const buckets = isDaily
    ? eachDayOfInterval({ start, end }).map((day) => ({
        key: toIsoDate(day),
        label: format(day, 'd MMM'),
      }))
    : eachMonthOfInterval({ start, end }).map((month) => ({
        key: format(month, 'yyyy-MM'),
        label: format(month, 'MMM yy'),
      }));

  const points = new Map<string, FlowPoint>(
    buckets.map((bucket) => [bucket.key, { label: bucket.label, income: 0, expense: 0 }]),
  );

  for (const row of rows) {
    const key = isDaily ? row.date : row.date.slice(0, 7);
    const point = points.get(key);
    if (!point) continue;
    if (row.type === 'income') point.income += row.amount;
    else point.expense += row.amount;
  }

  return Array.from(points.values());
}

export function summarizeFlow(rows: Pick<TransactionRecord, 'type' | 'amount'>[]) {
  let income = 0;
  let expense = 0;
  for (const row of rows) {
    if (row.type === 'income') income += row.amount;
    else expense += row.amount;
  }
  const savings = income - expense;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  return { income, expense, savings, savingsRate };
}

export function summarizeCategories(rows: Pick<TransactionRecord, 'type' | 'amount' | 'category'>[]) {
  const totals = new Map<string, number>();
  let total = 0;

  for (const row of rows) {
    if (row.type !== 'expense') continue;
    totals.set(row.category, (totals.get(row.category) ?? 0) + row.amount);
    total += row.amount;
  }

  return Array.from(totals, ([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
  })).sort((a, b) => b.amount - a.amount);
}
