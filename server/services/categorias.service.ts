import { supabase } from "../config/supabase.js";

export async function getCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCategoriaPorId(id: string) {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createCategoria(
  categoria: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("categorias")
    .insert(categoria)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCategoria(
  id: string,
  cambios: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("categorias")
    .update(cambios)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCategoria(id: string) {
  const { data, error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}