const Estudiante = require("../models/Estudiante");
const moment = require("moment-timezone");

async function processMsg(nuip) {
  try {
    const usuarioRegistro = "Sistema";
    const estudiante = await Estudiante.findOne({ NUIP: nuip });

    if (!estudiante) {
      console.log("Estudiante no encontrado.");
      return;
    }

    const { horaIngreso, horaSalida } = estudiante.datosIE[0];

    const horaActual = moment().tz("America/Bogota"); // Obtener la hora actual en la zona horaria de Bogotá

    const rangoInferiorIngreso = moment(horaIngreso, "HH:mm").subtract(
      30,
      "minutes"
    );
    const rangoSuperiorIngreso = moment(horaIngreso, "HH:mm").add(
      30,
      "minutes"
    );

    const rangoInferiorSalida = moment(horaSalida, "HH:mm").subtract(
      30,
      "minutes"
    );
    const rangoSuperiorSalida = moment(horaSalida, "HH:mm").add(30, "minutes");

    const nuevoRegistro = {
      fecha: horaActual.format(),
      notificacion: false,
      usuario: usuarioRegistro,
    };

    if (
      horaActual.isBetween(
        rangoInferiorIngreso,
        rangoSuperiorIngreso,
        null,
        "[]"
      )
    ) {
      nuevoRegistro.tipo = "Ingreso";
    } else if (
      horaActual.isBetween(rangoInferiorSalida, rangoSuperiorSalida, null, "[]")
    ) {
      nuevoRegistro.tipo = "Salida";
    } else {
      nuevoRegistro.tipo = "Fuera de horario";
    }

    estudiante.registros.push(nuevoRegistro);
    await estudiante.save();
    console.log("Registro exitoso.");
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
}

module.exports = { processMsg };
