# Tareas - ReyPaletas Frontend

## Fase 1: Configuración ✅ COMPLETADA

- [x] 1.1 Crear archivo `.env` con variables requeridas
- [x] 1.2 Instalar dependencias adicionales (@supabase/supabase-js, leaflet, react-leaflet, motion, @iconify/react)
- [x] 1.3 Crear estructura de carpetas src/

## Fase 2: Servicios y Estado ✅ COMPLETADA

- [x] 2.1 Configurar cliente Supabase
- [x] 2.2 Crear servicios de API (api-client.js)
- [x] 2.3 Crear AuthContext
- [x] 2.4 Crear CartContext
- [x] 2.5 Crear UIContext

## Fase 3: Componentes Globales ✅ COMPLETADA

- [x] 3.1 Layout (Header, Footer)
- [x] 3.2 Rutas públicas (Router)

## Fase 4: Páginas Públicas ✅ COMPLETADA

- [x] 4.1 Home (/)
- [x] 4.2 Sabores (/sabores)
- [x] 4.3 Quienes Somos (/quienes-somos)
- [x] 4.4 Puntos de Venta (/puntos-de-venta)
- [x] 4.5 Franquicias (/franquicias) - con OpenStreetMap
- [x] 4.6 Contactanos (/contactanos)
- [x] 4.7 Compras (/compras) - Carrito + WhatsApp

## Fase 5: Admin Panel ✅ COMPLETADA

- [x] 5.1 Ruta /admin y protección de rutas
- [x] 5.2 Login /admin/login
- [x] 5.3 Dashboard /admin
- [x] 5.4 Gestión Productos /admin/productos
- [x] 5.5 Gestión Categorías /admin/categorias
- [x] 5.6 Gestión Avisos /admin/avisos
- [x] 5.7 Gestión Franquicias /admin/franquicias

## Fase 6: Deployment ✅ COMPLETADA

- [x] 6.1 Configurar Vercel
- [x] 6.2 Variables de entorno en Vercel

## Fase 7: Mejoras y Optimizaciones

### Mejoras de Código

- [x] 7.1 Corregir warning de lint en Announcements.jsx (useEffect missing dependency)
- [x] 7.2 Reemplazar confirm() nativos por Sileo en todas las páginas admin
- [x] 7.3 Agregar validación de formato URL en campos de imagen (N/A - se usa input file)

### Mejoras de UX

- [x] 7.4 Agregar estados de loading en modales de categoría/ciudad
- [x] 7.5 Validación en tiempo real del formato de coordenadas (Franchises)
- [x] 7.6 Agregar tooltips o ayuda contextual en campos complejos

### Optimización de Rendimiento

- [x] 7.7 Implementar code splitting para rutas/admin
- [x] 7.8 Agregar memoización en componentes grandes (N/A - code splitting suficiente)
- [x] 7.9 Optimizar bundle (configurar manualChunks en Vite)

### Seguridad

- [x] 7.10 Agregar interceptor para manejo de 401 (token expirado)
- [ ] 7.11 Sanitizar inputs antes de enviar a API

### Testing

- [ ] 7.12 Configurar Vitest o Jest para tests unitarios
- [ ] 7.13 Agregar tests para componentes críticos (AuthContext, API service)

## Fase 8: Subida de Imágenes vía Backend (reemplaza la subida directa a Supabase)

> **Cambio de arquitectura.** La Fase 8 anterior ("Subida de Imágenes a Supabase", tareas 8.1–8.13) subía
> las imágenes desde el navegador usando `@supabase/supabase-js` con `VITE_SUPABASE_ANON_KEY`. Eso publicaba la
> URL del proyecto y la anon key en el bundle. Ahora **todas las subidas pasan por el backend**
> (`POST /private/storage/upload`) y el frontend no usa Supabase en absoluto.
> Detalle del contrato en `docs/FRONTEND.md`, `docs/ADMIN.md` y `docs/COMPONENTS.md#ImageUpload`.

### Depende del backend

- [ ] 8.1 **Acción: actualizar** — Backend debe exponer `POST /private/storage/upload`, `POST /private/storage/upload-multiple` y `DELETE /private/storage` (ver `ReyPaletasBack/ai/tasks/TASKS.md`, Fase 7)

