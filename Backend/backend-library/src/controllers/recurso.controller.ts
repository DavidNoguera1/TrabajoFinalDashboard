import { NextFunction, Request, Response } from 'express';
import * as recursoRepository from '../repositories/recurso.repository';

const getParamId = (value: string | string[] | undefined): string => {
  if (!value) {
    return '';
  }

  return Array.isArray(value) ? value[0] : value;
};

export const getRecursos = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await recursoRepository.getAllRecursos();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRecursoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParamId(req.params.id);
    const data = await recursoRepository.getRecursoById(id);

    if (!data) {
      res.status(404).json({ success: false, message: 'Recurso no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createRecurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await recursoRepository.createRecurso(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateRecurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParamId(req.params.id);
    const data = await recursoRepository.updateRecurso(id, req.body);

    if (!data) {
      res.status(404).json({ success: false, message: 'Recurso no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteRecurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParamId(req.params.id);
    const data = await recursoRepository.deleteRecurso(id);

    if (!data) {
      res.status(404).json({ success: false, message: 'Recurso no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Recurso eliminado' });
  } catch (error) {
    next(error);
  }
};
