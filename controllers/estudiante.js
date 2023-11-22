const Estudiante = require("../models/Estudiante.js");
const { sendMessageToClients } = require("../websocket/websocket.js");

const crearEstudiante = async (req, res) => {
  try {
    const { nombre, apellidos, NUIP, grado, acudientes, datosIE } = req.body;

    if (!nombre || !apellidos || !NUIP || !grado || !acudientes || !datosIE) {
      return res.status(400).json({
        ok: false,
        msg: "Todos los campos son requeridos.",
      });
    }

    const estudiante = new Estudiante({
      nombre,
      apellidos,
      NUIP,
      grado,
      acudientes,
      datosIE,
    });

    try {
      await estudiante.save();
      res.status(201).json({
        ok: true,
        estudiante,
      });
    } catch (error) {
      if (error.code === 11000) {
        // Error de clave duplicada (NUIP duplicado)
        return res.status(400).json({
          ok: false,
          msg: "El NUIP proporcionado ya está registrado.",
        });
      } else {
        console.error(error);
        res.status(500).json({
          ok: false,
          msg: "Error de servidor",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

const editarEstudiante = async (req, res) => {
  try {
    const estudianteId = req.params.id;
    const { nombre, apellidos, NUIP, grado, acudientes, datosIE } = req.body;

    const estudiante = await Estudiante.findByIdAndUpdate(
      estudianteId,
      {
        nombre,
        apellidos,
        NUIP,
        grado,
        acudientes,
        datosIE,
      },
      {
        new: true,
      }
    );

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      estudiante,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

const eliminarEstudiante = async (req, res) => {
  try {
    const estudianteId = req.params.id;

    const estudiante = await Estudiante.findByIdAndRemove(estudianteId);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Estudiante eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

const consultarEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();

    res.status(200).json({
      ok: true,
      estudiantes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor al consultar estudiantes",
    });
  }
};

const crearCarnetEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.body;
    const estudiante = await Estudiante.findById(estudianteId);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado",
      });
    }
    sendMessageToClients(`nuip_student: ${estudiante.NUIP}`);

    res.status(200).json({
      ok: true,
      msg: "Carné creado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

const accesoManualEstudiante = async (req, res) => {
  try {
    const { estudianteId, tipoAcceso, motivo, usuarioID } = req.body;
    const offset = -5 * 60 * 60 * 1000;

    if (!estudianteId || !tipoAcceso) {
      return res.status(400).json({
        ok: false,
        msg: "ID del estudiante y tipo de acceso son requeridos.",
      });
    }

    const estudiante = await Estudiante.findById(estudianteId);

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado",
      });
    }
    const nuevoRegistro = {
      fecha: new Date(Date.now() + offset),
      tipo: tipoAcceso,
      notificacion: false,
      usuario: usuarioID,
      motivo,
    };

    estudiante.registros.push(nuevoRegistro);

    await estudiante.save();

    res.status(200).json({
      ok: true,
      msg: "Acceso manual realizado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error de servidor",
    });
  }
};

module.exports = {
  crearEstudiante,
  editarEstudiante,
  eliminarEstudiante,
  consultarEstudiantes,
  crearCarnetEstudiante,
  accesoManualEstudiante,
};
