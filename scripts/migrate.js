const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/sequelize');

const migrate = async () => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.createTable('People', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  });

  await queryInterface.createTable('Correspondences', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    personId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'People', key: 'id' },
    },
    reason: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  });

  await queryInterface.createTable('Letters', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    correspondenceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Correspondences', key: 'id' },
    },
    type: { type: DataTypes.ENUM('sent', 'received'), allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  });

  console.log('Migration completed!');
};

migrate().catch((error) => {
  console.error('Migration failed:', error);
});
