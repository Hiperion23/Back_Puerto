import { z } from "zod";

export const crearCategoriaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre es demasiado largo"),
});

export const actualizarCategoriaSchema =
  crearCategoriaSchema.partial();

export type CrearCategoriaInput = z.infer<
  typeof crearCategoriaSchema
>;

export type ActualizarCategoriaInput = z.infer<
  typeof actualizarCategoriaSchema
>;