import { getAllUsersService } from "../user/service/getUser.service.js";
import { updateUserService } from "../user/service/updateUser.service.js";

export const getAllUsersController = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await getAllUsersService(role);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedUser = await updateUserService(id, updatedFields);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error en updateUserController:", error);
    return res.status(500).json({ message: error.message });
  }
};
