## APIs Públicas

Rutas diseñadas para el sitio web principal.

- No requieren autenticación (`Bearer token`)
- Excepción: login (genera el token para rutas privadas)

---

## Directrices Generales

- **Prefijo:** `/public`
- **Privacidad:**
  - No exponer IDs internos de la base de datos
- **Formato:**
  - Respuestas bajo estándar RESTful

---

## 1. Obtener Productos

Devuelve productos filtrados por categoría y disponibilidad.

- Si existen variantes de precio:
  - Reemplazan automáticamente el precio base

### Endpoint

GET /public/products

### Parámetros de Consulta

- `category_id` (UUID, requerido)
  - ID de la categoría para filtrar productos

- `available` (boolean, opcional)
  - `true`: disponibles
  - `false`: lanzamientos futuros
  - Default: `true`

### Ejemplo

GET /public/products?category_id=123e4567-e89b-12d3-a456-426614174000&available=true

### Respuesta

```json
[
  {
    "name": "Copa Imperial",
    "price": 5.5,
    "image_url": "https://ejemplo.com/copa.jpg",
    "variants": []
  },
  {
    "name": "Paleta Artesanal",
    "price": null,
    "image_url": "https://ejemplo.com/paleta.jpg",
    "variants": [
      {
        "name": "Agua",
        "price": 2.0
      },
      {
        "name": "Leche",
        "price": 2.5
      }
    ]
  }
]
```

Nota:

IDs de productos y variantes no incluidos por reglas de negocio

## 2. Login de Administrador

Autentica administradores usando Supabase Auth.

Genera token de acceso para rutas privadas

Endpoint
POST /public/login

```json
Body
{
  "email": "admin@reypaletas.com",
  "password": "password_seguro_123"
}
Respuesta
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "email": "admin@reypaletas.com",
    "role": "admin"
  }
}
```

## 3. Obtener Anuncios

Este endpoint devuelve los avisos promocionales destinados a mostrarse en la página de inicio (**Home**).  
Solo se recuperan aquellos que están marcados como activos.

### Endpoint

GET /public/announcements

### Reglas de Negocio

- Solo se devuelven anuncios donde:
  - `active = true`

### Ejemplo de Uso

GET /public/announcements

### Respuesta de Ejemplo

```json
[
  {
    "title": "¡Gran Apertura!",
    "description": "Visítanos en nuestra nueva sucursal este fin de semana.",
    "image_url": "https://ejemplo.com/promo-apertura.jpg",
    "active": true
  },
  {
    "title": "Sabor del Mes",
    "description": "Prueba nuestro nuevo helado de Pitaya por tiempo limitado.",
    "image_url": "https://ejemplo.com/pitaya.jpg",
    "active": true
  }
]
```

## 4. Obtener Ciudades

Este endpoint devuelve una lista de ciudades disponibles.  
Es útil para que el frontend genere filtros de búsqueda o selectores de ubicación.

### Endpoint

GET /public/franchises/cities

### Reglas de Negocio

- Retorna `id` y `name` de cada ciudad
- El `id` es necesario para filtrar franquicias en `GET /public/franchises`

### Respuesta de Ejemplo

```json
[
  { "id": "123e4567-e89b-12d3-a456-426614174000", "name": "San Salvador" },
  { "id": "223e4567-e89b-12d3-a456-426614174001", "name": "Santa Ana" },
  { "id": "323e4567-e89b-12d3-a456-426614174002", "name": "San Miguel" }
]
```

---

## 5. Obtener Categorías

Este endpoint devuelve la lista de categorías disponibles. Se utiliza para poblar el selector de categorías en el frontend y filtrar productos.

### Endpoint

GET /public/categories

### Reglas de Negocio

- Retorna `id` y `name` de cada categoría
- El `id` es necesario para filtrar productos en `GET /public/products`

### Ejemplo de Uso

GET /public/categories

### Respuesta de Ejemplo

