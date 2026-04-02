import { Lista, Tablero } from '../models/index.js';

export const createLista = async (req, res) => {
  try {
    const { tableroId } = req.params;
    const { estado } = req.body;
    
    if (!estado) return res.status(400).json({ error: 'El nombre/estado de la lista es obligatorio' });

    // Verificar seguridad: que el tablero exista y pertenezca al usuario logeado
    const tablero = await Tablero.findOne({ where: { id: tableroId, usuarioId: req.usuario.id } });
    if (!tablero) return res.status(404).json({ error: 'Tablero no encontrado o no autorizado' });

    const nuevaLista = await Lista.create({
      estado,
      tableroId
    });

    res.status(201).json(nuevaLista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la lista' });
  }
};

export const updateLista = async (req, res) => {
  try {
    const { tableroId, listaId } = req.params;
    const { estado } = req.body;

    const tablero = await Tablero.findOne({ where: { id: tableroId, usuarioId: req.usuario.id } });
    if (!tablero) return res.status(404).json({ error: 'Tablero no autorizado' });

    const lista = await Lista.findOne({ where: { id: listaId, tableroId } });
    if (!lista) return res.status(404).json({ error: 'Lista no encontrada' });

    lista.estado = estado || lista.estado;
    await lista.save();

    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar lista' });
  }
};

export const deleteLista = async (req, res) => {
  try {
    const { tableroId, listaId } = req.params;

    const tablero = await Tablero.findOne({ where: { id: tableroId, usuarioId: req.usuario.id } });
    if (!tablero) return res.status(404).json({ error: 'Tablero no autorizado' });

    const lista = await Lista.findOne({ where: { id: listaId, tableroId } });
    if (!lista) return res.status(404).json({ error: 'Lista no encontrada' });

    await lista.destroy();
    res.json({ message: 'Lista eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar lista' });
  }
};
