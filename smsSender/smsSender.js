const sendSms = (to, body) => {
  try {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
      process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio credentials are missing");
    }

    const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    client.messages
      .create({
        body,
        from: TWILIO_PHONE_NUMBER,
        to,
      })
      .then((message) => console.log(message.sid))
      .catch((error) => {
        console.error("Error sending SMS:", error);
      });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

const notificarSmsRegistrosEstudiante = async (student, registro) => {
  try {
    const { nombre, apellidos, acudientes } = student;
    const { tipo, fecha } = registro;

    const formattedDate = new Date(fecha);
    formattedDate.setHours(formattedDate.getHours() + 5);

    const formattedDateString = `${formattedDate.toLocaleDateString(
      "es-co"
    )} a las ${formattedDate.toLocaleTimeString("es-co")}`;

    const msg = `El estudiante ${nombre} ${apellidos} realizó un registro de ${tipo} el día ${formattedDateString}`;
    const studentAttendantPhone = `+57${acudientes[0].telefono}`;
    await sendSms(studentAttendantPhone, "Registro");
  } catch (error) {
    console.error("Error al enviar la notificación al estudiante:", error);
  }
};
module.exports = { notificarSmsRegistrosEstudiante };
