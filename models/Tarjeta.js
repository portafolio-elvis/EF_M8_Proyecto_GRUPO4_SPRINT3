import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Tarjeta = sequelize.define('Tarjetas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  prioridad: { type: DataTypes.STRING },
  tag: { type: DataTypes.STRING },
  fecha_inicio: { type: DataTypes.STRING },
  fecha_fin: { type: DataTypes.STRING },
  autor: { type: DataTypes.STRING },
  responsable: { type: DataTypes.STRING },
  estado: {
    type: DataTypes.STRING
  }
})

export default Tarjeta;