import sequelize from './config/sequelize.js'
import { Usuario, Tablero, Lista, Tarjeta } from './models/index.js'

async function main() {
  try {

    /* =========================
       CONEXIÓN A BASE DE DATOS
    ========================== */
    console.log("🔌 Conectando a la base de datos...")
    await sequelize.authenticate()
    console.log("✅ Conexión exitosa")

    /* =========================
       CREACIÓN DE TABLAS
    ========================== */
    console.log("🧱 Creando tablas...")
    await sequelize.sync({ force: true })
    console.log("✅ Tablas creadas correctamente")


    /* =========================
       CREAR USUARIOS
    ========================== */
    console.log("👤 Creando usuarios...")

    const usuario1 = await Usuario.create({
      nombre: "Ana",
      email: "ana@email.com"
    })

    const usuario2 = await Usuario.create({
      nombre: "Luis",
      email: "luis@email.com"
    })

    console.table([
      usuario1.toJSON(),
      usuario2.toJSON()
    ])


    /* =========================
       CREAR TABLEROS
    ========================== */
    console.log("📋 Creando tableros...")

    const tablero1 = await usuario1.createTablero({
      nombre: "Proyecto Web",
      descripcion: "Desarrollo sitio web"
    })

    const tablero2 = await usuario1.createTablero({
      nombre: "Proyecto Backend",
      descripcion: "API Node"
    })

    const tablero3 = await usuario2.createTablero({
      nombre: "Tareas Personales",
      descripcion: "Organización personal"
    })

    console.table([
      tablero1.toJSON(),
      tablero2.toJSON(),
      tablero3.toJSON()
    ])


    /* =========================
       CREAR LISTAS
    ========================== */
    console.log("📑 Creando listas...")

    const lista1 = await tablero1.createLista({
      nombre: "Pendiente"
    })

    const lista2 = await tablero1.createLista({
      nombre: "En progreso"
    })

    const lista3 = await tablero2.createLista({
      nombre: "Terminado"
    })

    console.table([
      lista1.toJSON(),
      lista2.toJSON(),
      lista3.toJSON()
    ])


    /* =========================
       CREAR TARJETAS
    ========================== */
    console.log("🃏 Creando tarjetas...")

    const tarjeta1 = await lista1.createTarjeta({
      titulo: "Diseñar UI",
      descripcion: "Crear diseño inicial",
      estado: "Pendiente"
    })

    const tarjeta2 = await lista2.createTarjeta({
      titulo: "Crear API",
      descripcion: "Endpoints con Express",
      estado: "En progreso"
    })

    const tarjeta3 = await lista1.createTarjeta({
      titulo: "Subir proyecto",
      descripcion: "Deploy en servidor",
      estado: "Pendiente"
    })

    console.table([
      tarjeta1.toJSON(),
      tarjeta2.toJSON(),
      tarjeta3.toJSON()
    ])


    /* =========================
       FINALIZACIÓN
    ========================== */
    console.log("🌱 Base de datos creada y poblada correctamente")

    await sequelize.close()

  } catch (error) {
    console.error("❌ Error:", error)
  }
}

main()