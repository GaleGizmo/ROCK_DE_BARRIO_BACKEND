require("dotenv").config();

const cors = require("cors");
const cron = require('node-cron');
const cloudinary = require("cloudinary").v2;
const { remindEvento } = require("./src/api/evento/evento.controller.js");
const PORT = process.env.PORT;

const db = require("./src/utils/db.js");

db.connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
cron.schedule('0 10 * * *', () => {
  remindEvento()
  .then(() => {
    console.log("Cron job para remindEvento ejecutado con éxito.");
  })
  .catch((error) => {
    console.error("Error al ejecutar remindEvento:", error);
  });
});
const express = require("express");
const eventoRoutes = require("./src/api/evento/evento.routes");
const usuarioRoutes = require("./src/api/usuario/usuario.routes");
const comentarioRoutes = require("./src/api/comentario/comentario.routes");


const server = express();

server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/usuario", usuarioRoutes);
server.use("/evento", eventoRoutes);
server.use("/comentario", comentarioRoutes);

server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || "Unexpected error");
});

server.use("*", (req, res, next) => {
  return res.status(404).json("Route not found");
});

server.use("/", (req, res) => {
  res.send("Working");
});

function startServer(port) {
  server.listen(port, function(err) {
    if (err) {
      console.log('Error al iniciar el servidor en el puerto ' + port);
      if (err.code === 'EADDRINUSE') {
        console.log('Intentando iniciar el servidor en un puerto alternativo');
        startServer(port + 1);
      } else {
        console.log('Error desconocido:', err);
      }
    } else {
      console.log('Servidor iniciado en el puerto ' + port);
    }
  });
}
startServer(PORT);