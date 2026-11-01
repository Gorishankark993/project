'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_CATEGORIES, PAYMENT_METHODS } from '@/lib/constants';
import { SORT_OPTIONS } from '@/lib/transactions/filters';
import type { TransactionFilters } from '@/lib/transactions/repository';

const FILTER_KEYS = ['q', 'type', 'category', 'payment', 'from', 'to', 'min', 'max', 'sort'] as const;
const SEARCH_DEBOUNCE_MS = 350;

function useFilterUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== 'all') params.set(key, value);
        else params.delete(key);
      }
      params.delete('page');
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );
}

function DebouncedField({
  id,
  label,
  initialValue,
  type = 'text',
  placeholder,
  inputMode,
  onCommit,
}: {
  id: string;
  label: string;
  initialValue: string;
  type?: string;
  placeholder?: string;
  inputMode?: 'decimal' | 'text';
  onCommit: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (value === initialValue) return;
    const timer = setTimeout(() => onCommit(value.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, initialValue, onCommit]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => setValue(event.target.value)}
        className="h-10"
      />
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function TransactionsToolbar({ filters }: { filters: TransactionFilters }) {
  const updateUrl = useFilterUrl();

  const hasActiveFilters =
    filters.query !== '' ||
    filters.type !== null ||
    filters.category !== null ||
    filters.paymentMethod !== null ||
    filters.from !== null ||
    filters.to !== null ||
    filters.minAmount !== null ||
    filters.maxAmount !== null ||
    filters.sort !== 'date_desc';

  function clearFilters() {
    updateUrl(Object.fromEntries(FILTER_KEYS.map((key) => [key, null])));
  }

  return (
    <div className="space-y-4 rounded-xl border bg-background p-4 sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1.5 md:col-span-2 xl:col-span-2">
          <DebouncedField
            id="search"
            label="Search"
            placeholder="Description, category or notes"
            initialValue={filters.query}
            onCommit={(value) => updateUrl({ q: value })}
          />
        </div>
        <FilterSelect
          id="type-filter"
          label="Type"
          value={filters.type ?? 'all'}
          options={[
            { value: 'all', label: 'All types' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expenses' },
          ]}
          onChange={(value) => updateUrl({ type: value })}
        />
        <FilterSelect
          id="category-filter"
          label="Category"
          value={filters.category ?? 'all'}
          options={[{ value: 'all', label: 'All categories' }, ...ALL_CATEGORIES.map((c) => ({ value: c, label: c }))]}
          onChange={(value) => updateUrl({ category: value })}
        />
        <FilterSelect
          id="payment-filter"
          label="Payment method"
          value={filters.paymentMethod ?? 'all'}
          options={[{ value: 'all', label: 'All methods' }, ...PAYMENT_METHODS.map((m) => ({ value: m, label: m }))]}
          onChange={(value) => updateUrl({ payment: value })}
        />
        <FilterSelect
          id="sort-filter"
          label="Sort by"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(value) => updateUrl({ sort: value === 'date_desc' ? null : value })}
        />
        <DebouncedField
          id="from-date"
          label="From"
          type="date"
          initialValue={filters.from ?? ''}
          onCommit={(value) => updateUrl({ from: value })}
        />
        <DebouncedField
          id="to-date"
          label="To"
          type="date"
          initialValue={filters.to ?? ''}
          onCommit={(value) => updateUrl({ to: value })}
        />
        <DebouncedField
          id="min-amount"
          label="Min amount"
          placeholder="0"
          inputMode="decimal"
          initialValue={filters.minAmount?.toString() ?? ''}
          onCommit={(value) => updateUrl({ min: value })}
        />
        <DebouncedField
          id="max-amount"
          label="Max amount"
          placeholder="No limit"
          inputMode="decimal"
          initialValue={filters.maxAmount?.toString() ?? ''}
          onCommit={(value) => updateUrl({ max: value })}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
            <X className="h-4 w-4" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
