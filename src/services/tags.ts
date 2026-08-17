import { api } from "./api";
import type { Tag } from "../types/catalogo";

export async function getTags(): Promise<Tag[]> {
  return api.get<Tag[]>("/tags");
}

export async function getTagPorId(
  id: string
): Promise<Tag> {
  return api.get<Tag>(
    `/tags/${id}`
  );
}

export async function createTag(
  nombre: string
): Promise<Tag> {
  return api.post<Tag>(
    "/tags",
    {
      nombre,
    }
  );
}

export async function updateTag(
  id: string,
  nombre: string
): Promise<Tag> {
  return api.put<Tag>(
    `/tags/${id}`,
    {
      nombre,
    }
  );
}

export async function deleteTag(
  id: string
): Promise<void> {
  await api.delete<void>(
    `/tags/${id}`
  );
}