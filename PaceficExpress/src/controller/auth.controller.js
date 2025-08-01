const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/data-source");
const User = require("../models/user.entity");
const userRepository = AppDataSource.getRepository("User");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await userRepository.findOneBy({ email });
    if (existing) return res.status(400).json({ message: "Email ya existe" });

    const hashed = await bcrypt.hash(password, 10);
    const user = userRepository.create({ name, email, password: hashed, role });
    await userRepository.save(user);

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userRepository.findOneBy({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
