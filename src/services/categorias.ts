import { api } from "./api";
import type { Categoria } from "../types/catalogo";

export async function getCategorias(): Promise<
  Categoria[]
> {
  return api.get<Categoria[]>(
    "/categorias"
  );
}

export async function getCategoriaPorId(
  id: string
): Promise<Categoria> {
  return api.get<Categoria>(
    `/categorias/${id}`
  );
}

export async function createCategoria(
  nombre: string
): Promise<Categoria> {
  return api.post<Categoria>(
    "/categorias",
    {
      nombre,
    }
  );
}

export async function updateCategoria(
  id: string,
  nombre: string
): Promise<Categoria> {
  return api.put<Categoria>(
    `/categorias/${id}`,
    {
      nombre,
    }
  );
}

export async function deleteCategoria(
  id: string
): Promise<void> {
  await api.delete<void>(
    `/categorias/${id}`
  );
}