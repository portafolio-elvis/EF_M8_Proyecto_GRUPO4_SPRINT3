import { Tarjeta, Lista, Tablero } from '../models/index.js';

// Verificación auxiliar
const checkUserAccess = async (listaId, usuarioId) => {
  const lista = await Lista.findByPk(listaId, { include: Tablero });
  if (!lista || lista.Tablero.usuarioId !== usuarioId) return null;
  return lista;
};

export const createTarjeta = async (req, res) => {
  try {
    const { listaId } = req.params;
    const { titulo, descripcion, prioridad, tag, estado, fecha_inicio, fecha_fin, autor, responsable } = req.body;

    const lista = await checkUserAccess(listaId, req.usuario.id);
    if (!lista) return res.status(404).json({ error: 'Lista no encontrada o sin acceso' });

    const nuevaTarjeta = await Tarjeta.create({
      titulo,
      descripcion,
      prioridad,
      tag,
      estado: estado || lista.estado,
      fecha_creacion: new Date(),
      fecha_inicio,
      fecha_fin,
      autor,
      responsable,
      listaId
    });

    res.status(201).json(nuevaTarjeta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la tarjeta' });
  }
};

export const updateTarjeta = async (req, res) => {
  try {
    const { listaId, tarjetaId } = req.params;
    const { titulo, descripcion, prioridad, tag, estado, fecha_inicio, fecha_fin, autor, responsable } = req.body;

    const lista = await checkUserAccess(listaId, req.usuario.id);
    if (!lista) return res.status(404).json({ error: 'No autorizado' });

    const tarjeta = await Tarjeta.findOne({ where: { id: tarjetaId, listaId } });
    if (!tarjeta) return res.status(404).json({ error: 'Tarjeta no encontrada' });

    await tarjeta.update({
      titulo, descripcion, prioridad, tag, estado, fecha_inicio, fecha_fin, autor, responsable
    });

    res.json(tarjeta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar tarjeta' });
  }
};

export const moveTarjeta = async (req, res) => {
  try {
    // Para mover necesitamos lista destino
    const { listaId: toListId, tarjetaId } = req.params; 
    
    // Y debemos validar el acceso
    const listaDestino = await checkUserAccess(toListId, req.usuario.id);
    if (!listaDestino) return res.status(404).json({ error: 'Lista destino no autorizada' });

    // La tarjeta puede venir de otra lista, la buscamos globalmente por el usuario logeado (asegurándonos con joins)
    const tarjeta = await Tarjeta.findOne({
      where: { id: tarjetaId },
      include: {
        model: Lista,
        include: { model: Tablero, where: { usuarioId: req.usuario.id } }
      }
    });

    if (!tarjeta) return res.status(404).json({ error: 'Tarjeta no encontrada' });

    await tarjeta.update({
      listaId: toListId,
      estado: listaDestino.estado // Actualiza el estado al de la nueva lista!
    });

    res.json({ ok: true, message: 'Movimiento exitoso', tarjeta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al mover tarjeta' });
  }
};

export const deleteTarjeta = async (req, res) => {
  try {
    const { listaId, tarjetaId } = req.params;
    
    const lista = await checkUserAccess(listaId, req.usuario.id);
    if (!lista) return res.status(404).json({ error: 'No autorizado' });

    const tarjeta = await Tarjeta.findOne({ where: { id: tarjetaId, listaId } });
    if (!tarjeta) return res.status(404).json({ error: 'Tarjeta no encontrada' });

    await tarjeta.destroy();
    res.json({ message: 'Tarjeta eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar tarjeta' });
  }
};
