import { z } from 'zod';
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
} from '@/lib/constants';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_AMOUNT = 9_999_999_999.99;

export const transactionSchema = z
  .object({
    type: z.enum(TRANSACTION_TYPES, { errorMap: () => ({ message: 'Choose income or expense' }) }),
    amount: z
      .string()
      .trim()
      .min(1, 'Amount is required')
      .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount, such as 450 or 450.50')
      .transform(Number)
      .refine((value) => value > 0, 'Amount must be greater than 0')
      .refine((value) => value <= MAX_AMOUNT, 'Amount is too large'),
    description: z.string().trim().min(1, 'Description is required').max(120, 'Keep the description under 120 characters'),
    category: z
      .string()
      .min(1, 'Category is required')
      .refine((value) => (ALL_CATEGORIES as readonly string[]).includes(value), 'Choose a valid category'),
    paymentMethod: z
      .string()
      .refine((value) => (PAYMENT_METHODS as readonly string[]).includes(value), 'Choose a payment method'),
    date: z
      .string()
      .regex(ISO_DATE_PATTERN, 'Date is required')
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid date'),
    notes: z.string().trim().max(500, 'Notes must be under 500 characters'),
  })
  .superRefine((data, ctx) => {
    const allowed: readonly string[] = data.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!allowed.includes(data.category)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['category'],
        message: data.type === 'income' ? 'Choose an income category' : 'Choose an expense category',
      });
    }
  });

export type TransactionFormInput = z.input<typeof transactionSchema>;
export type ValidatedTransaction = z.output<typeof transactionSchema>;
