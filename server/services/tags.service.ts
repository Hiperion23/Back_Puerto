import { supabase } from "../config/supabase.js";

export async function getTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getTagPorId(id: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createTag(
  tag: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("tags")
    .insert(tag)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTag(
  id: string,
  cambios: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("tags")
    .update(cambios)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteTag(id: string) {
  const { data, error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}