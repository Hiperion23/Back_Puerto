import { Router } from "express";
import {
  getPlatosPublicosController,
  getCategoriasPublicasController,
  getTagsPublicosController,
  getAllergensPublicosController,
} from "../controllers/public.controller.js";

const router = Router();

router.get(
  "/platos",
  getPlatosPublicosController
);

router.get(
  "/categorias",
  getCategoriasPublicasController
);

router.get(
  "/tags",
  getTagsPublicosController
);

router.get(
  "/allergens",
  getAllergensPublicosController
);

export default router;