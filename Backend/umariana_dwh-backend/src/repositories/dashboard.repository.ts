import { neonPool } from '../config/database';

export interface DashboardFilters {
  year?: number;
  semester?: number;
  courseId?: number;
  teacher?: string;
  subject?: string;
  gradeMin?: number;
  gradeMax?: number;
  activityLevel?: string;
}

type QueryParam = number | string;

interface FilterBuildResult {
  conditions: string[];
  params: QueryParam[];
  nextParamIndex: number;
}

const buildWhereClause = (conditions: string[]): string => {
  if (!conditions.length) {
    return '';
  }

  return `WHERE ${conditions.join(' AND ')}`;
};

const buildAcademicFilters = (
  filters: DashboardFilters,
  startParamIndex = 1,
  tableAlias = 'fa',
  subjectAlias = 'da',
  studentAlias = 'de'
): FilterBuildResult => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];
  let paramIndex = startParamIndex;

  if (typeof filters.year === 'number') {
    conditions.push(`EXTRACT(YEAR FROM ${tableAlias}.id_fecha) = $${paramIndex}`);
    params.push(filters.year);
    paramIndex += 1;
  }

  if (typeof filters.semester === 'number') {
    conditions.push(`${studentAlias}.semestre_actual = $${paramIndex}`);
    params.push(filters.semester);
    paramIndex += 1;
  }

  if (typeof filters.courseId === 'number') {
    conditions.push(`${tableAlias}.id_curso = $${paramIndex}`);
    params.push(filters.courseId);
    paramIndex += 1;
  }

  if (filters.teacher) {
    conditions.push(`${tableAlias}.docente_asignado ILIKE $${paramIndex}`);
    params.push(`%${filters.teacher}%`);
    paramIndex += 1;
  }

  if (filters.subject) {
    conditions.push(
      `(COALESCE(${subjectAlias}.nombre_asignatura, ${tableAlias}.codigo_asignatura) ILIKE $${paramIndex} OR ${tableAlias}.codigo_asignatura ILIKE $${paramIndex})`
    );
    params.push(`%${filters.subject}%`);
    paramIndex += 1;
  }

  if (typeof filters.gradeMin === 'number') {
    conditions.push(`${tableAlias}.nota_final >= $${paramIndex}`);
    params.push(filters.gradeMin);
    paramIndex += 1;
  }

  if (typeof filters.gradeMax === 'number') {
    conditions.push(`${tableAlias}.nota_final <= $${paramIndex}`);
    params.push(filters.gradeMax);
    paramIndex += 1;
  }

  if (filters.activityLevel) {
    conditions.push(`${studentAlias}.nivel_actividad_biblioteca = $${paramIndex}`);
    params.push(filters.activityLevel);
    paramIndex += 1;
  }

  return { conditions, params, nextParamIndex: paramIndex };
};

const buildLibraryDateFilters = (
  filters: DashboardFilters,
  startParamIndex = 1,
  tableAlias = 'fb'
): FilterBuildResult => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];
  let paramIndex = startParamIndex;

  if (typeof filters.year === 'number') {
    conditions.push(`EXTRACT(YEAR FROM ${tableAlias}.id_fecha) = $${paramIndex}`);
    params.push(filters.year);
    paramIndex += 1;
  }

  return { conditions, params, nextParamIndex: paramIndex };
};

const shouldApplyAcademicCohort = (filters: DashboardFilters): boolean =>
  typeof filters.semester === 'number' ||
  typeof filters.courseId === 'number' ||
  Boolean(filters.teacher) ||
  Boolean(filters.subject) ||
  typeof filters.gradeMin === 'number' ||
  typeof filters.gradeMax === 'number' ||
  Boolean(filters.activityLevel);

