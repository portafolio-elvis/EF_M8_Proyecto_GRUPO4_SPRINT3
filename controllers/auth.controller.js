import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario, Tablero, Lista, Tarjeta } from '../models/index.js';

const SECRET = 'super_secreto';

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validación básica
  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, error: 'Nombre, Email y password son requeridos' });
  }

  try {
    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ ok: false, error: 'Usuario ya existe con este email' });
    }

    // 🔐 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar en la base de datos
    const newUser = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: 'usuario' // Forzamos el rol "usuario" sin importar si mandan otro desde la vista
    });

    // Sembrar un Tablero por defecto con Listas para usuarios recien creados
    const tablero = await Tablero.create({ nombre: 'Mi Primer Proyecto', usuarioId: newUser.id });
    const lista1 = await Lista.create({ nombre: 'Backlog', tableroId: tablero.id });
    const lista2 = await Lista.create({ nombre: 'En Progreso', tableroId: tablero.id });
    const lista3 = await Lista.create({ nombre: 'Finalizado', tableroId: tablero.id });

    await Tarjeta.create({
      titulo: 'Bienvenida a KanbanPro',
      descripcion: 'Edita esta tarjeta o muévela a otras listas.',
      prioridad: 'Feature',
      tag: 'Feature',
      estado: 'Backlog',
      listaId: lista1.id
    });

    console.log('\n--- Nuevo Usuario Registrado ---');
    console.table([{ 
      ID: newUser.id, 
      Nombre: newUser.nombre, 
      Email: newUser.email, 
      Rol: newUser.rol
    }]);

    res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error del servidor al registrar' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ ok: false, error: 'Usuario no encontrado o Contraseña incorrecta' });
    }

    // 🔑 Comparar password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ ok: false, error: 'Usuario no encontrado o Contraseña incorrecta' });
    }

    // 🎫 Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '1h' }
    );

    // Configurar cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    });

    console.log('\n--- Inicio de Sesión Exitoso ---');
    console.table([{ 
      ID: user.id, 
      Nombre: user.nombre, 
      Email: user.email 
    }]);

    res.json({
      ok: true,
      message: 'Login exitoso',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error del servidor durante el inicio de sesión' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true, message: 'Sesión cerrada correctamente' });
};