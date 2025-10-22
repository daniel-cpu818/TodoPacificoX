import { AppDataSource } from "../../../config/data-source.js";
import { User } from "../../../models/user.entity.js";

const userRepository = AppDataSource.getRepository(User);

export const updateUserService = async (id, updatedFields) => {
  try {
    // Buscar usuario existente
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    // Actualizar campos dinámicamente
    Object.assign(user, updatedFields);

    // Guardar cambios
    const updatedUser = await userRepository.save(user);

    return updatedUser;
  } catch (error) {
    console.error("Error en updateUserService:", error);
    throw new Error("Error al actualizar el usuario");
  }
};
