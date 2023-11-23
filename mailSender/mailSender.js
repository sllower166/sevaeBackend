const nodemailer = require("nodemailer");
const Directivo = require("../models/Directivo.js");

const enviarCorreoNotificacion = async (destinatario, subject, mensaje) => {
  try {
    const { GMAIL_USER, GMAIL_PASS } = process.env;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });

    const mailOptions = {
      to: destinatario,
      subject: subject,
      html: mensaje,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo electrónico de notificación enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
};

async function notificarEmailRegistrosEstudiante(student, registro) {
  try {
    const { nombre, apellidos, acudientes } = student;
    const { tipo, fecha, usuario, motivo } = registro;
    const formattedDate = new Date(fecha);
    formattedDate.setHours(formattedDate.getHours() + 2);

    const formattedDateString = `${formattedDate.toLocaleDateString(
      "es-co"
    )} a las ${formattedDate.toLocaleTimeString("es-co")}`;

    const ingresoManual = usuario !== "Sistema";
    let usuarioIngreso = usuario;
    if (ingresoManual) {
      const directivo = await Directivo.findById(usuario);
      usuarioIngreso = directivo ? directivo.nombre : "Desconocido";
    }
    const notificaciones = acudientes.map((acudiente) => {
      const subject = `Notificación de ${tipo} para ${nombre} ${apellidos}`;
      const msg = `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>${subject}</h2>
            <p>Estimado(a) ${acudiente.nombre},</p>
            <p>El estudiante ${nombre} ${apellidos} realizó un registro de ${tipo} el día ${formattedDateString}.</p>
            ${
              ingresoManual
                ? `<p>Este registro fue ingresado manualmente por <strong>${usuarioIngreso}</strong>. Motivo: <i> ${motivo}</i></p>`
                : `<p>Este registro fue realizado automáticamente por el <strong>Sistema</strong>.</p>`
            }
            <p>¡Gracias!</p>
            <P>Att: Sevae team</P>
          </body>
        </html>
      `;

      return enviarCorreoNotificacion(acudiente.correo, subject, msg);
    });

    await Promise.all(notificaciones);
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
    throw error;
  }
}
module.exports = { notificarEmailRegistrosEstudiante };
