import { neonPool } from '../config/database';
import {
  Estudiante,
  Asignatura,
  Curso,
  Matricula,
  Calificacion,
  Asistencia
} from '../models/academic.model';

export const getAllEstudiantes = async (): Promise<Estudiante[]> => {
  const result = await neonPool.query('SELECT * FROM estudiante');
  return result.rows;
};

export const getAllAsignaturas = async (): Promise<Asignatura[]> => {
  const result = await neonPool.query('SELECT * FROM asignatura');
  return result.rows;
};

export const getAllCursos = async (): Promise<Curso[]> => {
  const result = await neonPool.query('SELECT * FROM curso');
  return result.rows;
};

export const getAllMatriculas = async (): Promise<Matricula[]> => {
  const result = await neonPool.query('SELECT * FROM matricula');
  return result.rows;
};

export const getAllCalificaciones = async (): Promise<Calificacion[]> => {
  const result = await neonPool.query('SELECT * FROM calificacion');
  return result.rows;
};

export const getAllAsistencias = async (): Promise<Asistencia[]> => {
  const result = await neonPool.query('SELECT * FROM asistencia');
  return result.rows;
};
