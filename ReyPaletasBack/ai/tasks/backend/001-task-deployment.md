# 001-task-deployment.md

> T-B001 — Verificar configuración de despliegue (vercel.json y variables en Vercel).
> Acción de esta descomposición: `actualizar`.

## Referencias

- `[[docs/SUPABASE]]` — sección 2 (variables requeridas por el backend)
- `.env.example`

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-B001-01 | actualizar | [verificar] `vercel.json` con servicios `frontend`/`backend` y rewrites de `/public`, `/private`, `/health`, `/ping` | completada | `vercel.json` | rewrites presentes y JSON válido |
| T-B001-02 | actualizar | [actualizar] declarar en el dashboard de Vercel las variables `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_EMAIL`, `CORS_ORIGIN`, `PORT` | bloqueada | dashboard de Vercel | variables listadas en Settings del proyecto |

**Dependencias:** T-B001-01 → T-B001-02
