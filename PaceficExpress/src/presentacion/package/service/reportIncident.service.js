import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";

const packageRepository = AppDataSource.getRepository(Package);

export const reportIncidentService = async (packageId, incidentData) => {
  const pkg = await packageRepository.findOne({ where: { id: packageId } });
  if (!pkg) {
    throw new Error("Paquete no encontrado");
  }

  const newIncident = {
    type: incidentData.type,
    description: incidentData.description,
    photoUrl: incidentData.photoUrl || null,
    timestamp: new Date().toISOString(),
  };

  pkg.hasIncident = true;
  pkg.incident = newIncident;
  pkg.updatedAt = new Date();

  await packageRepository.save(pkg);
  return pkg;
};
