import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Landmark, PiggyBank, TrendingDown, TrendingUp, ReceiptText } from 'lucide-react';
import { AddTransactionButton } from '@/components/transactions/add-transaction-button';
import { TransactionRow } from '@/components/transactions/transaction-row';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { PeriodSelector } from '@/components/dashboard/period-selector';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildFlowSeries, resolveSeriesRange, summarizeCategories, summarizeFlow } from '@/lib/analytics/aggregate';
import { resolvePeriod } from '@/lib/analytics/periods';
import { getCurrentUser } from '@/lib/auth/session';
import { formatCurrency, formatPercent } from '@/lib/format';
import {
  getLifetimeTotals,
  getRecentTransactions,
  getTransactionsInRange,
} from '@/lib/transactions/repository';

export const metadata = { title: 'Overview | SpendWise' };

type OverviewSearchParams = { period?: string; from?: string; to?: string; chart?: string };

export default async function DashboardOverviewPage({ searchParams }: { searchParams: OverviewSearchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const period = resolvePeriod(searchParams);
  const series = resolveSeriesRange(searchParams.chart);

  const [lifetime, periodRows, seriesRows, recent] = await Promise.all([
    getLifetimeTotals(user.id),
    getTransactionsInRange(user.id, period.start, period.end),
    getTransactionsInRange(user.id, series.start, series.end),
    getRecentTransactions(user.id, 10),
  ]);

  const flow = summarizeFlow(periodRows);
  const categories = summarizeCategories(periodRows);
  const points = buildFlowSeries(seriesRows, series);
  const balance = lifetime.income - lifetime.expense;
  const hasAnyTransactions = recent.length > 0;
  const baseQuery = `from=${period.start}&to=${period.end}&type=expense`;
  const periodQuery =
    period.key === 'custom' ? `period=custom&from=${period.start}&to=${period.end}` : `period=${period.key}`;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{period.label}</p>
          <h1 className="text-3xl font-semibold tracking-tight">Hi, {user.name}</h1>
          <p className="text-sm text-muted-foreground">Here is how your money is moving.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start lg:flex-col xl:flex-row">
          <PeriodSelector active={period} chart={series.key} />
          <AddTransactionButton />
        </div>
      </header>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total balance" value={formatCurrency(balance)} icon={Landmark} helper="All time, income minus expenses" />
        <StatCard title="Income" value={formatCurrency(flow.income)} icon={TrendingUp} tone="income" helper={period.label} />
        <StatCard title="Expenses" value={formatCurrency(flow.expense)} icon={TrendingDown} tone="expense" helper={period.label} />
        <StatCard
          title="Savings"
          value={formatCurrency(flow.savings)}
          icon={PiggyBank}
          tone={flow.savings >= 0 ? 'income' : 'expense'}
          helper={flow.income > 0 ? `${formatPercent(flow.savingsRate)} savings rate` : 'Add income to see your rate'}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income vs expenses</CardTitle>
            <CardDescription>Daily or monthly movement across the selected window</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingChart data={points} activeRange={series.key} periodQuery={periodQuery} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spending by category</CardTitle>
            <CardDescription>Select a category to see its transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <CategoryChart data={categories} baseQuery={baseQuery} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">No expenses in this period yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <div className="space-y-1">
            <CardTitle className="text-base">Recent transactions</CardTitle>
            <CardDescription>Your latest ten entries</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/dashboard/transactions">
              View all transactions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        {hasAnyTransactions ? (
          <ul className="divide-y">
            {recent.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={ReceiptText}
            title="No transactions yet."
            description="Add your first income or expense to start seeing your dashboard come to life."
            action={<AddTransactionButton />}
          />
        )}
      </Card>
    </div>
  );
}
