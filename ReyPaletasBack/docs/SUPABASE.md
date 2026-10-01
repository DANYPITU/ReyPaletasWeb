# Supabase Configuration

## 1. Initial Setup

For the backend to work correctly, follow these manual steps in the Supabase dashboard:

1. **Create Project**: Create a new project in Supabase and obtain `SUPABASE_URL` and `SUPABASE_KEY` (anon) for the `.env` file.
2. **Execute Schemas**: Copy and paste the SQL script (generated from DATA.md) into the Supabase **SQL Editor**.
3. **Enable RLS**: It is essential to activate **Row Level Security** on all tables to protect admin data.
4. **Configure Auth**: Ensure the Email provider is active for admin panel access.

## 2. Environment Variables

The backend requires the following keys in the `.env` file:

- `SUPABASE_URL`: Your API endpoint.
- `SUPABASE_ANON_KEY`: Your anon/public key. Used for public, read-only queries.
- `SUPABASE_SERVICE_KEY`: Your service role key. Used for authenticated writes and for Supabase Storage.
   _Note: Never push these keys to version control._

## 3. Supabase Storage

### 3.1 Who owns the uploads

Storage is accessed **exclusively from the backend**. The frontend no longer holds `SUPABASE_URL` nor `SUPABASE_ANON_KEY`, and never calls the Storage REST API directly. All reads of stored images use the public URL returned by the backend, so the buckets must remain **public**.

Rationale: the frontend bundle is public. Shipping `VITE_SUPABASE_ANON_KEY` exposes the project URL and an anon key to anyone who opens devtools, and lets any visitor attempt writes against the Storage API. Moving the uploads to the backend keeps the service role key server-side and puts validation (size, MIME type, bucket whitelist) in a single trusted place.

### 3.2 Required buckets

Create these buckets in the Supabase dashboard, all with **Public** visibility:

| Bucket | Used by |
| ------ | ------- |
| `Products` | Product image |
| `Announcements` | Announcement image |
| `Franchises` | Sales point photo, franchise photos |
| `HeroImages` | Homepage carousel images |
| `Associates` | Partner company logos |

### 3.3 RLS on storage objects

Table RLS (step 3 above) does **not** protect Storage. Storage objects have their own policies, and the backend uploads with the service role key, which bypasses RLS entirely.

Given that, storage access control lives in two places instead of in RLS:

- The route is mounted under `/private/storage` behind `verifyToken`, so only an authenticated admin can reach it.
- `bucket` is validated against a hardcoded whitelist inside the route. A valid admin token cannot write outside the five buckets above.

The anon key is no longer used by any client, so the storage policies that previously granted write access to `authenticated` can be tightened or removed. Review existing bucket policies before deleting them.

## 4. Security Considerations

- Private tables should only be accessible via a Bearer token from Supabase Auth
- Internal database IDs should not be exposed in public endpoint responses.
- The service role key must never reach the frontend, and `SUPABASE_SERVICE_KEY` must never be exposed through a `VITE_`-prefixed variable.
- Uploads are restricted to the five buckets above and to `image/*` files of at most 4 MB.
