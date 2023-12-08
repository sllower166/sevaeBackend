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
    const { operationType, updateDescription, documentKey } = change;

    const updatedFields = updateDescription?.updatedFields || {};
    const hasRegistroUpdates = Object.keys(updatedFields).some((field) =>
      field.startsWith("registros")
    );

    if (operationType === "update" && hasRegistroUpdates) {
      try {
        let registroId;

        for (const key in updatedFields) {
          if (key.startsWith("registros")) {
            const registro = Array.isArray(updatedFields[key])
              ? updatedFields[key][0]
              : updatedFields[key];
            registroId = registro._id;
            break;
          }
        }

        const studentId = documentKey._id;
        const updatedStudent = await Estudiante.findById(studentId);
        const updatedRegistro = updatedStudent.registros.find((registro) =>
          registro._id.equals(registroId)
        );

        notificarEmailRegistrosEstudiante(updatedStudent, updatedRegistro);

        if (TWILIO_ACTIVATE === "true") {
          await notificarSmsRegistrosEstudiante(
            updatedStudent,
            updatedRegistro
          );
        }
      } catch (error) {
        console.error("Error al obtener el estudiante:", error);
      }
    }
  });
};

module.exports = { startStudentsChanges };
