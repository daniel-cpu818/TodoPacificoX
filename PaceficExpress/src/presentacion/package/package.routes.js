import { Router } from "express";
import { createPackageController,completeDeliveryController,assignMessengerController } from "./package.controller.js";
import { authMiddleware, checkRole } from "../../middlewares/auth.middleware.js";
import { upload } from "./service/completeDelivery.service.js";
import {
  getAllPackagesController,
  getPackagesByStatusController,
} from "./package.controller.js";


const router = Router();

// Crear un nuevo paquete → solo admin
router.post(
  "/",
  authMiddleware,
  checkRole(["admin"]),
  createPackageController
);

// Asignar un mensajero a un paquete → solo admin
router.post(
  "/:id/assign",
  authMiddleware,
  checkRole(["admin"]),
  assignMessengerController
);

// Completar la entrega con comprobantes → solo mensajero
router.post(
  "/:id/complete",
  authMiddleware,
  checkRole(["messenger"]),
  upload.array("images", 2), // multer recibe 2 imágenes desde form-data
  completeDeliveryController
);

// Obtener todos los paquetes
router.get("/", 
  authMiddleware, 
  getAllPackagesController);

// Obtener paquetes por estado
router.get("/status/:status", 
  authMiddleware, 
  getPackagesByStatusController);


export default router;
