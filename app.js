import express from 'express';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api.routes.js';
import { verificarToken } from './middlewares/auth.middleware.js';
import { Tablero, Lista, Tarjeta, Usuario } from './models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/sequelize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // Habilitar la lectura de cookies
app.use(express.static('public'));

// Enrutador Principal de la APIREST
app.use('/api', apiRoutes);

// Servir GSAP desde node_modules
app.use('/gsap', express.static(path.join(__dirname, 'node_modules', 'gsap')));

// Motor de plantillas Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    length:     arr => Array.isArray(arr) ? arr.length : 0,
    eq:         (a, b) => a === b,
    formatDate: s => s ? s.split('-').reverse().join('/') : ''
  }
}));

app.set('view engine', 'hbs');

// ── Rutas de Vistas GET ─────────────────────────────
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Usar verificarToken restringe el acceso solo para autenticados
app.get('/dashboard', verificarToken, async (req, res) => {
  try {
    // Conseguir datos *reales* usando Sequelize (Requisito HU-07)
    const tablerosDB = await Tablero.findAll({
      where: { usuarioId: req.usuario.id },
      include: [
        {
          model: Lista,
          include: [{
            model: Tarjeta,
          }]
        }
      ]
    });

    // Mapear el estricto formato de Sequelize al formato esperado por la plantilla HBS original
    const boards = tablerosDB.map(t => {
      const tab = t.get({ plain: true });
      return {
        id: tab.id,
        name: tab.nombre,
        lists: tab.Listas ? tab.Listas.map(l => ({
          id: l.id,
          name: l.nombre,
          cards: l.Tarjetas || []
        })) : []
      };
    });

    res.render('dashboard', { boards, user: req.usuario });
  } catch (err) {
    console.error('Error al cargar dashboard en DB:', err);
    res.status(500).send('Error interno cargando sus datos');
  }
});

// Sincronizar Sequelize e Iniciar app
sequelize.sync({ alter: true }).then(() => {
  console.log('Base de Datos PostgreSQL Sincronizada y Alterada.');
  app.listen(port, () => {
    console.log(`KanbanPro escuchando en http://localhost:${port}`);
  });
}).catch(err => {
  console.error("Error sincronizando BD:", err);
});