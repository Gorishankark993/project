# SpendWise

A personal finance dashboard built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL + Auth), Zod, Recharts, and Lucide icons.

## What is included

- Landing page with hero, features, analytics preview, security, pricing, and CTA
- Email/password sign up, log in, forgot password, and password reset
- Protected `/dashboard` routes (unauthenticated visitors are sent to `/login`)
- Overview with total balance, income, expenses, savings, an income vs expenses chart (7 days, 30 days, 6 months, 1 year), spending by category, and the 10 most recent transactions
- Period selector: this month, last month, last 3 months, this year, or a custom range
- Transactions: add, edit, delete, search (debounced), filter by type, category, payment method, date range, and amount, sort, and pagination
- Light and dark mode, responsive layout with a mobile navigation drawer

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Make sure the Supabase values listed in `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are present in your environment.

3. In Supabase (Authentication > URL Configuration), add `http://localhost:3000/auth/callback` and your production domain plus `/auth/callback` to the redirect URLs. Password reset links depend on this. Keep email confirmation turned off so new accounts can sign in immediately.

4. Start the app with `npm run dev`, then open `/register` to create an account.

## Database

The schema is managed through Supabase migrations applied to the project. The current migration creates the `transactions` table with:

- Monetary values stored as exact decimals (`numeric(12,2)`), never floating point
- Check constraints for transaction type, positive amounts, and allowed categories and payment methods
- Indexes on `(user_id, date)` and `(user_id, category)`
- Row level security so each user can only select, insert, update, and delete their own rows
- Cascading delete when a user account is removed

## Security notes

- Passwords are handled entirely by Supabase Auth.
- Every database query is scoped to the signed-in user, and row level security enforces the same rule in the database.
- All input is validated with Zod on the server before it is saved, and the same rules run in the form for instant feedback.
- The user ID is always taken from the server-side session, never from the browser.

## Project structure

- `app/` — routes (landing, auth, dashboard, auth callback)
- `components/` — UI components, grouped by feature (`auth`, `dashboard`, `transactions`, `landing`) plus shared pieces
- `lib/auth` — session helper and auth server actions
- `lib/transactions` — database access, filters, and transaction server actions
- `lib/analytics` — period and chart calculations
- `lib/validations` — Zod schemas
- `middleware.ts` — session refresh and route protection

## Not yet built

Budgets, recurring transactions, bill splitting, the analytics page, rule-based insights, notifications, settings, and the seed script are planned next.
