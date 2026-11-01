'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { TransactionFormSheet } from '@/components/transactions/transaction-form-sheet';
import type { TransactionRecord } from '@/lib/transactions/repository';
import { deleteTransaction } from '@/lib/transactions/actions';

export function TransactionActions({ transaction }: { transaction: TransactionRecord }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  async function handleDelete() {
    const result = await deleteTransaction(transaction.id);
    if (result.ok) {
      toast.success('Transaction deleted');
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        aria-label={`Edit ${transaction.description}`}
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
        aria-label={`Delete ${transaction.description}`}
        onClick={() => setIsConfirmingDelete(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {isEditing && (
        <TransactionFormSheet open={isEditing} onOpenChange={setIsEditing} transaction={transaction} />
      )}
      <ConfirmDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title="Delete this transaction?"
        description={`"${transaction.description}" will be removed permanently. This cannot be undone.`}
        confirmLabel="Delete transaction"
        onConfirm={handleDelete}
      />
    </>
  );
}
