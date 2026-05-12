import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import academicRoutes from './routes/academic.routes';
import { testNeonConnection } from './config/database';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Academic Backend activo' });
});

app.use('/api', academicRoutes);

app.use(errorHandler);

const bootstrap = async (): Promise<void> => {
  await testNeonConnection();

  app.listen(PORT, () => {
    console.log(`Academic Backend running at http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('No fue posible iniciar el servidor', error);
  process.exit(1);
});