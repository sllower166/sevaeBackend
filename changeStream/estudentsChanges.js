const {
  notificarEmailRegistrosEstudiante,
} = require("../mailSender/mailSender.js");

const Estudiante = require("../models/Estudiante.js");
const {
  notificarSmsRegistrosEstudiante,
} = require("../smsSender/smsSender.js");

const startStudentsChanges = () => {
  const changeStream = Estudiante.watch();
  const TWILIO_ACTIVATE = process.env.TWILIO_ACTIVATE;

  changeStream.on("change", async (change) => {
    if (
      change.operationType === "update" &&
      Object.keys(change.updateDescription.updatedFields).some((field) =>
        field.startsWith("registros")
      )
    ) {
      registroAgg = change.updateDescription.updatedFields;
      try {
        const keyName = Object.keys(registroAgg).find((field) =>
          field.startsWith("registros")
        );

        const registro = registroAgg[keyName];

        const studentId = change.documentKey._id;
        const updatedStudent = await Estudiante.findById(studentId);

        notificarEmailRegistrosEstudiante(updatedStudent, registro);
        if (TWILIO_ACTIVATE === "true") {
          await notificarSmsRegistrosEstudiante(updatedStudent, registro);
        }
      } catch (error) {
        console.error("Error al obtener el estudiante:", error);
      }
    }
  });
};

module.exports = { startStudentsChanges };
