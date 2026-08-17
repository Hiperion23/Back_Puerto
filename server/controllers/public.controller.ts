import { Request, Response } from "express";
import {
  getPlatosPublicos,
  getCategoriasPublicas,
  getTagsPublicos,
  getAllergensPublicos,
} from "../services/public.service.js";

export async function getPlatosPublicosController(
  req: Request,
  res: Response
) {
  try {
    const categoria =
      typeof req.query.categoria === "string"
        ? req.query.categoria
        : undefined;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const data = await getPlatosPublicos({
      categoria,
      search,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Error obteniendo platos públicos:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error al obtener los platos públicos",
    });
  }
}

export async function getCategoriasPublicasController(
  _req: Request,
  res: Response
) {
  try {
    const data = await getCategoriasPublicas();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Error obteniendo categorías públicas:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
    });
  }
}

export async function getTagsPublicosController(
  _req: Request,
  res: Response
) {
  try {
    const data = await getTagsPublicos();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Error obteniendo tags públicos:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error al obtener los tags",
    });
  }
}

export async function getAllergensPublicosController(
  _req: Request,
  res: Response
) {
  try {
    const data = await getAllergensPublicos();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Error obteniendo allergens públicos:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error al obtener los allergens",
    });
  }
}