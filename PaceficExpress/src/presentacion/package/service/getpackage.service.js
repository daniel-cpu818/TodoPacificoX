import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";

const packageRepository = AppDataSource.getRepository(Package);

// Obtener todos los paquetes
export const getAllPackagesService = async () => {
  return await packageRepository.find();
};

// Obtener paquetes por estado (pendiente, asignado, entregado)
export const getPackagesByStatusService = async (status) => {
  return await packageRepository.find({ where: { status } });
};

// Obtener paquetes del mensajero autenticado

export const getPackagesByMessengerService = async (messengerId) => {
  try {
    const packages = await packageRepository.find({
      where: {
        messenger: { id: messengerId },
      },
      relations: ["messenger"], 
      order: { createdAt: "DESC" },
    });

    return packages;
  } catch (error) {
    console.error("Error al obtener paquetes del mensajero:", error);
    throw new Error("Error al obtener los paquetes del mensajero");
  }
};