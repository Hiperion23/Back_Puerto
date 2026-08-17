import { Request, Response } from "express";
import {
  getTags,
  getTagPorId,
  createTag,
  updateTag,
  deleteTag,
} from "../services/tags.service.js";

export async function obtenerTags(
  _req: Request,
  res: Response
) {
  try {
    const tags = await getTags();

    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error obteniendo tags:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener los tags",
    });
  }
}

export async function obtenerTagPorId(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de tag inválido",
      });
    }

    const tag = await getTagPorId(id);

    return res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error obteniendo tag:", error);

    return res.status(404).json({
      success: false,
      message: "Tag no encontrado",
    });
  }
}

export async function crearTag(
  req: Request,
  res: Response
) {
  try {
    const tag = req.body;

    const nuevoTag = await createTag(tag);

    return res.status(201).json({
      success: true,
      data: nuevoTag,
    });
  } catch (error) {
    console.error("Error creando tag:", error);

    return res.status(500).json({
      success: false,
      message: "Error al crear el tag",
    });
  }
}

export async function actualizarTag(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de tag inválido",
      });
    }

    const cambios = req.body;

    const tagActualizado = await updateTag(id, cambios);

    return res.status(200).json({
      success: true,
      data: tagActualizado,
    });
  } catch (error) {
    console.error("Error actualizando tag:", error);

    return res.status(500).json({
      success: false,
      message: "Error al actualizar el tag",
    });
  }
}

export async function eliminarTag(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de tag inválido",
      });
    }

    const tagEliminado = await deleteTag(id);

    return res.status(200).json({
      success: true,
      data: tagEliminado,
    });
  } catch (error) {
    console.error("Error eliminando tag:", error);

    return res.status(500).json({
      success: false,
      message: "Error al eliminar el tag",
    });
  }
}