// src/middlewares/auth.middleware.js
import { verifyToken } from "../utils/jwt.js";
import { AppDataSource } from "../config/data-source.js";
import User from "../models/user.entity.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    // Decodificar el token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // Buscar el usuario en la BD
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.id },
      select: ["id", "name", "email", "role"], // 👈 selecciona solo lo necesario
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Guardamos los datos del usuario en la request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    res.status(500).json({ message: "Error en autenticación" });
  }
};

// 🔑 Middleware para verificar roles
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" });
    }

    next();
  };
};
