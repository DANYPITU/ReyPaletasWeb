-- ============================================================================
-- Storage buckets and policies — Rey Paletas
-- ----------------------------------------------------------------------------
-- Run this script in the Supabase SQL Editor.
--
-- It replaces the manual steps described in docs/SUPABASE.md (3.2 Required
-- buckets and 3.3 RLS on storage objects).
--
-- Context: image uploads moved from the browser to the backend. The frontend
-- holds no Supabase credentials and never calls the Storage REST API. All
-- writes go through POST /private/storage/upload, /upload-multiple and
-- DELETE /private/storage, which run behind verifyToken and validate `bucket`
-- against a hardcoded whitelist. The backend uses SUPABASE_SERVICE_KEY, which
-- bypasses RLS entirely.
--
-- Consequence: no policy in this file grants write access to anon or
-- authenticated. Write access is decided by verifyToken + the bucket whitelist
-- in src/routes/private-storage.js. Reads stay public because every image the
-- site shows is served from a public URL.
--
-- Idempotent: safe to run more than once.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Buckets
-- ----------------------------------------------------------------------------
-- All five are PUBLIC. The backend returns getPublicUrl(path), which only
-- resolves for public buckets, and the frontend renders that URL directly.
--
-- file_size_limit and allowed_mime_types make Supabase reject oversized and
-- non-image uploads at the storage layer, before they reach the bucket. They
-- mirror the multer limits in src/middlewares/upload-middleware.js: 4 MB and
-- image/*. The backend already answers 413 and 415 with those codes; these
-- columns are the second line of defense, not the first.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('Products',     'Products',     true, 4194304, ARRAY['image/*']),
  ('Announcements','Announcements',true, 4194304, ARRAY['image/*']),
  ('Franchises',   'Franchises',   true, 4194304, ARRAY['image/*']),
  ('HeroImages',   'HeroImages',   true, 4194304, ARRAY['image/*']),
  ('Associates',   'Associates',   true, 4194304, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE
  SET public              = EXCLUDED.public,
      file_size_limit     = EXCLUDED.file_size_limit,
      allowed_mime_types  = EXCLUDED.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- 2. Drop legacy write policies
-- ----------------------------------------------------------------------------
-- Before the migration, the frontend shipped the anon key and uploaded from
-- the browser, so the buckets carried policies granting INSERT/UPDATE/DELETE
-- to anon or authenticated. Those are now a liability: anyone who recovers the
-- project URL from an old bundle or from git history could still write or
-- destroy images even though the app no longer uses that path.
--
-- This drops every storage.objects policy that grants a write command to anon
-- or authenticated, whatever its name. Read policies are left alone.

DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      AND ('anon' = ANY(roles) OR 'authenticated' = ANY(roles))
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', policy_record.policyname);
    RAISE NOTICE 'Política de escritura eliminada: %', policy_record.policyname;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Read policies
-- ----------------------------------------------------------------------------
-- One policy for all five buckets instead of ten. Public SELECT is what makes
-- the images render on the public site. The bucket_id IN (...) list is what
-- keeps it scoped: objects in any other bucket stay unreadable by default.

-- DROP IF EXISTS first so the script stays idempotent; CREATE POLICY would
-- otherwise abort with "policy already exists" on a second run.
DROP POLICY IF EXISTS "Public read of image buckets" ON storage.objects;

CREATE POLICY "Public read of image buckets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('Products', 'Announcements', 'Franchises', 'HeroImages', 'Associates'));

-- ----------------------------------------------------------------------------
-- 4. Verification
-- ----------------------------------------------------------------------------
-- Expected: 5 rows, all public = true, file_size_limit = 4194304.
--
--   SELECT id, public, file_size_limit, allowed_mime_types
--   FROM storage.buckets
--   WHERE id IN ('Products','Announcements','Franchises','HeroImages','Associates')
--   ORDER BY id;
--
-- Expected: only the read policy remains (plus any pre-existing read policies).
--   SELECT policyname, cmd, roles FROM pg_policies
--   WHERE schemaname = 'storage' AND tablename = 'objects'
--   ORDER BY policyname;
--
-- Expected: false, when run with the anon key. Confirms the anon key can no
-- longer write, which is the whole point of the migration.
--
--   curl -X POST "$SUPABASE_URL/storage/v1/object/Products/ataque.txt" \
--     -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
--     -H "Content-Type: text/plain" \
--     --data "x"