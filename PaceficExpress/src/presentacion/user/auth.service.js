import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/data-source.js";

const userRepository = AppDataSource.getRepository("User");

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findOne({ where: { email } });
  if (existingUser) throw new Error("El email ya está registrado");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userRepository.create({
    name,
    email,
    password: hashedPassword,
    role: role || "mensajero"
  });

  await userRepository.save(newUser);
  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await userRepository.findOne({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Contraseña incorrecta");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || "1h" }
  );

  return { token, user };
};
