import { PoolClient } from 'pg';
import { neonPool } from '../config/database';
import { Asignatura, Estudiante } from '../models/source.model';
import { DimEquipoRow, FactAcademicoRow, FactBibliotecaRow, FactLaboratorioRow } from '../models/dwh.model';
import { inferPeriodoAcademico } from '../utils/date';

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

export const withTransaction = async <T>(handler: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await neonPool.connect();

  try {
    await client.query('BEGIN');
    const result = await handler(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const truncateReloadableFacts = async (client: PoolClient): Promise<void> => {
  await client.query('TRUNCATE TABLE fact_academico, fact_uso_biblioteca, fact_uso_laboratorio RESTART IDENTITY');
};

export const upsertDimEstudiantes = async (
  client: PoolClient,
  estudiantes: Estudiante[],
  nivelActividadByDocumento: Map<string, string>
): Promise<void> => {
  for (const row of estudiantes) {
    await client.query(
      `
      INSERT INTO dim_estudiante (
        id_estudiante,
        tipo_documento,
        nombres,
        apellidos,
        correo_institucional,
        semestre_actual,
        nivel_actividad_biblioteca
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (id_estudiante) DO UPDATE SET
        tipo_documento = EXCLUDED.tipo_documento,
        nombres = EXCLUDED.nombres,
        apellidos = EXCLUDED.apellidos,
        correo_institucional = EXCLUDED.correo_institucional,
        semestre_actual = EXCLUDED.semestre_actual,
        nivel_actividad_biblioteca = EXCLUDED.nivel_actividad_biblioteca
      `,
      [
        row.numero_documento,
        row.tipo_documento,
        row.nombres,
        row.apellidos,
        row.correo_institucional,
        row.semestre_actual,
        nivelActividadByDocumento.get(row.numero_documento) || 'SIN DATOS'
      ]
    );
  }
};

export const upsertDimAsignaturas = async (client: PoolClient, asignaturas: Asignatura[]): Promise<void> => {
  for (const row of asignaturas) {
    await client.query(
      `
      INSERT INTO dim_asignatura (
        codigo_asignatura,
        nombre_asignatura,
        creditos,
        semestre_plan
      )
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (codigo_asignatura) DO UPDATE SET
        nombre_asignatura = EXCLUDED.nombre_asignatura,
        creditos = EXCLUDED.creditos,
        semestre_plan = EXCLUDED.semestre_plan
      `,
      [row.codigo_asignatura, row.nombre_asignatura, row.creditos, row.semestre_plan]
    );
  }
};

export const upsertDimTiempo = async (client: PoolClient, isoDates: string[]): Promise<void> => {
  for (const isoDate of isoDates) {
    const date = new Date(`${isoDate}T00:00:00.000Z`);
    const diaSemana = date.toLocaleDateString('es-CO', { weekday: 'long', timeZone: 'UTC' });

    await client.query(
      `
      INSERT INTO dim_tiempo (
        id_fecha,
        anio,
        mes,
        dia,
        dia_semana,
        periodo_academico
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id_fecha) DO UPDATE SET
        anio = EXCLUDED.anio,
        mes = EXCLUDED.mes,
        dia = EXCLUDED.dia,
        dia_semana = EXCLUDED.dia_semana,
        periodo_academico = EXCLUDED.periodo_academico
      `,
      [isoDate, date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), diaSemana, inferPeriodoAcademico(isoDate)]
    );
  }
};

export const insertFactAcademico = async (client: PoolClient, rows: FactAcademicoRow[]): Promise<void> => {
  const batches = chunk(rows, 1000);

  for (const batch of batches) {
    const values: Array<string | number | boolean | null> = [];
    const placeholders = batch.map((row, index) => {
      const offset = index * 10;
      values.push(
        row.id_estudiante,
        row.codigo_asignatura,
        row.id_fecha,
        row.id_curso,
        row.docente_asignado,
        row.asistio,
        row.nota_seguimiento_1,
        row.nota_seguimiento_2,
        row.nota_seguimiento_3,
        row.nota_final
      );

      return `($${offset + 1},$${offset + 2},$${offset + 3},$${offset + 4},$${offset + 5},$${offset + 6},$${offset + 7},$${offset + 8},$${offset + 9},$${offset + 10})`;
    });

    await client.query(
      `
      INSERT INTO fact_academico (
        id_estudiante,
        codigo_asignatura,
        id_fecha,
        id_curso,
        docente_asignado,
        asistio,
        nota_seguimiento_1,
        nota_seguimiento_2,
        nota_seguimiento_3,
        nota_final
      )
      VALUES ${placeholders.join(',')}
      `,
      values
    );
  }
};

export const insertFactBiblioteca = async (client: PoolClient, rows: FactBibliotecaRow[]): Promise<void> => {
  const filteredRows = rows.filter((row) => Boolean(row.id_estudiante && row.id_fecha && row.recurso_id));

  if (!filteredRows.length) {
    return;
  }

  const values: Array<string | number | null> = [];
  const placeholders = filteredRows.map((row, index) => {
    const offset = index * 6;
    values.push(
      row.id_estudiante,
      row.id_fecha,
      row.tipo_interaccion,
      row.recurso_id,
      row.cantidad_articulos,
      row.horas_lectura_acumuladas
    );

    return `($${offset + 1},$${offset + 2},$${offset + 3},$${offset + 4},$${offset + 5},$${offset + 6})`;
  });

  await client.query(
    `
    INSERT INTO fact_uso_biblioteca (
      id_estudiante,
      id_fecha,
      tipo_interaccion,
      recurso_id,
      cantidad_articulos,
      horas_lectura_acumuladas
    )
    VALUES ${placeholders.join(',')}
    `,
    values
  );
};

export const upsertDimEquipos = async (client: PoolClient, rows: DimEquipoRow[]): Promise<void> => {
  for (const row of rows) {
    await client.query(
      `
      INSERT INTO dim_equipo_lab (
        id_equipo,
        descripcion_equipo
      )
      VALUES ($1,$2)
      ON CONFLICT (id_equipo) DO UPDATE SET
        descripcion_equipo = EXCLUDED.descripcion_equipo
      `,
      [row.id_equipo, row.descripcion_equipo]
    );
  }
};

export const insertFactLaboratorio = async (client: PoolClient, rows: FactLaboratorioRow[]): Promise<void> => {
  if (!rows.length) {
    return;
  }

  const values: Array<string | number | null> = [];
  const placeholders = rows.map((row, index) => {
    const offset = index * 6;
    values.push(
      row.id_estudiante,
      row.id_equipo,
      row.id_fecha,
      row.hora_entrada,
      row.hora_salida,
      row.duracion_minutos
    );

    return `($${offset + 1},$${offset + 2},$${offset + 3},$${offset + 4},$${offset + 5},$${offset + 6})`;
  });

  await client.query(
    `
    INSERT INTO fact_uso_laboratorio (
      id_estudiante,
      id_equipo,
      id_fecha,
      hora_entrada,
      hora_salida,
      duracion_minutos
    )
    VALUES ${placeholders.join(',')}
    `,
    values
  );
};
