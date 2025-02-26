const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
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

module.exports = { sequelize };
