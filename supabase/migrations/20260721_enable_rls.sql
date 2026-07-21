-- Revoke akses dari anon & authenticated roles
-- Payload pake DATABASE_URL (role postgres) —> tidak kena dampak
-- Supabase REST API via anon key —> tidak bisa baca/tulis data

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;

-- Service role tetap bisa akses (untuk operasional via Supabase API jika perlu)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
