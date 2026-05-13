export interface FactAcademicoRow {
  id_estudiante: string;
  codigo_asignatura: string;
  id_fecha: string | null;
  id_curso: number | null;
  docente_asignado: string | null;
  asistio: boolean | null;
  nota_seguimiento_1: number | null;
  nota_seguimiento_2: number | null;
  nota_seguimiento_3: number | null;
  nota_final: number | null;
}

export interface FactBibliotecaRow {
  id_estudiante: string;
  id_fecha: string;
  tipo_interaccion: string;
  recurso_id: string;
  cantidad_articulos: number;
  horas_lectura_acumuladas: number;
}

export interface DimEquipoRow {
  id_equipo: string;
  descripcion_equipo: string | null;
}

export interface FactLaboratorioRow {
  id_estudiante: string;
  id_equipo: string;
  id_fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  duracion_minutos: number | null;
}
