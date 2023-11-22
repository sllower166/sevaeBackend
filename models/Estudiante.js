const { Schema, model } = require("mongoose");

const AcudienteSchema = new Schema({
  nombre: String,
  telefono: String,
  correo: String,
});

const DatosIESchema = new Schema({
  nombreIE: String,
  horaIngreso: String,
  horaSalida: String,
});

const RegistroSchema = new Schema({
  fecha: {
    type: Date,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["Ingreso", "Salida", "Fuera de horario"],
    required: true,
  },
  notificacion: Boolean,
  usuario: String,
  motivo: String,
});

const EstudianteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  NUIP: {
    type: Number,
    required: true,
    unique: true,
  },
  grado: {
    type: String,
    required: true,
  },
  acudientes: [
    {
      type: AcudienteSchema,
    },
  ],
  datosIE: [DatosIESchema],
  registros: {
    type: [RegistroSchema],
    required: true,
  },
});

module.exports = model("Estudiante", EstudianteSchema);
