import { AppDataSource } from "../../config/data-source.js";


const packageRepository = AppDataSource.getRepository("Package");
const userRepository = AppDataSource.getRepository("User");

export const createPackageService = async ({ trackingNumber }) => {
  const existing = await packageRepository.findOne({ where: { trackingNumber } });
  if (existing) throw new Error("Número de guía ya registrado");

  const newPackage = packageRepository.create({ trackingNumber });
  await packageRepository.save(newPackage);
  return newPackage;
};

export const getAllPackagesService = async () => {
  return await packageRepository.find({ relations: ["assignedTo"] });
};

export const updatePackageStatusService = async (id, status) => {
  const pack = await packageRepository.findOne({ where: { id } });
  if (!pack) throw new Error("Paquete no encontrado");

  pack.status = status;
  await packageRepository.save(pack);
  return pack;
};

export const assignPackageToSelfService = async (userId, packageId) => {
  const pack = await packageRepository.findOne({ where: { id: packageId }, relations: ["assignedTo"] });
  if (!pack) throw new Error("Paquete no encontrado");

  if (pack.assignedTo) throw new Error("Este paquete ya está asignado");

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new Error("Usuario no encontrado");

  pack.assignedTo = user;
  pack.status = "en_transito";
  await packageRepository.save(pack);
  return pack;
};

export const getMyPackagesService = async (userId) => {
  return await packageRepository.find({
    where: { assignedTo: { id: userId } },
    relations: ["assignedTo"]
  });
};
