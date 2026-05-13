import fs from 'fs';
import path from 'path';
import { appConfig } from '../config/env';
import {
  AccesoLaboratorio,
  Asignatura,
  Asistencia,
  Calificacion,
  Curso,
  Estudiante,
  Matricula,
  RecursoBiblioteca
} from '../models/source.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const getJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No fue posible consultar ${url}. HTTP ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!payload.success) {
    throw new Error(`La fuente ${url} respondio con success=false`);
  }

  return payload.data;
};

export const fetchAcademicData = async (): Promise<{
  estudiantes: Estudiante[];
  asignaturas: Asignatura[];
  cursos: Curso[];
  matriculas: Matricula[];
  calificaciones: Calificacion[];
  asistencias: Asistencia[];
}> => {
  const base = appConfig.academicApiBaseUrl;

  const [estudiantes, asignaturas, cursos, matriculas, calificaciones, asistencias] = await Promise.all([
    getJson<Estudiante[]>(`${base}/estudiantes`),
    getJson<Asignatura[]>(`${base}/asignaturas`),
    getJson<Curso[]>(`${base}/cursos`),
    getJson<Matricula[]>(`${base}/matriculas`),
    getJson<Calificacion[]>(`${base}/calificaciones`),
    getJson<Asistencia[]>(`${base}/asistencias`)
  ]);

  return { estudiantes, asignaturas, cursos, matriculas, calificaciones, asistencias };
};

export const fetchLibraryResources = async (): Promise<RecursoBiblioteca[]> => {
  return getJson<RecursoBiblioteca[]>(appConfig.libraryApiBaseUrl);
};

const hasLabKeys = (value: Record<string, unknown>): boolean =>
  typeof value.numero_documento === 'string' &&
  typeof value.fecha === 'string' &&
  typeof value.equipo_utilizado === 'string';

const normalizeLabRow = (row: Record<string, unknown>): AccesoLaboratorio => ({
  numero_documento: String(row.numero_documento || '').trim(),
  semestre: typeof row.semestre === 'number' ? row.semestre : null,
  fecha: String(row.fecha || '').trim(),
  hora_entrada: row.hora_entrada ? String(row.hora_entrada).trim() : null,
  hora_salida: row.hora_salida ? String(row.hora_salida).trim() : null,
  equipo_utilizado: String(row.equipo_utilizado || '').trim().toUpperCase(),
  descripcion_equipo: row.descripcion_equipo ? String(row.descripcion_equipo).trim() : null
});

export const fetchLaboratoryData = async (): Promise<AccesoLaboratorio[]> => {
  const dir = appConfig.labsDataDir;

  if (!fs.existsSync(dir)) {
    throw new Error(`No existe directorio de datos de laboratorio: ${dir}`);
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith('_mongo.json'))
    .sort();

  const rows: AccesoLaboratorio[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
      continue;
    }

    for (const item of parsed) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const record = item as Record<string, unknown>;
      if (!hasLabKeys(record)) {
        continue;
      }

      rows.push(normalizeLabRow(record));
    }
  }

  return rows;
};
