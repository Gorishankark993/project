'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, type TransactionType } from '@/lib/constants';
import type { TransactionRecord } from '@/lib/transactions/repository';
import { createTransaction, updateTransaction } from '@/lib/transactions/actions';
import { transactionSchema, type TransactionFormInput } from '@/lib/validations/transaction';
import { cn } from '@/lib/utils';

type TransactionFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: TransactionRecord;
};

function buildDefaults(transaction?: TransactionRecord): TransactionFormInput {
  if (!transaction) {
    return {
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      paymentMethod: 'UPI',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    };
  }
  return {
    type: transaction.type,
    amount: transaction.amount.toString(),
    description: transaction.description,
    category: transaction.category,
    paymentMethod: transaction.paymentMethod,
    date: transaction.date,
    notes: transaction.notes ?? '',
  };
}

export function TransactionFormSheet({ open, onOpenChange, transaction }: TransactionFormSheetProps) {
  const [isPending, setIsPending] = useState(false);
  const isEditing = Boolean(transaction);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: buildDefaults(transaction),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(transaction));
  }, [open, transaction, reset]);

  const selectedType = watch('type');
  const categoryOptions = useMemo(
    () => (selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES),
    [selectedType],
  );

  function chooseType(type: TransactionType) {
    setValue('type', type, { shouldValidate: true });
    const allowed: readonly string[] = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!allowed.includes(watch('category'))) setValue('category', '');
  }

  async function onSubmit(values: TransactionFormInput) {
    setIsPending(true);
    try {
      const result = transaction
        ? await updateTransaction(transaction.id, values)
        : await createTransaction(values);

      if (result.ok) {
        toast.success(isEditing ? 'Transaction updated' : 'Transaction added');
        onOpenChange(false);
      } else {
        setError('root', { message: result.error });
        toast.error(result.error);
      }
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' });
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5 text-left">
          <SheetTitle>{isEditing ? 'Edit transaction' : 'Add transaction'}</SheetTitle>
          <SheetDescription>Record money coming in or going out.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden" noValidate>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1" role="group" aria-label="Transaction type">
              {(['expense', 'income'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selectedType === type}
                  onClick={() => chooseType(type)}
                  disabled={isPending}
                  className={cn(
                    'rounded-md py-2 text-sm font-medium transition-all',
                    selectedType === type
                      ? type === 'income'
                        ? 'bg-background text-emerald-600 shadow-sm dark:text-emerald-400'
                        : 'bg-background text-red-600 shadow-sm dark:text-red-400'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {type === 'income' ? 'Income' : 'Expense'}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="h-12 pl-7 text-lg font-semibold tabular-nums"
                  aria-invalid={Boolean(errors.amount)}
                  {...register('amount')}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-600 dark:text-red-400">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g. Weekly groceries"
                className="h-11"
                aria-invalid={Boolean(errors.description)}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-trigger">Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category-trigger" className="h-11" aria-invalid={Boolean(errors.category)}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-trigger">Payment method</Label>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="payment-trigger" className="h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" className="h-11" aria-invalid={Boolean(errors.date)} {...register('date')} />
              {errors.date && <p className="text-xs text-red-600 dark:text-red-400">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={3} placeholder="Anything worth remembering?" {...register('notes')} />
            </div>

            {errors.root && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {errors.root.message}
              </p>
            )}
          </div>

          <SheetFooter className="border-t px-6 py-4 sm:justify-between">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-32">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save changes'
              ) : (
                'Add transaction'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
