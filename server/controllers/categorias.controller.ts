import { Request, Response } from "express";
import {
  getCategorias,
  getCategoriaPorId,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categorias.service.js";

export async function obtenerCategorias(
  _req: Request,
  res: Response
) {
  try {
    const categorias = await getCategorias();

    return res.status(200).json({
      success: true,
      data: categorias,
    });
  } catch (error) {
    console.error("Error obteniendo categorías:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
    });
  }
}

export async function obtenerCategoriaPorId(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de categoría inválido",
      });
    }

    const categoria = await getCategoriaPorId(id);

    return res.status(200).json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    console.error("Error obteniendo categoría:", error);

    return res.status(404).json({
      success: false,
      message: "Categoría no encontrada",
    });
  }
}

export async function crearCategoria(
  req: Request,
  res: Response
) {
  try {
    const categoria = req.body;

    const nuevaCategoria = await createCategoria(categoria);

    return res.status(201).json({
      success: true,
      data: nuevaCategoria,
    });
  } catch (error) {
    console.error("Error creando categoría:", error);

    return res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
    });
  }
}

export async function actualizarCategoria(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de categoría inválido",
      });
    }

    const cambios = req.body;

    const categoriaActualizada = await updateCategoria(
      id,
      cambios
    );

    return res.status(200).json({
      success: true,
      data: categoriaActualizada,
    });
  } catch (error) {
    console.error("Error actualizando categoría:", error);

    return res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
    });
  }
}

export async function eliminarCategoria(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de categoría inválido",
      });
    }

    const categoriaEliminada = await deleteCategoria(id);

    return res.status(200).json({
      success: true,
      data: categoriaEliminada,
    });
  } catch (error) {
    console.error("Error eliminando categoría:", error);

    return res.status(500).json({
      success: false,
      message: "Error al eliminar la categoría",
    });
  }
}