# 002-task-fase-8-storage-backend.md

> T-F002 — Migrar la subida de imágenes al backend y eliminar Supabase del frontend (Fase 8).
> Acción de esta descomposición: `actualizar`.

## Referencias

- `ReyPaletasFront/docs/FRONTEND.md` (sección Storage, 336-353)
- `ReyPaletasFront/docs/COMPONENTS.md` (ImageUpload, 471-501)
- `ReyPaletasFront/AGENTS.md` (servicios de storage, endpoints multipart)

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-F002-01 | actualizar | [actualizar] Agregar métodos multipart y `deleteStorage` en el cliente de API permitiendo sobrescribir los headers por defecto | completada | `src/services/api.js` | `getHeaders` deja de forzar `Content-Type` en multipart |
| T-F002-02 | crear | [crear] Crear `services/storage.js` con `uploadImage`, `uploadMultipleImages` y `deleteImage`, validando `image/*` y 4 MB y traduciendo errores 413/415/400 | completada | `src/services/storage.js` | `rg "VITE_SUPABASE" src/services/storage.js` sin resultados |
| T-F002-03 | actualizar | [actualizar] Migrar Products.jsx a `services/storage` e invertir el orden (subir antes de borrar) | completada | `src/pages/admin/Products.jsx` | Import desde `services/storage`, bucket `Products` |
| T-F002-04 | actualizar | [actualizar] Migrar Announcements.jsx a `services/storage` e invertir el orden | completada | `src/pages/admin/Announcements.jsx` | Import desde `services/storage`, bucket `Announcements` |
| T-F002-05 | actualizar | [actualizar] Migrar Franchises.jsx a `services/storage`, incluidas las fotos múltiples de la franquicia | completada | `src/pages/admin/Franchises.jsx` | Bucket `Franchises`, sin `supabase` |
| T-F002-06 | actualizar | [actualizar] Migrar SalesPoints.jsx a `services/storage` (bucket `Franchises`) | completada | `src/pages/admin/SalesPoints.jsx` | Import desde `services/storage` |
| T-F002-07 | actualizar | [actualizar] Migrar HeroImages.jsx a `services/storage` (bucket `HeroImages`) | completada | `src/pages/admin/HeroImages.jsx` | Import desde `services/storage` |
| T-F002-08 | actualizar | [actualizar] Migrar Associates.jsx a `services/storage` (bucket `Associates`) | completada | `src/pages/admin/Associates.jsx` | Import desde `services/storage` |
| T-F002-09 | eliminar | [eliminar] Eliminar `src/services/supabase.js` y toda referencia a Supabase en `src/` | completada | `src/services/supabase.js` | `rg -n "supabase\|VITE_SUPABASE" src/` sin resultados |
| T-F002-10 | actualizar | [actualizar] Quitar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` de `.env` y `.env.example` | completada | `.env`, `.env.example` | Solo queda `VITE_API_URL` |
| T-F002-11 | actualizar | [actualizar] Quitar el chunk `supabase` de `manualChunks` en la config de Vite | completada | `vite.config.js` | `rg "supabase" vite.config.js` sin resultados |
| T-F002-12 | eliminar | [eliminar] Quitar `@supabase/supabase-js` de `package.json` y reinstalar dependencias | completada | `package.json` | `npm ls @supabase/supabase-js` sin resultados |
| T-F002-13 | actualizar | [actualizar] Quitar de Vercel las variables `VITE_SUPABASE_*` del proyecto | bloqueada | — | Requiere acceso al panel de Vercel |
| T-F002-14 | actualizar | [actualizar] Sustituir las URLs de ejemplo de Supabase del Hero público por rutas locales `/public/hero-images` | bloqueada | `src/pages/public/Home.jsx` | Faltan los archivos `Hero1..7.webp` en `public/hero-images` |
| T-F002-15 | actualizar | [actualizar] Verificar la migración con lint, build, búsqueda de referencias y revisión del bundle | completada | — | `npm run lint` y `npm run build` sin errores; bundle sin claves de Supabase |
| T-F002-16 | actualizar | [actualizar] Probar la subida real en cada módulo admin y que las URLs guardadas apunten a los buckets públicos | bloqueada | — | Requiere Supabase buckets públicos + backend desplegado |

Dependencias: T-F002-01 → T-F002-02 → T-F002-03 a T-F002-08 → T-F002-09 → T-F002-10 a T-F002-12 → T-F002-14 → T-F002-15