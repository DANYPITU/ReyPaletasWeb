# BUSINESS_LOGIC.md

## Business Logic Overview

This document defines the business rules, validations, and processes for the backend system, including how data should be handled and returned for each model. It serves as a guide for developers and AI agents interacting with the backend.

---

## Products

**Endpoint:** `GET /public/products`  
**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | yes | Name of the category to filter products |
| available | boolean | no | Filter by availability: `true` = available products (`exists = true`), `false` = future products (`exists = false`). Default: `true` |

**Rules:**

1. Filter products by `category` name.
2. Map query parameter `available` to database field `exists` (default `true`).
3. Include product variants if `price_varies = true`.
4. Omit all IDs (product and variant) in the response.
5. Return only relevant fields: `name`, `price`, `image_url`, `variants`.

**Variant Rules:**

- If `price_varies = true`, variants replace the base product price.
- Include all variants in the response, omitting IDs.

---

## Categories

**Rules:**

1. Category `name` must be unique.
2. Used to group and filter products.
3. Admin can create, update, or delete categories via private endpoints.

---

## Product Variants

**Rules:**

1. Only exist if `products.price_varies = true`.
2. Each variant has a `name` and `price`.
3. Variants override the base product price when returned to frontend.

---

## Announcements

**Rules:**

1. Only `active = true` announcements are returned in public endpoints.
2. Admin can create, update, or deactivate announcements.
3. Response includes: `title`, `description`, `image_url`, `active`.
4. IDs are not exposed to frontend.

---

## Franchises

**Rules:**

1. Only include necessary fields for frontend: `city`, `location_name`, `latitude`, `longitude`, `streets`.
2. IDs are hidden from public endpoints.
3. Admin can create, update, or delete franchises via private endpoints.

---

## Admin Users

**Rules:**

1. Managed entirely by Supabase Auth.
2. Only `admin` role exists for now.
3. Admin users access private endpoints via authentication token.
4. Public endpoints do not require authentication (except login for admin panel).

---

## General Guidelines

- Public endpoints (`/public/*`) do not require authentication.
- Private endpoints (`/private/*`) require Supabase Bearer token validation.
- All public responses omit IDs to avoid exposing database internal identifiers.
- Business logic is centralized in **services/**; controllers should only handle request/response and call service functions.
- Any automated processes (e.g., email notifications) are triggered by the corresponding service when relevant conditions are met (e.g., a new announcement is activated).
- Query parameter `available` maps to database field `exists` for product availability.
