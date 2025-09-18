// src/controllers/package.controller.js
import { createPackageService } from "./service/package-service.create.js";
import { assignPackageService } from "./service/assignPackage.service.js";
import { completeDeliveryService } from "./service/completeDelivery.service.js";

/**
 * Crear un nuevo paquete
 */
export const createPackageController = async (req, res) => {
  try {
    const data = req.body;
    const newPackage = await createPackageService(data);
    return res.status(201).json(newPackage);
  } catch (error) {
    console.error("Error en createPackageController:", error);
    return res.status(500).json({
      message: "Error al crear el paquete",
      error: error.message,
    });
  }
};

/**
 * Asignar un mensajero a un paquete
 */
export const assignMessengerController = async (req, res) => {
  try {
    const { id } = req.params;
    const { messengerId } = req.body; // opcional: se puede enviar o usar el user autenticado

    const updatedPackage = await assignPackageService(id, messengerId || req.user?.id);
    return res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error en assignMessengerController:", error);
    return res.status(500).json({
      message: "Error al asignar el mensajero",
      error: error.message,
    });
  }
};

/**
 * Completar entrega y subir imágenes
 */
export const completeDeliveryController = async (req, res) => {
  try {
    // 📦 id del paquete desde los params
    const { id } = req.params;
    // 👤 userId enviado desde el cliente en el body
    const { userId } = req.body;
    // 📸 imágenes subidas con multer (form-data → images[])
    const files = req.files;
    // Llamada al servicio
    const updatedPackage = await completeDeliveryService(id, userId, files);
    return res.status(200).json({
      message: "Entrega completada con éxito",
      data: updatedPackage,
    });
  } catch (error) {
    console.error("Error en completeDeliveryController:", error);
    return res.status(500).json({
      message: "Error al completar la entrega",
      error: error.message,
    });
  }
};


