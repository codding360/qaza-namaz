-- Rollback Script for Namaz Profile App
-- This script will remove all database objects created by supabase-schema.sql

-- Drop triggers first
DROP TRIGGER IF EXISTS update_prayer_stats_updated_at ON prayer_stats;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS increment(INTEGER);
DROP FUNCTION IF EXISTS update_prayer_count(UUID, TEXT, INTEGER);
DROP FUNCTION IF EXISTS handle_user_signup(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT);

-- Drop RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Users can view own prayer stats" ON prayer_stats;
DROP POLICY IF EXISTS "Users can update own prayer stats" ON prayer_stats;
DROP POLICY IF EXISTS "Users can insert own prayer stats" ON prayer_stats;

-- Drop indexes
DROP INDEX IF EXISTS idx_prayer_stats_user_prayer;
DROP INDEX IF EXISTS idx_prayer_stats_user_id;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS prayer_stats;
DROP TABLE IF EXISTS users;

-- Disable RLS (this will be done automatically when tables are dropped, but included for completeness)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE prayer_stats DISABLE ROW LEVEL SECURITY;

-- Note: This script will permanently delete all data in the tables
-- Make sure to backup any important data before running this script
