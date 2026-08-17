import { z } from "zod";

const uuidSchema = z.string().uuid("Debe ser un UUID válido");

export const crearPlatoSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre es demasiado largo"),

  description: z
    .string()
    .max(1000, "La descripción es demasiado larga")
    .nullable()
    .optional(),

  price: z
    .number()
    .nonnegative("El precio no puede ser negativo"),

  categoria_id: uuidSchema.nullable().optional(),

  image: z
    .string()
    .url("La imagen debe ser una URL válida")
    .nullable()
    .optional(),

  images: z
    .array(
      z.string().url("Cada imagen debe ser una URL válida")
    )
    .optional(),

  tags: z
    .array(uuidSchema)
    .optional(),

  ingredients: z
    .array(
      z
        .string()
        .min(1, "El ingrediente no puede estar vacío")
    )
    .optional(),

  allergens: z
    .array(uuidSchema)
    .optional(),

  disponible: z
    .boolean()
    .optional(),

  orden: z
    .number()
    .int("El orden debe ser un número entero")
    .nullable()
    .optional(),
});

export const actualizarPlatoSchema =
  crearPlatoSchema.partial();

export type CrearPlatoInput = z.infer<
  typeof crearPlatoSchema
>;

export type ActualizarPlatoInput = z.infer<
  typeof actualizarPlatoSchema
>;