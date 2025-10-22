import { AppDataSource } from "../../../config/data-source.js";
import { User } from "../../../models/user.entity.js";

/**
 * Servicio para obtener usuarios.
 * - Si se pasa el rol "messenger", devuelve solo los mensajeros.
 * - Si no, devuelve todos los usuarios registrados.
 */
export const getAllUsersService = async (role) => {
  const userRepository = AppDataSource.getRepository(User);

  try {
    let users;

    if (role === "messenger") {
      // 🔹 Solo mensajeros
      users = await userRepository.find({
        where: { role: "messenger" },
        select: ["id", "name", "email", "role", "isActive"],
      });
    } else {
      // 🔹 Todos los usuarios
      users = await userRepository.find({
        select: ["id", "name", "email", "role", "isActive"],
      });
    }

    return users;
  } catch (error) {
    console.error("Error en getAllUsersService:", error);
    throw new Error("Error al obtener los usuarios desde la base de datos");
  }
};
