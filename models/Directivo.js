const { Schema, model } = require("mongoose");

const DatosIESchema = new Schema({
  nombreIE: String,
});

const DirectivoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  usuario: {
    type: String,
    required: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  datosIE: [DatosIESchema],
});

module.exports = model("Directivo", DirectivoSchema);
