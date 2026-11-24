import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Meeting = sequelize.define('Meeting', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, validate: { isEmail: true } },
  slotTime: { type: DataTypes.STRING(20), allowNull: false },
  meetingLink: { type: DataTypes.STRING(500), allowNull: false },
  status: { type: DataTypes.ENUM('scheduled', 'cancelled'), allowNull: false, defaultValue: 'scheduled' }
}, {
  tableName: 'meetings',
  timestamps: true
});

export default Meeting;
