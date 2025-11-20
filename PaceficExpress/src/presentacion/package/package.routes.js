import { Router } from "express";
import { authMiddleware, checkRole } from "../../middlewares/auth.middleware.js";
import { upload } from "./service/completeDelivery.service.js";
import {
  getAllPackagesController,
  getPackagesByStatusController,
  getPackagesByMessengerController,
  createPackageController,
  completeDeliveryController,
  assignPackageController,
  getUserStatsController,
  reportIncidentController,
  departPackageController,
  arrivePackageController,
  startDeliveryPackageController,
  getPackageByTrackingNumberController,
  getUserHistoryController,
  getPackageHistoryController,
  assignAdminPackageController,
  updatePackageController,
  deletePackageController,
  unassignPackageController,
  generateMessengerReportController,
  getPackagesBySpecificMessengerController
} from "./package.controller.js";


const router = Router();

// Crear un nuevo paquete → solo admin
router.post(
  "/",
  authMiddleware,
  checkRole(["admin"]),
  createPackageController
);

// Asignar un mensajero a un paquete 
router.post(
  "/assign",
  authMiddleware,
  checkRole(["messenger"]),
  assignPackageController
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

// Obtener paquetes del mensajero autenticado
router.get("/assigned", 
  authMiddleware, 
  getPackagesByMessengerController);
// Obtener paquete por su tracking number
router.get("/tracking/:trackingNumber", 
  getPackageByTrackingNumberController);  

// contador de paquetes entregados, escaneados e incidencias
router.get("/user/stats", 
  authMiddleware,
  getUserStatsController);

// Reportar una incidencia en un paquete
router.post("/packages/:id/incident",
  authMiddleware, 
  reportIncidentController);

// cambiar estado del paquete a "en_ruta_bventura"
router.post("/packages/depart", 
  authMiddleware,
  departPackageController);

// cambiar estado del paquete a "asignado_reparto"
router.post("/packages/arrive", 
  authMiddleware,
  arrivePackageController);

// cambiar estado del paquete a "en_reparto"
router.post("/packages/start-delivery", 
  authMiddleware,
  startDeliveryPackageController);

// Historial completo de paquetes de un mensajero (activos y completados)
router.get("/user/history", 
  authMiddleware,
  getUserHistoryController);

// Historial de un paquete por su tracking number
router.get("/packages/:trackingNumber/history",
  getPackageHistoryController);

// Asignar paquete por admin
router.post(
  "/:id/assign",
  authMiddleware,
  checkRole(["admin"]),
  assignAdminPackageController
);

// Actualizar información del paquete
router.put(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  updatePackageController
);
// Eliminar un paquete
router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  deletePackageController
);

// Desasignar un mensajero de un paquete
 router.post(
  "/:id/unassign",
   authMiddleware,
   checkRole(["admin"]),
  unassignPackageController
);

// reporte de paquetes entregados por mensajero en un rango de fechas
 router.get(
   "/report/messenger",
   authMiddleware,
   checkRole(["admin"]),
   generateMessengerReportController
 );

// listar paquetes por mensajero específico
  router.get(
    "/messenger/:messengerId",
    authMiddleware,
    checkRole(["admin"]),
    getPackagesBySpecificMessengerController
  );

export default router;
