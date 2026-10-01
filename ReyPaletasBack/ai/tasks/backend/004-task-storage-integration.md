# 004-task-storage-integration.md

> T-B004 — Montar `/private/storage` con `verifyToken` en `src/index.js`.
> Acción de esta descomposición: `actualizar`.

## Referencias

- `[[docs/API]]` — sección 3 (rutas `/private/storage/*`) y subsección Body Parsing
- `[[AGENTS]]` — tabla Storage Endpoints (todas requieren Bearer token)

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-B004-01 | actualizar | [actualizar] `src/index.js` para requerir el router de storage y montarlo en `/private/storage` con `verifyToken` | completada | `src/index.js` | `GET /private/storage/upload` sin token responde `401` |
| T-B004-02 | actualizar | [verificar] que `express.json()` global no rompa el parsing multipart de las rutas de storage | completada | `src/index.js` | `POST /private/storage/upload` con multipart responde `400`/`200`, no `500` |

**Dependencias:** T-B004-01 → T-B004-02
