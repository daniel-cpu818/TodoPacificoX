// src/services/package/completeDelivery.service.js
import { AppDataSource } from "../../../config/data-source.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../config/envs.js";
import crypto from "crypto";
import multer from "multer";
import { Package } from "../../../models/package.entity.js";
import { User } from "../../../models/user.entity.js";

const packageRepository = AppDataSource.getRepository(Package);
const userRepository = AppDataSource.getRepository(User);

// Configuración de S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Configuración de multer para recibir imágenes en memoria
export const upload = multer({ storage: multer.memoryStorage() });

function generateFileName(originalName) {
  const randomName = crypto.randomBytes(16).toString("hex");
  const ext = originalName.split(".").pop();
  return `${randomName}.${ext}`;
}

/**
 * Completar entrega de un paquete con comprobantes (2 imágenes).
 * @param {string} packageId - ID del paquete
 * @param {string} userId - ID del mensajero autenticado
 * @param {Array} files - Archivos recibidos de multer
 */
export const completeDeliveryService = async (packageId, userId, files) => {
  // Verificar que el paquete exista con su relación messenger
  const pkg = await packageRepository.findOne({
    where: { id: packageId },
    relations: ["messenger"],
  });
  if (!pkg) throw new Error("Paquete no encontrado");

  // Verificar que el usuario exista y sea mensajero
  const user = await userRepository.findOneBy({ id: userId });
  if (!user || user.role !== "messenger") {
    throw new Error("Usuario no válido o no es mensajero");
  }

  // Validar que el mensajero sea el asignado al paquete
  if (!pkg.messenger || pkg.messenger.id !== user.id) {
    throw new Error("No tienes permiso para completar la entrega de este paquete");
  }

  // Validar que vengan dos imágenes
  if (!files || files.length !== 2) {
    throw new Error("Debes subir exactamente 2 imágenes como comprobante");
  }

  // Subir imágenes a S3
  const imageUrls = [];
  for (const file of files) {
    const fileName = generateFileName(file.originalname);
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    imageUrls.push(fileUrl);
  }

  // Actualizar paquete
  pkg.proofImage1 = imageUrls[0];
  pkg.proofImage2 = imageUrls[1];
  pkg.status = "entregado";

  await packageRepository.save(pkg);

  return {
    message: "Entrega completada con éxito",
    package: pkg,
  };
};
