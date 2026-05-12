import RecursoModel from './mongo-recurso.model';
import { IRecurso } from '../models/recurso.model';

export const getAllRecursos = async () => RecursoModel.find();

export const getRecursoById = async (id: string) => RecursoModel.findById(id);

export const createRecurso = async (payload: IRecurso) => RecursoModel.create(payload);

export const updateRecurso = async (id: string, payload: Partial<IRecurso>) =>
  RecursoModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

export const deleteRecurso = async (id: string) => RecursoModel.findByIdAndDelete(id);
