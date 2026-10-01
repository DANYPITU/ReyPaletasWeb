# ReyPaletas Backend

REST API Backend para ReyPaletas - Heladería artesanal.

---

## Tabla de Contenidos

### Auth

| #   | Método | Endpoint                                                           | Descripción               | Requiere Auth |
| --- | ------ | ------------------------------------------------------------------ | ------------------------- | ------------- |
| 0.1 | POST   | [`/public/login`](#01-post-publiclogin)                            | Inicio de sesión de admin | No            |
| 0.2 | POST   | [`/private/auth/refresh-token`](#02-post-privateauthrefresh-token) | Renovar access token      | Sí            |

### Público

| #   | Método | Endpoint                                               | Descripción              | Requiere Auth |
| --- | ------ | ------------------------------------------------------ | ------------------------ | ------------- |
| 1.1 | GET    | [`/public/products`](#11-get-publicproducts)           | Listar productos         | No            |
| 1.2 | GET    | [`/public/categories`](#12-get-publiccategories)       | Listar categorías        | No            |
| 1.3 | GET    | [`/public/cities`](#13-get-publiccities)               | Listar ciudades          | No            |
| 1.4 | GET    | [`/public/franchises`](#14-get-publicfranchises)       | Listar franquicias       | No            |
| 1.5 | GET    | [`/public/announcements`](#15-get-publicannouncements) | Listar anuncios activos  | No            |
| 1.6 | GET    | [`/public/hero-images`](#16-get-publichero-images)       | Listar imágenes hero      | No            |
| 1.7 | POST   | [`/public/contact`](#17-post-publiccontact)            | Enviar email de contacto | No            |
| 1.8 | GET    | [`/public/sales-points`](#18-get-publicsales-points)   | Listar puntos de venta | No            |
| 1.9 | GET    | [`/public/associates`](#19-get-publicassociates)        | Empresas asociadas       | No            |
| 1.10 | GET   | [`/ping`](#110-get-ping)                             | Ping keep-alive Supabase   | No            |

### Privado

| #    | Método | Endpoint                                                               | Descripción                   | Requiere Auth |
| ---- | ------ | ---------------------------------------------------------------------- | ----------------------------- | ------------- |
| 2.1  | GET    | [`/private/categories`](#21-get-privatecategories)                     | Listar categorías             | Sí            |
| 2.2  | POST   | [`/private/categories`](#22-post-privatecategories)                    | Crear categoría               | Sí            |
| 2.3  | PUT    | [`/private/categoriesid`](#23-put-privatecategoriesid)                 | Actualizar categoría          | Sí            |
| 2.4  | DELETE | [`/private/categoriesid`](#24-delete-privatecategoriesid)              | Eliminar categoría            | Sí            |
| 2.5  | GET    | [`/private/products`](#25-get-privateproducts)                         | Listar productos              | Sí            |
| 2.6  | POST   | [`/private/products`](#26-post-privateproducts)                        | Crear producto                | Sí            |
| 2.7  | PUT    | [`/private/productsid`](#27-put-privateproductsid)                     | Actualizar producto           | Sí            |
| 2.8  | DELETE | [`/private/productsid`](#28-delete-privateproductsid)                  | Eliminar producto             | Sí            |
| 2.9  | GET    | [`/private/product-variants`](#29-get-privateproduct-variants)         | Listar variantes              | Sí            |
| 2.10 | POST   | [`/private/product-variants`](#210-post-privateproduct-variants)       | Crear variante                | Sí            |
| 2.11 | PUT    | [`/private/product-variantsid`](#211-put-privateproduct-variantsid)    | Actualizar variante           | Sí            |
| 2.12 | DELETE | [`/private/product-variantsid`](#212-delete-privateproduct-variantsid) | Eliminar variante             | Sí            |
| 2.13 | GET    | [`/private/cities`](#213-get-privatecities)                            | Listar ciudades               | Sí            |
| 2.14 | POST   | [`/private/cities`](#214-post-privatecities)                           | Crear ciudad                  | Sí            |
| 2.15 | PUT    | [`/private/citiesid`](#215-put-privatecitiesid)                        | Actualizar ciudad             | Sí            |
| 2.16 | DELETE | [`/private/citiesid`](#216-delete-privatecitiesid)                     | Eliminar ciudad               | Sí            |
| 2.17 | GET    | [`/private/franchises`](#217-get-privatefranchises)                    | Listar franquicias            | Sí            |
| 2.18 | POST   | [`/private/franchises`](#218-post-privatefranchises)                   | Crear franquicia              | Sí            |
| 2.19 | PUT    | [`/private/franchisesid`](#219-put-privatefranchisesid)                | Actualizar franquicia         | Sí            |
| 2.20 | DELETE | [`/private/franchisesid`](#220-delete-privatefranchisesid)             | Eliminar franquicia           | Sí            |
| 2.21 | GET    | [`/private/franchise-photos`](#221-get-privatefranchise-photos)        | Listar fotos de franquicia    | Sí            |
| 2.22 | POST   | [`/private/franchise-photos`](#222-post-privatefranchise-photos)       | Agregar foto a franquicia     | Sí            |
| 2.23 | PUT    | [`/private/franchise-photosid`](#223-put-privatefranchise-photosid)    | Actualizar foto de franquicia | Sí            |
| 2.24 | DELETE | [`/private/franchise-photosid`](#224-delete-privatefranchise-photosid) | Eliminar foto de franquicia   | Sí            |
| 2.25 | GET    | [`/private/announcements`](#225-get-privateannouncements)              | Listar anuncios               | Sí            |
| 2.26 | POST   | [`/private/announcements`](#226-post-privateannouncements)             | Crear anuncio                 | Sí            |
| 2.27 | PUT    | [`/private/announcementsid`](#227-put-privateannouncementsid)          | Actualizar anuncio            | Sí            |
| 2.28 | DELETE | [`/private/announcementsid`](#228-delete-privateannouncementsid)       | Eliminar anuncio              | Sí            |
| 2.29 | GET    | [`/private/hero-images`](#229-get-privatehero-images)                 | Listar imágenes hero         | Sí            |
| 2.30 | POST   | [`/private/hero-images`](#230-post-privatehero-images)                | Crear imagen hero            | Sí            |
| 2.31 | PUT    | [`/private/hero-images/:id`](#231-put-privatehero-imagesid)            | Actualizar imagen hero       | Sí            |
| 2.32 | DELETE | [`/private/hero-images/:id`](#232-delete-privatehero-imagesid)         | Eliminar imagen hero         | Sí            |
| 2.33 | GET    | [`/private/sales-points`](#233-get-privatesales-points)              | Listar puntos de venta       | Sí            |
| 2.34 | POST   | [`/private/sales-points`](#234-post-privatesales-points)             | Crear punto de venta         | Sí            |
| 2.35 | PUT    | [`/private/sales-points/:id`](#235-put-privatesales-pointsid)          | Actualizar punto de venta    | Sí            |
| 2.36 | DELETE | [`/private/sales-points/:id`](#236-delete-privatesales-pointsid)       | Eliminar punto de venta      | Sí            |
| 2.37 | GET    | [`/private/associates`](#237-get-privateassociates)                | Listar empresas asociadas   | Sí            |
| 2.38 | POST   | [`/private/associates`](#238-post-privateassociates)              | Crear empresa asociada     | Sí            |
| 2.39 | PUT    | [`/private/associates/:id`](#239-put-privateassociatesid)            | Actualizar empresa asociada  | Sí            |
| 2.40 | DELETE | [`/private/associates/:id`](#240-delete-privateassociatesid)       | Eliminar empresa asociada  | Sí            |

---

## Tecnologías

- **Runtime:** Node.js
- **Framework:** Express 5.x
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Email:** Resend
- **Hosting:** Vercel

## Supabase Free Tier

El proyecto usa Supabase en el tier gratuito, que suspende proyectos después de 7 días de inactividad. Para prevenir esto, se implementó un **Vercel Cron Job** que ejecuta un ping cada 3 días al endpoint `/ping`.

> **Nota sobre la expresión cron:** el campo `*/3` corresponde al **día del mes**, no a un intervalo de días. La expresión `0 6 */3 * *` dispara a las 06:00 UTC en los días 1, 4, 7, 10, 13, 16, 19, 22, 25, 28 y 31 de cada mes. El máximo intervalo entre ejecuciones es de 3 días, salvo el reinicio de mes (31 → 1), que se cierra antes. Vercel Hobby solo permite una ejecución diaria, y esta expresión cumple: un único disparo por día.

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` basado en `.env.example`.

Variables requeridas:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `RESEND_API_KEY`
- `PORT` (default: 3000)
- `CORS_ORIGIN`

> **Nota**: El proyecto usa dos clientes Supabase:
>
> - `SUPABASE_ANON_KEY` para lectura pública (endpoints `/public/*`)
> - `SUPABASE_SERVICE_KEY` para operaciones privilegiadas (endpoints `/private/*` y autenticación)

## Uso

```bash
node src/index.js
```

---

## Autenticación

### 0.1 POST /public/login

Autentica un administrador con email y password.

**Body:**

```json
{
  "email": "admin@reypaletas.com",
  "password": "password_seguro_123"
}
```

**Respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "d9b8f7...",
  "expires_in": 3600,
  "user": { "email": "admin@reypaletas.com" }
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 0.2 POST /private/auth/refresh-token

Renueva el access token.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**

```json
{
  "refresh_token": "token_de_refresco"
}
```

**Respuesta:**

```json
{
  "status": "success",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_in": 3600
  }
}
```

[Volver al índice](#tabla-de-contenidos)

---

## Público

### 1.1 GET /public/products

Obtiene productos. Si no se pasa categoría, trae todos.

**Query:**

- `category_id` (UUID, opcional) - filtrar por categoría
- `available` (boolean, opcional, default: true) - true=disponibles, false=lanzamientos

**Ejemplos:**

- `GET /public/products` - todos los disponibles
- `GET /public/products?available=false` - todos los no disponibles
- `GET /public/products?category_id=xxx` - productos de una categoría

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "name": "Copa Imperial",
    "price": 5.5,
    "image_url": "https://...",
    "price_varies": false,
    "category_id": "xxx",
    "variants": []
  },
  {
    "id": "xxx",
    "name": "Paleta",
    "price": null,
    "image_url": "https://...",
    "price_varies": true,
    "category_id": "xxx",
    "variants": [
      { "name": "Agua", "price": 2.0 },
      { "name": "Leche", "price": 2.5 }
    ]
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.2 GET /public/categories

Obtiene lista de categorías.

**Respuesta:**

```json
[
  { "id": "xxx", "name": "Helados" },
  { "id": "xxx", "name": "Paletas" }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.3 GET /public/cities

Obtiene lista de ciudades.

**Respuesta:**

```json
[
  { "id": "xxx", "name": "San Salvador" },
  { "id": "xxx", "name": "Santa Ana" }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.4 GET /public/franchises

Obtiene franquicias agrupadas por ciudad. El filtrado se hace localmente en el frontend usando `city.id`.

**Respuesta:**

```json
[
  {
    "city": {
      "id": "xxx",
      "name": "San Salvador"
    },
    "franchises": [
      {
        "id": "xxx",
        "city_id": "xxx",
        "latitude": 13.7013,
        "longitude": -89.2244,
        "streets": "Ubicada en la Zona Escalón.",
        "photos": [
          { "id": "xxx", "url": "https://..." },
          { "id": "xxx", "url": "https://..." }
        ]
      }
    ]
  },
  {
    "city": {
      "id": "yyy",
      "name": "Santa Ana"
    },
    "franchises": [...]
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.5 GET /public/announcements

Obtiene anuncios activos filtrados por el día actual de la semana.

**Query:**

- `active` (boolean, opcional, default: true)

**Notas:**

- Si el anuncio tiene días configurados (`days`), solo se muestra si el día actual coincide
- Si no tiene días configurados, se muestra siempre (compatibilidad hacia atrás)
- Días válidos: `'monday'`, `'tuesday'`, `'wednesday'`, `'thursday'`, `'friday'`, `'saturday'`, `'sunday'`

**Respuesta:**

```json
[
  {
    "title": "¡Gran Apertura!",
    "description": "Visítanos en nuestra nueva sucursal.",
    "image_url": "https://...",
    "active": true
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.6 GET /public/hero-images

Obtiene las imágenes hero para el homepage.

**Respuesta:**

```json
[
  { "id": "xxx", "url": "https://..." },
  { "id": "xxx", "url": "https://..." }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.7 POST /public/contact

Envía un email de contacto.

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "message": "Hola, me gustaría saber más sobre..."
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente"
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.8 GET /public/sales-points

Obtiene los puntos de venta agrupados por ciudad. El filtrado se hace localmente en el frontend usando `city.id`.

**Respuesta:**

```json
[
  {
    "city": {
      "id": "xxx",
      "name": "San Salvador"
    },
    "sales_points": [
      {
        "id": "xxx",
        "city_id": "xxx",
        "name": "Paletería Central",
        "latitude": 13.7013,
        "longitude": -89.2244,
        "streets": "Centro histórico",
        "photo_url": "https://..."
      }
    ]
  },
  {
    "city": {
      "id": "yyy",
      "name": "Santa Ana"
    },
    "sales_points": [...]
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 1.9 GET /public/associates

Obtiene las empresas asociadas (logos de empresas aliadas).

**Respuesta:**

```json
{
  "data": [
    { "id": "xxx", "name": "Empresa Ejemplo", "logoUrl": "https://..." },
    { "id": "xxx", "name": null, "logoUrl": "https://..." }
  ]
}
```

**Nota:** Si `name` es `null`, el frontend no debe mostrar el nombre.

[Volver al índice](#tabla-de-contenidos)

---

### 1.10 GET /ping

Endpoint de keep-alive para prevenir la suspensión del proyecto Supabase free tier. Ejecutado automáticamente por Vercel Cron cada 3 días.

> **Nota sobre la expresión cron:** la expresión `0 6 */3 * *` (configurada en `vercel.json`) ejecuta el ping a las 06:00 UTC en los días 1, 4, 7, 10, 13, 16, 19, 22, 25, 28 y 31 de cada mes. Esto equivale a una frecuencia aproximada de cada 3 días en los meses de 30/31 días, con un hueco de hasta 3 días entre ejecuciones (el tramo 31→1 es menor). Vercel Hobby permite un solo disparo por día, por lo que la frecuencia cumple el límite.

**Nota:** Este endpoint no requiere autenticación. Ejecuta un query simple a la tabla `categories` para registrar actividad en la base de datos.

**Respuesta:**

```json
{
  "status": "ok",
  "message": "Supabase ping successful"
}
```

[Volver al índice](#tabla-de-contenidos)

---

## Privado

Requiere: `Authorization: Bearer <access_token>`

### 2.1 GET /private/categories

Lista todas las categorías.

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "name": "Helados",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.2 POST /private/categories

Crea una categoría.

**Body:**

```json
{ "name": "Postres" }
```

**Respuesta (201):**

```json
{
  "id": "xxx",
  "name": "Postres",
  "created_at": "...",
  "updated_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.3 PUT /private/categories/:id

Actualiza una categoría.

**Body:**

```json
{ "name": "Postres Premium" }
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.4 DELETE /private/categories/:id

Elimina una categoría.

**Respuesta:** `204 No Content`

[Volver al índice](#tabla-de-contenidos)

---

### 2.5 GET /private/products

Lista todos los productos con sus variantes.

**Query:**

- `category_id` (UUID, opcional) - filtrar por categoría
- `exists` (boolean, opcional) - true=solo existentes, false=solo no existentes

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "name": "Copa de Helado",
    "price": 3.5,
    "exists": true,
    "category_id": "xxx",
    "price_varies": false,
    "image_url": "https://...",
    "created_at": "...",
    "updated_at": "...",
    "variants": []
  },
  {
    "id": "xxx",
    "name": "Paleta",
    "price": null,
    "exists": true,
    "category_id": "xxx",
    "price_varies": true,
    "variants": [
      {
        "id": "xxx",
        "name": "Agua",
        "price": 2.0,
        "created_at": "...",
        "updated_at": "..."
      }
    ]
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.6 POST /private/products

Crea un producto.

**Body:**

```json
{
  "name": "Copa de Helado",
  "price": 3.5,
  "exists": true,
  "category_id": "xxx",
  "price_varies": false,
  "image_url": "https://..."
}
```

Campos requeridos: `name`, `category_id`
Campos opcionales: `price`, `exists`, `price_varies`, `image_url`

**Respuesta (201):**

```json
{
  "id": "xxx",
  "name": "Copa de Helado",
  "price": 3.5,
  "exists": true,
  "category_id": "xxx",
  "price_varies": false,
  "image_url": "https://...",
  "created_at": "...",
  "updated_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.7 PUT /private/products/:id

Actualiza un producto.

**Body (campos parciales):**

```json
{ "name": "Copa Premium", "price": 4.5 }
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.8 DELETE /private/products/:id

Elimina un producto.

**Respuesta:** `204 No Content`

[Volver al índice](#tabla-de-contenidos)

---

### 2.9 GET /private/product-variants

Lista todas las variantes.

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "product_id": "xxx",
    "name": "Agua",
    "price": 2.0,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.10 POST /private/product-variants

Crea una variante.

**Body:**

```json
{
  "product_id": "xxx",
  "name": "Agua",
  "price": 2.0
}
```

Campos requeridos: `product_id`, `name`, `price`

**Respuesta (201):**

```json
{
  "id": "xxx",
  "product_id": "xxx",
  "name": "Agua",
  "price": 2.0,
  "created_at": "...",
  "updated_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.11 PUT /private/product-variants/:id

Actualiza una variante.

**Body:**

```json
{ "name": "Leche", "price": 2.5 }
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.12 DELETE /private/product-variants/:id

Elimina una variante.

**Respuesta:** `204 No Content`

[Volver al índice](#tabla-de-contenidos)

---

### 2.13 GET /private/cities

Lista todas las ciudades.

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "name": "San Salvador",
    "created_at": "..."
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.14 POST /private/cities

Crea una ciudad.

**Body:**

```json
{ "name": "San Salvador" }
```

**Respuesta (201):**

```json
{
  "id": "xxx",
  "name": "San Salvador",
  "created_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.15 PUT /private/cities/:id

Actualiza una ciudad.

**Body:**

```json
{ "name": "San Salvador Centro" }
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.16 DELETE /private/cities/:id

Elimina una ciudad.

**Respuesta:** `204 No Content`

[Volver al índice](#tabla-de-contenidos)

---

### 2.17 GET /private/franchises

Lista todas las franquicias agrupadas por ciudad.

**Respuesta:**

```json
[
  {
    "city": {
      "id": "xxx",
      "name": "San Salvador"
    },
    "franchises": [
      {
        "id": "xxx",
        "city_id": "xxx",
        "latitude": 13.7013,
        "longitude": -89.2244,
        "streets": "Ubicada en la Zona Escalón.",
        "created_at": "...",
        "updated_at": "...",
        "photos": [
          { "id": "xxx", "url": "https://..." }
        ]
      }
    ]
  },
  {
    "city": {
      "id": "yyy",
      "name": "Santa Ana"
    },
    "franchises": [...]
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.18 POST /private/franchises

Crea una franquicia.

**Body:**

```json
{
  "city_id": "xxx",
  "latitude": 13.7013,
  "longitude": -89.2244,
  "streets": "Ubicada en la Zona Escalón."
}
```

Campos requeridos: `city_id`
Campos opcionales: `latitude`, `longitude`, `streets`

**Respuesta (201):**

```json
{
  "id": "xxx",
  "city_id": "xxx",
  "latitude": 13.7013,
  "longitude": -89.2244,
  "streets": "Ubicada en la Zona Escalón.",
  "created_at": "...",
  "updated_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.19 PUT /private/franchises/:id

Actualiza una franquicia.

**Body (campos parciales):**

```json
{
  "streets": "Nueva ubicación"
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.20 DELETE /private/franchises/:id

Elimina una franquicia.

**Respuesta:** `204 No Content`

[Volver al índice](#tabla-de-contenidos)

---

### 2.21 GET /private/franchise-photos

Lista las fotos de una franquicia.

**Query:**

- `franchise_id` (UUID, opcional) - filtrar por franquicia

**Ejemplo:** `GET /private/franchise-photos?franchise_id=xxx`

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "franchise_id": "xxx",
    "url": "https://...",
    "created_at": "..."
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.22 POST /private/franchise-photos

Agrega una foto a una franquicia.

**Body:**

```json
{
  "franchise_id": "xxx",
  "url": "https://..."
}
```

Campos requeridos: `franchise_id`, `url`

**Respuesta (201):**

```json
{
  "id": "xxx",
  "franchise_id": "xxx",
  "url": "https://...",
  "created_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.23 PUT /private/franchise-photos/:id

Actualiza una foto de franquicia.

**Body:**

```json
{
  "url": "https://...",
  "franchise_id": "xxx"
}
```

Campo requerido: `url`
Campo opcional: `franchise_id`

**Respuesta:**

```json
{
  "id": "xxx",
  "franchise_id": "xxx",
  "url": "https://...",
  "created_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.24 DELETE /private/franchise-photos/:id

Elimina una foto de franquicia.

**Respuesta:** `204 No Content`

[Volver al índice](#tabla-de-contenidos)

---

### 2.25 GET /private/announcements

Lista todos los anuncios.

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "title": "¡Promoción!",
    "description": "2x1 en helados este fin de semana.",
    "image_url": "https://...",
    "active": true,
    "days": ["monday", "wednesday", "friday"],
    "created_at": "...",
    "updated_at": "..."
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.26 POST /private/announcements

Crea un anuncio.

**Body:**

```json
{
  "title": "¡Promoción!",
  "description": "2x1 en helados este fin de semana.",
  "image_url": "https://...",
  "active": true,
  "days": ["monday", "wednesday", "friday"]
}
```

Campos requeridos: `title`
Campos opcionales: `description`, `image_url`, `active` (default: true), `days` (array de días: `'monday'`, `'tuesday'`, `'wednesday'`, `'thursday'`, `'friday'`, `'saturday'`, `'sunday'`. Si está vacío o no se especifica, el anuncio se muestra siempre)

**Respuesta (201):**

```json
{
  "id": "xxx",
  "title": "¡Promoción!",
  "description": "2x1 en helados este fin de semana.",
  "image_url": "https://...",
  "active": true,
  "days": ["monday", "wednesday", "friday"],
  "created_at": "...",
  "updated_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.27 PUT /private/announcements/:id

Actualiza un anuncio.

**Body (campos parciales):**

```json
{
  "title": "¡Nueva Promoción!",
  "active": false,
  "days": ["saturday", "sunday"]
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.28 DELETE /private/announcements/:id

Elimina un anuncio.

**Respuesta:** `204 No Content`

---

### 2.29 GET /private/hero-images

Lista todas las imágenes hero.

**Respuesta:**

```json
[
  {
    "id": "xxx",
    "url": "https://...",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.30 POST /private/hero-images

Crea una imagen hero.

**Body:**

```json
{
  "url": "https://..."
}
```

Campo requerido: `url`

**Respuesta (201):**

```json
{
  "id": "xxx",
  "url": "https://...",
  "created_at": "...",
  "updated_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.31 PUT /private/hero-images/:id

Actualiza una imagen hero.

**Body:**

```json
{ "url": "https://nueva-imagen.com/hero.jpg" }
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.32 DELETE /private/hero-images/:id

Elimina una imagen hero.

**Respuesta:** `204 No Content`

---

### 2.33 GET /private/sales-points

Lista todos los puntos de venta agrupados por ciudad.

**Respuesta:**

```json
[
  {
    "city": {
      "id": "xxx",
      "name": "San Salvador"
    },
    "sales_points": [
      {
        "id": "xxx",
        "city_id": "xxx",
        "name": "Paletería Central",
        "latitude": 13.7013,
        "longitude": -89.2244,
        "streets": "Centro histórico",
        "photo_url": "https://...",
        "created_at": "...",
        "updated_at": "..."
      }
    ]
  },
  {
    "city": {
      "id": "yyy",
      "name": "Santa Ana"
    },
    "sales_points": [...]
  }
]
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.34 POST /private/sales-points

Crea un punto de venta.

**Body:**

```json
{
  "city_id": "xxx",
  "name": "Paletería Central",
  "latitude": 13.7013,
  "longitude": -89.2244,
  "streets": "Centro histórico",
  "photo_url": "https://..."
}
```

Campos requeridos: `city_id`, `name`
Campos opcionales: `latitude`, `longitude`, `streets`, `photo_url`

**Respuesta (201):**

```json
{
  "id": "xxx",
  "city_id": "xxx",
  "name": "Paletería Central",
  "latitude": 13.7013,
  "longitude": -89.2244,
  "streets": "Centro histórico",
  "photo_url": "https://...",
  "created_at": "...",
  "updated_at": "..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.35 PUT /private/sales-points/:id

Actualiza un punto de venta.

**Body (campos parciales):**

```json
{
  "name": "Nueva Paletería",
  "photo_url": "https://..."
}
```

[Volver al índice](#tabla-de-contenidos)

---

### 2.36 DELETE /private/sales-points/:id

Elimina un punto de venta.

**Respuesta:** `204 No Content`

---

### 2.37 GET /private/associates

Lista todas las empresas asociadas.

**Respuesta:**

```json
{
  "data": [
    {
      "id": "xxx",
      "name": "Empresa Ejemplo",
      "logo_url": "https://...",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

---

### 2.38 POST /private/associates

Crea una empresa asociada.

**Body:**

```json
{
  "name": "Empresa Ejemplo",
  "logoUrl": "https://..."
}
```

Campo requerido: `logoUrl`
Campo opcional: `name` (si el logo ya incluye el nombre, dejar null)

**Respuesta (201):**

```json
{
  "data": {
    "id": "xxx",
    "name": "Empresa Ejemplo",
    "logo_url": "https://...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

### 2.39 PUT /private/associates/:id

Actualiza una empresa asociada.

**Body:**

```json
{
  "name": "Nuevo Nombre",
  "logoUrl": "https://..."
}
```

---

### 2.40 DELETE /private/associates/:id

Elimina una empresa asociada.

**Respuesta:** `204 No Content`

---

## Tablas de la Base de Datos

### categories

| Campo      | Tipo      | Descripción            |
| ---------- | --------- | ---------------------- |
| id         | UUID      | Identificador único    |
| name       | TEXT      | Nombre de la categoría |
| created_at | TIMESTAMP | Fecha de creación      |
| updated_at | TIMESTAMP | Fecha de actualización |

### products

| Campo        | Tipo      | Descripción                      |
| ------------ | --------- | -------------------------------- |
| id           | UUID      | Identificador único              |
| name         | TEXT      | Nombre del producto              |
| price        | DECIMAL   | Precio del producto              |
| exists       | BOOLEAN   | Si el producto existe/disponible |
| category_id  | UUID      | FK a categories                  |
| price_varies | BOOLEAN   | Si el precio varía por variante  |
| image_url    | TEXT      | URL de la imagen                 |
| created_at   | TIMESTAMP | Fecha de creación                |
| updated_at   | TIMESTAMP | Fecha de actualización           |

### product_variants

| Campo      | Tipo      | Descripción            |
| ---------- | --------- | ---------------------- |
| id         | UUID      | Identificador único    |
| product_id | UUID      | FK a products          |
| name       | TEXT      | Nombre de la variante  |
| price      | DECIMAL   | Precio de la variante  |
| created_at | TIMESTAMP | Fecha de creación      |
| updated_at | TIMESTAMP | Fecha de actualización |

### announcements

| Campo       | Tipo      | Descripción                       |
| ----------- | --------- | --------------------------------- |
| id          | UUID      | Identificador único               |
| title       | TEXT      | Título del anuncio                |
| description | TEXT      | Descripción del anuncio           |
| image_url   | TEXT      | URL de la imagen                  |
| active      | BOOLEAN   | Si el anuncio está activo         |
| days        | TEXT[]    | Días en que se muestra (opcional) |
| created_at  | TIMESTAMP | Fecha de creación                 |
| updated_at  | TIMESTAMP | Fecha de actualización            |

### cities

| Campo      | Tipo      | Descripción         |
| ---------- | --------- | ------------------- |
| id         | UUID      | Identificador único |
| name       | TEXT      | Nombre de la ciudad |
| created_at | TIMESTAMP | Fecha de creación   |

### franchises

| Campo      | Tipo      | Descripción               |
| ---------- | --------- | ------------------------- |
| id         | UUID      | Identificador único       |
| city_id    | UUID      | FK a cities               |
| latitude   | DECIMAL   | Latitud de la ubicación   |
| longitude  | DECIMAL   | Longitud de la ubicación  |
| streets    | TEXT      | Descripción de las calles |
| created_at | TIMESTAMP | Fecha de creación         |
| updated_at | TIMESTAMP | Fecha de actualización    |

### franchise_photos

| Campo        | Tipo      | Descripción         |
| ------------ | --------- | ------------------- |
| id           | UUID      | Identificador único |
| franchise_id | UUID      | FK a franchises     |
| url          | TEXT      | URL de la foto      |
| created_at   | TIMESTAMP | Fecha de creación   |

### hero_images

| Campo      | Tipo      | Descripción            |
| ---------- | --------- | ---------------------- |
| id         | UUID      | Identificador único    |
| url        | TEXT      | URL de la imagen hero  |
| created_at | TIMESTAMP | Fecha de creación      |
| updated_at | TIMESTAMP | Fecha de actualización |

### sales_points

| Campo      | Tipo      | Descripción               |
| ---------- | --------- | ------------------------- |
| id         | UUID      | Identificador único       |
| city_id    | UUID      | FK a cities               |
| name      | TEXT      | Nombre del punto de venta   |
| latitude   | DECIMAL   | Latitud de la ubicación   |
| longitude  | DECIMAL   | Longitud de la ubicación  |
| streets    | TEXT      | Descripción de las calles |
| photo_url  | TEXT      | URL de la imagen        |
| created_at | TIMESTAMP | Fecha de creación         |
| updated_at | TIMESTAMP | Fecha de actualización    |

### associates

| Campo      | Tipo      | Descripción               |
| ---------- | --------- | ------------------------- |
| id         | UUID      | Identificador único       |
| name       | TEXT      | Nombre de la empresa (opcional) |
| logo_url   | TEXT      | URL del logo              |
| created_at | TIMESTAMP | Fecha de creación         |
| updated_at | TIMESTAMP | Fecha de actualización    |

---

## Códigos de Error

| Código | Descripción                      |
| ------ | -------------------------------- |
| 200    | Éxito                            |
| 201    | Creado                           |
| 204    | Sin contenido (DELETE exitoso)   |
| 400    | Error de validación              |
| 401    | No autorizado                    |
| 404    | No encontrado                    |
| 409    | Conflicto (ej: ciudad duplicada) |
| 500    | Error interno                    |

---

## Deployment

Vercel

## Licencia

ISC
