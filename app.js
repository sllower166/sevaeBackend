const express = require("express");
const cors = require("cors");
const path = require("path");
const { dbConnection } = require("./database/config");
const http = require("http");
const { initializeWebSocket } = require("./websocket/websocket");
const { startStudentsChanges } = require("./changeStream/estudentsChanges");

require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
require("./swaggerConfig")(app);

dbConnection();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));
app.use("/api/auth/", require("./routes/auth"));
app.use("/api/estudiantes/", require("./routes/estudiante"));
app.use("/api/directivo/", require("./routes/directivo"));
app.use("/api/schoolparams/", require("./routes/schoolParams"));
app.use("/api/reportes/", require("./routes/reportes"));

initializeWebSocket();
startStudentsChanges();
app.listen(PORT, () =>
  console.log(`Servidor corriendo http://localhost:${PORT}`)
);
