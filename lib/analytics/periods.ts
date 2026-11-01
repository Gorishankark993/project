import { endOfMonth, endOfYear, format, isValid, parseISO, startOfMonth, startOfYear, subMonths } from 'date-fns';

export const PERIOD_OPTIONS = [
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'last_3_months', label: 'Last 3 months' },
  { value: 'this_year', label: 'This year' },
  { value: 'custom', label: 'Custom range' },
] as const;

export type PeriodKey = (typeof PERIOD_OPTIONS)[number]['value'];

export type DateRange = {
  key: PeriodKey;
  label: string;
  start: string;
  end: string;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function isValidIsoDate(value: string | undefined): value is string {
  return !!value && ISO_DATE_PATTERN.test(value) && isValid(parseISO(value));
}

export function resolvePeriod(
  params: { period?: string; from?: string; to?: string },
  now: Date = new Date(),
): DateRange {
  const option = PERIOD_OPTIONS.find((item) => item.value === params.period);
  const key: PeriodKey = option?.value ?? 'this_month';

  switch (key) {
    case 'last_month': {
      const previous = subMonths(now, 1);
      return {
        key,
        label: 'Last month',
        start: toIsoDate(startOfMonth(previous)),
        end: toIsoDate(endOfMonth(previous)),
      };
    }
    case 'last_3_months':
      return {
        key,
        label: 'Last 3 months',
        start: toIsoDate(startOfMonth(subMonths(now, 2))),
        end: toIsoDate(endOfMonth(now)),
      };
    case 'this_year':
      return { key, label: 'This year', start: toIsoDate(startOfYear(now)), end: toIsoDate(endOfYear(now)) };
    case 'custom': {
      if (isValidIsoDate(params.from) && isValidIsoDate(params.to) && params.from <= params.to) {
        return { key, label: 'Custom range', start: params.from, end: params.to };
      }
      return resolvePeriod({ period: 'this_month' }, now);
    }
    case 'this_month':
      return {
        key,
        label: 'This month',
        start: toIsoDate(startOfMonth(now)),
        end: toIsoDate(endOfMonth(now)),
      };
  }
}
