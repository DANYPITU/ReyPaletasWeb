# 003-task-storage-routes.md

> T-B003 — Crear rutas de storage (`upload`, `upload-multiple`, `delete`) con whitelist, saneado y service key.
> Acción de esta descomposición: `crear`.

## Referencias

- `[[docs/API]]` — sección 3 (Storage de Imágenes): whitelist de buckets, reglas de negocio y respuestas de los 3 endpoints
- `[[docs/ARCHITECTURE]]` — sección File Storage: validación, saneado y escritura con service role
- `[[docs/SUPABASE]]` — sección 3.2: buckets públicos requeridos

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-B003-01 | crear | [crear] helpers de whitelist de buckets, saneado de `folder`/filename y armado de `<timestamp>-<nombre-sanitizado>` | completada | `src/routes/private-storage.js` | router carga; comportamiento de helpers ejercitado en T-B003-02 |
| T-B003-02 | crear | [crear] `POST /upload` con `file`, `bucket`, `folder?` vía `supabaseAdmin.storage` devolviendo `{url, path, bucket}` | completada | `src/routes/private-storage.js` | `400` con bucket fuera de whitelist |
| T-B003-03 | crear | [crear] `POST /upload-multiple` con `files[]` en secuencia devolviendo `{data: []}` y `400` si la lista está vacía | completada | `src/routes/private-storage.js` | `400` con `files` vacío |
| T-B003-04 | crear | [crear] `DELETE /` con body `{bucket, path}`, `400` si `path` es URL completa y `200` si el objeto no existía | completada | `src/routes/private-storage.js` | `400` con `path` = URL |

**Dependencias:** T-B003-01 → T-B003-02, T-B003-03, T-B003-04
