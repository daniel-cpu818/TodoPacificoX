import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source.js";
import authRoutes from "./presentacion/routes.js";
import packageRoutes from "./presentacion/package/package.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);

AppDataSource.initialize().then(() => {
  console.log("📦 Base de datos conectada");
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
  });
}).catch((err) => {
  console.error("❌ Error al conectar la base de datos:", err);
});
