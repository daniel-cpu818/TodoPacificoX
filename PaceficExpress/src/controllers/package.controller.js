import {
  getAllPackagesService,
  updatePackageStatusService,
  assignPackageToSelfService,
  getMyPackagesService
} from "../presentacion/package/package.service.js";
import { createPackageService } from "../presentacion/package/service/package-service.create.js";

export const createPackage = async (req, res) => {
  try {
    const pack = await createPackageService(req.body);
    res.status(201).json(pack);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPackages = async (req, res) => {
  const packs = await getAllPackagesService();
  res.json(packs);
};

export const updatePackageStatus = async (req, res) => {
  try {
    const pack = await updatePackageStatusService(req.params.id, req.body.status);
    res.json(pack);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignPackageToSelf = async (req, res) => {
  try {
    const pack = await assignPackageToSelfService(req.user.id, req.body.packageId);
    res.json(pack);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyPackages = async (req, res) => {
  const packs = await getMyPackagesService(req.user.id);
  res.json(packs);
};
