const { response } = require("express");
const bcrypt = require("bcryptjs");
const Directivo = require("../models/Directivo");
const { generarJWT } = require("../helpers/jwt");

// Crear un directivo
const createDirectivo = async (req, res = response) => {
  try {
    const { nombre, usuario, contraseña, email } = req.body;

    // Verificar si el usuario ya existe
    let directivo = await Directivo.findOne({ usuario });
    if (directivo) {
      return res.status(400).json({
        ok: false,
        msg: "Username already taken",
      });
    }

    directivo = new Directivo({ nombre, usuario, contraseña, email });

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    directivo.contraseña = bcrypt.hashSync(contraseña, salt);

    await directivo.save();

    // Generar JWT
    const token = await generarJWT(directivo.id);

    res.status(201).json({
      ok: true,
      uid: directivo.id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
    });
  }
};

// Iniciar sesión de un directivo
const directivoLogin = async (req, res = response) => {
  try {
    const { usuario, contraseña } = req.body;

    // Buscar al directivo por su nombre de usuario
    const directivo = await Directivo.findOne({ usuario });

    // Si el directivo no existe
    if (!directivo) {
      return res.status(400).json({
        ok: false,
        errors: {
          usuario: {
            value: "",
            msg: "Credenciales invalidas",
            param: "usuario",
            location: "body",
          },
        },
      });
    }

    // Verificar la contraseña
    const isValidPassword = bcrypt.compareSync(
      contraseña,
      directivo.contraseña
    );

    if (!isValidPassword) {
      return res.status(400).json({
        ok: false,
        errors: {
          contraseña: {
            value: "",
            msg: "Credenciales invalidas",
            param: "contraseña",
            location: "body",
          },
        },
      });
    }

    // Generar JWT
    const token = await generarJWT(directivo.id);

    res.status(200).json({
      ok: true,
      uid: directivo.id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
    });
  }
};

// Renovar token web
const renewToken = async (req, res) => {
  const { uid } = req;
  const token = await generarJWT(uid);

  res.json({
    ok: true,
    token,
    uid,
  });
};

const resetPassword = async (req, res) => {
  try {
    res.json({
      ok: true,
      msg: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
    });
  }
};

module.exports = {
  createDirectivo,
  directivoLogin,
  renewToken,
  resetPassword,
};
