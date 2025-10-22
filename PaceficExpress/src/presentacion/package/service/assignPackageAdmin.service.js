import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";
import { User } from "../../../models/user.entity.js";

export const assignAdminPackageService = async (packageId, messengerId) => {
  const packageRepository = AppDataSource.getRepository(Package);
  const userRepository = AppDataSource.getRepository(User);

  try {
    // Buscar el paquete exacto
    const pkg = await packageRepository.findOne({
      where: { id: packageId },
      relations: ["messenger"],
    });

    if (!pkg) throw new Error(`No se encontró un paquete con ID ${packageId}`);

    // Buscar el mensajero
    const messenger = await userRepository.findOne({
      where: { id: messengerId, role: "messenger" },
    });

    if (!messenger) throw new Error(`No se encontró un mensajero con ID ${messengerId}`);
    if (pkg.messenger) throw new Error("El paquete ya está asignado a un mensajero");
    // Asignar el paquete
    pkg.messenger = messenger;
    pkg.status = "asignado_reparto";
    pkg.updatedAt = new Date();

    // Guardar los cambios
    await packageRepository.save(pkg);

    // Retornar el paquete actualizado con el mensajero incluido
    const updatedPackage = await packageRepository.findOne({
      where: { id: packageId },
      relations: ["messenger"],
    });

    return updatedPackage;
  } catch (error) {
    throw new Error(error.message || "Error al asignar el paquete al mensajero");
  }
};
