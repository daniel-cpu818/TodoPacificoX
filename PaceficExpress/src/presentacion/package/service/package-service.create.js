import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js"; 

const packageRepository = AppDataSource.getRepository(Package);

export const createPackageService = async ({ trackingNumber, sender, recipient }) => {
  
  if (!trackingNumber || !sender || !recipient) {
    throw new Error("Faltan datos obligatorios: trackingNumber, sender y recipient");
  }

  const senderFields = ["name", "address", "phone"];
  for (const field of senderFields) {
    if (!sender[field]) {
      throw new Error(`Falta el campo obligatorio sender.${field}`);
    }
  }

  const recipientFields = ["name", "address", "phone"];
  for (const field of recipientFields) {
    if (!recipient[field]) {
      throw new Error(`Falta el campo obligatorio recipient.${field}`);
    }
  }

  const existing = await packageRepository.findOne({ where: { trackingNumber } });
  if (existing) {
    throw new Error("Número de guía ya registrado");
  }

  const newPackage = packageRepository.create({
    trackingNumber,
    sender,
    recipient,
    status: "asignado_ruta",
    proofImage1: null,
    proofImage2: null,
  });

  const savedPackage = await packageRepository.save(newPackage);

  return {
    id: savedPackage.id,
    trackingNumber: savedPackage.trackingNumber,
    status: savedPackage.status,
    sender: savedPackage.sender,
    recipient: savedPackage.recipient,
    proofImage1: savedPackage.proofImage1,
    proofImage2: savedPackage.proofImage2,
    createdAt: savedPackage.createdAt,
    updatedAt: savedPackage.updatedAt,
  };
};
