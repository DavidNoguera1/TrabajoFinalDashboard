# umariana_dwh-backend

Backend para poblar `umariana_dwh` desde `academic-backend` y `backend-library`, y exponer agregados para dashboard.

## Requisitos

- Node.js 18+
- Tener corriendo:
  - `academic-backend` en `http://localhost:3000`
  - `backend-library` en `http://localhost:3001`

## Configuracion

1. Crear archivo `.env` usando `.env.example`.
2. Ajustar credenciales y URLs si aplica.
3. Verificar `LABS_DATA_DIR` con los `*_mongo.json` generados por `backend-labs`.

## Ejecucion

```bash
npm install
npm run dev
```

Servidor por defecto: `http://localhost:3003`.

## Pipeline

- `POST /api/pipelines/descarga-inicial`

Ejecuta una carga completa para:

- `dim_estudiante`
- `dim_asignatura`
- `dim_tiempo`
- `dim_equipo_lab`
- `fact_academico` (reconstruida)
- `fact_uso_biblioteca` (reconstruida por estudiante/evento)
- `fact_uso_laboratorio` (reconstruida)

## Endpoints Dashboard

- `GET /api/dashboard/overview`
- `GET /api/dashboard/academic/performance`
- `GET /api/dashboard/academic/attendance-trend`
- `GET /api/dashboard/library/usage-by-type`
- `GET /api/dashboard/library/availability`
