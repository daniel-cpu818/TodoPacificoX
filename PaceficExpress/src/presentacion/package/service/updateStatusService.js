import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";
import { PackageHistory } from "../../../models/packageHistory.entity.js";
import { User } from "../../../models/user.entity.js";

const packageRepository = AppDataSource.getRepository(Package);
const historyRepository = AppDataSource.getRepository(PackageHistory);
const userRepository = AppDataSource.getRepository(User);

export const updatePackageStatusByTrackingService = async (trackingNumber, newStatus, userId, note = null) => {
  // Buscar el paquete
  const pkg = await packageRepository.findOne({
    where: { trackingNumber },
    relations: ["messenger"],
  });

  if (!pkg) {
    throw new Error(`No se encontró un paquete con trackingNumber ${trackingNumber}`);
  }

  const previousStatus = pkg.status;

  // Validar si el estado realmente cambió
  if (previousStatus === newStatus) {
    throw new Error(`El paquete ya se encuentra en el estado '${newStatus}'`);
  }

  // Actualizar el estado principal
  pkg.status = newStatus;
  pkg.updatedAt = new Date();

  // Determinar quién hizo el cambio
  const user = userId ? await userRepository.findOne({ where: { id: userId } }) : null;

  // Crear un nuevo registro en el historial
  const historyEntry = historyRepository.create({
    package: pkg,
    user: user || pkg.messenger || null,
    previousStatus,
    newStatus,
    note: note || `Cambio automático a estado: ${newStatus}`,
  });

  // Guardar ambos en la base de datos
  await packageRepository.save(pkg);
  await historyRepository.save(historyEntry);

  return {
    message: `Estado del paquete ${trackingNumber} actualizado de '${previousStatus}' a '${newStatus}'`,
    package: pkg,
    history: historyEntry,
  };
};
