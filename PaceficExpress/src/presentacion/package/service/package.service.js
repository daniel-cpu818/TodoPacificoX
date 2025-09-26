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
