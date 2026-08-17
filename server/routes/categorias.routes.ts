import { Router } from "express";

import {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categorias.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validate.middleware.js";

import {
  crearCategoriaSchema,
  actualizarCategoriaSchema,
} from "../schemas/categoria.schema.js";

const router = Router();

router.get(
  "/",
  obtenerCategorias
);

router.get(
  "/:id",
  obtenerCategoriaPorId
);

router.post(
  "/",
  authMiddleware,
  validate(crearCategoriaSchema),
  crearCategoria
);

router.put(
  "/:id",
  authMiddleware,
  validate(actualizarCategoriaSchema),
  actualizarCategoria
);

router.delete(
  "/:id",
  authMiddleware,
  eliminarCategoria
);

export default router;