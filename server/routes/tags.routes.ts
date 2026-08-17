import { Router } from "express";

import {
  obtenerTags,
  obtenerTagPorId,
  crearTag,
  actualizarTag,
  eliminarTag,
} from "../controllers/tags.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validate.middleware.js";

import {
  crearTagSchema,
  actualizarTagSchema,
} from "../schemas/tag.schema.js";

const router = Router();

router.get(
  "/",
  obtenerTags
);

router.get(
  "/:id",
  obtenerTagPorId
);

router.post(
  "/",
  authMiddleware,
  validate(crearTagSchema),
  crearTag
);

router.put(
  "/:id",
  authMiddleware,
  validate(actualizarTagSchema),
  actualizarTag
);

router.delete(
  "/:id",
  authMiddleware,
  eliminarTag
);

export default router;