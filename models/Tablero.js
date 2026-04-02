import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Tablero = sequelize.define('Tableros', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  }
})

export default Tablero;