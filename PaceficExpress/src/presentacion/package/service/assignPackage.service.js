import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";
import { User } from "../../../models/user.entity.js";

const packageRepository = AppDataSource.getRepository(Package);
const userRepository = AppDataSource.getRepository(User);

export const assignPackageService = async (userId, trackingNumber) => {
  // Buscar el paquete por número de guía
  const pkg = await packageRepository.findOne({
    where: { trackingNumber },
    relations: ["messenger"],
  });

  if (!pkg) throw new Error("Paquete no encontrado");
  if (pkg.messenger) throw new Error("El paquete ya está asignado");

  // Buscar al usuario autenticado
  const messenger = await userRepository.findOne({ where: { id: userId } });
  if (!messenger) throw new Error("Usuario no encontrado");
  if (messenger.role !== "messenger") throw new Error("El usuario no es un mensajero");

  // Asignar mensajero y actualizar estado
  pkg.messenger = messenger;
  pkg.status = "asignado_reparto"; // o "asignado_ruta" según tu flujo
  pkg.updatedAt = new Date();

  await packageRepository.save(pkg);

  return {
    message: `Paquete ${pkg.trackingNumber} asignado a ${messenger.name}`,
    status: pkg.status,
  };
};
