import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const Environment = {
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: process.env.DATABASE_PORT || 5432,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'root',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'root',
  DATABASE_NAME: process.env.DATABASE_NAME || 'teraflex',
  DATABASE_SSL: process.env.DATABASE_SSL || false,
  JWT_SECRETKEY: process.env.JWT_SECRETKEY,
  PUBLIC_DIR: process.env.PUBLIC_DIR || './src/public',
  FILE_SIZE: process.env.FILE_SIZE || 20,
  FIREBASE_CONFIG:
    process.env.FIREBASE_CONFIG ||
    path.join(__dirname, '../../../firebase.json'),
  CORS: process.env.CORS || '*',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  ADMIN_USER: process.env.ADMIN_USER || '1234567890',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '12345',
};