### Configuración

- [ ] 8.2 **Acción: actualizar** — Eliminar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` de `.env` y `.env.example`
- [ ] 8.3 **Acción: actualizar** — Eliminar esas mismas variables de la configuración del proyecto en Vercel
- [ ] 8.4 **Acción: actualizar** — Revisar `vite.config.js` (`manualChunks`) para quitar cualquier chunk de `supabase`
- [ ] 8.5 **Acción: actualizar** — Eliminar la dependencia `@supabase/supabase-js` de `package.json`

### Servicio de storage

- [ ] 8.6 **Acción: actualizar** — Crear `src/services/storage.js` con las funciones `uploadImage(file, bucket, folder)`, `uploadMultipleImages(files, bucket, folder)` y `deleteImage(bucket, path)`, conservando las firmas actuales para minimizar cambios en las páginas
- [ ] 8.7 **Acción: actualizar** — Construir el `FormData` y enviarlo como `multipart/form-data` sin fijar `Content-Type` manualmente
- [ ] 8.8 **Acción: actualizar** — Agregar métodos multipart y `deleteStorage` en `src/services/api.js`, permitiendo sobrescribir los headers por defecto (hoy `getHeaders()` fuerza `application/json`)
- [ ] 8.9 **Acción: actualizar** — Traducir los errores del backend: `413` (archivo > 4 MB), `415` (MIME no permitido), `400` (bucket inválido) a mensajes en español

### Migración de páginas admin

- [ ] 8.10 **Acción: actualizar** — `pages/admin/Products.jsx`: cambiar el import de `services/supabase` a `services/storage` (bucket `Products`)
- [ ] 8.11 **Acción: actualizar** — `pages/admin/Announcements.jsx`: migrar a `services/storage` (bucket `Announcements`)
- [ ] 8.12 **Acción: actualizar** — `pages/admin/Franchises.jsx`: migrar a `services/storage` (bucket `Franchises`), incluyendo las fotos múltiples de `franchise_photos`
- [ ] 8.13 **Acción: actualizar** — `pages/admin/SalesPoints.jsx`: migrar a `services/storage` (bucket `Franchises`)
- [ ] 8.14 **Acción: actualizar** — `pages/admin/HeroImages.jsx`: migrar a `services/storage` (bucket `HeroImages`)
- [ ] 8.15 **Acción: actualizar** — `pages/admin/Associates.jsx`: migrar a `services/storage` (bucket `Associates`)
- [ ] 8.16 **Acción: actualizar** — Invertir el orden eliminar-ant-subir: subir la nueva imagen primero y borrar la anterior solo si la subida y el guardado del recurso tienen éxito

### Limpieza

- [ ] 8.17 **Acción: actualizar** — Eliminar `src/services/supabase.js`
- [ ] 8.18 **Acción: actualizar** — Confirmar que `rg -n "supabase|VITE_SUPABASE" src/` no devuelve resultados
- [ ] 8.19 **Acción: actualizar** — Eliminar las URLs de ejemplo hardcodeadas de Supabase en `pages/public/Home.jsx` (líneas 10-16) y usar `/public/hero-images`

### Verificación

- [ ] 8.20 Validar en el cliente que el archivo sea `image/*` y pese menos de 4 MB antes de enviarlo
- [ ] 8.21 Probar upload en cada módulo (producto, aviso, franquicia, punto de venta, hero, asociado)
- [ ] 8.22 Verificar que las URLs guardadas en la DB apuntan a los buckets públicos
- [ ] 8.23 Ejecutar `npm run lint` y `npm run build` sin errores
- [ ] 8.24 Confirmar en el build de Vercel que el bundle ya no contiene ninguna clave de Supabase

## Fase 9: Cambios Visuales y Estructurales

### Admin Franquicias

- [x] 9.1 Eliminar campos photo, description y name de los datos mostrados en tabla de franquicias
- [x] 9.2 Agregar selector de puntos de venta como franquicia con mapa
- [x] 9.3 Implementar 2 pestañas: "Obtener un punto de venta" y "Ubicaciones"

### Public Footer

- [x] 9.4 Cambiar slogan del footer por "Una delicia real"

### Public Hero

- [ ] 9.5 Reemplazar nombre de marca por logo en el Hero
