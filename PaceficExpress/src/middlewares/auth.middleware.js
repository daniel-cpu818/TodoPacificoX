// src/middlewares/auth.middleware.js
import { verifyToken } from "../utils/jwt.js";
import { AppDataSource } from "../config/data-source.js";
import User from "../models/user.entity.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // Buscar el usuario en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = user; // Guardamos el usuario en la request
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    res.status(500).json({ message: "Error en autenticación" });
  }
};

// Middleware adicional para verificar roles
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" });
    }
    next();
  };
};
