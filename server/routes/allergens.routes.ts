import { Router } from "express";

import {
  obtenerAllergens,
  obtenerAllergenPorId,
  crearAllergen,
  actualizarAllergen,
  eliminarAllergen,
} from "../controllers/allergens.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validate.middleware.js";

import {
  crearAllergenSchema,
  actualizarAllergenSchema,
} from "../schemas/allergen.schema.js";

const router = Router();

router.get(
  "/",
  obtenerAllergens
);

router.get(
  "/:id",
  obtenerAllergenPorId
);

router.post(
  "/",
  authMiddleware,
  validate(crearAllergenSchema),
  crearAllergen
);

router.put(
  "/:id",
  authMiddleware,
  validate(actualizarAllergenSchema),
  actualizarAllergen
);

router.delete(
  "/:id",
  authMiddleware,
  eliminarAllergen
);

export default router;