import sequelize from './config/sequelize.js'
import { Usuario, Tablero, Lista, Tarjeta } from './models/index.js'

async function testCRUD() {

  try {

    /* =========================
       CONEXIÓN
    ========================= */

    console.log("\n🔌 CONECTANDO A LA BASE DE DATOS")
    await sequelize.authenticate()
    console.log("✅ Conexión exitosa")


    /* =========================
       CREAR
    ========================= */

    console.log("\n🟢 CREAR TARJETA")

    const lista = await Lista.findOne()

    const nuevaTarjeta = await Tarjeta.create({
      titulo: "Tarjeta CRUD",
      descripcion: "Creada desde test-crud",
      estado: "Pendiente",
      listaId: lista.id
    })

    console.table([nuevaTarjeta.toJSON()])


    /* =========================
       LEER TABLERO
    ========================= */

    console.log("\n📖 LEER TABLERO CON LISTAS Y TARJETAS")

    const tablero = await Tablero.findOne({
      include: {
        model: Lista,
        include: Tarjeta
      }
    })

    console.log("\n📋 TABLERO")
    console.table([{
      id: tablero.id,
      nombre: tablero.nombre,
      descripcion: tablero.descripcion
    }])

    console.log("\n📑 LISTAS")

    const listas = tablero.Listas.map(lista => ({
      id: lista.id,
      nombre: lista.nombre,
      tableroId: lista.tableroId
    }))

    console.table(listas)

    console.log("\n🃏 TARJETAS")

    const tarjetas = tablero.Listas.flatMap(lista =>
      lista.Tarjetas.map(t => ({
        id: t.id,
        titulo: t.titulo,
        estado: t.estado,
        listaId: t.listaId
      }))
    )

    console.table(tarjetas)


    /* =========================
       ACTUALIZAR
    ========================= */

    console.log("\n✏️ ACTUALIZAR TARJETA")

    const tarjetaActualizar = await Tarjeta.findOne()

    tarjetaActualizar.titulo = "Tarjeta ACTUALIZADA CRUD"

    await tarjetaActualizar.save()

    console.table([tarjetaActualizar.toJSON()])


    /* =========================
       BORRAR
    ========================= */

    console.log("\n🗑️ BORRAR TARJETA")

    const tarjetaEliminar = await Tarjeta.findOne({
      where: { titulo: "Tarjeta CRUD" }
    })

    if (tarjetaEliminar) {

      const datosEliminados = tarjetaEliminar.toJSON()

      await tarjetaEliminar.destroy()

      console.log("Tarjeta eliminada:")
      console.table([datosEliminados])

    } else {

      console.log("No se encontró tarjeta para eliminar")

    }


    /* =========================
       FINAL
    ========================= */

    console.log("\n🎯 PRUEBAS CRUD FINALIZADAS")

    await sequelize.close()

  } catch (error) {

    console.error("❌ Error:", error)

  }

}

testCRUD()