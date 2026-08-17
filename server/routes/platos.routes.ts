import { Router } from "express";

import {
  obtenerPlatos,
  obtenerPlatoPorId,
  crearPlato,
  actualizarPlato,
  eliminarPlato,
} from "../controllers/platos.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validate.middleware.js";

import {
  crearPlatoSchema,
  actualizarPlatoSchema,
} from "../schemas/plato.schema.js";

const router = Router();

router.get(
  "/",
  obtenerPlatos
);

router.get(
  "/:id",
  obtenerPlatoPorId
);

router.post(
  "/",
  authMiddleware,
  validate(crearPlatoSchema),
  crearPlato
);

router.put(
  "/:id",
  authMiddleware,
  validate(actualizarPlatoSchema),
  actualizarPlato
);

router.delete(
  "/:id",
  authMiddleware,
  eliminarPlato
);

export default router;