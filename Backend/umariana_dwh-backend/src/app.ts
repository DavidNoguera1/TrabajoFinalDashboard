import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import dashboardRoutes from './routes/dashboard.routes';
import pipelineRoutes from './routes/pipeline.routes';
import { testNeonConnection } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import { appConfig } from './config/env';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'UMariana DWH Backend activo' });
});

app.get('/health', async (_req, res, next) => {
  try {
    await testNeonConnection();
    res.status(200).json({ success: true, message: 'Conexion DWH OK' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/pipelines', pipelineRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const bootstrap = async (): Promise<void> => {
  await testNeonConnection();

  app.listen(appConfig.port, () => {
    console.log(`UMariana DWH Backend running at http://localhost:${appConfig.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('No fue posible iniciar el servidor', error);
  process.exit(1);
});
