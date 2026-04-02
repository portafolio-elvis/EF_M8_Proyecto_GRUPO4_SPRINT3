import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Lista = sequelize.define('Listas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Lista;