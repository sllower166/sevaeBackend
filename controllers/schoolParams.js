const { response } = require("express");
const SchoolParams = require("../models/SchoolParams");
const Estudiante = require("../models/Estudiante");

const verParametrosIE = async (req, res = response) => {
  try {
    const parametrosIE = await SchoolParams.find();
    if (!parametrosIE) {
      res.status(200).json({
        ok: false,
      });
    }
    res.status(200).json({
      ok: true,
      parametrosIE,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor al consultar los parámetros de la IE",
    });
  }
};

const editarParametrosIE = async (req, res = response) => {
  try {
    const { nombreIE, horaIngreso, horaSalida } = req.body;

    const parametrosIE = await SchoolParams.findOneAndUpdate(
      {},
      {
        nombreIE,
        horaIngreso,
        horaSalida,
      },
      {
        new: true,
      }
    );

    if (!parametrosIE) {
      return res.status(404).json({
        ok: false,
        msg: "Parámetros de la IE no encontrados",
      });
    }

    const estudiantes = await Estudiante.find();

    estudiantes.forEach(async (estudiante) => {
      estudiante.datosIE = {
        nombreIE,
        horaIngreso,
        horaSalida,
      };
      await estudiante.save();
    });

    res.status(200).json({
      ok: true,
      parametrosIE,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor al editar los parámetros de la IE",
    });
  }
};

const setearParametrosIE = async (req, res = response) => {
  try {
    const { nombreIE, horaIngreso, horaSalida } = req.body;
    const parametrosIE = new SchoolParams({
      nombreIE,
      horaIngreso,
      horaSalida,
    });

    await parametrosIE.save();

    res.status(201).json({
      ok: true,
      parametrosIE,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor al establecer los parámetros de la IE",
    });
  }
};

module.exports = {
  verParametrosIE,
  editarParametrosIE,
  setearParametrosIE,
};
