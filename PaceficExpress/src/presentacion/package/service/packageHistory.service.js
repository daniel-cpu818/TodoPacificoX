import { AppDataSource } from "../../../config/data-source.js";
import { PackageHistory } from "../../../models/packageHistory.entity.js";

const historyRepository = AppDataSource.getRepository(PackageHistory);

export const addHistoryRecord = async (pkg, user, previousStatus, newStatus, note = null) => {
  const record = historyRepository.create({
    package: pkg,
    user,
    previousStatus,
    newStatus,
    note,
  });
  await historyRepository.save(record);
};
