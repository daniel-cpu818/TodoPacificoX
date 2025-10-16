import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";
import { Not } from "typeorm";


const packageRepository = AppDataSource.getRepository(Package);

// Obtener todos los paquetes
export const getAllPackagesService = async () => {
  return await packageRepository.find();
};

// Obtener paquetes por estado (pendiente, asignado, entregado)
export const getPackagesByStatusService = async (status) => {
  return await packageRepository.find({ where: { status }, order: { createdAt: "ASC" } });
};

// obtener paquete por su tracking number
export const getPackageByTrackingNumberService = async (trackingNumber) => {
  const pkg = await packageRepository.findOne({ where: { trackingNumber } });
  if (!pkg) throw new Error("Paquete no encontrado");
  return pkg;
};

// Obtener paquetes del mensajero autenticado

export const getPackagesByMessengerService = async (messengerId) => {
  try {
    const packages = await packageRepository.find({
      where: {
        messenger: { id: messengerId },
         status: Not("entregado"),
      },
      relations: ["messenger"], 
      order: { createdAt: "ASC" },
    });

    return packages;
  } catch (error) {
    console.error("Error al obtener paquetes del mensajero:", error);
    throw new Error("Error al obtener los paquetes del mensajero");
  }
};