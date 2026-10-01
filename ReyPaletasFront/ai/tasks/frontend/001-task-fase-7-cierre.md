# 001-task-fase-7-cierre.md

> T-F001 — Cerrar Fase 7: saneado de inputs y testing unitario.
> Acción de esta descomposición: `actualizar`.

## Referencias

- `ReyPaletasFront/AGENTS.md` (regla: no añadir tests sin consultar al usuario)

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-F001-01 | actualizar | [actualizar] Sanear los inputs del admin antes de enviar a la API (7.11) | bloqueada | `src/pages/admin/*.jsx` | Falta documentación del alcance del saneado en `docs/` |
| T-F001-02 | actualizar | [actualizar] Configurar Vitest como runner de tests (7.12) | bloqueada | `package.json` | AGENTS.md exige consultar al usuario antes de añadir un framework |
| T-F001-03 | actualizar | [actualizar] Agregar tests de AuthContext y del cliente de API (7.13) | bloqueada | `src/context/`, `src/services/api.js` | Depende de T-F001-02 |

Dependencias: ninguna