import { Request, Response } from "express";
import {
  getPlatos,
  getPlatoPorId,
  createPlato,
  updatePlato,
  deletePlato,
} from "../services/platos.service.js";

export async function obtenerPlatos(
  _req: Request,
  res: Response
) {
  try {
    const platos = await getPlatos();

    return res.status(200).json({
      success: true,
      data: platos,
    });
  } catch (error) {
    console.error("Error obteniendo platos:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener los platos",
    });
  }
}

export async function obtenerPlatoPorId(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de plato inválido",
      });
    }

    const plato = await getPlatoPorId(id);

    return res.status(200).json({
      success: true,
      data: plato,
    });
  } catch (error) {
    console.error("Error obteniendo plato:", error);

    return res.status(404).json({
      success: false,
      message: "Plato no encontrado",
    });
  }
}

export async function crearPlato(
  req: Request,
  res: Response
) {
  try {
    console.log("BODY RECIBIDO:", req.body);
    const plato = req.body;

    const nuevoPlato = await createPlato(plato);

    return res.status(201).json({
      success: true,
      data: nuevoPlato,
    });
  } catch (error) {
    console.error("ERROR COMPLETO CREANDO PLATO:", error);

    return res.status(500).json({
      success: false,
      message: "Error al crear el plato",
      error,
    });
  }
}

export async function actualizarPlato(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de plato inválido",
      });
    }

    const cambios = req.body;

    const platoActualizado = await updatePlato(id, cambios);

    return res.status(200).json({
      success: true,
      data: platoActualizado,
    });
  } catch (error) {
    console.error("Error actualizando plato:", error);

    return res.status(500).json({
      success: false,
      message: "Error al actualizar el plato",
    });
  }
}

export async function eliminarPlato(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID de plato inválido",
      });
    }

    const platoEliminado = await deletePlato(id);

    return res.status(200).json({
      success: true,
      data: platoEliminado,
    });
  } catch (error) {
    console.error("Error eliminando plato:", error);

    return res.status(500).json({
      success: false,
      message: "Error al eliminar el plato",
    });
  }
}