export const getFilters = async (): Promise<Record<string, unknown>> => {
  const yearsQuery = `
    SELECT DISTINCT EXTRACT(YEAR FROM id_fecha)::int AS year 
    FROM fact_academico 
    WHERE id_fecha IS NOT NULL 
    ORDER BY year DESC
  `;
  
  const coursesQuery = `
    SELECT
      fa.id_curso::int AS id,
      COALESCE(
        MIN(da.nombre_asignatura),
        MIN(fa.codigo_asignatura),
        'Curso ' || fa.id_curso::text
      ) AS label
    FROM fact_academico fa
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    WHERE fa.id_curso IS NOT NULL
    GROUP BY fa.id_curso
    ORDER BY label ASC
  `;

  const teachersQuery = `
    SELECT DISTINCT docente_asignado AS name 
    FROM fact_academico 
    WHERE docente_asignado IS NOT NULL AND docente_asignado != ''
    ORDER BY name
  `;

  const subjectsQuery = `
    SELECT DISTINCT COALESCE(da.nombre_asignatura, fa.codigo_asignatura) AS nombre
    FROM fact_academico fa
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    ORDER BY nombre
  `;

  const semestersQuery = `
    SELECT DISTINCT de.semestre_actual::int AS semestre
    FROM dim_estudiante de
    INNER JOIN fact_academico fa ON fa.id_estudiante = de.id_estudiante
    WHERE de.semestre_actual IS NOT NULL
    ORDER BY semestre
  `;

  const activityLevelsQuery = `
    SELECT DISTINCT nivel_actividad_biblioteca AS nivel
    FROM dim_estudiante
    WHERE nivel_actividad_biblioteca IS NOT NULL AND nivel_actividad_biblioteca <> ''
    ORDER BY nivel
  `;

  const [years, courses, teachers, subjects, semesters, activityLevels] = await Promise.all([
    neonPool.query(yearsQuery),
    neonPool.query(coursesQuery),
    neonPool.query(teachersQuery),
    neonPool.query(subjectsQuery),
    neonPool.query(semestersQuery),
    neonPool.query(activityLevelsQuery)
  ]);

  return {
    years: years.rows.map(r => r.year),
    courses: courses.rows,
    teachers: teachers.rows.map(r => r.name),
    subjects: subjects.rows.map(r => r.nombre),
    semesters: semesters.rows.map(r => r.semestre),
    activityLevels: activityLevels.rows.map((r) => r.nivel)
  };
};

export const getOverview = async (filters: DashboardFilters = {}): Promise<Record<string, unknown>> => {
  const academicFilters = buildAcademicFilters(filters);
  const libraryDateFilters = buildLibraryDateFilters(filters, academicFilters.nextParamIndex);
  const libraryConditions = [...libraryDateFilters.conditions];

  if (shouldApplyAcademicCohort(filters)) {
    libraryConditions.push('fb.id_estudiante IN (SELECT id_estudiante FROM filtered_students)');
  }

  const query = `
    WITH filtered_academic AS (
      SELECT fa.*
      FROM fact_academico fa
      LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
      LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
      ${buildWhereClause(academicFilters.conditions)}
    ),
    filtered_students AS (
      SELECT DISTINCT id_estudiante
      FROM filtered_academic
    ),
    filtered_library AS (
      SELECT fb.*
      FROM fact_uso_biblioteca fb
      ${buildWhereClause(libraryConditions)}
    )
    SELECT
      (SELECT COUNT(*)::int FROM filtered_students) AS total_estudiantes,
      (SELECT COUNT(DISTINCT codigo_asignatura)::int FROM filtered_academic) AS total_asignaturas,
      (SELECT COUNT(*)::int FROM filtered_academic) AS total_registros_academicos,
      (SELECT COUNT(*)::int FROM filtered_library) AS total_registros_biblioteca,
      (
        SELECT COALESCE(ROUND(AVG(nota_final)::numeric, 2), 0)
        FROM filtered_academic
        WHERE nota_final IS NOT NULL
      ) AS promedio_nota_final,
      (
        SELECT COALESCE(ROUND(AVG(CASE WHEN asistio THEN 100 ELSE 0 END)::numeric, 2), 0)
        FROM filtered_academic
        WHERE asistio IS NOT NULL
      ) AS porcentaje_asistencia
  `;

  const result = await neonPool.query(query, [...academicFilters.params, ...libraryDateFilters.params]);
  return result.rows[0];
};

export const getAcademicPerformanceBySubject = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const academicFilters = buildAcademicFilters(filters);
  const whereConditions = [...academicFilters.conditions, 'fa.nota_final IS NOT NULL'];

  const query = `
    SELECT
      fa.codigo_asignatura,
      COALESCE(da.nombre_asignatura, fa.codigo_asignatura) AS nombre_asignatura,
      COUNT(*)::int AS total_registros,
      ROUND(AVG(fa.nota_final)::numeric, 2) AS promedio_nota_final
    FROM fact_academico fa
    LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    ${buildWhereClause(whereConditions)}
    GROUP BY fa.codigo_asignatura, da.nombre_asignatura
    ORDER BY total_registros DESC, fa.codigo_asignatura ASC
  `;

  const result = await neonPool.query(query, academicFilters.params);
  return result.rows;
};

