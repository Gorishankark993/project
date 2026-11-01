import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { PAGE_SIZE, type TransactionType } from '@/lib/constants';
import type { ValidatedTransaction } from '@/lib/validations/transaction';

export type TransactionRecord = {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
  date: string;
  notes: string | null;
};

export type SortKey = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export type TransactionFilters = {
  query: string;
  type: TransactionType | null;
  category: string | null;
  paymentMethod: string | null;
  from: string | null;
  to: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  sort: SortKey;
  page: number;
};

type TransactionRow = {
  id: string;
  type: string;
  amount: string | number;
  description: string;
  category: string;
  payment_method: string;
  date: string;
  notes: string | null;
};

const SORT_COLUMNS: Record<SortKey, { column: string; ascending: boolean }> = {
  date_desc: { column: 'date', ascending: false },
  date_asc: { column: 'date', ascending: true },
  amount_desc: { column: 'amount', ascending: false },
  amount_asc: { column: 'amount', ascending: true },
};

const TRANSACTION_COLUMNS = 'id, type, amount, description, category, payment_method, date, notes';

function toRecord(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    type: row.type as TransactionType,
    amount: Number(row.amount),
    description: row.description,
    category: row.category,
    paymentMethod: row.payment_method,
    date: row.date,
    notes: row.notes,
  };
}

function sanitizeSearchTerm(term: string): string {
  return term.replace(/[%_,()*\\"]/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function getTransactionsPage(userId: string, filters: TransactionFilters) {
  const supabase = createClient();
  let query = supabase
    .from('transactions')
    .select(TRANSACTION_COLUMNS, { count: 'exact' })
    .eq('user_id', userId);

  const term = sanitizeSearchTerm(filters.query);
  if (term) {
    query = query.or(`description.ilike.*${term}*,category.ilike.*${term}*,notes.ilike.*${term}*`);
  }
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.paymentMethod) query = query.eq('payment_method', filters.paymentMethod);
  if (filters.from) query = query.gte('date', filters.from);
  if (filters.to) query = query.lte('date', filters.to);
  if (filters.minAmount !== null) query = query.gte('amount', filters.minAmount);
  if (filters.maxAmount !== null) query = query.lte('amount', filters.maxAmount);

  const sort = SORT_COLUMNS[filters.sort];
  const from = (filters.page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order(sort.column, { ascending: sort.ascending })
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw new Error('Failed to load transactions');

  return {
    items: ((data ?? []) as TransactionRow[]).map(toRecord),
    total: count ?? 0,
  };
}

export async function getRecentTransactions(userId: string, limit: number): Promise<TransactionRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select(TRANSACTION_COLUMNS)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error('Failed to load recent transactions');
  return ((data ?? []) as TransactionRow[]).map(toRecord);
}

export async function getTransactionsInRange(
  userId: string,
  from: string,
  to: string,
): Promise<TransactionRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select(TRANSACTION_COLUMNS)
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true });

  if (error) throw new Error('Failed to load transactions');
  return ((data ?? []) as TransactionRow[]).map(toRecord);
}

export async function getLifetimeTotals(userId: string): Promise<{ income: number; expense: number }> {
  const supabase = createClient();
  const { data, error } = await supabase.from('transactions').select('type, amount').eq('user_id', userId);

  if (error) throw new Error('Failed to load balance');

  return ((data ?? []) as { type: string; amount: string | number }[]).reduce(
    (totals, row) => {
      if (row.type === 'income') totals.income += Number(row.amount);
      else totals.expense += Number(row.amount);
      return totals;
    },
    { income: 0, expense: 0 },
  );
}

export async function insertTransaction(userId: string, input: ValidatedTransaction): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('transactions').insert({
    user_id: userId,
    type: input.type,
    amount: input.amount,
    description: input.description,
    category: input.category,
    payment_method: input.paymentMethod,
    date: input.date,
    notes: input.notes || null,
  });
  return !error;
}

export async function updateTransactionRecord(
  userId: string,
  id: string,
  input: ValidatedTransaction,
): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .update({
      type: input.type,
      amount: input.amount,
      description: input.description,
      category: input.category,
      payment_method: input.paymentMethod,
      date: input.date,
      notes: input.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('id');
  return !error && (data?.length ?? 0) > 0;
}

export async function deleteTransactionRecord(userId: string, id: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id');
  return !error && (data?.length ?? 0) > 0;
}
