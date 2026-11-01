'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionFormSheet } from '@/components/transactions/transaction-form-sheet';

export function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add transaction
      </Button>
      {isOpen && <TransactionFormSheet open={isOpen} onOpenChange={setIsOpen} />}
    </>
  );
}
