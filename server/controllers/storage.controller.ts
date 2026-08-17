import { Request, Response } from "express";
import { subirImagen, eliminarImagen } from "../services/storage.service.js";

export async function subirImagenController(
  req: Request & { file?: Express.Multer.File },
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ninguna imagen",
      });
    }

    const fileName = `${crypto.randomUUID()}-${req.file.originalname}`;

    const resultado = await subirImagen(
      req.file.buffer,
      fileName,
      req.file.mimetype
    );

    return res.status(201).json({
      success: true,
      data: resultado,
    });
  } catch (error) {
    console.error("Error subiendo imagen:", error);

    return res.status(500).json({
      success: false,
      message: "Error al subir la imagen",
    });
  }
}

export async function eliminarImagenController(
  req: Request,
  res: Response
) {
  try {
    const { path } = req.body;

    if (typeof path !== "string" || !path) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar la ruta de la imagen",
      });
    }

    await eliminarImagen(path);

    return res.status(200).json({
      success: true,
      message: "Imagen eliminada correctamente",
    });
  } catch (error) {
    console.error("Error eliminando imagen:", error);

    return res.status(500).json({
      success: false,
      message: "Error al eliminar la imagen",
    });
  }
}