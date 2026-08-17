import { supabase } from "../config/supabase.js";
import { eliminarImagen } from "./storage.service.js";

const BUCKET = "platos-imagenes";

function obtenerPathDesdeUrl(url: string): string | null {
  const marcador = `/${BUCKET}/`;

  const index = url.indexOf(marcador);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    url.substring(index + marcador.length)
  );
}

async function eliminarImagenDesdeUrl(
  url: string
): Promise<void> {
  const path = obtenerPathDesdeUrl(url);

  if (!path) {
    console.warn(
      "No se pudo obtener el path de la imagen:",
      url
    );

    return;
  }

  await eliminarImagen(path);
}

function obtenerImagenes(
  images: unknown
): string[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.filter(
    (image): image is string =>
      typeof image === "string" &&
      image.trim().length > 0
  );
}

export async function getPlatos() {
  const { data, error } = await supabase
    .from("platos_con_alergenos")
    .select("*")
    .order("orden", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    throw error;
  }

  return data.map((plato) => ({
    ...plato,
    allergens: plato.allergen_names ?? [],
  }));
}
export async function getPlatoPorId(
  id: string
) {
  const { data, error } = await supabase
    .from("platos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createPlato(
  plato: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("platos")
    .insert(plato)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updatePlato(
  id: string,
  cambios: Record<string, unknown>
) {
  const {
    data: platoActual,
    error: obtenerError,
  } = await supabase
    .from("platos")
    .select("image, images")
    .eq("id", id)
    .single();

  if (obtenerError) {
    throw obtenerError;
  }

  const imagenAnterior =
    typeof platoActual.image === "string"
      ? platoActual.image
      : null;

  const seActualizaImagenPrincipal =
    Object.prototype.hasOwnProperty.call(
      cambios,
      "image"
    );

  const nuevaImagen =
    typeof cambios.image === "string"
      ? cambios.image
      : cambios.image === null
        ? null
        : undefined;

  if (
    seActualizaImagenPrincipal &&
    nuevaImagen !== undefined &&
    nuevaImagen !== imagenAnterior &&
    imagenAnterior
  ) {
    try {
      await eliminarImagenDesdeUrl(
        imagenAnterior
      );
    } catch (error) {
      console.error(
        "Error eliminando imagen principal anterior:",
        error
      );
    }
  }

  const imagenesAnteriores =
    obtenerImagenes(platoActual.images);

  const seActualizanImagenes =
    Object.prototype.hasOwnProperty.call(
      cambios,
      "images"
    );

  if (
    seActualizanImagenes &&
    Array.isArray(cambios.images)
  ) {
    const nuevasImagenes =
      obtenerImagenes(cambios.images);

    const imagenesEliminadas =
      imagenesAnteriores.filter(
        (imagen) =>
          !nuevasImagenes.includes(imagen)
      );

    for (const imagen of imagenesEliminadas) {
      try {
        await eliminarImagenDesdeUrl(
          imagen
        );
      } catch (error) {
        console.error(
          "Error eliminando imagen adicional anterior:",
          error
        );
      }
    }
  }

  const { data, error } = await supabase
    .from("platos")
    .update(cambios)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePlato(
  id: string
) {

  const {
    data: plato,
    error: obtenerError,
  } = await supabase
    .from("platos")
    .select("image, images")
    .eq("id", id)
    .single();

  if (obtenerError) {
    throw obtenerError;
  }

  if (
    typeof plato.image === "string" &&
    plato.image.trim()
  ) {
    try {
      await eliminarImagenDesdeUrl(
        plato.image
      );
    } catch (error) {
      console.error(
        "Error eliminando imagen principal:",
        error
      );
    }
  }

  const imagenes =
    obtenerImagenes(plato.images);

  for (const imagen of imagenes) {
    try {
      await eliminarImagenDesdeUrl(
        imagen
      );
    } catch (error) {
      console.error(
        "Error eliminando imagen adicional:",
        error
      );
    }
  }

  const {
    data,
    error,
  } = await supabase
    .from("platos")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}