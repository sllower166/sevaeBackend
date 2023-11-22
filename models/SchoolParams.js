const { Schema, model } = require("mongoose");

const schoolParamsSchema = new Schema({
  nombreIE: {
    type: String,
    required: true,
  },
  horaIngreso: {
    type: String,
    required: true,
  },
  horaSalida: {
    type: String,
    required: true,
  },
});

module.exports = model("schoolParams", schoolParamsSchema);
