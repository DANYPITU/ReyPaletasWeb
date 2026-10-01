# DATA.md

## Database Models

This document defines the data models used in the backend system, including fields, types, relations, and rules.

---

### Categories

**Purpose:** Organize products into groups for display and admin management.

| Field | Type   | Description           |
| ----- | ------ | --------------------- |
| id    | string | Primary identifier    |
| name  | string | Category name, unique |

**Relations:**

- `products.category_id → categories.id`

---

### Products

**Purpose:** Represents items available for the menu.

| Field        | Type                 | Description                                            |
| ------------ | -------------------- | ------------------------------------------------------ |
| id           | UUID / serial        | Primary identifier                                     |
| name         | string               | Product name                                           |
| price        | decimal              | Base price (ignored if `price_varies = true`)          |
| exists       | boolean              | Availability: true → available, false → future product |
| category_id  | string / foreign key | References `categories.id`                             |
| price_varies | boolean              | Indicates if product has variants                      |
| image_url    | string               | URL for product image                                  |

**Relations:**

- `product_variants.product_id → products.id`

---

### Product Variants

**Purpose:** Represents different price configurations for a product.

| Field      | Type               | Description                               |
| ---------- | ------------------ | ----------------------------------------- |
| id         | UUID / serial      | Primary identifier                        |
| product_id | UUID / foreign key | References base product                   |
| name       | string             | Variant name (e.g., “Pilsener”, “Corona”) |
| price      | decimal            | Final price when this variant is selected |

**Rules:**

- Overrides base product price when selected
- Only used if `products.price_varies = true`

---

### Announcements

**Purpose:** Display promotional notices on the Home page.

| Field       | Type          | Description                              |
| ----------- | ------------- | ---------------------------------------- |
| id          | UUID / serial | Primary identifier                       |
| title       | string        | Announcement title                       |
| description | string        | Content or message                       |
| image_url   | string        | Optional associated image                |
| active      | boolean       | Visibility: true → shown, false → hidden |

---

### Hero Images

**Purpose:** Store hero/banner images for the homepage.

| Field | Type          | Description                  |
| ----- | ------------- | ---------------------------- |
| id    | UUID / serial | Primary identifier           |
| url   | string        | URL of the hero image        |

---

### Franchises

**Purpose:** Represent franchise locations and manager info.

| Field         | Type    | Description                                 |
| --------------- | ------- | ------------------------------------------- |
| id              | UUID    | Primary identifier                          |
| city            | string  | City where franchise is located             |
| location_name   | string  | Name of the franchise location              |
| latitude        | decimal | Latitude coordinate for map                 |
| longitude       | decimal | Longitude coordinate for map                |
| streets         | string  | Short description of the franchise streets |

---

### Admin Users (Supabase Auth)

**Purpose:** Handle authentication and admin access.

| Field         | Type   | Description              |
| ------------- | ------ | ------------------------ |
| id            | UUID   | Primary identifier       |
| email         | string | Login email              |
| password_hash | string | Managed by Supabase Auth |
| role          | string | Only `admin` for now     |

**Rules:**

- Only authenticated admins can access private endpoints
- Managed entirely by Supabase Auth

---

This structure ensures clear understanding of all models, relationships, and rules for backend development and AI agent interaction.
