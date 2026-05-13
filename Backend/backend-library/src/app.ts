import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import recursoRoutes from './routes/recurso.routes';
import { connectMongoDB } from './config/mongodb';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Library Backend activo' });
});

app.use('/api/recursos', recursoRoutes);

app.use(errorHandler);

const bootstrap = async (): Promise<void> => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Library Backend running at http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('No fue posible iniciar el servidor', error);
  process.exit(1);
});
