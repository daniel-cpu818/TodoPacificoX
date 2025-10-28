import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";
import { User } from "../../../models/user.entity.js";

const packageRepository = AppDataSource.getRepository(Package);
const userRepository = AppDataSource.getRepository(User);

export const unassignPackageService = async (packageId, adminId = null) => {
  try {
    // Buscar el paquete
    const pkg = await packageRepository.findOne({
      where: { id: packageId },
      relations: ["messenger"],
    });

    if (!pkg) throw new Error(`No se encontró un paquete con ID ${packageId}`);

    if (!pkg.messenger) {
      throw new Error(`El paquete con ID ${packageId} no tiene un mensajero asignado`);
    }

    const previousMessenger = pkg.messenger;

    // Desasignar el mensajero
    pkg.messenger = null;
    pkg.status = "pendiente";
    pkg.updatedAt = new Date();

    // Guardar cambios
    const updatedPackage = await packageRepository.save(pkg);

    return {
      message: `Paquete ${pkg.trackingNumber} desasignado del mensajero ${previousMessenger.name}`,
      package: updatedPackage,
    };
  } catch (error) {
    console.error("Error en unassignPackageService:", error);
    throw new Error("Error al desasignar el paquete");
  }
};
