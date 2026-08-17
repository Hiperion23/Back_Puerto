import { supabase } from "../config/supabase.js";

interface FiltrosPlatosPublicos {
  categoria?: string;
  search?: string;
}

export async function getPlatosPublicos(
  filtros: FiltrosPlatosPublicos = {}
) {
  let query = supabase
    .from("platos_publicos")
    .select("*")
    .eq("disponible", true);

  if (filtros.categoria) {
    query = query.ilike(
      "categoria",
      filtros.categoria
    );
  }

  if (filtros.search) {
    query = query.or(
      `name.ilike.%${filtros.search}%,description.ilike.%${filtros.search}%`
    );
  }

  query = query.order("orden", {
    ascending: true,
    nullsFirst: false,
  });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function getCategoriasPublicas() {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("nombre", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function getTagsPublicos() {
  const { data, error } = await supabase
    .from("tags")
    .select("id, nombre")
    .order("nombre", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllergensPublicos() {
  const { data, error } = await supabase
    .from("allergens")
    .select("id, nombre")
    .order("nombre", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}