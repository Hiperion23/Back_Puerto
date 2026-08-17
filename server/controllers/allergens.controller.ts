import { Request, Response } from "express";
import {
  getAllergens,
  getAllergenPorId,
  createAllergen,
  updateAllergen,
  deleteAllergen,
} from "../services/allergens.service.js";

export async function obtenerAllergens(
  _req: Request,
  res: Response
) {
  try {
    const allergens = await getAllergens();

    return res.status(200).json({
      success: true,
      data: allergens,
    });
  } catch (error) {
    console.error("Error obteniendo allergens:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener los allergens",
    });
  }
}

export async function obtenerAllergenPorId(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de allergen inválido",
      });
    }

    const allergen = await getAllergenPorId(id);

    return res.status(200).json({
      success: true,
      data: allergen,
    });
  } catch (error) {
    console.error("Error obteniendo allergen:", error);

    return res.status(404).json({
      success: false,
      message: "Allergen no encontrado",
    });
  }
}

export async function crearAllergen(
  req: Request,
  res: Response
) {
  try {
    const allergen = req.body;

    const nuevoAllergen = await createAllergen(allergen);

    return res.status(201).json({
      success: true,
      data: nuevoAllergen,
    });
  } catch (error) {
    console.error("Error creando allergen:", error);

    return res.status(500).json({
      success: false,
      message: "Error al crear el allergen",
    });
  }
}

export async function actualizarAllergen(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de allergen inválido",
      });
    }

    const cambios = req.body;

    const allergenActualizado = await updateAllergen(
      id,
      cambios
    );

    return res.status(200).json({
      success: true,
      data: allergenActualizado,
    });
  } catch (error) {
    console.error("Error actualizando allergen:", error);

    return res.status(500).json({
      success: false,
      message: "Error al actualizar el allergen",
    });
  }
}

export async function eliminarAllergen(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de allergen inválido",
      });
    }

    const allergenEliminado = await deleteAllergen(id);

    return res.status(200).json({
      success: true,
      data: allergenEliminado,
    });
  } catch (error) {
    console.error("Error eliminando allergen:", error);

    return res.status(500).json({
      success: false,
      message: "Error al eliminar el allergen",
    });
  }
}