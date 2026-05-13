import { NextFunction, Request, Response } from 'express';
import * as academicRepository from '../repositories/academic.repository';

export const getEstudiantes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await academicRepository.getAllEstudiantes();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAsignaturas = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await academicRepository.getAllAsignaturas();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCursos = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await academicRepository.getAllCursos();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMatriculas = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await academicRepository.getAllMatriculas();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCalificaciones = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await academicRepository.getAllCalificaciones();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAsistencias = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await academicRepository.getAllAsistencias();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
