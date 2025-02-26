import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    logging: console.log,
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Successfully connected to the database.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database.', err);
  });

export { sequelize };
