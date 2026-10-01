# 003-task-fase-9-hero-logo.md

> T-F003 — Reemplazar el nombre de marca por el logo en el Hero público (Fase 9.5).
> Acción de esta descomposición: `actualizar`.

## Referencias

- `ReyPaletasFront/AGENTS.md` (restricciones de diseño y assets en `src/assets`)
- `ReyPaletasFront/docs/DESIGN.md`

## Tareas pequeñas

| ID | Acción | Tarea | Estado | Archivos | Verificación |
|----|--------|-------|--------|----------|--------------|
| T-F003-01 | actualizar | [actualizar] Confirmar si el Hero ya renderiza el logo y sustituir el nombre de marca por el SVG | completada | `src/pages/public/Home.jsx` | El bloque central del Hero no pinta texto de marca |
| T-F003-02 | actualizar | [actualizar] Ajustar el tamaño y la alineación del logo para que no se recorte en móvil y escritorio | completada | `src/pages/public/Home.jsx` | SVG con ancho máximo y `mx-auto` |

Dependencias: T-F003-01 → T-F003-02