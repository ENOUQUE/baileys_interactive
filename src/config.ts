import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? '8787', 10),
  apiKey: process.env.API_KEY ?? 'ACFH4RFOTME4RU50R4FKGNW34LDFG8DSQ',
  authFolder: process.env.AUTH_FOLDER ?? 'auth',
  evolutionApiPath: process.env.EVOLUTION_API_PATH 
    ? path.resolve(process.cwd(), process.env.EVOLUTION_API_PATH)
    : path.resolve(process.cwd(), '../../../ap.api/evolution-api'),
  evolutionApiUrl: process.env.EVOLUTION_API_URL ?? 'http://localhost:8080',
  evolutionApiKey: process.env.EVOLUTION_API_KEY ?? '429683C4C977415CAAFCCE10F7D57E11',
  limits: {
    maxButtons: 3,
    maxCarouselCards: 10,
    maxListSections: 10,
    maxListRowsPerSection: 10,
    maxPollOptions: 12,
  },
} as const;

export type Config = typeof config;