export const getAcademicGradeDistributionByStudent = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const academicFilters = buildAcademicFilters(filters);
  const whereConditions = [...academicFilters.conditions, 'fa.nota_final IS NOT NULL'];

  const query = `
    WITH filtered_academic AS (
      SELECT fa.id_estudiante, fa.nota_final
      FROM fact_academico fa
      LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
      LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
      ${buildWhereClause(whereConditions)}
    ),
    student_avg AS (
      SELECT
        id_estudiante,
        AVG(nota_final)::numeric AS avg_grade
      FROM filtered_academic
      GROUP BY id_estudiante
    )
    SELECT '0.0 - 1.9' AS rango, COUNT(*) FILTER (WHERE avg_grade < 2)::int AS total_estudiantes FROM student_avg
    UNION ALL
    SELECT '2.0 - 2.9' AS rango, COUNT(*) FILTER (WHERE avg_grade >= 2 AND avg_grade < 3)::int AS total_estudiantes FROM student_avg
    UNION ALL
    SELECT '3.0 - 3.9' AS rango, COUNT(*) FILTER (WHERE avg_grade >= 3 AND avg_grade < 4)::int AS total_estudiantes FROM student_avg
    UNION ALL
    SELECT '4.0 - 4.5' AS rango, COUNT(*) FILTER (WHERE avg_grade >= 4 AND avg_grade < 4.6)::int AS total_estudiantes FROM student_avg
    UNION ALL
    SELECT '4.6 - 5.0' AS rango, COUNT(*) FILTER (WHERE avg_grade >= 4.6 AND avg_grade <= 5)::int AS total_estudiantes FROM student_avg
  `;

  const result = await neonPool.query(query, academicFilters.params);
  return result.rows;
};

export const getAcademicAttendanceTrend = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const academicFilters = buildAcademicFilters(filters);
  const whereConditions = [...academicFilters.conditions, 'fa.id_fecha IS NOT NULL', 'fa.asistio IS NOT NULL'];

  const query = `
    SELECT
      DATE_TRUNC('month', fa.id_fecha)::date AS mes,
      COUNT(*)::int AS total_clases,
      SUM(CASE WHEN fa.asistio THEN 1 ELSE 0 END)::int AS asistencias,
      ROUND(
        AVG(CASE WHEN fa.asistio THEN 100 ELSE 0 END)::numeric,
        2
      ) AS porcentaje_asistencia
    FROM fact_academico fa
    LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    ${buildWhereClause(whereConditions)}
    GROUP BY DATE_TRUNC('month', fa.id_fecha)
    ORDER BY mes ASC
  `;

  const result = await neonPool.query(query, academicFilters.params);
  return result.rows;
};

export const getAcademicAttendanceByWeekday = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const academicFilters = buildAcademicFilters(filters);
  const whereConditions = [...academicFilters.conditions, 'fa.id_fecha IS NOT NULL', 'fa.asistio IS NOT NULL'];

  const query = `
    SELECT
      EXTRACT(DOW FROM fa.id_fecha)::int AS dia_semana_num,
      TRIM(TO_CHAR(fa.id_fecha, 'TMDay')) AS dia_semana,
      COUNT(*)::int AS total_clases,
      SUM(CASE WHEN fa.asistio THEN 1 ELSE 0 END)::int AS asistencias,
      ROUND(AVG(CASE WHEN fa.asistio THEN 100 ELSE 0 END)::numeric, 2) AS porcentaje_asistencia
    FROM fact_academico fa
    LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    ${buildWhereClause(whereConditions)}
    GROUP BY EXTRACT(DOW FROM fa.id_fecha), TRIM(TO_CHAR(fa.id_fecha, 'TMDay'))
    ORDER BY dia_semana_num ASC
  `;

  const result = await neonPool.query(query, academicFilters.params);
  return result.rows;
};

