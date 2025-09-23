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
    const  id  = req.params;
    const { trackingNumber } = req.body; 

    const updatedPackage = await assignPackageService(id, trackingNumber);
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
// src/controllers/package/completeDelivery.controller.js
export const completeDeliveryController = async (req, res) => {
  try {
    const { id } = req.params;        // 📦 id del paquete en la URL
    const userId = req.user.id;       // 👤 viene directo del token gracias al middleware
    const files = req.files;          // 📸 imágenes subidas con multer (form-data → images[])

    // Validar que vengan dos imágenes
    if (!files || files.length !== 2) {
      return res.status(400).json({
        message: "Error al completar la entrega",
        error: "Debes subir exactamente 2 imágenes como comprobante (form-data → images[])",
      });
    }

    // Llamada al servicio con userId del token
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


