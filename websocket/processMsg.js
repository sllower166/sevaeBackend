const Estudiante = require("../models/Estudiante");
const SchoolParams = require("../models/SchoolParams");

async function processMsg(nuip) {
  try {
    const usuarioRegistro = "Sistema";
    const estudiante = await Estudiante.findOne({ NUIP: nuip });

    if (!estudiante) {
      console.log("Estudiante no encontrado.");
      return;
    }

    const horaActual = new Date().getHours();
    const offset = -5 * 60 * 60 * 1000;

    const { horaIngreso, horaSalida } = estudiante.datosIE[0];

    const horaIngresoDate = new Date();
    horaIngresoDate.setHours(
      parseInt(horaIngreso.split(":")[0]),
      parseInt(horaIngreso.split(":")[1]),
      0
    );

    const horaSalidaDate = new Date();
    horaSalidaDate.setHours(
      parseInt(horaSalida.split(":")[0]),
      parseInt(horaSalida.split(":")[1]),
      0
    );

    const rangoInferiorIngreso = new Date(
      horaIngresoDate.getTime() - 30 * 60000
    );
    const rangoSuperiorIngreso = new Date(
      horaIngresoDate.getTime() + 30 * 60000
    );

    const rangoInferiorSalida = new Date(horaSalidaDate.getTime() - 30 * 60000);
    const rangoSuperiorSalida = new Date(horaSalidaDate.getTime() + 30 * 60000);

    const nuevoRegistro = {
      fecha: new Date(Date.now() + offset),
      notificacion: false,
      tipo: "",
      notificacion: false,
      usuario: usuarioRegistro,
    };

    if (
      horaActual >= rangoInferiorIngreso.getHours() &&
      horaActual <= rangoSuperiorIngreso.getHours()
    ) {
      nuevoRegistro.tipo = "Ingreso";
      estudiante.registros.push(nuevoRegistro);
    } else if (
      horaActual >= rangoInferiorSalida.getHours() &&
      horaActual <= rangoSuperiorSalida.getHours()
    ) {
      nuevoRegistro.tipo = "Salida";
      estudiante.registros.push(nuevoRegistro);
    } else {
      nuevoRegistro.tipo = "Fuera de horario";
      estudiante.registros.push(nuevoRegistro);
    }

    await estudiante.save();
    console.log("Registro exitoso.");
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
}
module.exports = { processMsg };
