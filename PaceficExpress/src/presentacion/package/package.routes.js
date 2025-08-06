import { Router } from "express";
import { createPackage, getAllPackages, updatePackageStatus, assignPackageToSelf, getMyPackages } 
    from "../../controllers/package.controller.js";
import { register, login } 
    from "../../controllers/auth.controller.js";
import { authMiddleware } 
    from "../../middlewares/auth.middleware.js";

const router = Router();

// Rutas de autenticación
router.post("/register", register);
router.post("/login", login);

// Rutas de paquetes
router.post("/packages", createPackage);
router.get("/packages", getAllPackages);
router.put("/packages/:id/status", updatePackageStatus);

// Rutas para asignación y consulta de paquetes de un mensajero
router.post("/assign", authMiddleware, assignPackageToSelf);
router.get("/my-packages", authMiddleware, getMyPackages);

export default router;
