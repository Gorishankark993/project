import type { ReactNode } from 'react';
import { CategoryIcon } from '@/components/transactions/category-icon';
import type { TransactionRecord } from '@/lib/transactions/repository';
import { formatCurrency, formatDisplayDate } from '@/lib/format';
import { cn } from '@/lib/utils';

type TransactionRowProps = {
  transaction: TransactionRecord;
  actions?: ReactNode;
};

export function TransactionRow({ transaction, actions }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';

  return (
    <li className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50 sm:px-6">
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          isIncome ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground',
        )}
      >
        <CategoryIcon category={transaction.category} className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{transaction.description}</p>
        <p className="truncate text-xs text-muted-foreground">
          {transaction.category} · {formatDisplayDate(transaction.date)} · {transaction.paymentMethod}
        </p>
      </div>

      <p
        className={cn(
          'shrink-0 text-sm font-semibold tabular-nums',
          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
        )}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </p>

      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </li>
  );
}
