import { Router } from 'express';
import { descargaInicial } from '../controllers/pipeline.controller';

const router = Router();

router.post('/descarga-inicial', descargaInicial);

export default router;
