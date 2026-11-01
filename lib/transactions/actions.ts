'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import {
  deleteTransactionRecord,
  insertTransaction,
  updateTransactionRecord,
} from '@/lib/transactions/repository';
import { transactionSchema, type TransactionFormInput } from '@/lib/validations/transaction';

export type TransactionActionResult = { ok: true } | { ok: false; error: string };

const SESSION_EXPIRED = 'Your session has expired. Please log in again.';
const idSchema = z.string().uuid();

function refreshDashboard() {
  revalidatePath('/dashboard', 'layout');
}

export async function createTransaction(input: TransactionFormInput): Promise<TransactionActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };

  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const saved = await insertTransaction(user.id, parsed.data);
  if (!saved) return { ok: false, error: 'We could not save this transaction. Please try again.' };

  refreshDashboard();
  return { ok: true };
}

export async function updateTransaction(id: string, input: TransactionFormInput): Promise<TransactionActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: 'This transaction could not be found.' };

  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const updated = await updateTransactionRecord(user.id, parsedId.data, parsed.data);
  if (!updated) return { ok: false, error: 'We could not update this transaction. It may have been deleted.' };

  refreshDashboard();
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<TransactionActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: 'This transaction could not be found.' };

  const deleted = await deleteTransactionRecord(user.id, parsedId.data);
  if (!deleted) return { ok: false, error: 'We could not delete this transaction. Please try again.' };

  refreshDashboard();
  return { ok: true };
}
