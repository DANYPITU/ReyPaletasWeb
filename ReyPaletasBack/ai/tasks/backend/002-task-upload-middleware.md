# 002-task-upload-middleware.md

> T-B002 — Crear middleware de upload con multer (4 MB, solo `image/*`, errores 413/415).
> Acción de esta descomposición: `crear`.

## Referencias

- `[[docs/API]]` — sección 3.1/3.2 (límite 4 MB, MIME `image/*`) y `upload-middleware.js` en Middleware
- `[[AGENTS]]` — tabla Storage Endpoints y reglas de buckets/tamaño

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-B002-01 | actualizar | [instalar] `multer` como dependencia de producción | completada | `package.json`, `package-lock.json` | `npm ls multer` |
| T-B002-02 | crear | [crear] middleware multer con `memoryStorage`, `fileSize` 4 MB y `fileFilter` `image/*` | completada | `src/middlewares/upload-middleware.js` | `require` carga sin error |
| T-B002-03 | crear | [crear] export `uploadSingle` (`single('file')`) y `uploadMultiple` (`array('files')`) | completada | `src/middlewares/upload-middleware.js` | ambos exportados desde el módulo |
| T-B002-04 | crear | [crear] traducción de errores multer a `413` (archivo > 4 MB) y `415` (MIME no `image/*`) | completada | `src/middlewares/upload-middleware.js` | wrapper responde `413`/`415` según causa |

**Dependencias:** T-B002-01 → T-B002-02 → T-B002-03, T-B002-04
