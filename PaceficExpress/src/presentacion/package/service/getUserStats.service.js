import { AppDataSource } from "../../../config/data-source.js";
import { Between } from "typeorm";
import { Package } from "../../../models/package.entity.js"; // Asegúrate de importar tu entidad correctamente
const packageRepository = AppDataSource.getRepository(Package);


export const getUserStatsService = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Inicio del día

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Fin del día

  const scannedToday = await packageRepository.count({
    where: {
      messenger: { id: userId },
      updatedAt: Between(today, tomorrow),
    },
  });

  const deliveredToday = await packageRepository.count({
    where: {
      messenger: { id: userId },
      status: "entregado",
      updatedAt: Between(today, tomorrow),
    },
  });

  const incidentsToday = await packageRepository.count({
    where: {
      messenger: { id: userId },
      hasIncident: true,
      updatedAt: Between(today, tomorrow),
    },
  });

  return {
    scannedToday,
    deliveredToday,
    incidentsToday,
  };
};
