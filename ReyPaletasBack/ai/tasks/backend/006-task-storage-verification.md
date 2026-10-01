# 006-task-storage-verification.md

> T-B006 — Verificar buckets públicos, auth, rechazos y borrado en Supabase/Vercel.
> Acción de esta descomposición: `actualizar`.

## Referencias

- `[[docs/SUPABASE]]` — secciones 3.2 (buckets públicos requeridos) y 3.3 (RLS de storage)
- `[[docs/API]]` — sección 3 (reglas de negocio y códigos de error de los endpoints de storage)

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-B006-01 | actualizar | [crear] los 5 buckets públicos `Products`, `Announcements`, `Franchises`, `HeroImages`, `Associates` | bloqueada | dashboard de Supabase | buckets existentes con visibilidad Public |
| T-B006-02 | actualizar | [verificar] `401` sin `Bearer token` y con token inválido en `/private/storage` | bloqueada | API desplegada | respuestas `401` |
| T-B006-03 | actualizar | [verificar] rechazos `400` bucket fuera de whitelist, `415` MIME no imagen y `413` archivo > 4 MB | bloqueada | API desplegada | respuestas `400`, `415`, `413` |
| T-B006-04 | actualizar | [verificar] subida múltiple y borrado con `path` de subcarpeta contra buckets reales | bloqueada | API desplegada | `data[]` con 2+ URLs públicas y borrado `200` |
| T-B006-05 | actualizar | [revisar] endurecer o eliminar las políticas de bucket que permitían escritura con la anon key | bloqueada | políticas RLS de Storage | sin escritura con anon key |

**Dependencias:** T-B006-01 → T-B006-02, T-B006-03, T-B006-04, T-B006-05
