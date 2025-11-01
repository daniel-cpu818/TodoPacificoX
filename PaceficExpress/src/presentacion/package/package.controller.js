import { createPackageService } from "./service/package-service.create.js";
import { assignPackageService } from "./service/assignPackage.service.js";
import { completeDeliveryService } from "./service/completeDelivery.service.js";
import { reportIncidentService } from "./service/reportIncident.service.js";
import {updatePackageStatusByTrackingService} from "./service/updateStatusService.js";
import { getUserStatsService } from "./service/getUserStats.service.js";
import {getUserHistoryService} from "./service/getUserHistoryService.js";
import {assignAdminPackageService} from "./service/assignPackageAdmin.service.js";
import { updatePackageService } from "./service/updatePackage.service.js";
import {deletePackageService} from "./service/deletePackage.service.js";
import { unassignPackageService } from "./service/unassignPackage.service.js";
import { generateMessengerReportService } from "./service/packageReport.service.js";
import {
  getAllPackagesService, 
  getPackagesByStatusService, 
  getPackagesByMessengerService,
  getPackageByTrackingNumberService,
  getPackagesBySpecificMessengerService} 
from "./service/getpackage.service.js";
import { AppDataSource } from "../../config/data-source.js";
import { Package } from "../../models/package.entity.js";
import path from "path";
import fs from "fs";

const packageRepository = AppDataSource.getRepository(Package);


/**
 * Crear un nuevo paquete
 */
export const createPackageController = async (req, res) => {
  try {
    const {
      trackingNumber,
      sender,
      recipient,
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
      sender,
      recipient,
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
export const assignPackageController = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const userId = req.user.id; // <- tomado del token (middleware de auth)

    const result = await assignPackageService(userId, trackingNumber);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Completar entrega y subir imágenes
 */
export const completeDeliveryController = async (req, res) => {
  try {
    const { id } = req.params;        
    const userId = req.user.id;   // viene directo del token
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
    const messengerId = req.user.id;
    const packages = await getPackagesByMessengerService(messengerId);
    res.json(packages);
  } catch (error) {
    console.error("Error en getPackagesByMessengerController:", error);
    res.status(500).json({ message: "Error al obtener los paquetes del mensajero" });
  }
};

// listar paquete por su tracking number
export const getPackageByTrackingNumberController = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const pkg = await getPackageByTrackingNumberService(trackingNumber);
    res.json(pkg);
  } catch (error) {
    console.error("Error en getPackageByTrackingNumberController:", error);
    res.status(500).json({ message: "Error al obtener el paquete por su tracking number" });
  }
};

//contador de paquetes entregados, escaneados e incidencias
export const getUserStatsController = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token gracias al middleware
    const stats = await getUserStatsService(userId);
    res.json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// registrar incidencia en la entrega de un paquete 
export const reportIncidentController = async (req, res) => {
  try {
    const { id } = req.params;
    const incidentData = req.body;
    const updatedPackage = await reportIncidentService(id, incidentData);
    return res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error al registrar el incidente:", error);
    return res.status(500).json({
      message: "Error al registrar el incidente",
      error: error.message,
    });
  }
};

export const departPackageController = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const userId = req.user.id; // del token
    const result = await updatePackageStatusByTrackingService(trackingNumber, "en_ruta_bventura", userId);
     return res.status(200).json({
      message: result.message,
      package: result.package,
      history: result.history,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const arrivePackageController = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const userId = req.user.id;
    const result = await updatePackageStatusByTrackingService(trackingNumber, "recibido_bventura", userId);
    return res.status(200).json({
      message: result.message,
      package: result.package,
      history: result.history,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const startDeliveryPackageController = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const userId = req.user.id;
    const result = await updatePackageStatusByTrackingService(trackingNumber, "en_reparto", userId);
   
     return res.status(200).json({
      message: result.message,
      package: result.package,
      history: result.history,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserHistoryController = async (req, res) => {
  try {
    const userId = req.user.id;

    const packages = await getUserHistoryService(userId);

    return res.status(200).json({
      total: packages.length,
      packages,
    });
  } catch (error) {
    console.error("Error en getUserHistoryController:", error);
    return res.status(500).json({
      message: "Error al obtener el historial del usuario",
      error: error.message,
    });
  }
};

export const getPackageHistoryController = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const pkg = await packageRepository.findOne({
      where: { trackingNumber },
      relations: ["history", "history.user"],
      order: { history: { changedAt: "ASC" } },
    });

    if (!pkg) return res.status(404).json({ message: "Paquete no encontrado" });

    res.json({
      trackingNumber: pkg.trackingNumber,
      history: pkg.history.map((h) => ({
        previousStatus: h.previousStatus,
        newStatus: h.newStatus,
        note: h.note,
        changedBy: h.user ? h.user.name : "Sistema",
        changedAt: h.changedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignAdminPackageController = async (req, res) => {
  try {
    const { id } = req.params;
    const { messengerId } = req.body;
    const updatedPackage = await assignAdminPackageService(id, messengerId);
    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error en assignPackageController:", error);
    res.status(400).json({ message: error.message });
  }
};


export const updatePackageController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("✏️ Actualizando paquete:", id, "con datos:", updateData);

    const updatedPackage = await updatePackageService(id, updateData);

    res.status(200).json({
      message: "Paquete actualizado correctamente",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Error en updatePackageController:", error);
    res.status(400).json({ message: error.message });
  }
};


export const deletePackageController = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Eliminando paquete con ID:", id);

    const result = await deletePackageService(id);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error en deletePackageController:", error);
    res.status(400).json({ message: error.message });
  }
};

export const unassignPackageController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await unassignPackageService(id);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error en unassignPackageController:", error);
    res.status(500).json({ message: error.message });
  }
};

export const generateMessengerReportController = async (req, res) => {
  try {
    const { messengerId, startDate, endDate } = req.body;
    const report = await generateMessengerReportService(messengerId, startDate, endDate);

    const filePath = path.resolve(report.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Archivo de reporte no encontrado" });
    }

    // 🔽 Envía el archivo directamente al cliente
    res.download(filePath, `reporte_${messengerId}.xlsx`, (err) => {
      if (err) {
        console.error("Error al descargar el archivo:", err);
        res.status(500).json({ message: "Error al descargar el archivo" });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Listar paquetes asignados a un mensajero específico
export const getPackagesBySpecificMessengerController = async (req, res) => {
  try {
    const { messengerId } = req.params;
    const packages = await getPackagesBySpecificMessengerService(messengerId);
    res.json(packages);
  } catch (error) {
    console.error("Error en getPackagesBySpecificMessengerController:", error);
    res.status(500).json({ message: "Error al obtener los paquetes del mensajero específico" });
  }
};