import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";

const packageRepository = AppDataSource.getRepository(Package);

export const getUserHistoryService = async (userId) => {
  const packages = await packageRepository.find({
    where: {
      messenger: { id: userId },
    },
    relations: ["messenger"],
    order: {
      updatedAt: "DESC",
    },
  });

  return packages;
};
