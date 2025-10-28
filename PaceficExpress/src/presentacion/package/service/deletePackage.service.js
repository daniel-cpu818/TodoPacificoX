import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";

const packageRepository = AppDataSource.getRepository(Package);

export const deletePackageService = async (packageId) => {
  try {
    // Buscar el paquete
    const pkg = await packageRepository.findOne({ where: { id: packageId } });

    if (!pkg) throw new Error(`No se encontró un paquete con ID ${packageId}`);

    // Eliminar el paquete
    await packageRepository.remove(pkg);

    return {
      message: `Paquete con ID ${packageId} eliminado correctamente`,
      deletedPackage: pkg,
    };
  } catch (error) {
    console.error("Error en deletePackageService:", error);
    throw new Error("Error al eliminar el paquete");
  }
};
