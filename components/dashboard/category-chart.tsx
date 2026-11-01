'use client';

import Link from 'next/link';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency, formatPercent } from '@/lib/format';
import { CategoryIcon } from '@/components/transactions/category-icon';

export type CategoryTotal = {
  category: string;
  amount: number;
  percentage: number;
};

type CategoryChartProps = {
  data: CategoryTotal[];
  baseQuery: string;
};

const CATEGORY_COLORS = [
  '#059669',
  '#0284c7',
  '#2563eb',
  '#475569',
  '#d97706',
  '#65a30d',
  '#0d9488',
  '#64748b',
  '#b45309',
  '#0369a1',
  '#94a3b8',
];

export function CategoryChart({ data, baseQuery }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No expenses recorded in this range yet.
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,240px)_1fr] md:items-center">
      <div className="relative mx-auto h-60 w-60" role="img" aria-label="Spending by category">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Top category</span>
          <span className="text-sm font-semibold">{data[0].category}</span>
        </div>
      </div>

      <ul className="divide-y">
        {data.map((entry, index) => (
          <li key={entry.category}>
            <Link
              href={`/dashboard/transactions?${baseQuery}&category=${encodeURIComponent(entry.category)}`}
              className="group flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-accent"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                aria-hidden="true"
              />
              <CategoryIcon category={entry.category} className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate text-sm font-medium">{entry.category}</span>
              <span className="hidden text-xs text-muted-foreground sm:inline">{formatPercent(entry.percentage)}</span>
              <span className="text-sm font-semibold tabular-nums">{formatCurrency(entry.amount)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
