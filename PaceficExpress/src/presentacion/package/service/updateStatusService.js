import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";

const packageRepository = AppDataSource.getRepository(Package);
/**
 * Actualiza el estado de un paquete por su trackingNumber y agrega el cambio al historial.
 */
export const updatePackageStatusByTrackingService = async (trackingNumber, newStatus, userId) => {
  const packageFound = await packageRepository.findOne({
    where: { trackingNumber },
    relations: ["messenger"],
  });

  if (!packageFound) {
    throw new Error(`No se encontró un paquete con trackingNumber ${trackingNumber}`);
  }

  // Crear un registro del cambio
  const historyEntry = {
    status: newStatus,
    changedBy: userId || (packageFound.messenger ? packageFound.messenger.id : null),
    timestamp: new Date().toISOString(),
  };

  // Agregar al historial
  packageFound.statusHistory = [...(packageFound.statusHistory || []), historyEntry];
  packageFound.status = newStatus;
  packageFound.updatedAt = new Date();

  await packageRepository.save(packageFound);

  return {
    message: `Estado del paquete ${trackingNumber} actualizado a '${newStatus}'`,
    package: packageFound,
  };
};
