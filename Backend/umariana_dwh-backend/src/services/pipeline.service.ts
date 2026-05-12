import {
  insertFactAcademico,
  insertFactBiblioteca,
  insertFactLaboratorio,
  truncateReloadableFacts,
  upsertDimAsignaturas,
  upsertDimEquipos,
  upsertDimEstudiantes,
  upsertDimTiempo,
  withTransaction
} from '../repositories/dwh.repository';
import { fetchAcademicData, fetchLaboratoryData, fetchLibraryResources } from './sources.service';
import { DimEquipoRow, FactAcademicoRow, FactBibliotecaRow, FactLaboratorioRow } from '../models/dwh.model';
import { AccesoLaboratorio, Asistencia, Curso, Matricula, RecursoBiblioteca } from '../models/source.model';
import { calculateDurationMinutes, parseFlexibleIsoDate, parseFlexibleTime, toIsoDate } from '../utils/date';

const normalizeDocument = (value: string | null | undefined): string => String(value || '').replace(/\D/g, '');

const groupAsistenciasByMatricula = (asistencias: Asistencia[]): Map<number, Asistencia[]> => {
  const map = new Map<number, Asistencia[]>();

  for (const asistencia of asistencias) {
    const current = map.get(asistencia.id_matricula) || [];
    current.push(asistencia);
    map.set(asistencia.id_matricula, current);
  }

  return map;
};

const buildFactAcademico = (
  matriculas: Matricula[],
  cursosById: Map<number, Curso>,
  calificacionesByMatricula: Map<number, { seguimiento_1: number | null; seguimiento_2: number | null; seguimiento_3: number | null; nota_final: number | null }>,
  asistenciasByMatricula: Map<number, Asistencia[]>
): FactAcademicoRow[] => {
  const result: FactAcademicoRow[] = [];

  for (const matricula of matriculas) {
    const curso = cursosById.get(matricula.id_curso);
    if (!curso) {
      continue;
    }

    const calificacion = calificacionesByMatricula.get(matricula.id_matricula);
    const asistencias = asistenciasByMatricula.get(matricula.id_matricula) || [];

    for (const asistencia of asistencias) {
      result.push({
        id_estudiante: matricula.numero_documento,
        codigo_asignatura: curso.codigo_asignatura,
        id_fecha: toIsoDate(asistencia.fecha_clase),
        id_curso: curso.id_curso,
        docente_asignado: curso.docente_asignado,
        asistio: asistencia.estado_asistencia,
        nota_seguimiento_1: calificacion?.seguimiento_1 ?? null,
        nota_seguimiento_2: calificacion?.seguimiento_2 ?? null,
        nota_seguimiento_3: calificacion?.seguimiento_3 ?? null,
        nota_final: calificacion?.nota_final ?? null
      });
    }
  }

  return result;
};

const pushBibliotecaRow = (
  rows: FactBibliotecaRow[],
  payload: {
    id_estudiante: string;
    id_fecha: string | null;
    tipo_interaccion: string;
    recurso_id: string;
    cantidad_articulos: number;
    horas_lectura_acumuladas: number;
  },
  fallbackDate: string
): string => {
  const id_fecha = payload.id_fecha || fallbackDate;
  rows.push({
    id_estudiante: payload.id_estudiante,
    id_fecha,
    tipo_interaccion: payload.tipo_interaccion,
    recurso_id: payload.recurso_id,
    cantidad_articulos: payload.cantidad_articulos,
    horas_lectura_acumuladas: payload.horas_lectura_acumuladas
  });
  return id_fecha;
};

const buildNivelActividadByStudent = (resources: RecursoBiblioteca[]): Map<string, string> => {
  const map = new Map<string, string>();

  for (const row of resources) {
    const document = normalizeDocument(row.numero_documento);
    const nivel = row.metricas_globales?.nivel_actividad?.trim();

    if (document && nivel) {
      map.set(document, nivel);
    }
  }

  return map;
};

