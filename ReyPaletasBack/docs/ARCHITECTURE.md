# ARCHITECTURE.md

## System Vision

This system serves as the backend for a web application, providing REST APIs to manage products, categories, franchises, announcements, and variants. It supports an admin panel with authentication handled by Supabase and exposes only minimal public endpoints for the main website.

---

## Components

### Backend API

**Technology:** Node.js, Express  
**Deployment:** Vercel

**Responsibilities:**

- Provide REST APIs
- Handle data management
- Secure admin operations
- Proxy and validate all admin image uploads to Supabase Storage
- Send email notifications via Resend
- No payment or order processing

---

### Database

**Platform:** Supabase (PostgreSQL)

**Responsibilities:**

- Store business data: products (with `exists` flag), franchises, announcements
- Manage authentication and admin sessions via Supabase Auth
- Enforce row-level security

---

### Authentication

**Platform:** Supabase Auth  
**Usage:** Admin panel only

**Responsibilities:**

- Admin login
- Session management
- Secure access to admin operations

---

### Email Service

**Platform:** Resend

**Responsibilities:**

- Send notifications
- Send contact emails

---

## Agents / Skills (conceptual)

- **Notification Agent:** Sends emails via Resend when triggered by backend events (e.g., new announcement).
- **Data Validation Agent:** Ensures data consistency and enforces business rules before CRUD operations.
- **Admin Operations Agent:** Orchestrates CRUD operations for categories, products, variants, announcements, and franchises.

---

## Data Models

### Categories

- **Fields:** id, name
- **Usage:** Group products on the web and manage dynamically from the admin panel

### Products

- **Fields:** id, name, price, exists, category_id, price_varies, image_url
- **Usage:** Displayed on the Sabores page; may have fixed or variable prices

### Product Variants

- **Fields:** id, product_id, name, price
- **Usage:** Override base product price when variants exist

### Announcements

- **Fields:** id, title, description, image_url, active
- **Usage:** Shown on the Home page; managed via admin panel

### Franchises

- **Fields:** id, city, location_name, latitude, longitude, streets
- **Usage:** Display franchise information on the web

---

## Endpoints

### Public Endpoints (no authentication)

- `GET /public/products` → Fetch list of products for the main website (query: `category_id`, `available`)
- `GET /public/categories` → Fetch all categories (returns `id` and `name`)
- `POST /public/login` → Admin login via Supabase Auth
- `GET /public/announcements` → Fetch active announcements for home page
- `GET /public/franchises/cities` → Fetch unique cities with franchises
- `GET /public/franchises` → Fetch franchises grouped by city
- `GET /public/hero-images` → Fetch hero images for homepage

### Private Endpoints (admin only, requires Supabase Bearer token)

**Authentication:**
- `POST /private/auth/refresh-token` → Refresh access token using refresh_token

**CRUD Operations:**
- `GET|POST /private/categories` → List/create categories
- `PUT|DELETE /private/categories/:id` → Update/delete category by ID
- `GET|POST /private/products` → List/create products
- `PUT|DELETE /private/products/:id` → Update/delete product by ID
- `GET|POST /private/product-variants` → List/create product variants
- `PUT|DELETE /private/product-variants/:id` → Update/delete variant by ID
- `GET|POST /private/announcements` → List/create announcements
- `PUT|DELETE /private/announcements/:id` → Update/delete announcement by ID
- `GET|POST /private/hero-images` → List/create hero images
- `PUT|DELETE /private/hero-images/:id` → Update/delete hero image by ID
- `GET|POST /private/franchises` → List/create franchises
- `PUT|DELETE /private/franchises/:id` → Update/delete franchise by ID

**Storage Operations:**
- `POST /private/storage/upload` → Upload a single image (`multipart/form-data`)
- `POST /private/storage/upload-multiple` → Upload several images (`multipart/form-data`)
- `DELETE /private/storage` → Delete an image by bucket + path

---

## File Storage

The admin panel uploads images to Supabase Storage **through this backend**, not directly from the browser.

**Responsibilities of the backend:**

- Authenticate the upload (`verifyToken` on all `/private/storage` routes)
- Parse `multipart/form-data` (multer, per-route) and enforce a 4 MB limit plus an `image/*` MIME filter
- Validate the requested bucket against a hardcoded whitelist
- Sanitize the target filename and folder
- Write the object with the service role key and return the public URL

**Why:** the frontend bundle is public, so shipping `VITE_SUPABASE_ANON_KEY` exposes the Supabase project URL and an anon key to every visitor and lets anyone attempt writes against the Storage API. Centralizing uploads in the backend keeps the service role key server-side and makes size, type and bucket validation enforceable in one trusted place.

**Consequence:** the frontend requires no Supabase credentials at all. Its only backend dependency is `VITE_API_URL`.

Buckets in use: `Products`, `Announcements`, `Franchises`, `HeroImages`, `Associates`. See [[SUPABASE]] for setup and [[API]] for the endpoint contract.

---

## Data Flow

1. **Public access:** Web client fetches products via `GET /public/products`, announcements via `GET /public/announcements`, and franchises via `GET /public/franchises`. No authentication required.
2. **Admin operations:** Admin logs in via `POST /public/login`. Supabase Auth issues session tokens (access_token + refresh_token).
3. **Token refresh:** When access_token expires, use `POST /private/auth/refresh-token` with the refresh_token.
4. **CRUD operations:** Authenticated admin interacts with private endpoints at `/private/*`. Data is validated with Joi and stored in Supabase.
5. **Image uploads:** The admin panel sends the file as `multipart/form-data` to `/private/storage/upload`. The backend validates it, stores it in the matching bucket with the service role key, and returns the public URL, which the frontend then persists in the resource field (`image_url`, `url`, `photo_url`).
6. **Notifications:** Notification Agent triggers emails through Resend when relevant events occur.
7. **Frontend consumption:** Web frontend consumes public endpoints; admin panel consumes private endpoints securely.
