# MAIN-TASKS.md

| ID | Acción | Tarea | Dep | Estado | Detalle |
|----|--------|-------|-----|--------|---------|
| T-B000 | actualizar | Verificar cierre del servicio de email de contacto (Resend) | — | completada | — |
| T-B001 | actualizar | Verificar configuración de despliegue (vercel.json y variables en Vercel) | — | bloqueada | `001-task-deployment.md` |
| T-B002 | crear | Crear middleware de upload con multer (4 MB, solo `image/*`, errores 413/415) según [[docs/API]] | T-B001 | completada | `002-task-upload-middleware.md` |
| T-B003 | crear | Crear rutas de storage (`upload`, `upload-multiple`, `delete`) con whitelist, saneado y service key | T-B002 | completada | `003-task-storage-routes.md` |
| T-B004 | actualizar | Montar `/private/storage` con `verifyToken` en `src/index.js` | T-B003 | completada | `004-task-storage-integration.md` |
| T-B005 | actualizar | Actualizar documentación de storage ([[docs/API]], [[docs/SUPABASE]], [[docs/ARCHITECTURE]], [[docs/REPOSITORY_STRUCTURE]], AGENTS.md) | T-B003 | completada | — |
| T-B006 | actualizar | Verificar buckets públicos, auth, rechazos y borrado en Supabase/Vercel | T-B004 | bloqueada | `006-task-storage-verification.md` |
