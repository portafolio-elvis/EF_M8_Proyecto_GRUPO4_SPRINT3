import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Usuario = sequelize.define('Usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  rol: {
    type: DataTypes.STRING,
    defaultValue: 'usuario'
  }
})

export default Usuario;