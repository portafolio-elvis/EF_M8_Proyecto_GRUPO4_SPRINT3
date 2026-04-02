import Usuario from './Usuario.js'
import Tablero from './Tablero.js'
import Lista from './Lista.js'
import Tarjeta from './Tarjeta.js'

/* relaciones */

Usuario.hasMany(Tablero, { foreignKey: 'usuarioId' })
Tablero.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Tablero.hasMany(Lista, { foreignKey: 'tableroId' })
Lista.belongsTo(Tablero, { foreignKey: 'tableroId' })

Lista.hasMany(Tarjeta, { foreignKey: 'listaId' })
Tarjeta.belongsTo(Lista, { foreignKey: 'listaId' })

export { Usuario, Tablero, Lista, Tarjeta }