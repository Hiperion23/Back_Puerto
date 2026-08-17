import { z } from "zod";

export const crearAllergenSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre es demasiado largo"),
});

export const actualizarAllergenSchema =
  crearAllergenSchema.partial();

export type CrearAllergenInput = z.infer<
  typeof crearAllergenSchema
>;

export type ActualizarAllergenInput = z.infer<
  typeof actualizarAllergenSchema
>;