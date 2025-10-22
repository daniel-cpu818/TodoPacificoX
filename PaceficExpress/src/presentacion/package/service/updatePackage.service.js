import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";

const packageRepository = AppDataSource.getRepository(Package);

export const updatePackageService = async (packageId, updateData) => {
  try {
    // Buscar el paquete existente
    const pkg = await packageRepository.findOne({ where: { id: packageId } });
    if (!pkg) throw new Error(`No se encontró un paquete con ID ${packageId}`);

    // Actualizar los campos del remitente si vienen en el body
    if (updateData.sender) {
      pkg.sender = {
        ...pkg.sender,
        ...updateData.sender,
      };
    }

    // Actualizar los campos del destinatario si vienen en el body
    if (updateData.recipient) {
      pkg.recipient = {
        ...pkg.recipient,
        ...updateData.recipient,
      };
    }

    pkg.updatedAt = new Date();

    // Guardar los cambios en la base de datos
    const updatedPackage = await packageRepository.save(pkg);

    return updatedPackage;
  } catch (error) {
    console.error("Error en updatePackageService:", error);
    throw new Error("Error al actualizar la información del paquete");
  }
};
