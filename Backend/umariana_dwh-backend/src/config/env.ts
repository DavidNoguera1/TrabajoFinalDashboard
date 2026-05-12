import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const appConfig = {
  port: toNumber(process.env.PORT, 3003),
  academicApiBaseUrl: process.env.ACADEMIC_API_BASE_URL || 'http://localhost:3000/api',
  libraryApiBaseUrl: process.env.LIBRARY_API_BASE_URL || 'http://localhost:3001/api/recursos',
  labsDataDir:
    process.env.LABS_DATA_DIR ||
    path.resolve(process.cwd(), '..', 'backend-labs', 'extractor-csv-laboratorios', 'data', 'clean')
};
