const WebSocket = require("ws");
const { processMsg } = require("./processMsg");
let io;
function initializeWebSocket() {
  const WS_PORT = process.env.WS_PORT;
  io = new WebSocket.Server({ port: WS_PORT });
  console.log(io);
  io.on("connection", (socket) => {
    console.log("Cliente WebSocket conectado.");

    let pingTimeout = setTimeout(() => {
      console.log("Alarma: No se recibió el mensaje de ping en 3000 ms.");
    }, 4000);

    socket.on("message", (message) => {
      try {
        const jsonData = JSON.parse(message);

        if ("ping" in jsonData) {
          console.log("Recibido mensaje de ping.");

          clearTimeout(pingTimeout);
        } else if ("rfidData" in jsonData) {
          const uidFromReader = hexToString(jsonData.rfidData);
          processMsg(parseInt(uidFromReader));
        } else {
          console.log("Mensaje desconocido:", jsonData);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente WebSocket desconectado.");
    });
  });
}

function sendMessageToClients(message) {
  io.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function hexToString(hex) {
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16);
    result += String.fromCharCode(byte);
  }
  return result;
}

module.exports = { initializeWebSocket, sendMessageToClients };