const buildFactBiblioteca = (
  resources: RecursoBiblioteca[],
  snapshotDate: string
): { rows: FactBibliotecaRow[]; dates: Set<string> } => {
  const rows: FactBibliotecaRow[] = [];
  const dates = new Set<string>();

  for (const student of resources) {
    const document = normalizeDocument(student.numero_documento);
    if (!document) {
      continue;
    }

    let lastKnownDate: string | null = null;

    for (const [index, prestamo] of (student.historial_prestamos_fisicos || []).entries()) {
      const parsedDate = parseFlexibleIsoDate(prestamo.fecha_prestamo || prestamo.fecha_devolucion || null);
      const idFecha = pushBibliotecaRow(
        rows,
        {
          id_estudiante: document,
          id_fecha: parsedDate,
          tipo_interaccion: `prestamo_fisico:${(prestamo.estado || 'desconocido').toLowerCase()}`,
          recurso_id: prestamo.id_libro || `LIBRO-${document}-${index + 1}`,
          cantidad_articulos: 1,
          horas_lectura_acumuladas: 0
        },
        snapshotDate
      );

      dates.add(idFecha);
      lastKnownDate = idFecha;
    }

    for (const [index, acceso] of (student.accesos_bases_datos_cientificas || []).entries()) {
      const parsedDate = parseFlexibleIsoDate(acceso.fecha_acceso || null);
      const plataforma = (acceso.plataforma || 'desconocida').toLowerCase();
      const rawArticles = Number(acceso.articulos_consultados || 0);
      const articles = Number.isFinite(rawArticles) ? Math.max(0, Math.trunc(rawArticles)) : 0;
      const idFecha = pushBibliotecaRow(
        rows,
        {
          id_estudiante: document,
          id_fecha: parsedDate,
          tipo_interaccion: `acceso_bd:${plataforma}`,
          recurso_id: `BD-${plataforma.toUpperCase()}-${index + 1}`,
          cantidad_articulos: articles,
          horas_lectura_acumuladas: 0
        },
        snapshotDate
      );

      dates.add(idFecha);
      lastKnownDate = idFecha;
    }

    for (const [index, descarga] of (student.descargas_material_estudio || []).entries()) {
      const parsedDate = parseFlexibleIsoDate(descarga.fecha_descarga || null);
      const tipoMaterial = (descarga.tipo_material || 'material').toLowerCase();
      const idFecha = pushBibliotecaRow(
        rows,
        {
          id_estudiante: document,
          id_fecha: parsedDate,
          tipo_interaccion: `descarga:${tipoMaterial}`,
          recurso_id: descarga.recurso_id || `DESCARGA-${document}-${index + 1}`,
          cantidad_articulos: 1,
          horas_lectura_acumuladas: 0
        },
        snapshotDate
      );

      dates.add(idFecha);
      lastKnownDate = idFecha;
    }

    const totalHoras = student.metricas_globales?.total_horas_lectura_digital;
    if (typeof totalHoras === 'number' && Number.isFinite(totalHoras)) {
      const idFecha = pushBibliotecaRow(
        rows,
        {
          id_estudiante: document,
          id_fecha: lastKnownDate || snapshotDate,
          tipo_interaccion: 'metrica_global:lectura_digital',
          recurso_id: 'TOTAL_LECTURA_DIGITAL',
          cantidad_articulos: 0,
          horas_lectura_acumuladas: totalHoras
        },
        snapshotDate
      );

      dates.add(idFecha);
    }
  }

  return { rows, dates };
};

