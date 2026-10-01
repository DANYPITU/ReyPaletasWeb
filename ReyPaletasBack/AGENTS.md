# AGENTS.md

Guidelines for AI agents working on the ReyPaletas backend.

## Project Overview

- **Type:** Node.js/Express 5.x REST API Backend
- **Module System:** CommonJS (`"type": "commonjs"`)
- **External Services:** Supabase (auth + PostgreSQL), Resend (email)

## Directory Structure

```
src/
├── config/           # Configuration files
├── models/           # Database schemas & validation (Joi)
├── routes/           # Express route definitions
├── controllers/      # Request handlers
├── services/         # Business logic
├── middlewares/      # Auth, validation, error handling
└── utils/            # Helper functions
docs/                 # ARCHITECTURE.md, BUSINESS_LOGIC.md, DATA.md
```

## Available Commands

```bash
# Development
npm run dev          # Start server with nodemon (create nodemon.json first)
node index.js        # Run directly

# Testing (requires setup - see below)
npm test             # Run all tests
npx jest test/path   # Run single test file
npx jest --watch     # Watch mode

# Linting (requires setup - see below)
npm run lint         # Run ESLint
npm run lint -- --fix # Fix auto-fixable issues
```

## API Endpoints

### Public Endpoints (no authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/public/products` | Products by category_id (query: `category_id`, `available`) |
| GET | `/public/categories` | List all categories (returns `id` and `name`) |
| GET | `/public/announcements` | Active announcements filtered by current day |
| GET | `/public/franchises` | Franchises grouped by city |
| GET | `/public/sales-points` | Sales points grouped by city |
| GET | `/public/franchises/cities` | Cities list (returns `id` and `name`) |
| GET | `/public/hero-images` | Hero images for homepage |
| GET | `/public/associates` | Associates (empresas asociadas) |
| POST | `/public/login` | Admin login via Supabase Auth |

### Private Endpoints (requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/private/categories` | List all categories |
| POST | `/private/categories` | Create category |
| PUT | `/private/categories/:id` | Update category |
| DELETE | `/private/categories/:id` | Delete category |
| GET | `/private/products` | List all products |
| POST | `/private/products` | Create product |
| PUT | `/private/products/:id` | Update product |
| DELETE | `/private/products/:id` | Delete product |
| GET | `/private/product-variants` | List all variants |
| POST | `/private/product-variants` | Create variant |
| PUT | `/private/product-variants/:id` | Update variant |
| DELETE | `/private/product-variants/:id` | Delete variant |
| GET | `/private/announcements` | List all announcements |
| POST | `/private/announcements` | Create announcement |
| PUT | `/private/announcements/:id` | Update announcement |
| DELETE | `/private/announcements/:id` | Delete announcement |
| GET | `/private/hero-images` | List all hero images |
| POST | `/private/hero-images` | Create hero image |
| PUT | `/private/hero-images/:id` | Update hero image |
| DELETE | `/private/hero-images/:id` | Delete hero image |
| GET | `/private/franchises` | List all franchises |
| POST | `/private/franchises` | Create franchise |
| PUT | `/private/franchises/:id` | Update franchise |
| DELETE | `/private/franchises/:id` | Delete franchise |
| GET | `/private/sales-points` | List all sales points grouped by city |
| POST | `/private/sales-points` | Create sales point |
| PUT | `/private/sales-points/:id` | Update sales point |
| DELETE | `/private/sales-points/:id` | Delete sales point |
| GET | `/private/franchises/:franchiseId/photos` | List franchise photos |
| POST | `/private/franchises/:franchiseId/photos` | Add photo to franchise |
| DELETE | `/private/franchises/photos/:id` | Delete franchise photo |
| GET | `/private/cities` | List all cities |
| POST | `/private/cities` | Create city |
| PUT | `/private/cities/:id` | Update city |
| DELETE | `/private/cities/:id` | Delete city |
| POST | `/private/auth/refresh-token` | Refresh access token |
| GET | `/private/associates` | List all associates |
| POST | `/private/associates` | Create associate |
| PUT | `/private/associates/:id` | Update associate |
| DELETE | `/private/associates/:id` | Delete associate |

### Storage Endpoints (require Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/private/storage/upload` | Upload one image (`multipart/form-data`: `file`, `bucket`, `folder?`) |
| POST | `/private/storage/upload-multiple` | Upload several images (`multipart/form-data`: `files[]`, `bucket`, `folder?`) |
| DELETE | `/private/storage` | Delete an image (JSON body: `bucket`, `path`) |

Storage is **only** accessed from the backend, using the service role key from `src/config/supabase-admin.js`.
Never add a Supabase client or Supabase credentials to the frontend.

Rules:

- `bucket` must be in the whitelist: `Products`, `Announcements`, `Franchises`, `HeroImages`, `Associates`
- Max **4 MB** per file (Vercel serverless body limit is ~4.5 MB) → `413` if exceeded
- MIME must be `image/*` → `415` otherwise
- Object name is generated server-side: `<timestamp>-<sanitized-filename>`
- `folder` must be sanitized against `..` and leading `/`
- Delete takes the object `path` returned by the upload, not a full URL

## Required Setup

Install dependencies:
```bash
npm install express @supabase/supabase-js joi dotenv cors multer
npm install --save-dev jest supertest eslint prettier eslint-config-prettier
```

## Code Style

### Naming Conventions
- **Files:** kebab-case (`product-routes.js`, `auth-middleware.js`)
- **Functions:** camelCase (`getProducts`, `validateCategory`)
- **Classes:** PascalCase (`ProductService`, `AuthMiddleware`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_PRODUCTS`)
- **DB Tables:** snake_case (`product_variants`)
- **URL Routes:** kebab-case with hyphens (`product-variants`, `auth/refresh-token`)

### Imports/Exports (CommonJS)
```javascript
const express = require('express');
const { supabase } = require('./config/supabase');
const productService = require('./services/product-service');

module.exports = router;
```

### Error Handling
- Use try/catch for all async operations
- Return proper HTTP status codes: 200, 201, 400, 401, 403, 404, 500

```javascript
// Controller pattern
async function getProducts(req, res) {
  try {
    const products = await productService.getProducts(req.query);
    res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Response Format
```javascript
res.status(200).json({ data: result });
res.status(201).json({ data: createdItem });
res.status(400).json({ error: 'Descriptive message' });
```

### Architecture
- Controllers: request/response only, call services
- Services: business logic, external integrations
- Models: validation schemas (Joi), database types
- Never expose internal DB IDs in public API responses

## API Design

- Public endpoints: `/public` prefix, no authentication required
- Private endpoints: `/private` prefix, requires Supabase Bearer token
- RESTful patterns: GET/POST/PUT/DELETE for collections and resources
- Route naming: kebab-case (e.g., `/product-variants`, not `/product_variants`)
- Query params: camelCase (`available`, not `exists`; DB field mapping handled in services)

## Security

- Use environment variables for secrets (`.env` - never commit)
- Validate authentication tokens on private routes
- Sanitize user input before database queries

## Documentation

Update `docs/` files when making architectural changes.

## Git Workflow

- Feature branches, meaningful commit messages
- Never commit `.env`, node_modules, or secrets

## Skills

- **express-production:** Production-ready Express patterns
- **supabase-postgres-best-practices:** PostgreSQL/Supabase optimization
- **javascript-typescript-jest:** Testing patterns
