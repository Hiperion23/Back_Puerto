import { supabase } from "../config/supabase.js";

const BUCKET = "platos-imagenes";

export async function subirImagen(
  file: Buffer,
  fileName: string,
  contentType: string
) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrl } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrl.publicUrl,
  };
}

export async function eliminarImagen(filePath: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) {
    throw error;
  }

  return data;
}