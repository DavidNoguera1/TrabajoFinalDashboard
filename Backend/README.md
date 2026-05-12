# UMariana Backend - Microservicios

Backend dividido en servicios independientes.

## Estructura

```text
|- academic-backend/   # Microservicio academico (puerto 3000)
|  \- src/
|- backend-library/    # Microservicio de recursos/biblioteca (puerto 3001)
|  \- src/
|- umariana_dwh-backend/ # Backend DWH y dashboard (puerto 3003)
|  \- src/
\- backend-labs/       # ETL de laboratorios CSV -> Mongo (puerto 3002)
   \- extractor-csv-laboratorios/
      |- data/
      |  |- raw/
      |  |- clean/
      |  \- error/
      \- src/
         |- controllers/
         |- services/
         |- routes/
         \- app.js
```

## Requisitos

- Node.js 18+
- npm 9+

## Ejecucion

```bash
# Compilar
cd academic-backend && npm run build
cd backend-library && npm run build
cd umariana_dwh-backend && npm run build

# Ejecutar
cd academic-backend && npm start
cd backend-library && npm start
cd umariana_dwh-backend && npm start
cd backend-labs/extractor-csv-laboratorios && npm start
```

## Endpoints

### Academic Backend (Puerto 3000)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `http://localhost:3000/api/estudiantes` | Listar todos los estudiantes |
| GET | `http://localhost:3000/api/asignaturas` | Listar todas las asignaturas |
| GET | `http://localhost:3000/api/cursos` | Listar todos los cursos |
| GET | `http://localhost:3000/api/matriculas` | Listar todas las matriculas |
| GET | `http://localhost:3000/api/calificaciones` | Listar todas las calificaciones |
| GET | `http://localhost:3000/api/asistencias` | Listar todas las asistencias |

### Library Backend (Puerto 3001)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `http://localhost:3001/api/recursos` | Listar todos los recursos |
| GET | `http://localhost:3001/api/recursos/:id` | Obtener recurso por ID |
| POST | `http://localhost:3001/api/recursos` | Crear nuevo recurso |
| PUT | `http://localhost:3001/api/recursos/:id` | Actualizar recurso |
| DELETE | `http://localhost:3001/api/recursos/:id` | Eliminar recurso |

### Backend Labs (Puerto 3002)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `http://localhost:3002/api/laboratorios/transform` | Procesar CSV(s) en `data/raw`, limpiar y generar `*_mongo.json` + `*_insert.js` en `data/clean` |
| GET | `http://localhost:3002/api/laboratorios/status` | Consultar estado del pipeline (`raw`, `clean`, `error`) y archivos detectados |

### UMariana DWH Backend (Puerto 3003)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `http://localhost:3003/api/pipelines/descarga-inicial` | Carga inicial de DWH desde `academic-backend` y `backend-library` |
| GET | `http://localhost:3003/api/dashboard/overview` | KPIs generales del dashboard |
| GET | `http://localhost:3003/api/dashboard/academic/performance` | Rendimiento por asignatura |
| GET | `http://localhost:3003/api/dashboard/academic/attendance-trend` | Tendencia de asistencia por mes |
| GET | `http://localhost:3003/api/dashboard/library/usage-by-type` | Conteo de interacciones por tipo de recurso |
| GET | `http://localhost:3003/api/dashboard/library/availability` | Disponibilidad de recursos de biblioteca |

## Variables de Entorno

### academic-backend/.env

```env
PGHOST=ep-long-grass-an02z6fc-pooler.c-6.us-east-1.aws.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_yhoO1HGPCE8d
PGSSLMODE=require
PGCHANNELBINDING=require
```

### backend-library/.env

```env
MONGODB_URI=mongodb://nexo_user:admin@ac-w423ybf-shard-00-00.gyvdj2p.mongodb.net:27017,...
MONGODB_DB_NAME=umariana_db
```

## Base de Datos

- **Academic Backend**: Neon PostgreSQL
- **Library Backend**: MongoDB Atlas
- **Backend Labs**: Genera artefactos para carga en MongoDB (JSON e `insertMany`)
