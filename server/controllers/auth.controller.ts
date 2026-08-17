import { Request, Response } from "express";
import {
  loginAdmin,
} from "../services/auth.service.js";
import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email y contraseña son obligatorios",
      });
    }

    const data = await loginAdmin({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error en login:", error);

    return res.status(401).json({
      success: false,
      message: "Credenciales incorrectas",
    });
  }
}

export async function meController(
  req: AuthenticatedRequest,
  res: Response
) {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
}