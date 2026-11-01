/*
# Create transactions table

Plain-English summary: adds the core table where each signed-in user records their income and expenses.

1. New Tables
- `transactions`: one row per income or expense entry.
  - `id` (uuid, primary key)
  - `user_id` (uuid, owner; defaults to the signed-in user and references auth.users)
  - `type` ('income' or 'expense')
  - `amount` (numeric(12,2), always greater than 0)
  - `description` (text, required)
  - `category` (text, one of the predefined categories)
  - `payment_method` (text, one of the predefined payment methods)
  - `date` (date of the transaction)
  - `notes` (optional text)
  - `created_at`, `updated_at` (timestamps)

2. Security
- Row level security is enabled on `transactions`.
- Only signed-in users (`authenticated` role) are granted access.
- Each policy checks that `user_id` matches the signed-in user, so users can only read and change their own transactions.

3. Important Notes
- 1. Monetary values use exact decimal numbers, never floating point.
- 2. Indexes cover the common lookups: by user and date, and by user and category.
- 3. Deleting a user account removes their transactions automatically.
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL CHECK (char_length(trim(description)) > 0),
  category text NOT NULL CHECK (category IN ('Food', 'Transport', 'Shopping', 'Entertainment', 'Education', 'Health', 'Bills', 'Rent', 'Travel', 'Subscriptions', 'Other', 'Salary', 'Freelance', 'Investments', 'Other Income')),
  payment_method text NOT NULL CHECK (payment_method IN ('Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other')),
  date date NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON transactions (user_id, date DESC);
CREATE INDEX IF NOT EXISTS transactions_user_category_idx ON transactions (user_id, category);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON transactions TO authenticated;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_transactions" ON transactions;
CREATE POLICY "update_own_transactions" ON transactions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_transactions" ON transactions;
CREATE POLICY "delete_own_transactions" ON transactions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