```json
[
  { "id": "123e4567-e89b-12d3-a456-426614174000", "name": "Helados" },
  { "id": "223e4567-e89b-12d3-a456-426614174001", "name": "Paletas" },
  { "id": "323e4567-e89b-12d3-a456-426614174002", "name": "Bebidas" }
]
```

---

## 6. Obtener Franquicias por Ciudad

Este endpoint devuelve las franquicias agrupadas por ciudad. El frontend puede usar los IDs para filtrado local eficiente.

### Endpoint

GET /public/franchises

### Reglas de Negocio

- Retorna todas las ciudades que tienen al menos una franquicia vinculada
- Cada ciudad contiene un array de sus franquicias con fotos

### Respuesta de Ejemplo

```json
[
  {
    "city": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "San Salvador"
    },
    "franchises": [
      {
        "id": "abc12345-...",
        "city_id": "123e4567-e89b-12d3-a456-426614174000",
        "latitude": 13.7013,
        "longitude": -89.2244,
        "streets": "Ubicada en la Zona Escalón.",
        "photos": [
          { "id": "xyz789-...", "url": "https://..." }
        ]
      },
      {
        "id": "def45678-...",
        "city_id": "123e4567-e89b-12d3-a456-426614174000",
        "latitude": 13.6890,
        "longitude": -89.2100,
        "streets": "Colonia San Benito",
        "photos": []
      }
    ]
  },
  {
    "city": {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "name": "Santa Ana"
    },
    "franchises": [...]
  }
]
```

**Nota:** El filtro `city_id` ya no está disponible. El filtrado debe hacerse localmente en el frontend usando el `city.id`.

---

## 7. Obtener Hero Images

Este endpoint devuelve las imágenes del hero/banner para la página de inicio.

### Endpoint

GET /public/hero-images

### Reglas de Negocio

- Retorna todas las imágenes disponibles

### Respuesta de Ejemplo

```json
[
  {
    "id": "xxx",
    "url": "https://ejemplo.com/hero1.jpg"
  },
  {
    "id": "xxx",
    "url": "https://ejemplo.com/hero2.jpg"
  }
]
```

---

## 8. Obtener Puntos de Venta

Este endpoint devuelve los puntos de venta agrupados por ciudad.

### Endpoint

GET /public/sales-points

### Reglas de Negocio

- Retorna todas las ciudades que tienen al menos un punto de venta vinculado
- Cada ciudad contiene un array de sus puntos de venta

### Respuesta de Ejemplo

```json
[
  {
    "city": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "San Salvador"
    },
    "sales_points": [
      {
        "id": "abc12345-...",
        "city_id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Paletería Central",
        "latitude": 13.7013,
        "longitude": -89.2244,
        "streets": "Centro histórico",
        "photo_url": "https://ejemplo.com/punto1.jpg"
      }
    ]
  },
  {
    "city": {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "name": "Santa Ana"
    },
    "sales_points": [...]
  }
]
```

**Nota:** El filtro `city_id` ya no está disponible. El filtrado debe hacerse localmente en el frontend usando el `city.id`.

---

## APIs Privadas

Rutas diseñadas para el panel de administración (login).

- Requieren autenticación (`Bearer token`)
- Excepción: login (genera el token para rutas privadas)

---

## Directrices Generales

- **Prefijo:** `/private`
- **Formato:**
  - Respuestas bajo estándar RESTful

---

## 1. Endpoint de Refresco de Token

Este endpoint permite obtener un nuevo `access_token` utilizando un `refresh_token` válido proporcionado por el cliente.

### Endpoint

POST /private/auth/refresh-token

### Seguridad

- Requiere el `refresh_token` en el cuerpo de la petición.

### Ejemplo de Uso (Request)

POST /private/auth/refresh-token  
Content-Type: application/json

{
"refresh_token": "token_de_refresco_proporcionado_por_supabase"
}

### Ejemplo de Respuesta (Response)

{
"status": "success",
"data": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"refresh_token": "d9b8f7...",
"expires_in": 3600
}
}

---

## 2. Estructura de APIs Privadas (Admin)

Todas estas rutas deben estar protegidas por un middleware que valide el **Bearer token de Supabase**.  
A diferencia de los endpoints públicos, en las rutas privadas se permite el uso de IDs para operaciones de actualización y eliminación.

