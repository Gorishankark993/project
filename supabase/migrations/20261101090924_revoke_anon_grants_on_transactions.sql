/*
# Revoke anonymous role access to transactions

1. Changes
- Removes all table privileges that the anonymous (signed-out) role holds on `transactions`.

2. Why
- Every policy on `transactions` targets the `authenticated` role only, so anonymous access was already blocked by row level security.
- Removing the unused grants is defence in depth: a future policy mistake cannot expose the table to signed-out visitors.

3. Data
- No rows, columns, or policies are changed. The `authenticated` grants remain intact.
*/

REVOKE ALL ON TABLE transactions FROM anon;
