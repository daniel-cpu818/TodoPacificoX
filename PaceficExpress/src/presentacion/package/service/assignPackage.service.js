import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";
import { User } from "../../../models/user.entity.js";

const packageRepository = AppDataSource.getRepository(Package);
const userRepository = AppDataSource.getRepository(User);

export const assignPackageService = async (messengerId, trackingNumber) => {
  // Buscar el paquete
  const pkg = await packageRepository.findOne({
    where: { trackingNumber },
    relations: ["messenger"], 
  });

  if (!pkg) throw new Error("Paquete no encontrado");
  if (pkg.messenger) throw new Error("El paquete ya está asignado");

  // Buscar al usuario y verificar que sea mensajero
  const messenger = await userRepository.findOne({ where: { id: messengerId } });
  if (!messenger) throw new Error("Usuario no encontrado");
  if (messenger.role !== "messenger") throw new Error("El usuario no es un mensajero");

  // Asignar el mensajero y actualizar el estado
  pkg.messenger = messenger;
  pkg.status = "asignado_reparto";
  pkg.updatedAt = new Date();

  await packageRepository.save(pkg);
  return pkg;
};
