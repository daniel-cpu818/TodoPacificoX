import { Router } from "express";

// Controladores
import { register, login } from "../controllers/auth.controller.js";
import {
  createPackage,
  getAllPackages,
  updatePackageStatus,
  assignPackageToSelf,
  getMyPackages
} from "../controllers/package.controller.js";

// Middleware
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------- Autenticación ----------------
router.post("/register", register);
router.post("/login", login);

// // ---------------- Paquetes ----------------
// router.post("/packages", authMiddleware, createPackage);
// router.get("/packages", authMiddleware, getAllPackages);
// router.put("/packages/:id/status", authMiddleware, updatePackageStatus);

// // ---------------- Asignación e historial ----------------
// router.post("/assign", authMiddleware, assignPackageToSelf);
// router.get("/my-packages", authMiddleware, getMyPackages);


// router.post("/assign", authMiddleware, checkRole(["mensajero"]), assignPackageToSelf);
// router.get("/my-packages", authMiddleware, checkRole(["mensajero"]), getMyPackages);

export default router;
