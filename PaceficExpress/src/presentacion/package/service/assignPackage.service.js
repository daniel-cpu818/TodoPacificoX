// src/services/package/assignPackageService.js
import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../models/Package.js";
import { User } from "../../models/User.js";

const packageRepository = AppDataSource.getRepository(Package);
const userRepository = AppDataSource.getRepository(User);

export const assignPackageService = async (trackingNumber, messengerId) => {
  // Buscar el paquete
  const pkg = await packageRepository.findOne({
    where: { trackingNumber },
    relations: ["messenger"], // opcional, si quieres traer el mensajero asignado
  });

  if (!pkg) throw new Error("Paquete no encontrado");
  if (pkg.messenger) throw new Error("El paquete ya está asignado");

  // Buscar al usuario y verificar que sea mensajero
  const messenger = await userRepository.findOne({ where: { id: messengerId } });
  if (!messenger) throw new Error("Usuario no encontrado");
  if (messenger.role !== "messenger") throw new Error("El usuario no es un mensajero");

  // Asignar el mensajero y actualizar el estado
  pkg.messenger = messenger;
  pkg.status = "asignado";

  await packageRepository.save(pkg);
  return pkg;
};
