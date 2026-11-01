import {
  ALL_CATEGORIES,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
  type TransactionType,
} from '@/lib/constants';
import type { SortKey, TransactionFilters } from '@/lib/transactions/repository';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'amount_desc', label: 'Highest amount' },
  { value: 'amount_asc', label: 'Lowest amount' },
];

type SearchParams = Record<string, string | string[] | undefined>;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function readParam(params: SearchParams, key: string): string | null {
  const value = params[key];
  const single = Array.isArray(value) ? value[0] : value;
  return single && single.length > 0 ? single : null;
}

function readAmount(raw: string | null): number | null {
  if (raw === null) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function parseTransactionFilters(params: SearchParams): TransactionFilters {
  const type = readParam(params, 'type');
  const category = readParam(params, 'category');
  const paymentMethod = readParam(params, 'payment');
  const from = readParam(params, 'from');
  const to = readParam(params, 'to');
  const sort = readParam(params, 'sort');
  const page = Number(readParam(params, 'page'));

  return {
    query: (readParam(params, 'q') ?? '').slice(0, 100),
    type: type && (TRANSACTION_TYPES as readonly string[]).includes(type) ? (type as TransactionType) : null,
    category: category && (ALL_CATEGORIES as readonly string[]).includes(category) ? category : null,
    paymentMethod: paymentMethod && (PAYMENT_METHODS as readonly string[]).includes(paymentMethod) ? paymentMethod : null,
    from: from && ISO_DATE_PATTERN.test(from) ? from : null,
    to: to && ISO_DATE_PATTERN.test(to) ? to : null,
    minAmount: readAmount(readParam(params, 'min')),
    maxAmount: readAmount(readParam(params, 'max')),
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? (sort as SortKey) : 'date_desc',
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}