### Recursos Disponibles

Se implementan métodos CRUD para las siguientes entidades:

- Categories
- Products
- Product Variants
- Announcements
- Hero Images
- Franchises
- Sales Points

### Métodos CRUD

| Método | Ruta                   | Acción                                  |
| ------ | ---------------------- | --------------------------------------- |
| GET    | /private/[recurso]     | Retorna todos los registros sin filtros |
| POST   | /private/[recurso]     | Crea un nuevo registro                  |
| PUT    | /private/[recurso]/:id | Actualiza un registro por ID            |
| DELETE | /private/[recurso]/:id | Elimina un registro por ID              |

### Listado de Rutas por Recurso

#### Categorías

- Ruta: `/private/categories`
- Regla:
  - El nombre debe ser único

#### Productos

- Ruta: `/private/products`
- Campos:
  - `name`
  - `price`
  - `exists`
  - `category_id`
  - `price_varies`
  - `image_url`

#### Variantes de Producto

- Ruta: `/private/product-variants`
- Regla:
  - Solo existen si el producto tiene `price_varies = true`

#### Anuncios

- Ruta: `/private/announcements`
- Campos:
  - `title`
  - `description`
  - `image_url`
  - `active`

#### Hero Images

- Ruta: `/private/hero-images`
- Campos:
  - `url`

#### Franquicias

- Ruta: `/private/franchises`
- Campos:
  - `city`
  - `location_name`
  - `latitude`
  - `longitude`
  - `streets`

#### Puntos de Venta

- Ruta: `/private/sales-points`
- Campos:
  - `city_id`
  - `name`
  - `latitude`
  - `longitude`
  - `streets`
  - `photo_url`

---

## 3. Storage de Imágenes

El almacenamiento de archivos (bucket de Supabase Storage) se expone **únicamente por backend**. El frontend no debe conectarse directamente a Supabase Storage ni conocer `SUPABASE_URL` / `SUPABASE_ANON_KEY`.

### Rol de las credenciales

| Credencial | Uso |
| ---------- | --- |
| `SUPABASE_SERVICE_KEY` | Única credencial usada para subir y eliminar objetos. Se usa desde `src/config/supabase-admin.js`, ya que el service role ignora las políticas RLS del bucket. |

### Buckets permitidos (whitelist)

El cliente envía el bucket, pero el backend solo acepta los que están en esta lista. Cualquier otro valor responde `400`.

| Bucket | Uso |
| ------ | --- |
| `Products` | Imagen de producto (`products.image_url`) |
| `Announcements` | Imagen de aviso (`announcements.image_url`) |
| `Franchises` | Foto de(point) de venta y fotos de franquicia (`franchise_photos.url`) |
| `HeroImages` | Imagen del carrusel principal (`hero_images.url`) |
| `Associates` | Logo de empresa asociada (`associates.logo_url`) |

### 3.1 Subir una imagen

- Ruta: `POST /private/storage/upload`
- Content-Type: `multipart/form-data`
- Auth: `Bearer token` (middleware `verifyToken`)

#### Campos del formulario

| Campo | Tipo | Requerido | Descripción |
| ----- | ---- | --------- | ----------- |
| `file` | archivo | sí | Un único archivo de imagen |
| `bucket` | texto | sí | Debe estar en la whitelist |
| `folder` | texto | no | Subcarpeta dentro del bucket. Se sanea contra `..` y `/` iniciales |

#### Reglas de negocio

- Tamaño máximo por archivo: **4 MB**. El límite existe porque el backend se despliega en Vercel (serverless) y el límite de body de la plataforma es de ~4.5 MB. Excederlo responde `413`.
- Tipo MIME permitido: solo `image/*`. Otro tipo responde `415`.
- El nombre final del objeto se genera en el servidor como `<timestamp>-<nombre-sanitizado>`; el nombre enviado por el cliente nunca se usa tal cual.
- El backend devuelve la URL pública del bucket. El frontend solo persiste esa URL en el recurso correspondiente.
- No se persisten registros de base de datos en este endpoint. Crear la entidad (producto, aviso, franquicia) y luego subir el archivo, o subir y luego crear con la URL devuelta, según el flujo del cliente.

