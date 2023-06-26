// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const Environment = {
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: process.env.DATABASE_PORT || 5432,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'root',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'root',
  DATABASE_NAME: process.env.DATABASE_NAME || 'teraflex',
  DATABASE_SSL: process.env.DATABASE_SSL || false,
};
