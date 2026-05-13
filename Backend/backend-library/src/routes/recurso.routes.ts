import { Router } from 'express';
import * as recursoController from '../controllers/recurso.controller';

const recursoRoutes = Router();

recursoRoutes.get('/', recursoController.getRecursos);
recursoRoutes.get('/:id', recursoController.getRecursoById);
recursoRoutes.post('/', recursoController.createRecurso);
recursoRoutes.put('/:id', recursoController.updateRecurso);
recursoRoutes.delete('/:id', recursoController.deleteRecurso);

export default recursoRoutes;
