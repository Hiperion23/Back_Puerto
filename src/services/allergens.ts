import { api } from "./api";
import type { Allergen } from "../types/catalogo";

export async function getAllergens(): Promise<
  Allergen[]
> {
  return api.get<Allergen[]>(
    "/allergens"
  );
}

export async function getAllergenPorId(
  id: string
): Promise<Allergen> {
  return api.get<Allergen>(
    `/allergens/${id}`
  );
}

export async function createAllergen(
  nombre: string
): Promise<Allergen> {
  return api.post<Allergen>(
    "/allergens",
    {
      nombre,
    }
  );
}

export async function updateAllergen(
  id: string,
  nombre: string
): Promise<Allergen> {
  return api.put<Allergen>(
    `/allergens/${id}`,
    {
      nombre,
    }
  );
}

export async function deleteAllergen(
  id: string
): Promise<void> {
  await api.delete<void>(
    `/allergens/${id}`
  );
}