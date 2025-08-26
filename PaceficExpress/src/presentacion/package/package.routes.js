import { Router } from "express";
import { createPackageController,completeDeliveryController,assignMessengerController } from "./package.controller.js";

const router = Router();

// Crear un nuevo paquete
router.post("/", createPackageController);

// Asignar un mensajero al paquete
router.post("/:id/assign", assignMessengerController);

// Completar la entrega y subir imágenes
router.post("/:id/complete", completeDeliveryController);

export default router;
