import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js"; 

const packageRepository = AppDataSource.getRepository(Package);

export const createPackageService = async ({ trackingNumber, sender, recipient }) => {
  // ✅ Validar campos obligatorios
  if (!trackingNumber || !sender || !recipient) {
    throw new Error("Faltan datos obligatorios: trackingNumber, sender y recipient");
  }

  // ✅ Validar estructura del remitente
  const senderFields = ["name", "address", "phone"];
  for (const field of senderFields) {
    if (!sender[field]) {
      throw new Error(`Falta el campo obligatorio sender.${field}`);
    }
  }

  // ✅ Validar estructura del destinatario
  const recipientFields = ["name", "address", "phone"];
  for (const field of recipientFields) {
    if (!recipient[field]) {
      throw new Error(`Falta el campo obligatorio recipient.${field}`);
    }
  }

  // ✅ Verificar duplicados
  const existing = await packageRepository.findOne({ where: { trackingNumber } });
  if (existing) {
    throw new Error("Número de guía ya registrado");
  }

  // ✅ Crear nuevo paquete
  const newPackage = packageRepository.create({
    trackingNumber,
    sender,
    recipient,
    status: "pendiente",
    proofImage1: null,
    proofImage2: null,
  });

  // ✅ Guardar en la base de datos
  const savedPackage = await packageRepository.save(newPackage);

  // ✅ Retornar el paquete con todos los campos
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
