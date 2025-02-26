import { sequelize } from '../lib/sequelize.js';

export const rollback = async () => {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await queryInterface.dropTable('Letters');
    await queryInterface.dropTable('Correspondences');
    await queryInterface.dropTable('People');
    console.log('Rollback completed!');
  } catch (error) {
    console.error('Rollback failed:', error);
  }
};

rollback();
