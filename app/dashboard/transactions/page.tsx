import { redirect } from 'next/navigation';
import { ReceiptText, SearchX } from 'lucide-react';
import { AddTransactionButton } from '@/components/transactions/add-transaction-button';
import { TransactionActions } from '@/components/transactions/transaction-actions';
import { TransactionRow } from '@/components/transactions/transaction-row';
import { TransactionsToolbar } from '@/components/transactions/transactions-toolbar';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { Card } from '@/components/ui/card';
import { PAGE_SIZE } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth/session';
import { parseTransactionFilters } from '@/lib/transactions/filters';
import { getTransactionsPage } from '@/lib/transactions/repository';

export const metadata = { title: 'Transactions | SpendWise' };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function TransactionsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const filters = parseTransactionFilters(searchParams);
  const { items, total } = await getTransactionsPage(user.id, filters);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
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

  const paginationQuery = Object.fromEntries(
    Object.entries(searchParams).flatMap(([key, value]) =>
      key !== 'page' && typeof value === 'string' ? [[key, value]] : [],
    ),
  );
  const rangeStart = total === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filters.page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">Every income and expense, searchable and sortable.</p>
        </div>
        <AddTransactionButton />
      </header>

      <TransactionsToolbar filters={filters} />

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3 text-sm text-muted-foreground sm:px-6">
          <span>
            {total === 0 ? 'No matching transactions' : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
          </span>
        </div>

        {items.length > 0 ? (
          <ul className="divide-y">
            {items.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                actions={<TransactionActions transaction={transaction} />}
              />
            ))}
          </ul>
        ) : hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No transactions match these filters."
            description="Try widening the date range or clearing a filter."
          />
        ) : (
          <EmptyState
            icon={ReceiptText}
            title="No transactions yet."
            description="Record your first income or expense to start tracking."
            action={<AddTransactionButton />}
          />
        )}

        {totalPages > 1 && (
          <div className="border-t px-4 py-4 sm:px-6">
            <Pagination page={filters.page} totalPages={totalPages} query={paginationQuery} />
          </div>
        )}
      </Card>
    </div>
  );
}
