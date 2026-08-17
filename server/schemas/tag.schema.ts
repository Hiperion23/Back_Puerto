import { z } from "zod";

export const crearTagSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre es demasiado largo"),
});

export const actualizarTagSchema =
  crearTagSchema.partial();

export type CrearTagInput = z.infer<
  typeof crearTagSchema
>;

export type ActualizarTagInput = z.infer<
  typeof actualizarTagSchema
>;