#### Respuesta

```json
{
  "url": "https://<project>.supabase.co/storage/v1/object/public/Products/1723456789012-helado.webp",
  "path": "1723456789012-helado.webp",
  "bucket": "Products"
}
```

### 3.2 Subir varias imágenes

- Ruta: `POST /private/storage/upload-multiple`
- Content-Type: `multipart/form-data`
- Se usa para las fotos de una franquicia, que son N archivos bajo el mismo `franchise_id`.

#### Campos del formulario

| Campo | Tipo | Requerido | Descripción |
| ----- | ---- | --------- | ----------- |
| `files` | archivos[] | sí | Uno o más archivos de imagen |
| `bucket` | texto | sí | Debe estar en la whitelist |
| `folder` | texto | no | Subcarpeta dentro del bucket |

#### Reglas de negocio

- Las mismas restricciones de tamaño (4 MB por archivo) y MIME (`image/*`) que en `3.1`.
- Se sube cada archivo en secuencia. Si uno falla, la respuesta es `500` y el frontend debe reportar el error; los archivos ya subidos en esa llamada no se eliminan automáticamente.
- Requiere al menos un archivo. Una lista vacía responde `400`.

#### Respuesta

```json
{
  "data": [
    {
      "url": "https://<project>.supabase.co/storage/v1/object/public/Franchises/1723456789012-franquicia-1.webp",
      "path": "1723456789012-franquicia-1.webp",
      "bucket": "Franchises"
    }
  ]
}
```

### 3.3 Eliminar una imagen

- Ruta: `DELETE /private/storage`
- Content-Type: `application/json`
- Auth: `Bearer token`

#### Body

| Campo | Tipo | Requerido | Descripción |
| ----- | ---- | --------- | ----------- |
| `bucket` | texto | sí | Debe estar en la whitelist |
| `path` | texto | sí | Ruta del objeto dentro del bucket, tal como lo devolvió la subida. No es una URL completa |

#### Reglas de negocio

- Se **debe enviar `path`**, no la URL pública. Enviar la URL responde `400` para evitar ambigüedad al reconstruir la ruta cuando hay subcarpetas.
- Eliminar un objeto inexistente no es un error: responde `200`.
- El frontend debe enviar la operación de borrado **después** de que la operación de escritura del recurso haya tenido éxito. Si se borra primero y la escritura falla, se pierde la imagen anterior.

#### Respuesta

```json
{
  "deleted": true,
  "path": "1723456789012-helado.webp"
}
```

---

## Consideraciones Técnicas

### Validación

- Utilizar esquemas de **Joi** para validar los datos antes de procesar:
  - `POST`
  - `PUT`

### Manejo de Errores

- Todas las operaciones deben:
  - Estar envueltas en bloques `try/catch`
  - Retornar códigos HTTP adecuados:
    - `200` → Éxito
    - `201` → Creación exitosa
    - `204` → Eliminación exitosa
    - `400` → Error de validación
    - `401` → Falta o invalidez del token
    - `413` → Archivo excede el límite de 4 MB
    - `415` → Tipo MIME no permitido (solo `image/*`)

### Body Parsing

- `express.json()` se aplica globalmente y solo interpreta `Content-Type: application/json`.
- Las rutas de `/private/storage` reciben `multipart/form-data` y deben usar el middleware de upload (`multer`) a nivel de ruta. No se modifica el parser global, para no arrastrar el procesamiento multipart a rutas que no lo necesitan.

### Middleware

- Crear o actualizar `auth-middleware.js` para:
  - Interceptar peticiones a `/private/*`
  - Verificar la autenticidad del token usando Supabase
- `upload-middleware.js` para:
  - Aplicarse solo en `/private/storage/*`
  - Rechazar archivos mayores a 4 MB
  - Rechazar `fileFilter` que no sea `image/*`
