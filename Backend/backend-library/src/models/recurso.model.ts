import { Document } from 'mongoose';

export interface IRecurso {
  titulo: string;
  autor: string;
  tipo: string;
  anio: number;
  disponibilidad: boolean;
}

export interface IRecursoDocument extends IRecurso, Document {}
