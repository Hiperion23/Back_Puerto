import { Router } from "express";
import multer from "multer";
import {
  subirImagenController,
  eliminarImagenController,
} from "../controllers/storage.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  subirImagenController
);

router.delete(
  "/",
  authMiddleware,
  eliminarImagenController
);

export default router;