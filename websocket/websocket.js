const { processMsg } = require("./processMsg");
let wsServer; // Variable para el servidor WebSocket

function initializeWebSocket(server) {
  const WebSocket = require("ws");
  wsServer = new WebSocket.Server({ server });

  wsServer.on("connection", (socket) => {
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

    socket.on("close", () => {
      console.log("Cliente WebSocket desconectado.");
    });
  });
}

function sendMessageToClients(message) {
  if (wsServer) {
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } else {
    console.log("Error: Servidor WebSocket no inicializado");
  }
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
