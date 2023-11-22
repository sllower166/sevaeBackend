const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { generarJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  try {
    const { schoolId, password } = req.body;
    let school = await User.findOne({ schoolId });
    if (school) {
      return res.status(400).json({
        ok: false,
        msg: "SchoolID already taken",
      });
    }
    school = new User(req.body);

    //encrypta pass
    const salt = bcrypt.genSaltSync();
    school.password = bcrypt.hashSync(password, salt);
    await school.save();
    //JWT
    const token = await generarJWT(school.id);
    res.status(201).json({
      ok: true,
      uid: school.id,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
    });
  }
};

const userLogin = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    let usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "no user found",
      });
    }

    const isValidPassword = bcrypt.compareSync(password, usuario.password);

    if (!isValidPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid Password",
      });
    }
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(200).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Server error please try again",
    });
  }
};

const renewToken = async (req, res) => {
  const { uid } = req;
  const token = await generarJWT(uid);

  res.json({
    ok: true,
    token,
    uid,
  });
};

module.exports = {
  createUser,
  userLogin,
  renewToken,
};
