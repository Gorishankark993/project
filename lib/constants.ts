export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Health',
  'Bills',
  'Rent',
  'Travel',
  'Subscriptions',
  'Other',
] as const;

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other Income'] as const;

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as const;
export type TransactionCategory = (typeof ALL_CATEGORIES)[number];

export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAGE_SIZE = 10;

export const DEFAULT_CURRENCY = 'INR';
