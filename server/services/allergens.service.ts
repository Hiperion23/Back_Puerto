import { supabase } from "../config/supabase.js";

export async function getAllergens() {
  const { data, error } = await supabase
    .from("allergens")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllergenPorId(id: string) {
  const { data, error } = await supabase
    .from("allergens")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createAllergen(
  allergen: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("allergens")
    .insert(allergen)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateAllergen(
  id: string,
  cambios: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("allergens")
    .update(cambios)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteAllergen(id: string) {
  const { data, error } = await supabase
    .from("allergens")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}