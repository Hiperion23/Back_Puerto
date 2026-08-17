import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(
  schema: ZodSchema
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: resultado.error.issues.map(
          (error) => ({
            field: error.path.join("."),
            message: error.message,
          })
        ),
      });
    }

    req.body = resultado.data;

    next();
  };
}