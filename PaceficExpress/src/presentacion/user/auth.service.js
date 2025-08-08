import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/data-source.js";

const userRepository = AppDataSource.getRepository("User");

export const registerUser = async ({ name, email, password, role }) => {
  try {
    if (!name || !email || !password) {
      const error = new Error("Nombre, email y contraseña son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("El email ya está registrado");
      error.statusCode = 409; // Conflict
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || "mensajero"
    });

    await userRepository.save(newUser);

    return {
      status: 201,
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  } catch (err) {
    throw {
      status: err.statusCode || 500,
      message: err.message || "Error interno al registrar usuario"
    };
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    if (!email || !password) {
      const error = new Error("Email y contraseña son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Contraseña incorrecta");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );

    return {
      status: 200,
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (err) {
    throw {
      status: err.statusCode || 500,
      message: err.message || "Error interno al iniciar sesión"
    };
  }
};
