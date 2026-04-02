import jwt from 'jsonwebtoken';

const SECRET = 'super_secreto'; // En producción, usar variables de entorno

export const verificarToken = (req, res, next) => {
  // Buscar el token primariamente en las cookies, o en el header Authorization (para pruebas en Postman)
  let token = req.cookies?.token;
  
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // Si es una petición a la API, retornamos un JSON
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ ok: false, error: 'Acceso denegado. Token requerido.' });
    }
    // Si es una vista, redirigir al login
    return res.redirect('/login');
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.usuario = payload; // Adjuntamos los datos del usuario a la request
    next();
  } catch (error) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(403).json({ ok: false, error: 'Token inválido o expirado.' });
    }
    res.clearCookie('token');
    return res.redirect('/login');
  }
};
