import ExcelJS from "exceljs";
import fs from "fs";
import { AppDataSource } from "../../../config/data-source.js";
import { Package } from "../../../models/package.entity.js";
import { User } from "../../../models/user.entity.js";


const packageRepository = AppDataSource.getRepository(Package);
const userRepository = AppDataSource.getRepository(User);

export const generateMessengerReportService = async (messengerId, startDate, endDate) => {
  try {
    // Validar datos de entrada
    if (!messengerId || !startDate || !endDate) {
      throw new Error("Debe enviar messengerId, startDate y endDate en el body");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      throw new Error("Formato de fecha inválido. Use el formato YYYY-MM-DD");
    }

    //  Verificar mensajero
    const messenger = await userRepository.findOne({
      where: { id: messengerId, role: "messenger" },
    });
    if (!messenger) throw new Error("Mensajero no encontrado o no tiene rol de messenger");

    //  Buscar paquetes entregados por el mensajero en el rango de fechas
    const packages = await packageRepository
      .createQueryBuilder("pkg")
      .where("pkg.messenger = :messengerId", { messengerId })
      .andWhere("pkg.status = :status", { status: "entregado" })
      .andWhere("pkg.updatedAt BETWEEN :start AND :end", { start, end })
      .getMany();

    if (!packages.length) {
      throw new Error("No hay paquetes entregados en ese rango de fechas.");
    }

    //  Crear el archivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte de Entregas");

    worksheet.columns = [
      { header: "ID", key: "id", width: 36 },
      { header: "Número de Guía", key: "trackingNumber", width: 20 },
      { header: "Destinatario", key: "recipient", width: 25 },
      { header: "Ciudad", key: "city", width: 20 },
      { header: "Estado", key: "status", width: 20 },
      { header: "Fecha de Entrega", key: "updatedAt", width: 25 },
    ];

    packages.forEach((pkg) => {
      worksheet.addRow({
        id: pkg.id,
        trackingNumber: pkg.trackingNumber,
        recipient: pkg.recipient?.name,
        city: pkg.recipient?.city,
        status: pkg.status,
        updatedAt: pkg.updatedAt.toISOString().slice(0, 19).replace("T", " "),
      });
    });

    const reportsDir = "./reports";
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

    const filePath = `${reportsDir}/reporte_mensajero_${messengerId}_${Date.now()}.xlsx`;
    await workbook.xlsx.writeFile(filePath);

    return {
      message: "Reporte generado con éxito",
      messenger: messenger.name,
      totalEntregados: packages.length,
      filePath,
    };
  } catch (error) {
    console.error(" Error generando reporte:", error);
    throw new Error(error.message || "Error al generar el reporte");
  }
};
