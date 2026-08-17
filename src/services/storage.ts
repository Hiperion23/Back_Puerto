import { api } from "./api";

interface ResultadoSubida {
  path: string;
  url: string;
}

export async function subirImagen(
  file: File
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);

  const resultado =
    await api.upload<ResultadoSubida>(
      "/storage/upload",
      formData
    );

  return resultado.url;
}

export async function eliminarImagen(
  url: string
): Promise<void> {
  if (!url) {
    return;
  }

  const marcador =
    "/platos-imagenes/";

  const index =
    url.indexOf(marcador);

  if (index === -1) {
    throw new Error(
      "URL de imagen inválida"
    );
  }

  const path = decodeURIComponent(
    url.substring(
      index + marcador.length
    )
  );

  await api.post(
    "/storage/delete",
    {
      path,
    }
  );
}