export const getAcademicAttendanceByStudentSemester = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const academicFilters = buildAcademicFilters(filters);
  const whereConditions = [...academicFilters.conditions, 'fa.asistio IS NOT NULL'];

  const query = `
    SELECT
      de.semestre_actual::int AS semestre_estudiante,
      COUNT(*)::int AS total_clases,
      SUM(CASE WHEN fa.asistio THEN 1 ELSE 0 END)::int AS asistencias,
      ROUND(AVG(CASE WHEN fa.asistio THEN 100 ELSE 0 END)::numeric, 2) AS porcentaje_asistencia
    FROM fact_academico fa
    LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    ${buildWhereClause(whereConditions)}
    GROUP BY de.semestre_actual
    HAVING de.semestre_actual IS NOT NULL
    ORDER BY de.semestre_actual ASC
  `;

  const result = await neonPool.query(query, academicFilters.params);
  return result.rows;
};

export const getAcademicAttendanceBySubject = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const academicFilters = buildAcademicFilters(filters);
  const whereConditions = [...academicFilters.conditions, 'fa.asistio IS NOT NULL'];

  const query = `
    SELECT
      fa.codigo_asignatura,
      COALESCE(da.nombre_asignatura, fa.codigo_asignatura) AS nombre_asignatura,
      COUNT(*)::int AS total_clases,
      SUM(CASE WHEN fa.asistio THEN 1 ELSE 0 END)::int AS asistencias,
      ROUND(AVG(CASE WHEN fa.asistio THEN 100 ELSE 0 END)::numeric, 2) AS porcentaje_asistencia
    FROM fact_academico fa
    LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
    LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
    ${buildWhereClause(whereConditions)}
    GROUP BY fa.codigo_asignatura, da.nombre_asignatura
    ORDER BY porcentaje_asistencia DESC, total_clases DESC
  `;

  const result = await neonPool.query(query, academicFilters.params);
  return result.rows;
};

export const getLibraryUsageByType = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const cohortFiltersEnabled = shouldApplyAcademicCohort(filters);
  const academicFilters = cohortFiltersEnabled ? buildAcademicFilters(filters) : null;
  const libraryDateFilters = buildLibraryDateFilters(
    filters,
    cohortFiltersEnabled && academicFilters ? academicFilters.nextParamIndex : 1
  );
  const libraryConditions = [...libraryDateFilters.conditions];

  if (cohortFiltersEnabled) {
    libraryConditions.push('fb.id_estudiante IN (SELECT id_estudiante FROM filtered_students)');
  }

  const query = cohortFiltersEnabled
    ? `
      WITH filtered_academic AS (
        SELECT fa.id_estudiante
        FROM fact_academico fa
        LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
        LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
        ${buildWhereClause(academicFilters?.conditions || [])}
      ),
      filtered_students AS (
        SELECT DISTINCT id_estudiante
        FROM filtered_academic
      ),
      filtered_library AS (
        SELECT fb.*
        FROM fact_uso_biblioteca fb
        ${buildWhereClause(libraryConditions)}
      )
      SELECT
        CASE
          WHEN NULLIF(split_part(tipo_interaccion, ':', 2), '') IS NOT NULL
            THEN CONCAT(split_part(tipo_interaccion, ':', 1), ' - ', split_part(tipo_interaccion, ':', 2))
          ELSE split_part(tipo_interaccion, ':', 1)
        END AS tipo_recurso,
        COUNT(*)::int AS total_registros,
        COALESCE(SUM(cantidad_articulos), 0)::int AS total_articulos
      FROM filtered_library
      GROUP BY tipo_recurso
      ORDER BY total_articulos DESC, tipo_recurso ASC
    `
    : `
      SELECT
        CASE
          WHEN NULLIF(split_part(fb.tipo_interaccion, ':', 2), '') IS NOT NULL
            THEN CONCAT(split_part(fb.tipo_interaccion, ':', 1), ' - ', split_part(fb.tipo_interaccion, ':', 2))
          ELSE split_part(fb.tipo_interaccion, ':', 1)
        END AS tipo_recurso,
        COUNT(*)::int AS total_registros,
        COALESCE(SUM(fb.cantidad_articulos), 0)::int AS total_articulos
      FROM fact_uso_biblioteca fb
      ${buildWhereClause(libraryConditions)}
      GROUP BY tipo_recurso
      ORDER BY total_articulos DESC, tipo_recurso ASC
    `;

  const params = cohortFiltersEnabled
    ? [...(academicFilters?.params || []), ...libraryDateFilters.params]
    : libraryDateFilters.params;
  const result = await neonPool.query(query, params);

  return result.rows;
};

