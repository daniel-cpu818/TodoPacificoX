import { createPackageService } from "./service/package-service.create.js";
import { assignPackageService } from "./service/assignPackage.service.js";
import { completeDeliveryService } from "./service/completeDelivery.service.js";
import {getAllPackagesService, getPackagesByStatusService, getPackagesByMessengerService} from "./service/getpackage.service.js";


/**
 * Crear un nuevo paquete
 */
export const createPackageController = async (req, res) => {
  try {
    const {
      trackingNumber,
      status = "pendiente",
      sender,
      recipient,
      proofImage1 = null,
      proofImage2 = null,
      messengerId = null,
    } = req.body;

    // Validaciones básicas
    if (!trackingNumber || !sender || !recipient) {
      return res.status(400).json({
        message: "Faltan datos requeridos: trackingNumber, sender o recipient",
      });
    }

    // Validar estructura de sender y recipient
    if (
      !sender.name ||
      !sender.address ||
      !sender.phone ||
      !recipient.name ||
      !recipient.address ||
      !recipient.phone
    ) {
      return res.status(400).json({
        message:
          "Los campos sender y recipient deben incluir name, address y phone",
      });
    }

    // Crear el paquete con los datos recibidos
    const newPackage = await createPackageService({
      trackingNumber,
      status,
      sender,
      recipient,
      proofImage1,
      proofImage2,
      messengerId,
    });

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
    const  {id}  = req.params;
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
export const completeDeliveryController = async (req, res) => {
  try {
    const { id } = req.params;        
    const userId = req.user.id;       // viene directo del token
    const files = req.files;          

    // Validar que vengan dos imágenes
    if (!files || files.length !== 2) {
      return res.status(400).json({
        message: "Error al completar la entrega",
        error: "Debes subir exactamente 2 imágenes como comprobante (form-data → images[])",
      });
    }

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

// Listar todos los paquetes
export const getAllPackagesController = async (req, res) => {
  try {
    const packages = await getAllPackagesService();
    res.json(packages);
  } catch (error) {
    console.error("Error en getAllPackagesController:", error);
    res.status(500).json({ message: "Error al obtener los paquetes" });
  }
};

// Listar paquetes por estado
export const getPackagesByStatusController = async (req, res) => {
  try {
    const { status } = req.params;
    const packages = await getPackagesByStatusService(status);
    res.json(packages);
  } catch (error) {
    console.error("Error en getPackagesByStatusController:", error);
    res.status(500).json({ message: "Error al obtener los paquetes por estado" });
  }
};

// Listar paquetes del mensajero autenticado
export const getPackagesByMessengerController = async (req, res) => {
  try {
    const messengerId = req.user.id; // viene del token
    const packages = await getPackagesByMessengerService(messengerId);
    res.json(packages);
  } catch (error) {
    console.error("Error en getPackagesByMessengerController:", error);
    res.status(500).json({ message: "Error al obtener los paquetes del mensajero" });
  }
};
