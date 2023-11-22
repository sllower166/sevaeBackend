const Estudiante = require("../models/Estudiante.js");

const generarReporte = async (req, res = response) => {
  try {
    const { fechaInicio, fechaFin, selectedType } = req.body;

    if (!fechaInicio || !fechaFin || !selectedType) {
      return res.status(400).json({
        ok: false,
        msg: "Por favor, proporciona fechas y tipo de registro válidos",
      });
    }

    const reporte = await filtrarRegistros(fechaInicio, fechaFin, selectedType);

    if (!reporte || reporte.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron registros para los filtros proporcionados",
      });
    }

    res.status(200).json({
      ok: true,
      reporte,
    });
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al generar el reporte",
    });
  }
};

const filtrarRegistros = async (fechaInicio, fechaFin, selectedType) => {
  try {
    const fechaInicioUTC = new Date(fechaInicio);
    const fechaFinUTC = new Date(fechaFin);

    fechaInicioUTC.setUTCHours(0, 0, 0, 0);
    fechaFinUTC.setUTCHours(23, 59, 59, 59);

    let filtro = {
      "registros.fecha": {
        $gte: fechaInicioUTC,
        $lte: fechaFinUTC,
      },
    };

    if (selectedType !== "Todos") {
      filtro["registros.tipo"] = selectedType;
    }

    const estudiantes = await Estudiante.aggregate([
      { $unwind: "$registros" },
      { $match: filtro },
      { $group: { _id: "$_id", registros: { $push: "$registros" } } },
    ]);

    return estudiantes;
  } catch (error) {
    console.error("Error al filtrar los registros:", error);
    throw error;
  }
};

module.exports = {
  generarReporte,
};