const buildLaboratoryFacts = (
  labRows: AccesoLaboratorio[]
): { equipos: DimEquipoRow[]; facts: FactLaboratorioRow[]; dates: Set<string> } => {
  const equipoMap = new Map<string, string | null>();
  const facts: FactLaboratorioRow[] = [];
  const dates = new Set<string>();

  for (const row of labRows) {
    const document = normalizeDocument(row.numero_documento);
    const equipo = String(row.equipo_utilizado || '').trim().toUpperCase();
    const fecha = parseFlexibleIsoDate(row.fecha);

    if (!document || !equipo || !fecha) {
      continue;
    }

    if (!equipoMap.has(equipo) || (row.descripcion_equipo && row.descripcion_equipo.trim())) {
      equipoMap.set(equipo, row.descripcion_equipo?.trim() || null);
    }

    const horaEntrada = parseFlexibleTime(row.hora_entrada);
    const horaSalida = parseFlexibleTime(row.hora_salida);
    const duracion = calculateDurationMinutes(horaEntrada, horaSalida);

    facts.push({
      id_estudiante: document,
      id_equipo: equipo,
      id_fecha: fecha,
      hora_entrada: horaEntrada,
      hora_salida: horaSalida,
      duracion_minutos: duracion
    });
    dates.add(fecha);
  }

  const equipos: DimEquipoRow[] = [...equipoMap.entries()].map(([id_equipo, descripcion_equipo]) => ({
    id_equipo,
    descripcion_equipo
  }));

  return { equipos, facts, dates };
};

export const runDescargaInicial = async (): Promise<{
  dimensiones: {
    estudiantes: number;
    asignaturas: number;
    fechas: number;
    equipos_laboratorio: number;
  };
  hechos: {
    academico: number;
    biblioteca: number;
    laboratorio: number;
  };
}> => {
  const [academicData, libraryData, laboratoryData] = await Promise.all([
    fetchAcademicData(),
    fetchLibraryResources(),
    fetchLaboratoryData()
  ]);

  const cursosById = new Map(academicData.cursos.map((row) => [row.id_curso, row]));
  const calificacionesByMatricula = new Map(
    academicData.calificaciones.map((row) => [
      row.id_matricula,
      {
        seguimiento_1: row.seguimiento_1,
        seguimiento_2: row.seguimiento_2,
        seguimiento_3: row.seguimiento_3,
        nota_final: row.nota_final
      }
    ])
  );

  const factAcademico = buildFactAcademico(
    academicData.matriculas,
    cursosById,
    calificacionesByMatricula,
    groupAsistenciasByMatricula(academicData.asistencias)
  );

  const snapshotDate = toIsoDate(new Date());
  const factBibliotecaPayload = buildFactBiblioteca(libraryData, snapshotDate);
  const laboratorioPayload = buildLaboratoryFacts(laboratoryData);
  const nivelActividadByStudent = buildNivelActividadByStudent(libraryData);

  const allIsoDates = new Set<string>([snapshotDate]);
  for (const row of factAcademico) {
    if (row.id_fecha) {
      allIsoDates.add(row.id_fecha);
    }
  }
  for (const date of factBibliotecaPayload.dates) {
    allIsoDates.add(date);
  }
  for (const date of laboratorioPayload.dates) {
    allIsoDates.add(date);
  }

  await withTransaction(async (client) => {
    await truncateReloadableFacts(client);
    await upsertDimEstudiantes(client, academicData.estudiantes, nivelActividadByStudent);
    await upsertDimAsignaturas(client, academicData.asignaturas);
    await upsertDimTiempo(client, [...allIsoDates]);
    await upsertDimEquipos(client, laboratorioPayload.equipos);
    await insertFactAcademico(client, factAcademico);
    await insertFactBiblioteca(client, factBibliotecaPayload.rows);
    await insertFactLaboratorio(client, laboratorioPayload.facts);
  });

  return {
    dimensiones: {
      estudiantes: academicData.estudiantes.length,
      asignaturas: academicData.asignaturas.length,
      fechas: allIsoDates.size,
      equipos_laboratorio: laboratorioPayload.equipos.length
    },
    hechos: {
      academico: factAcademico.length,
      biblioteca: factBibliotecaPayload.rows.length,
      laboratorio: laboratorioPayload.facts.length
    }
  };
};
