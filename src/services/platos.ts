import { api } from "./api";
import type { Plato } from "../types/plato";

export async function getPlatos(): Promise<Plato[]> {
  return api.get<Plato[]>("/platos");
}

export async function getPlatoPorId(
  id: string
): Promise<Plato> {
  return api.get<Plato>(
    `/platos/${id}`
  );
}

export async function createPlato(
  plato: Omit<
    Plato,
    "id" | "created_at" | "categoria"
  >
): Promise<Plato> {
  return api.post<Plato>(
    "/platos",
    plato
  );
}

export async function updatePlato(
  id: string,
  plato: Partial<
    Omit<Plato, "id" | "created_at" | "categoria">
  >
): Promise<Plato> {
  return api.put<Plato>(
    `/platos/${id}`,
    plato
  );
}

export async function deletePlato(
  id: string
): Promise<Plato> {
  return api.delete<Plato>(
    `/platos/${id}`
  );
}