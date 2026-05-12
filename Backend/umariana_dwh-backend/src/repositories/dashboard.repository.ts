import { neonPool } from '../config/database';

export const getOverview = async (): Promise<Record<string, unknown>> => {
  const query = `
    SELECT
      (SELECT COUNT(*)::int FROM dim_estudiante) AS total_estudiantes,
      (SELECT COUNT(*)::int FROM dim_asignatura) AS total_asignaturas,
      (SELECT COUNT(*)::int FROM fact_academico) AS total_registros_academicos,
      (SELECT COUNT(*)::int FROM fact_uso_biblioteca) AS total_registros_biblioteca,
      (SELECT ROUND(AVG(nota_final)::numeric, 2) FROM fact_academico WHERE nota_final IS NOT NULL) AS promedio_nota_final,
      (SELECT ROUND(AVG(CASE WHEN asistio THEN 100 ELSE 0 END)::numeric, 2) FROM fact_academico WHERE asistio IS NOT NULL) AS porcentaje_asistencia
  `;

  const result = await neonPool.query(query);
  return result.rows[0];
};

export const getAcademicPerformanceBySubject = async (): Promise<Record<string, unknown>[]> => {
  const query = `
    SELECT
      fa.codigo_asignatura,
      COALESCE(da.nombre_asignatura, fa.codigo_asignatura) AS nombre_asignatura,
      COUNT(*)::int AS total_registros,
      ROUND(AVG(fa.nota_final)::numeric, 2) AS promedio_nota_final
    FROM fact_academico fa
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    GROUP BY fa.codigo_asignatura, da.nombre_asignatura
    ORDER BY total_registros DESC, fa.codigo_asignatura ASC
  `;

  const result = await neonPool.query(query);
  return result.rows;
};

export const getAcademicAttendanceTrend = async (): Promise<Record<string, unknown>[]> => {
  const query = `
    SELECT
      DATE_TRUNC('month', id_fecha)::date AS mes,
      COUNT(*)::int AS total_clases,
      SUM(CASE WHEN asistio THEN 1 ELSE 0 END)::int AS asistencias,
      ROUND(
        AVG(CASE WHEN asistio THEN 100 ELSE 0 END)::numeric,
        2
      ) AS porcentaje_asistencia
    FROM fact_academico
    WHERE id_fecha IS NOT NULL AND asistio IS NOT NULL
    GROUP BY DATE_TRUNC('month', id_fecha)
    ORDER BY mes ASC
  `;

  const result = await neonPool.query(query);
  return result.rows;
};

export const getLibraryUsageByType = async (): Promise<Record<string, unknown>[]> => {
  const query = `
    SELECT
      split_part(tipo_interaccion, '|', 1) AS tipo_recurso,
      COUNT(*)::int AS total_registros,
      SUM(cantidad_articulos)::int AS total_articulos
    FROM fact_uso_biblioteca
    GROUP BY split_part(tipo_interaccion, '|', 1)
    ORDER BY total_articulos DESC, tipo_recurso ASC
  `;

  const result = await neonPool.query(query);
  return result.rows;
};

export const getLibraryAvailability = async (): Promise<Record<string, unknown>[]> => {
  const query = `
    SELECT
      split_part(tipo_interaccion, '|', 2) AS estado,
      COUNT(*)::int AS total
    FROM fact_uso_biblioteca
    GROUP BY split_part(tipo_interaccion, '|', 2)
    ORDER BY estado ASC
  `;

  const result = await neonPool.query(query);
  return result.rows;
};
