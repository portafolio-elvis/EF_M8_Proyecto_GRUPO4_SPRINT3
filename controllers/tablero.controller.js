import { Tablero, Lista, Tarjeta } from '../models/index.js';

export const getTableros = async (req, res) => {
  try {
    const tableros = await Tablero.findAll({
      where: { usuarioId: req.usuario.id },
      include: [
        {
          model: Lista,
          include: [Tarjeta],
          order: [['id', 'ASC']] // Listas ordenadas
        }
      ],
      order: [['id', 'ASC']]
    });
    res.json(tableros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tableros' });
  }
};

export const createTablero = async (req, res) => {
  try {
    const { titulo } = req.body;
    if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });

    const nuevoTablero = await Tablero.create({
      titulo,
      usuarioId: req.usuario.id
    });
    res.status(201).json(nuevoTablero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear tablero' });
  }
};

export const updateTablero = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo } = req.body;

    const tablero = await Tablero.findOne({ where: { id, usuarioId: req.usuario.id } });
    if (!tablero) return res.status(404).json({ error: 'Tablero no encontrado' });

    tablero.titulo = titulo || tablero.titulo;
    await tablero.save();

    res.json(tablero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar tablero' });
  }
};

export const deleteTablero = async (req, res) => {
  try {
    const { id } = req.params;
    const tablero = await Tablero.findOne({ where: { id, usuarioId: req.usuario.id } });
    if (!tablero) return res.status(404).json({ error: 'Tablero no encontrado' });

    await tablero.destroy();
    res.json({ message: 'Tablero eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar tablero' });
  }
};
