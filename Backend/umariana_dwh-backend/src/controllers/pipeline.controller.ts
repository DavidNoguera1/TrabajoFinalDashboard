import { NextFunction, Request, Response } from 'express';
import { runDescargaInicial } from '../services/pipeline.service';

export const descargaInicial = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const resumen = await runDescargaInicial();
    res.status(200).json({
      success: true,
      message: 'Pipeline descarga_inicial ejecutada correctamente',
      data: resumen
    });
  } catch (error) {
    next(error);
  }
};
