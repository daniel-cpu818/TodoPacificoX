require("dotenv").config();
require("reflect-metadata");
const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./config/data-source");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./presentacion/routes");
app.use("/api/auth", authRoutes);

AppDataSource.initialize().then(() => {
  console.log("📦 Base de datos conectada");
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${process.env.PORT}`);
  });
}).catch((err) => {
  console.error("❌ Error al conectar base de datos", err);
});
