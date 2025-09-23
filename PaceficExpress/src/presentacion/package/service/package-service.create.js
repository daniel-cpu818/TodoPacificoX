import { AppDataSource } from "../../../config/data-source.js";

const packageRepository = AppDataSource.getRepository("Package");

export const createPackageService = async ({ trackingNumber, sender, recipient }) => {
  // Validar datos obligatorios
  if (!trackingNumber || !sender || !recipient) {
    throw new Error("Faltan datos obligatorios: trackingNumber, sender y recipient");
  }

  // Validar que sender y recipient tengan los campos requeridos
  const senderFields = ["name", "address", "phone"];
  const recipientFields = ["name", "address", "phone"];
  
  for (const field of senderFields) {
    if (!sender[field]) {
      throw new Error(`Falta el campo obligatorio sender.${field}`);
    }
  }

  for (const field of recipientFields) {
    if (!recipient[field]) {
      throw new Error(`Falta el campo obligatorio recipient.${field}`);
    }
  }

  // Verificar duplicados
  const existing = await packageRepository.findOne({ where: { trackingNumber } });
  if (existing) {
    throw new Error("Número de guía ya registrado");
  }

  // Crear y guardar paquete
  const newPackage = packageRepository.create({
    trackingNumber,
    sender,
    recipient,
    status: "pendiente"
  });

  await packageRepository.save(newPackage);
  return newPackage;
};
