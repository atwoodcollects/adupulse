# Signals Backfill

1. **Migration**: Run `supabase/signals_raw.sql` in the Supabase SQL Editor to create the `signals_raw` table.
2. **Env vars**: Run `vercel env pull .env.local` to populate `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. **Run**: `npx tsx scripts/signals-backfill.ts --all` (or `--town=somerville` for a single town).
4. **Verify**: In Supabase, run `SELECT town_slug, count(*) FROM signals_raw GROUP BY town_slug ORDER BY count DESC;`
5. **Rollback**: `DROP TABLE signals_raw;` in the SQL Editor removes everything cleanly.
