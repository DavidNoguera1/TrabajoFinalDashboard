# 1Warehouse

Proyecto con múltiples backends.

## Proyectos

| Proyecto | Descripción | Puerto |
|----------|-------------|--------|
| `Backend/academic-backend` | API académica | 4000 |
| `Backend/backend-library` | API de biblioteca | 4000 |
| `Backend/umariana_dwh-backend` | ETL y analítica | 3003 |
| `Backend/backend-labs/extractor-csv-laboratorios` | Extractor CSV laboratorios | - |

## Ejecutar en otro equipo

### 1. Instalar dependencias

```bash
# Academic Backend
cd Backend/academic-backend
npm install

# Backend Library
cd Backend/backend-library
npm install

# UMariana DWH Backend
cd Backend/umariana_dwh-backend
npm install

# Extractor CSV Laboratorios
cd Backend/backend-labs/extractor-csv-laboratorios
npm install
```

### 2. Configurar variables de entorno

Cada proyecto tiene un archivo `.env` (no incluido en git). Copia y configura las variables necesarias:

- **academic-backend** y **backend-library**: MongoDB URI, PostgreSQL, PORT
- **umariana_dwh-backend**: PostgreSQL, URLs de APIs
- **extractor-csv-laboratorios**: No requiere .env

### 3. Ejecutar

**Desarrollo (con hot-reload):**
```bash
cd Backend/<proyecto>
npm run dev
```

**Producción:**
```bash
cd Backend/<proyecto>
npm run build
npm start
```

## Requisitos

- Node.js 18+
- PostgreSQL (para academic-backend, umariana_dwh-backend)
- MongoDB (para backend-library)