export const getLibraryAvailability = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const cohortFiltersEnabled = shouldApplyAcademicCohort(filters);
  const academicFilters = cohortFiltersEnabled ? buildAcademicFilters(filters) : null;
  const libraryDateFilters = buildLibraryDateFilters(
    filters,
    cohortFiltersEnabled && academicFilters ? academicFilters.nextParamIndex : 1
  );
  const libraryConditions = [...libraryDateFilters.conditions];

  if (cohortFiltersEnabled) {
    libraryConditions.push('fb.id_estudiante IN (SELECT id_estudiante FROM filtered_students)');
  }

  const query = cohortFiltersEnabled
    ? `
      WITH filtered_academic AS (
        SELECT fa.id_estudiante
        FROM fact_academico fa
        LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
        LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
        ${buildWhereClause(academicFilters?.conditions || [])}
      ),
      filtered_students AS (
        SELECT DISTINCT id_estudiante
        FROM filtered_academic
      ),
      filtered_library AS (
        SELECT fb.*
        FROM fact_uso_biblioteca fb
        ${buildWhereClause(libraryConditions)}
      )
      SELECT
        CASE
          WHEN NULLIF(split_part(tipo_interaccion, ':', 2), '') IS NOT NULL
            THEN CONCAT(split_part(tipo_interaccion, ':', 1), ' - ', split_part(tipo_interaccion, ':', 2))
          ELSE split_part(tipo_interaccion, ':', 1)
        END AS estado,
        COUNT(*)::int AS total
      FROM filtered_library
      GROUP BY estado
      ORDER BY total DESC, estado ASC
    `
    : `
      SELECT
        CASE
          WHEN NULLIF(split_part(fb.tipo_interaccion, ':', 2), '') IS NOT NULL
            THEN CONCAT(split_part(fb.tipo_interaccion, ':', 1), ' - ', split_part(fb.tipo_interaccion, ':', 2))
          ELSE split_part(fb.tipo_interaccion, ':', 1)
        END AS estado,
        COUNT(*)::int AS total
      FROM fact_uso_biblioteca fb
      ${buildWhereClause(libraryConditions)}
      GROUP BY estado
      ORDER BY total DESC, estado ASC
    `;

  const params = cohortFiltersEnabled
    ? [...(academicFilters?.params || []), ...libraryDateFilters.params]
    : libraryDateFilters.params;
  const result = await neonPool.query(query, params);

  return result.rows;
};

export const getLibraryActivityByLevel = async (
  filters: DashboardFilters = {}
): Promise<Record<string, unknown>[]> => {
  const academicFilters = buildAcademicFilters(filters);
  const libraryDateFilters = buildLibraryDateFilters(filters, academicFilters.nextParamIndex);
  const libraryConditions = [...libraryDateFilters.conditions, 'fb.id_estudiante IN (SELECT id_estudiante FROM filtered_students)'];

  const query = `
    WITH filtered_academic AS (
      SELECT fa.id_estudiante
      FROM fact_academico fa
      LEFT JOIN dim_estudiante de ON de.id_estudiante = fa.id_estudiante
      LEFT JOIN dim_asignatura da ON da.codigo_asignatura = fa.codigo_asignatura
      ${buildWhereClause(academicFilters.conditions)}
    ),
    filtered_students AS (
      SELECT DISTINCT id_estudiante
      FROM filtered_academic
    ),
    filtered_library AS (
      SELECT fb.*
      FROM fact_uso_biblioteca fb
      ${buildWhereClause(libraryConditions)}
    )
    SELECT
      COALESCE(de.nivel_actividad_biblioteca, 'SIN DATOS') AS nivel,
      COUNT(DISTINCT fs.id_estudiante)::int AS total_estudiantes,
      COUNT(fl.id_estudiante)::int AS total_interacciones,
      COALESCE(SUM(fl.cantidad_articulos), 0)::int AS total_articulos
    FROM filtered_students fs
    LEFT JOIN dim_estudiante de ON de.id_estudiante = fs.id_estudiante
    LEFT JOIN filtered_library fl ON fl.id_estudiante = fs.id_estudiante
    GROUP BY COALESCE(de.nivel_actividad_biblioteca, 'SIN DATOS')
    ORDER BY total_estudiantes DESC, nivel ASC
  `;

  const params = [...academicFilters.params, ...libraryDateFilters.params];
  const result = await neonPool.query(query, params);
  return result.rows;
};
