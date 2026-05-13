export interface Estudiante {
  numero_documento: string;
  tipo_documento: string;
  nombres: string;
  apellidos: string;
  correo_institucional: string;
  semestre_actual: number | null;
}

export interface Asignatura {
  codigo_asignatura: string;
  nombre_asignatura: string;
  creditos: number | null;
  semestre_plan: number | null;
}

export interface Curso {
  id_curso: number;
  codigo_asignatura: string;
  periodo: string;
  docente_asignado: string;
}

export interface Matricula {
  id_matricula: number;
  numero_documento: string;
  id_curso: number;
}

export interface Calificacion {
  id_matricula: number;
  seguimiento_1: number | null;
  seguimiento_2: number | null;
  seguimiento_3: number | null;
  nota_final: number | null;
}

export interface Asistencia {
  id_asistencia: number;
  id_matricula: number;
  fecha_clase: string;
  estado_asistencia: boolean;
}

export interface PrestamoFisico {
  id_libro?: string;
  titulo?: string;
  fecha_prestamo?: string;
  fecha_devolucion?: string;
  estado?: string;
}

export interface AccesoBaseDatos {
  plataforma?: string;
  fecha_acceso?: string;
  terminos_busqueda?: string[];
  articulos_consultados?: number;
}

export interface DescargaMaterial {
  recurso_id?: string;
  tipo_material?: string;
  asignatura_relacionada?: string;
  fecha_descarga?: string;
}

export interface MetricasBiblioteca {
  total_horas_lectura_digital?: number;
  nivel_actividad?: string;
}

export interface RecursoBiblioteca {
  _id?: string;
  numero_documento: string;
  nombre_estudiante?: string;
  metricas_globales?: MetricasBiblioteca;
  historial_prestamos_fisicos?: PrestamoFisico[];
  accesos_bases_datos_cientificas?: AccesoBaseDatos[];
  descargas_material_estudio?: DescargaMaterial[];
}

export interface AccesoLaboratorio {
  numero_documento: string;
  semestre?: number | null;
  fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  equipo_utilizado: string;
  descripcion_equipo?: string | null;
}
