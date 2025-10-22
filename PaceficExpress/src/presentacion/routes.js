import { Router } from "express";
import { getAllUsersController } from "../presentacion/user/user.controller.js";
import { register, login } from "../controllers/auth.controller.js";
import { updateUserController } from "../presentacion/user/user.controller.js";

const router = Router();

// ---------------- Autenticación ----------------
router.post("/register", register);
router.post("/login", login);

// obterner todos los usuarios
router.get("/users", getAllUsersController);

// actualizar usuario
router.put("/users/:id", updateUserController);
export default router;
