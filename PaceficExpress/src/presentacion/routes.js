import { Router } from "express";

// Controladores
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

// ---------------- Autenticación ----------------
router.post("/register", register);
router.post("/login", login);

export default router;
