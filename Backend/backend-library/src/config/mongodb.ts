import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectMongoDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI no esta definida en .env');
  }

  await mongoose.connect(mongoUri);
  console.log(`MongoDB conectado (${process.env.MONGODB_DB_NAME ?? 'database por defecto'})`);
};
